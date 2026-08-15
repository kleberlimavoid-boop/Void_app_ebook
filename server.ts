import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { getSmartCoverImage } from "./src/data/coverImages";
import { getSmartContextualImage } from "./src/data/visualLibrary";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Mercado Pago Client if Access Token is provided
const getMercadoPagoClient = () => {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return null;
  try {
    return new MercadoPagoConfig({ accessToken: token });
  } catch (err) {
    console.error("Error initializing Mercado Pago SDK:", err);
    return null;
  }
};

// Initialize Gemini Client
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not defined.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Helper to execute Gemini generation with backoff retries and model fallbacks (503 / 429 resilience)
async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: Parameters<ReturnType<typeof getGenAI>["models"]["generateContent"]>[0]
) {
  const preferredModel = params.model || "gemini-flash-latest";
  // Ordered fallback models supported by the platform
  const fallbackModels = ["gemini-flash-latest", "gemini-3.7-flash", "gemini-3.1-flash-lite"];
  const modelsToTry = Array.from(new Set([preferredModel, ...fallbackModels]));

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        ...params,
        model,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const errMessage = String(err?.message || err || "");
      const status = err?.status || err?.code || (err?.response ? err.response.status : undefined);

      const isTransient =
        errMessage.includes("503") ||
        errMessage.includes("UNAVAILABLE") ||
        errMessage.includes("high demand") ||
        errMessage.includes("RESOURCE_EXHAUSTED") ||
        errMessage.includes("429") ||
        errMessage.includes("Overloaded") ||
        errMessage.includes("temporarily unavailable") ||
        status === 503 ||
        status === 429;

      if (isTransient) {
        // High load / demand on current model - try next fallback model immediately
        continue;
      }

      // For any other error on this model, try next model if available
      continue;
    }
  }

  throw lastError || new Error("O serviço de IA está temporariamente indisponível. Por favor, tente novamente em instantes.");
}

function getTopicCoverImage(genre: string = "", title: string = "", description: string = ""): string {
  return getSmartCoverImage(genre, title, description);
}

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Criador de E-books IA",
    mercadoPagoConfigured: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
  });
});

// API: Mercado Pago - Create Payment Preference
app.post("/api/mercadopago/create-preference", async (req, res) => {
  try {
    const { planId, userId, userEmail } = req.body;

    if (!planId || !['basico', 'pro', 'pro_annual', 'pro_plus', 'premium'].includes(planId)) {
      return res.status(400).json({ success: false, error: "Plano inválido fornecido." });
    }

    const planPrices: Record<string, number> = {
      basico: 19.90,
      pro: 49.90,
      pro_annual: 97.00,
      pro_plus: 97.00,
      premium: 97.00,
    };

    const planTitles: Record<string, string> = {
      basico: "Plano Básico - E-books com IA (Até 3 e-books/mês • 30 Dias)",
      pro: "Plano PRO Mensal - E-books com IA (Até 10 e-books/mês • 30 Dias)",
      pro_annual: "Plano PRO+ ANUAL - Acesso VIP por 365 Dias (Até 20 e-books/mês • 240 no ano)",
      pro_plus: "Plano PRO+ ANUAL - Acesso VIP por 365 Dias (Até 20 e-books/mês • 240 no ano)",
      premium: "Plano PRO+ ANUAL - Acesso VIP por 365 Dias (Até 20 e-books/mês • 240 no ano)",
    };

    const price = planPrices[planId];
    const title = planTitles[planId];
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const mpClient = getMercadoPagoClient();

    if (mpClient) {
      const preference = new Preference(mpClient);

      const result = await preference.create({
        body: {
          items: [
            {
              id: planId,
              title: title,
              quantity: 1,
              unit_price: price,
              currency_id: "BRL",
            },
          ],
          payer: {
            email: userEmail || "cliente@exemplo.com",
          },
          external_reference: `${userId || 'guest'}:${planId}:${Date.now()}`,
          back_urls: {
            success: `${appUrl}?payment_status=success&plan=${planId}`,
            failure: `${appUrl}?payment_status=failure`,
            pending: `${appUrl}?payment_status=pending`,
          },
          auto_return: "approved",
          notification_url: `${appUrl}/api/mercadopago/webhook`,
        },
      });

      return res.json({
        success: true,
        init_point: result.init_point,
        sandbox_init_point: result.sandbox_init_point,
        preferenceId: result.id,
        mode: "live",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "A chave MERCADOPAGO_ACCESS_TOKEN do Mercado Pago não foi configurada. Insira seu Access Token do Mercado Pago em Configurações para processar pagamentos em produção.",
      });
    }
  } catch (error: any) {
    console.error("Erro ao criar preferência do Mercado Pago:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao gerar cobrança no Mercado Pago",
    });
  }
});

// API: Mercado Pago - Process Transparent PIX Payment
app.post("/api/mercadopago/process-pix", async (req, res) => {
  try {
    const { planId, userId, userEmail, name, cpf } = req.body;

    if (!planId || !['basico', 'pro', 'pro_annual', 'pro_plus', 'premium'].includes(planId)) {
      return res.status(400).json({ success: false, error: "Plano inválido fornecido." });
    }

    const planPrices: Record<string, number> = {
      basico: 19.90,
      pro: 49.90,
      pro_annual: 97.00,
      pro_plus: 97.00,
      premium: 97.00,
    };
    const planTitles: Record<string, string> = {
      basico: "Plano Básico - E-books com IA",
      pro: "Plano PRO Mensal - E-books com IA",
      pro_annual: "Plano PRO+ ANUAL - 365 Dias (20 e-books/mês)",
      pro_plus: "Plano PRO+ ANUAL - 365 Dias (20 e-books/mês)",
      premium: "Plano PRO+ ANUAL - 365 Dias (20 e-books/mês)",
    };

    const price = planPrices[planId];
    const title = planTitles[planId];
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const mpClient = getMercadoPagoClient();
    if (!mpClient) {
      return res.status(400).json({
        success: false,
        error: "A chave MERCADOPAGO_ACCESS_TOKEN não está configurada em Configurações.",
      });
    }

    const payment = new Payment(mpClient);
    const cleanCpf = (cpf || "").replace(/\D/g, "");

    const paymentData = await payment.create({
      body: {
        transaction_amount: price,
        description: title,
        payment_method_id: "pix",
        payer: {
          email: userEmail || "cliente@exemplo.com",
          first_name: name || "Cliente VOID",
          identification: {
            type: "CPF",
            number: cleanCpf.length >= 11 ? cleanCpf : "00000000000",
          },
        },
        external_reference: `${userId || 'guest'}:${planId}:${Date.now()}`,
        notification_url: `${appUrl}/api/mercadopago/webhook`,
      },
    });

    const qrCode = paymentData.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = paymentData.point_of_interaction?.transaction_data?.qr_code_base64;
    const ticketUrl = paymentData.point_of_interaction?.transaction_data?.ticket_url;

    return res.json({
      success: true,
      paymentId: paymentData.id,
      status: paymentData.status,
      qrCode,
      qrCodeBase64,
      ticketUrl,
    });
  } catch (error: any) {
    console.error("Erro ao processar Pix Mercado Pago:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro ao gerar PIX no Mercado Pago",
    });
  }
});

// API: Mercado Pago - Process Transparent Card Payment
app.post("/api/mercadopago/process-card", async (req, res) => {
  try {
    const { planId, userId, userEmail, name, cpf, cardNumber, cardExpiry, cardCvv } = req.body;

    if (!planId || !['basico', 'pro', 'pro_annual', 'pro_plus', 'premium'].includes(planId)) {
      return res.status(400).json({ success: false, error: "Plano inválido fornecido." });
    }

    const planPrices: Record<string, number> = {
      basico: 19.90,
      pro: 49.90,
      pro_annual: 97.00,
      pro_plus: 97.00,
      premium: 97.00,
    };
    const planTitles: Record<string, string> = {
      basico: "Plano Básico - E-books com IA",
      pro: "Plano PRO Mensal - E-books com IA",
      pro_annual: "Plano PRO+ ANUAL - 365 Dias (20 e-books/mês)",
      pro_plus: "Plano PRO+ ANUAL - 365 Dias (20 e-books/mês)",
      premium: "Plano PRO+ ANUAL - 365 Dias (20 e-books/mês)",
    };

    const price = planPrices[planId];
    const title = planTitles[planId];

    const mpClient = getMercadoPagoClient();
    if (!mpClient) {
      return res.status(400).json({
        success: false,
        error: "A chave MERCADOPAGO_ACCESS_TOKEN não está configurada em Configurações.",
      });
    }

    const cleanCardNumber = (cardNumber || "").replace(/\D/g, "");
    const cleanCpf = (cpf || "").replace(/\D/g, "");
    const [expMonthRaw, expYearRaw] = (cardExpiry || "").split("/");
    const expMonth = (expMonthRaw || "").trim().padStart(2, "0");
    let expYear = (expYearRaw || "").trim();
    if (expYear.length === 2) expYear = "20" + expYear;

    let paymentMethodId = "visa";
    if (cleanCardNumber.startsWith("4")) paymentMethodId = "visa";
    else if (/^(5[1-5]|2[2-7])/.test(cleanCardNumber)) paymentMethodId = "master";
    else if (/^(4011|4389|4514|4576|5041|5067|5090|6277|6362|6363)/.test(cleanCardNumber)) paymentMethodId = "elo";
    else if (/^(34|37)/.test(cleanCardNumber)) paymentMethodId = "amex";
    else if (/^(6062|3841)/.test(cleanCardNumber)) paymentMethodId = "hipercard";

    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const tokenRes = await fetch(`https://api.mercadopago.com/v1/card_tokens?access_token=${mpAccessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        card_number: cleanCardNumber,
        expiration_month: Number(expMonth),
        expiration_year: Number(expYear),
        security_code: (cardCvv || "").trim(),
        cardholder: {
          name: name || "CLIENTE VOID",
          identification: {
            type: "CPF",
            number: cleanCpf.length >= 11 ? cleanCpf : "00000000000",
          },
        },
      }),
    });

    const cardTokenResult: any = await tokenRes.json();

    if (!tokenRes.ok || !cardTokenResult || !cardTokenResult.id) {
      console.error("Erro tokenização Mercado Pago:", cardTokenResult);
      return res.status(400).json({
        success: false,
        error: cardTokenResult.message || "Não foi possível validar os dados do cartão de crédito. Verifique os dados digitados.",
      });
    }

    const payment = new Payment(mpClient);
    const paymentResult = await payment.create({
      body: {
        transaction_amount: price,
        token: cardTokenResult.id,
        description: title,
        installments: 1,
        payment_method_id: paymentMethodId,
        payer: {
          email: userEmail || "cliente@exemplo.com",
          first_name: name || "Cliente VOID",
          identification: {
            type: "CPF",
            number: cleanCpf.length >= 11 ? cleanCpf : "00000000000",
          },
        },
        external_reference: `${userId || 'guest'}:${planId}:${Date.now()}`,
      },
    });

    if (paymentResult.status === "approved") {
      return res.json({
        success: true,
        status: "approved",
        paymentId: paymentResult.id,
      });
    } else {
      const statusDetailsMessage: Record<string, string> = {
        cc_rejected_bad_filled_card_number: "Número do cartão inválido.",
        cc_rejected_bad_filled_date: "Data de validade do cartão incorreta.",
        cc_rejected_bad_filled_other: "Dados do cartão incorretos.",
        cc_rejected_bad_filled_security_code: "Código de segurança (CVV) inválido.",
        cc_rejected_call_for_authorize: "Pagamento não autorizado. Contate a operadora do cartão.",
        cc_rejected_card_disabled: "Cartão desabilitado.",
        cc_rejected_insufficient_amount: "Saldo ou limite insuficiente.",
        cc_rejected_other_reason: "Cartão recusado pela operadora.",
      };

      const detailMsg = statusDetailsMessage[paymentResult.status_detail || ""] || "Pagamento com cartão recusado pelo emissor.";
      return res.status(400).json({
        success: false,
        status: paymentResult.status,
        statusDetail: paymentResult.status_detail,
        error: detailMsg,
      });
    }
  } catch (error: any) {
    console.error("Erro ao processar cartão Mercado Pago:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Erro ao processar pagamento com cartão de crédito.",
    });
  }
});

// API: Mercado Pago - Check Transparent Payment Status (Polling)
app.get("/api/mercadopago/payment-status/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;
    const mpClient = getMercadoPagoClient();

    if (!mpClient) {
      return res.status(400).json({ success: false, error: "Mercado Pago não configurado." });
    }

    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    return res.json({
      success: true,
      status: paymentData.status,
      statusDetail: paymentData.status_detail,
      externalReference: paymentData.external_reference,
    });
  } catch (error: any) {
    console.error("Erro ao checar status do pagamento:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// API: Mercado Pago - Webhook Listener
app.post("/api/mercadopago/webhook", async (req, res) => {
  try {
    const { type, data } = req.body;
    console.log("Mercado Pago Webhook recebido:", { type, data, query: req.query });

    // Respond HTTP 200 immediately to Mercado Pago
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Erro no webhook Mercado Pago:", error);
    res.status(200).json({ received: true });
  }
});

// API: Suggest Titles and Subtitles
app.post("/api/suggest-title", async (req, res) => {
  try {
    const { genre, description, tone } = req.body;
    const ai = getGenAI();

    const response = await generateContentWithRetry(ai, {
      model: "gemini-flash-latest",
      contents: `Com base nas seguintes informações, sugira 4 opções incríveis de título e subtítulo para um e-book profissional e atraente:
- Gênero/Área: ${genre || 'Geral'}
- Descrição/Ideia: ${description || 'Tópicos úteis e práticos'}
- Tom de Voz: ${tone || 'Profissional'}

Retorne APENAS um array JSON com objetos contendo "title" e "subtitle" em português.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Título impactante do e-book" },
              subtitle: { type: Type.STRING, description: "Subtítulo explicativo e atraente" },
            },
            required: ["title", "subtitle"],
          },
        },
      },
    });

    const suggestions = JSON.parse(response.text || "[]");
    res.json({ success: true, suggestions });
  } catch (error: any) {
    console.error("Error in suggest-title:", error);
    res.status(500).json({ success: false, error: error.message || "Erro ao gerar sugestões" });
  }
});

// API: Generate AI Cover Image
app.post("/api/generate-cover-image", async (req, res) => {
  try {
    const { title, genre, style = "editorial" } = req.body;
    const ai = getGenAI();

    const promptRes = await generateContentWithRetry(ai, {
      model: "gemini-flash-latest",
      contents: `Create a concise 12-word English visual prompt for a professional book cover background artwork based on:
Title: ${title || 'Ebook'}
Genre: ${genre || 'General'}
Style: ${style}
Focus on high resolution artwork, elegant composition, 3D render or professional photography, clean background without text.`,
    });

    const visualPrompt = promptRes.text?.trim().replace(/[^a-zA-Z0-9 ,]/g, "") || "professional abstract book cover artwork background";
    const seed = Math.floor(Math.random() * 1000000);
    const coverImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(visualPrompt)}?width=800&height=1131&nologo=true&seed=${seed}`;

    res.json({ success: true, coverImageUrl, prompt: visualPrompt });
  } catch (error: any) {
    console.error("Error generating cover image:", error);
    const fallbackUrl = `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop`;
    res.json({ success: true, coverImageUrl: fallbackUrl });
  }
});

// API: Generate E-book Structure and Content
app.post("/api/generate-ebook", async (req, res) => {
  try {
    const {
      title,
      subtitle,
      author,
      genre,
      targetAudience,
      tone,
      description,
      pageCount = 8,
      template = "editorial",
      fontHeading = "Plus Jakarta Sans",
      fontBody = "Inter",
      primaryColor = "#2563EB",
      accentColor = "#F59E0B",
      contentDepth = "standard",
      language = "Português",
      userPlan = "basico",
      aspectRatio = "A4",
      useAiIllustrations = false,
      useNativeCharts = false,
      use3070Layout = false,
    } = req.body;

    const ai = getGenAI();

    // Enforce page limits based on user plan (Basic: 12, Pro: 18, Pro+ Anual: 18, Premium: 18)
    const isProOrPremium = ["pro", "pro_annual", "pro_plus", "premium"].includes(userPlan);
    const maxAllowedPages = isProOrPremium ? 18 : 12;
    const targetPages = Math.min(Math.max(Number(pageCount) || 8, 3), maxAllowedPages);
    const isDeep = contentDepth === "deep";

    const formatFramingRule = aspectRatio === '16:9'
      ? `\n\nENQUADRAMENTO DINÂMICO 16:9 (WIDESCREEN / TELAS HORIZONTAIS):
- Como a altura vertical é reduzida, cada página DEVE ter textos objetivos e parágrafos curtos (máximo 60 a 75 palavras por bloco).
- Cada página deve ter no máximo 2 a 4 blocos para NUNCA estourar o limite vertical da tela. Fracione ideias longas em capítulos adicionais.`
      : aspectRatio === '4:5'
      ? `\n\nENQUADRAMENTO DINÂMICO 4:5 (MOBILE / PORTRAIT):
- Altura média para celulares: parágrafos equilibrados (máximo 90 a 110 palavras por bloco) e 3 a 4 blocos por página.`
      : `\n\nENQUADRAMENTO DINÂMICO A4 (DOCUMENTO / PDF TRADICIONAL):
- Altura vertical generosa: parágrafos ricos e aprofundados (até 140 palavras por bloco) e 3 a 5 blocos por página.`;

    const visualsPrompt = (useAiIllustrations || useNativeCharts)
      ? `\n\nDIRETRIZES DE DESIGN VISUAL PROFISSIONAL & PRO:
- O usuário ativou elementos visuais e ilustrações enriquecidas.
- REGRA CRÍTICA DE COERÊNCIA E EQUILÍBRIO: NÃO coloque imagens ou gráficos em todas as páginas! Insira elementos visuais de forma DOSADA e ESTRATÉGICA em apenas 2 a 4 páginas estratégicas ao longo de todo o e-book (por exemplo: 1 bloco de imagem ilustrativa com 'imageAlt' e 'imageKeyword' focado no tema, ou 1 bloco de métricas/gráficos em um capítulo prático). As demais páginas devem ser dedicadas à leitura fluida com textos e listas.
- Em páginas selecionadas, sinta-se livre para incluir:
  1. Blocos de imagem ('image') com descrição visual em 'imageAlt' e 'imageKeyword' específico do conceito explicado.
  2. Blocos de gráficos de barras percentuais ('chart_bars') para demonstrar dados, comparações, etapas ou crescimento (com 2 a 4 'chartItems', cada um com 'label', 'percentage' de 10 a 100, e 'valueStr').
  3. Blocos de estatísticas e métricas de alto impacto ('stat_grid' ou 'kpi_trending') com 2 a 3 'stats' (ex: label: "Aumento de Eficiência", value: "+84%", desc: "Comprovado em testes").
  4. Blocos de medidores radiais / circulares ('circle_metrics') com 2 a 3 'chartItems' com percentuais e labels.
  5. Blocos de fluxo e roadmap ('process_timeline') com as fases divididas por quebra de linha (\\n).
  6. Blocos de destaques em badges ('badge_features') e tabelas conceituais ('comparison_table') com 'tableData'.
  7. Caixas de ênfase 'callout' e citações de autoridade 'quote'.`
      : `\n\nDIRETRIZES DE CONTEÚDO EDITORIAL (APENAS TEXTO & DIAGRAMAÇÃO):
- O usuário escolheu ESTRITAMENTE 'Apenas Texto e Diagramação'.
- NÃO inclua NENHUM bloco de imagem ('image') no corpo das páginas.
- NÃO inclua gráficos de barras ('chart_bars') ou medidores circulares ('circle_metrics').
- Foque 100% em diagramação editorial limpa, tipografia impecável, parágrafos fluidos ('paragraph'), subtítulos elegantes ('subheading'), citações ('quote'), destaques em caixas ('callout') e listas bem formatadas ('bullet_list', 'checklist').`;

    const systemPrompt = `Você é um autor especialista e mestre em diagramação e redação de e-books de altíssima qualidade.
Sua missão é entender profundamente o Título, Subtítulo, Gênero, Público-Alvo, Tom de Voz e a Descrição do projeto para criar o conteúdo completo, contextualizado e profissional para um e-book NO IDIOMA EXATO: ${language} com EXATAMENTE ${targetPages} páginas numeradas de 1 até ${targetPages}.${formatFramingRule}

INTELIGÊNCIA CONTEXTUAL E ESTRUTURA DO TEXTO:
- O conteúdo deve ser rico, fluido e adaptado ao tema exato do e-book.
- O formato principal deve ser composto por parágrafos envolventes ("paragraph"), títulos e subtítulos claros ("heading", "subheading"), citações inspiradoras ("quote") e destaques ("callout").${visualsPrompt}

REGRA RÍGIDA DE ESTRUTURAÇÃO DE LISTAS E TÓPICOS:
- Quando utilizar blocos do tipo "bullet_list", "checklist", "key_takeaways", "badge_features" ou "process_timeline", CADA ITEM DA LISTA DEVE FICAR EM UMA NOVA LINHA SEPARADA usando quebra de linha (\\n).
- É PROIBIDO separar itens de lista com vírgulas em uma única linha contínua.

Nível de Profundidade do Conteúdo: ${isDeep ? 'PROFUNDO E DETALHADO (Textos longos, com argumentos densos, dados, exemplos práticos e explicações minuciosas)' : 'DIRETO E RESUMIDO (Textos concisos, focados em pontos-chave e leitura rápida)'}.

Diretrizes por Página:
- Página 1 DEVE ser do tipo "cover" (Capa com Título, Subtítulo, Autor).
- Página 2 DEVE ser do tipo "toc" (Sumário estruturado).
- Página 3 DEVE ser do tipo "intro" (Introdução marcante ao tema).
- As páginas intermediárias (de 4 a ${targetPages - 1}) DEVEM ser do tipo "chapter" com capítulos fluidos, parágrafos explicativos e elementos variados.
- A última página (${targetPages}) DEVE ser do tipo "summary" ou "back_cover" (Conclusão e encerramento acionável).

Gere EXATAMENTE ${targetPages} páginas completas no array 'pages'.
Cada página DEVE conter entre ${isDeep ? '3 e 6' : '2 e 5'} blocos de conteúdo bem equilibrados e naturais.
Para cada página, sugira um 'imageKeyword' em inglês focado no assunto.`;

    const userPrompt = `Detalhes do E-book:
- Título: ${title}
- Subtítulo: ${subtitle || ''}
- Autor: ${author || 'Autor Especialista'}
- Gênero: ${genre}
- Público-Alvo: ${targetAudience || 'Público geral interessado no tema'}
- Tom de Voz: ${tone}
- Ideia e Conteúdo Principal: ${description}
- Idioma de Saída Solicitado: ${language}
- Quantidade exata de páginas: ${targetPages}`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-flash-latest",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  type: {
                    type: Type.STRING,
                    description: "Pode ser: cover, toc, intro, chapter, summary, back_cover",
                  },
                  layoutVariant: {
                    type: Type.STRING,
                    description: "Pode ser: standard, split, hero-top, quote-centered, grid-cards",
                  },
                  headerIcon: { type: Type.STRING, description: "Nome de um ícone sugestivo em inglês ex: BookOpen, Sparkles, Target, Lightbulb, Heart, CheckCircle2, TrendingUp, BarChart3, ShieldCheck" },
                  imageKeyword: { type: Type.STRING, description: "Palavras-chave conceituais em inglês para busca visual no Unsplash" },
                  blocks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        type: {
                          type: Type.STRING,
                          description: "Pode ser: heading, subheading, paragraph, bullet_list, quote, callout, key_takeaways, checklist, image, stat_grid, chart_bars, comparison_table, kpi_trending, circle_metrics, process_timeline, badge_features",
                        },
                        content: {
                          type: Type.STRING,
                          description: "Texto do bloco. Para listas cada item deve ter \\n.",
                        },
                        icon: { type: Type.STRING },
                        imageAlt: { type: Type.STRING },
                        stats: {
                          type: Type.ARRAY,
                          description: "Usado quando type='stat_grid' ou 'kpi_trending'. Lista de 2 a 3 métricas numéricas",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              label: { type: Type.STRING },
                              value: { type: Type.STRING, description: "Ex: '92%', '+3.4x', '10k+'" },
                              desc: { type: Type.STRING },
                            },
                            required: ["label", "value"],
                          },
                        },
                        chartItems: {
                          type: Type.ARRAY,
                          description: "Usado quando type='chart_bars' ou 'circle_metrics'. Lista de 2 a 4 barras de progresso",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              label: { type: Type.STRING },
                              percentage: { type: Type.INTEGER, description: "Número de 10 a 100" },
                              valueStr: { type: Type.STRING, description: "Ex: '78%', 'R$ 45k', 'Nível Alto'" },
                            },
                            required: ["label", "percentage"],
                          },
                        },
                        tableData: {
                          type: Type.OBJECT,
                          description: "Usado quando type='comparison_table'",
                          properties: {
                            headers: { type: Type.ARRAY, items: { type: Type.STRING } },
                            rows: {
                              type: Type.ARRAY,
                              items: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                              },
                            },
                          },
                        },
                      },
                      required: ["id", "type", "content"],
                    },
                  },
                },
                required: ["pageNumber", "title", "type", "blocks"],
              },
            },
          },
          required: ["title", "pages"],
        },
      },
    });

    const generatedData = JSON.parse(response.text || "{}");

    // Helper to normalize block content (ensuring list items are split by newlines)
    const normalizeBlockContent = (block: any) => {
      if (["bullet_list", "checklist", "key_takeaways", "badge_features", "process_timeline"].includes(block.type)) {
        let text = Array.isArray(block.content) ? block.content.join("\n") : String(block.content || "");
        if (!text.includes("\n")) {
          if (text.includes(",") && text.split(",").length >= 3) {
            text = text.split(",").map((item: string) => item.trim()).filter(Boolean).join("\n");
          } else if (text.includes(";") && text.split(";").length >= 2) {
            text = text.split(";").map((item: string) => item.trim()).filter(Boolean).join("\n");
          }
        }
        return text;
      }
      return block.content;
    };

    // Track used URLs per ebook to guarantee zero repetition across all pages
    const usedEbookImageUrls = new Set<string>();

    // Enhance pages with contextual image URLs from our 500-image professional library
    let rawPages = generatedData.pages || [];

    // Ensure rawPages adheres strictly to targetPages
    if (rawPages.length > targetPages) {
      // Keep first pages and force last page to be the summary/closing page
      const head = rawPages.slice(0, targetPages - 1);
      const tail = rawPages[rawPages.length - 1];
      rawPages = [...head, { ...tail, type: 'summary', title: tail.title || 'Conclusão & Próximos Passos' }];
    } else if (rawPages.length < targetPages && rawPages.length > 0) {
      // Fill missing pages with thematic chapter expansions to achieve exact targetPages count
      const lastChapter = rawPages[rawPages.length - 1];
      while (rawPages.length < targetPages) {
        const pNum = rawPages.length + 1;
        if (pNum === targetPages) {
          rawPages.push({
            pageNumber: pNum,
            title: "Conclusão Estratégica & Próximos Passos",
            type: "summary",
            layoutVariant: "standard",
            imageKeyword: genre || "success",
            blocks: [
              {
                id: `block-${pNum}-1`,
                type: "heading",
                content: "Conclusão & Implementação Prática",
              },
              {
                id: `block-${pNum}-2`,
                type: "paragraph",
                content: "Ao aplicar sistematicamente os conhecimentos apresentados ao longo deste e-book, você estabelece uma base sólida para alcançar resultados consistentes e mensuráveis no seu dia a dia.",
              },
              {
                id: `block-${pNum}-3`,
                type: "checklist",
                content: "Revisar os pontos fundamentais aprendidos\nDefinir metas acionáveis de curto prazo\nExecutar o plano prático com consistência",
              },
            ],
          });
        } else {
          rawPages.splice(rawPages.length - 1, 0, {
            pageNumber: pNum,
            title: `Capítulo ${pNum - 2}: Aprofundamento Prático`,
            type: "chapter",
            layoutVariant: "standard",
            imageKeyword: genre || "strategy",
            blocks: [
              {
                id: `block-${pNum}-1`,
                type: "heading",
                content: `Domínio & Boas Práticas - Parte ${pNum - 2}`,
              },
              {
                id: `block-${pNum}-2`,
                type: "paragraph",
                content: `Nesta etapa avançada, exploramos estratégias adicionais e metodologias comprovadas para maximizar sua eficiência e evitar erros comuns na execução do tema.`,
              },
              {
                id: `block-${pNum}-3`,
                type: "key_takeaways",
                content: "Foco na execução consistente\nMedição contínua dos resultados obtidos\nAprimoramento iterativo de cada processo",
              },
            ],
          });
        }
      }
    }

    // Process blocks and attach smart contextual images strictly respecting user choice
    let imagesInjectedCount = 0;
    const maxAllowedImages = useAiIllustrations ? (targetPages >= 14 ? 4 : targetPages >= 8 ? 3 : 2) : 0;

    const pagesWithImages = rawPages.map((page: any, index: number) => {
      const keyword = page.imageKeyword || page.title || genre || "knowledge";
      const pageTitle = page.title || "";
      const pageType = page.type || "chapter";

      let blocks = (page.blocks || []).map((block: any, bIdx: number) => {
        // If user chose text-only, convert any image block to a clean callout/text box
        if (block.type === 'image') {
          if (!useAiIllustrations) {
            return {
              id: block.id || `block-${index + 1}-${bIdx + 1}`,
              type: 'callout',
              content: block.content || `Conceito Estratégico: ${pageTitle || 'Fundamentos do Capítulo'}`,
            };
          }

          // If illustrations are enabled and within reasonable limit
          if (imagesInjectedCount < maxAllowedImages) {
            const imgItem = getSmartContextualImage(`${keyword} ${pageTitle}`, genre, usedEbookImageUrls);
            const resolvedImageUrl = imgItem?.url || block.imageUrl || "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop";
            if (imgItem?.url) {
              usedEbookImageUrls.add(imgItem.url);
            }
            imagesInjectedCount++;
            return {
              ...block,
              id: block.id || `block-${index + 1}-${bIdx + 1}`,
              content: normalizeBlockContent(block),
              imageUrl: resolvedImageUrl,
              imageAlt: block.imageAlt || `Ilustração: ${imgItem?.title || pageTitle || keyword}`,
            };
          } else {
            // Already reached balanced image quota: convert excess images to high-value takeaway boxes
            return {
              id: block.id || `block-${index + 1}-${bIdx + 1}`,
              type: 'key_takeaways',
              content: block.content || `Síntese Prática: ${pageTitle}`,
            };
          }
        }

        // If user disabled charts, convert chart types to key takeaways
        if (!useNativeCharts && ['chart_bars', 'circle_metrics', 'stat_grid', 'kpi_trending'].includes(block.type)) {
          return {
            id: block.id || `block-${index + 1}-${bIdx + 1}`,
            type: 'key_takeaways',
            content: typeof block.content === 'string' ? block.content : 'Análise estratégica e métricas de acompanhamento de resultados.',
          };
        }

        return {
          ...block,
          id: block.id || `block-${index + 1}-${bIdx + 1}`,
          content: normalizeBlockContent(block),
        };
      });

      // Auto-inject contextual illustration ONLY if user requested illustrations and we have fewer than max
      const hasImageBlock = blocks.some((b: any) => b.type === 'image' && b.imageUrl);
      const isEligiblePage = useAiIllustrations && pageType === 'chapter' && (index === 3 || index === 7) && imagesInjectedCount < maxAllowedImages;

      if (!hasImageBlock && isEligiblePage && blocks.length >= 2) {
        const imgItem = getSmartContextualImage(`${keyword} ${pageTitle}`, genre, usedEbookImageUrls);
        const contextualImageUrl = imgItem?.url;
        if (contextualImageUrl) {
          usedEbookImageUrls.add(contextualImageUrl);
          imagesInjectedCount++;
          const imageBlock = {
            id: `auto-img-${index + 1}`,
            type: 'image',
            content: pageTitle ? `Conceito Visual: ${pageTitle}` : `Ilustração de ${keyword}`,
            imageUrl: contextualImageUrl,
            imageAlt: `Ilustração: ${imgItem.title || pageTitle || keyword}`,
          };

          // Insert image harmoniously after the first introductory paragraph or heading
          if (blocks.length > 2) {
            blocks.splice(2, 0, imageBlock);
          } else {
            blocks.push(imageBlock);
          }
        }
      }

      return {
        ...page,
        pageNumber: index + 1,
        imageKeyword: keyword,
        blocks,
      };
    });

    // Main Cover image default or generated based on topic context
    const coverImageUrl = req.body.coverImageUrl || getTopicCoverImage(genre, title, description);

    const ebook = {
      id: `ebook-${Date.now()}`,
      title: generatedData.title || title,
      subtitle: generatedData.subtitle || subtitle || "",
      author: author || "Autor Especialista",
      genre: genre || "Geral",
      tone: tone || "Profissional",
      template,
      fontHeading,
      fontBody,
      primaryColor,
      accentColor,
      coverImageUrl,
      pages: pagesWithImages,
      createdAt: new Date().toISOString(),
      language: language || "Português",
      aspectRatio: req.body.aspectRatio || "A4",
    };

    res.json({ success: true, ebook });
  } catch (error: any) {
    console.error("Error generating ebook:", error);
    res.status(500).json({ success: false, error: error.message || "Erro ao gerar o e-book com IA" });
  }
});

// API: Translate E-book or Page
app.post("/api/translate-ebook", async (req, res) => {
  try {
    const { ebook, targetLanguage = "Inglês" } = req.body;
    if (!ebook || !ebook.pages) {
      return res.status(400).json({ success: false, error: "E-book inválido fornecido." });
    }

    const ai = getGenAI();

    const response = await generateContentWithRetry(ai, {
      model: "gemini-flash-latest",
      contents: `Você é um tradutor literário e técnico profissional.
Traduza com perfeição o seguinte JSON de e-book para o idioma: "${targetLanguage}".
Mantenha rigorosamente a estrutura, chaves JSON, IDs, tipos de blocos, contagem de páginas e formatações.

JSON do E-book:
${JSON.stringify(ebook, null, 2)}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const translatedEbook = JSON.parse(response.text || "{}");
    translatedEbook.language = targetLanguage;

    res.json({ success: true, ebook: translatedEbook });
  } catch (error: any) {
    console.error("Error translating ebook:", error);
    res.status(500).json({ success: false, error: error.message || "Erro na tradução do e-book" });
  }
});

// API: Unsplash Image Search proxy
app.get("/api/unsplash-search", async (req, res) => {
  try {
    const query = (req.query.q as string) || "reading book";
    const count = Number(req.query.count) || 8;

    // Curated high-quality unsplash image sets per theme for instant reliability
    const categoryImages: Record<string, string[]> = {
      negocios: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
      ],
      culinaria: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1200&auto=format&fit=crop",
      ],
      tecnologia: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop",
      ],
      desenvolvimento: [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
      ],
      saude: [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
      ],
      financas: [
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1200&auto=format&fit=crop",
      ],
    };

    const cleanQ = query.toLowerCase();
    let matchedUrls: string[] = [];

    Object.keys(categoryImages).forEach((cat) => {
      if (cleanQ.includes(cat)) {
        matchedUrls = categoryImages[cat];
      }
    });

    if (matchedUrls.length === 0) {
      // General photography selection
      matchedUrls = [
        `https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1200&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop`,
        `https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop`,
      ];
    }

    const results = matchedUrls.map((url, i) => ({
      id: `img-${i}-${Date.now()}`,
      url,
      thumb: url.replace("w=1200", "w=400"),
      alt: `${query} photo ${i + 1}`,
      author: "Unsplash Photographer",
    }));

    res.json({ success: true, images: results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
