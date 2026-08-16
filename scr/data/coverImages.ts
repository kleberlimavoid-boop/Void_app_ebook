export interface CoverImageItem {
  id: string;
  url: string;
  title: string;
  category: string;
  keywords: string[];
}

export interface CoverImageCategory {
  id: string;
  name: string;
  description: string;
  images: { id: string; url: string; title: string; keywords: string[] }[];
}

export const COVER_IMAGE_LIBRARY: Record<string, CoverImageCategory> = {
  negocios: {
    id: "negocios",
    name: "Negócios & Liderança",
    description: "Arranha-céus corporativos, reuniões executivas, liderança e gestão de alto nível.",
    images: [
      {
        id: "neg-1",
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
        title: "Arranha-Céu Corporativo Espelhado",
        keywords: ["empresa", "corporativo", "predio", "arquitetura", "sucesso", "b2b", "lideranca"]
      },
      {
        id: "neg-2",
        url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
        title: "Líder Executivo em Terno de Alfaiataria",
        keywords: ["lider", "executivo", "gestao", "carreira", "sucesso", "homem", "ceo"]
      },
      {
        id: "neg-3",
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
        title: "Executiva Liderando Reunião Estratégica",
        keywords: ["equipe", "reuniao", "trabalho", "lideranca", "negocios", "mulher"]
      },
      {
        id: "neg-4",
        url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
        title: "Planejamento Estratégico & Análise",
        keywords: ["plano", "estrategia", "meta", "produtividade", "gestao", "analise"]
      },
      {
        id: "neg-5",
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
        title: "Colaboração & Equipe de Alta Performance",
        keywords: ["startup", "inovacao", "time", "brainstorming", "cultura"]
      },
      {
        id: "neg-6",
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
        title: "Escritório Minimalista Premium",
        keywords: ["escritorio", "design", "foco", "moderno", "arquitetura", "ambiente"]
      },
      {
        id: "neg-7",
        url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop",
        title: "Acordo de Negócios & Aperto de Mão",
        keywords: ["acordo", "contrato", "venda", "cliente", "negociacao", "parceria"]
      },
      {
        id: "neg-8",
        url: "https://images.unsplash.com/photo-1507208773393-424a1c5d57d3?q=80&w=1200&auto=format&fit=crop",
        title: "Empreendedora Visionária",
        keywords: ["mulher", "lideranca", "empreendedora", "sucesso", "foco", "visao"]
      },
      {
        id: "neg-9",
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
        title: "Palestra & Apresentação Executiva",
        keywords: ["pitch", "apresentacao", "palestra", "vendas", "treinamento", "oratoria"]
      },
      {
        id: "neg-10",
        url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop",
        title: "Contrato Executivo & Caneta Tinteiro",
        keywords: ["direito", "advocacia", "contrato", "lei", "negociacao", "fechamento"]
      },
      {
        id: "neg-11",
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
        title: "Sessão de Mentoria & Coaching",
        keywords: ["mentoria", "coaching", "treinamento", "desenvolvimento", "consultoria"]
      },
      {
        id: "neg-12",
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
        title: "Reunião de Diretoria com Painéis",
        keywords: ["conselho", "diretoria", "board", "gestao", "reuniao"]
      },
      {
        id: "neg-13",
        url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
        title: "Sala de Conferência Iluminada",
        keywords: ["conferencia", "sede", "corporativo", "sala", "mesa"]
      },
      {
        id: "neg-14",
        url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
        title: "Parceria Estratégica & Confiança",
        keywords: ["parceria", "sociedade", "confianca", "networking", "negocios"]
      },
      {
        id: "neg-15",
        url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
        title: "Visão do Topo da Cidade",
        keywords: ["topo", "sucesso", "conquista", "metas", "carreira", "futuro"]
      },
      {
        id: "neg-16",
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
        title: "Consultora Empresarial Sênior",
        keywords: ["consultora", "especialista", "assessoria", "carreira", "lider"]
      },
      {
        id: "neg-17",
        url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop",
        title: "Painel de Métricas e KPIs Corporativos",
        keywords: ["kpi", "metricas", "resultados", "performance", "gestao"]
      },
      {
        id: "neg-18",
        url: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1200&auto=format&fit=crop",
        title: "Conversa de Alinhamento e Feedback 1-on-1",
        keywords: ["feedback", "1on1", "rh", "pessoas", "cultura"]
      },
      {
        id: "neg-19",
        url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop",
        title: "Comemoração de Metas Batidas",
        keywords: ["vitoria", "metas", "time", "celebracao", "resultado"]
      },
      {
        id: "neg-20",
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
        title: "Centro Financeiro Urbano ao Entardecer",
        keywords: ["metropole", "cidade", "luzes", "global", "capital"]
      }
    ]
  },

  financas: {
    id: "financas",
    name: "Finanças, Vendas & Investimentos",
    description: "Gráficos de lucro, mercado de ações, criptomoedas, funil de vendas e prosperidade.",
    images: [
      {
        id: "fin-1",
        url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop",
        title: "Candlesticks & Gráfico de Ações",
        keywords: ["bolsa", "trading", "mercado", "acoes", "investimentos", "daytrade"]
      },
      {
        id: "fin-2",
        url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop",
        title: "Crescimento de Patrimônio e Lucros",
        keywords: ["lucro", "crescimento", "renda", "dividendos", "riqueza", "capital"]
      },
      {
        id: "fin-3",
        url: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1200&auto=format&fit=crop",
        title: "Notas de Dinheiro em Foco",
        keywords: ["dinheiro", "cedulas", "riqueza", "patrimonio", "financas"]
      },
      {
        id: "fin-4",
        url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop",
        title: "Criptomoedas & Ativos Digitais",
        keywords: ["cripto", "bitcoin", "blockchain", "ativos", "ethereum", "web3"]
      },
      {
        id: "fin-5",
        url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1200&auto=format&fit=crop",
        title: "Moeda Dourada e Valor de Mercado",
        keywords: ["ouro", "moeda", "valor", "investir", "tesouro"]
      },
      {
        id: "fin-6",
        url: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1200&auto=format&fit=crop",
        title: "Dashboard de Vendas Exponenciais",
        keywords: ["vendas", "faturamento", "conversao", "escala", "receita"]
      },
      {
        id: "fin-7",
        url: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=1200&auto=format&fit=crop",
        title: "Calculadora e Planilhas Financeiras",
        keywords: ["contabilidade", "auditoria", "calculadora", "impostos", "relatorio"]
      },
      {
        id: "fin-8",
        url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
        title: "App de Fintech no Smartphone",
        keywords: ["fintech", "banco", "smartphone", "pagamento", "pix", "transferencia"]
      },
      {
        id: "fin-9",
        url: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=1200&auto=format&fit=crop",
        title: "Relatório de Balanço e Auditoria",
        keywords: ["dre", "balanco", "auditoria", "fiscal", "financas"]
      },
      {
        id: "fin-10",
        url: "https://images.unsplash.com/photo-1556742049-0a67c57750c9?q=80&w=1200&auto=format&fit=crop",
        title: "Cartão de Crédito Black & Pagamentos",
        keywords: ["cartao", "credito", "black", "pagamentos", "banco"]
      },
      {
        id: "fin-11",
        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
        title: "Monitor de Trading & Múltiplas Telas",
        keywords: ["trader", "telas", "analise", "forex", "mercado"]
      },
      {
        id: "fin-12",
        url: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200&auto=format&fit=crop",
        title: "Moedas de Bitcoin Físicas Douradas",
        keywords: ["bitcoin", "btc", "cripto", "investimento", "futuro"]
      },
      {
        id: "fin-13",
        url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
        title: "Declaração de Renda e Planejamento Tributário",
        keywords: ["tributario", "irpf", "economia", "dinheiro", "leis"]
      },
      {
        id: "fin-14",
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
        title: "Mansão de Alto Luxo & Investimento Imobiliário",
        keywords: ["imoveis", "mansao", "luxo", "patrimonio", "investidor"]
      },
      {
        id: "fin-15",
        url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
        title: "Conselheiro Financeiro Privado",
        keywords: ["wealth", "consultor", "patrimonio", "gestor", "fundos"]
      },
      {
        id: "fin-16",
        url: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop",
        title: "Segurança de Carteira Digital",
        keywords: ["wallet", "seguranca", "carteira", "reserva", "emergencia"]
      },
      {
        id: "fin-17",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
        title: "Análise de Retorno sobre Investimento (ROI)",
        keywords: ["roi", "retorno", "metricas", "crescimento", "dados"]
      },
      {
        id: "fin-18",
        url: "https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=1200&auto=format&fit=crop",
        title: "Transação Digital Instantânea",
        keywords: ["pagamento", "checkout", "venda", "comercio", "transacao"]
      },
      {
        id: "fin-19",
        url: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?q=80&w=1200&auto=format&fit=crop",
        title: "Comércio Eletrônico e Faturamento",
        keywords: ["loja", "ecommerce", "faturamento", "compras", "varejo"]
      },
      {
        id: "fin-20",
        url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
        title: "Rodada de Investimento & Venture Capital",
        keywords: ["investidores", "venture", "angel", "startup", "aporte"]
      }
    ]
  },

  tecnologia: {
    id: "tecnologia",
    name: "Tecnologia, IA & Inovação",
    description: "Redes neurais, circuitos integrados, código de programação, cloud e cibersegurança.",
    images: [
      {
        id: "tec-1",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        title: "Redes Neurais & Inteligência Artificial",
        keywords: ["ia", "ai", "redes", "neurais", "inteligencia", "futuro", "algoritmo"]
      },
      {
        id: "tec-2",
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
        title: "Código TypeScript & Desenvolvimento Web",
        keywords: ["codigo", "programacao", "developer", "software", "typescript", "web"]
      },
      {
        id: "tec-3",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
        title: "Matriz Hacker & Cibersegurança",
        keywords: ["seguranca", "cyber", "hacker", "protecao", "firewall", "privacidade"]
      },
      {
        id: "tec-4",
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
        title: "Microchip & Processador de Alta Potência",
        keywords: ["chip", "hardware", "processador", "circuito", "semicondutor"]
      },
      {
        id: "tec-5",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
        title: "Conexões Globais & Nuvem Espacial",
        keywords: ["globo", "internet", "conexoes", "satelite", "nuvem", "dados"]
      },
      {
        id: "tec-6",
        url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop",
        title: "Laptop Futurista & Setup Gamer",
        keywords: ["notebook", "trabalho", "hardware", "setup", "tela", "luzes"]
      },
      {
        id: "tec-7",
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
        title: "Datacenter & Servidores em Nuvem",
        keywords: ["servidor", "cloud", "datacenter", "infraestrutura", "bigdata"]
      },
      {
        id: "tec-8",
        url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
        title: "Cérebro Digital & Algoritmos de Machine Learning",
        keywords: ["cerebro", "deeplearning", "machinelearning", "algoritmos", "ia"]
      },
      {
        id: "tec-9",
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
        title: "Braço Robótico e Automação Industrial",
        keywords: ["robo", "robotica", "automacao", "industria", "futuro"]
      },
      {
        id: "tec-10",
        url: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop",
        title: "Óculos VR e Metaverso Imersivo",
        keywords: ["vr", "metaverso", "realidade", "virtual", "futurista", "jogos"]
      },
      {
        id: "tec-11",
        url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1200&auto=format&fit=crop",
        title: "Engenharia de Software e Desenvolvimento",
        keywords: ["software", "engenharia", "programador", "codigo", "dev"]
      },
      {
        id: "tec-12",
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
        title: "Cientista e Inovação em Laboratório Tech",
        keywords: ["pesquisa", "ciencia", "mulher", "inovacao", "futuro"]
      },
      {
        id: "tec-13",
        url: "https://images.unsplash.com/photo-1516116211227-bbc543204364?q=80&w=1200&auto=format&fit=crop",
        title: "Computação Quântica & Física Teórica",
        keywords: ["quantica", "computacao", "fisica", "pesquisa", "futuro"]
      },
      {
        id: "tec-14",
        url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1200&auto=format&fit=crop",
        title: "Estação de Trabalho com Monitores Duplos",
        keywords: ["telas", "workspace", "dev", "hardware", "setup"]
      },
      {
        id: "tec-15",
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
        title: "Luzes Cyberpunk em Metrópole Futurista",
        keywords: ["cyberpunk", "futuro", "neon", "cidade", "scifi"]
      },
      {
        id: "tec-16",
        url: "https://images.unsplash.com/photo-1510519138197-06b862a2939b?q=80&w=1200&auto=format&fit=crop",
        title: "Estrutura Hexagonal de Banco de Dados",
        keywords: ["estrutura", "dados", "grafico", "rede", "nodes", "database"]
      },
      {
        id: "tec-17",
        url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop",
        title: "Smart City & Internet das Coisas (IoT)",
        keywords: ["cidade", "smartcity", "iot", "conectividade", "sensores"]
      },
      {
        id: "tec-18",
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
        title: "Dashboard de Design de Interface UI/UX",
        keywords: ["ui", "ux", "design", "interface", "app", "mobile"]
      },
      {
        id: "tec-19",
        url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop",
        title: "Gradiente Holográfico e Abstração Digital",
        keywords: ["gradiente", "holograma", "abstrato", "design", "futurista"]
      },
      {
        id: "tec-20",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
        title: "Big Data & Análise Preditiva em Tempo Real",
        keywords: ["preditiva", "analise", "ia", "estatistica", "bigdata"]
      }
    ]
  },

  marketing: {
    id: "marketing",
    name: "Marketing & Vendas Digitais",
    description: "Tráfego pago, mídias sociais, copywriting, produção de conteúdo e branding.",
    images: [
      {
        id: "mkt-1",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
        title: "Métricas de Tráfego e Conversão",
        keywords: ["marketing", "trafego", "ads", "google", "meta", "conversao", "funil"]
      },
      {
        id: "mkt-2",
        url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop",
        title: "Redes Sociais & Engajamento Mobile",
        keywords: ["social", "instagram", "tiktok", "youtube", "engajamento", "conteudo"]
      },
      {
        id: "mkt-3",
        url: "https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=1200&auto=format&fit=crop",
        title: "Estratégia de Marketing Digital no Quadro",
        keywords: ["estrategia", "branding", "posicionamento", "campanha", "planejamento"]
      },
      {
        id: "mkt-4",
        url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop",
        title: "Copywriting & Produção Textual com Café",
        keywords: ["copywriting", "texto", "escrita", "persuasao", "artigo", "blog"]
      },
      {
        id: "mkt-5",
        url: "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=1200&auto=format&fit=crop",
        title: "Equipe Criativa em Brainstorming de Campanha",
        keywords: ["criativos", "campanha", "brainstorm", "agencia", "designers"]
      },
      {
        id: "mkt-6",
        url: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=1200&auto=format&fit=crop",
        title: "E-mail Marketing & Automação de Leads",
        keywords: ["email", "leads", "newsletter", "automacao", "crm"]
      },
      {
        id: "mkt-7",
        url: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=1200&auto=format&fit=crop",
        title: "SEO & Otimização de Busca no Google",
        keywords: ["seo", "google", "busca", "palavrachave", "ranqueamento"]
      },
      {
        id: "mkt-8",
        url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
        title: "Gravação de Vídeo & Produção Audiovisual",
        keywords: ["video", "gravacao", "camera", "reels", "shorts", "influencer"]
      },
      {
        id: "mkt-9",
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
        title: "Apresentação de Resultados para o Cliente",
        keywords: ["pitch", "relatorio", "cliente", "agencia", "resultado"]
      },
      {
        id: "mkt-10",
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
        title: "Trabalho Remoto e Lançamento Digital",
        keywords: ["lancamento", "infoproduto", "afiliado", "hotmart", "kiwify"]
      },
      {
        id: "mkt-11",
        url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
        title: "Consultoria de Posicionamento e Marca",
        keywords: ["branding", "marca", "consultoria", "logotipo", "identidade"]
      },
      {
        id: "mkt-12",
        url: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop",
        title: "Livro de Estratégia de Conteúdo e Notas",
        keywords: ["livro", "conteudo", "planejamento", "calendario", "redacao"]
      },
      {
        id: "mkt-13",
        url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
        title: "Agência Digital em Dia de Lançamento",
        keywords: ["agencia", "lancamento", "comemoracao", "metas", "faturamento"]
      },
      {
        id: "mkt-14",
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
        title: "Página de Vendas de Alta Conversão",
        keywords: ["landingpage", "checkout", "conversao", "copy", "vendas"]
      },
      {
        id: "mkt-15",
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
        title: "Nômade Digital Trabalhando da Praia",
        keywords: ["nomade", "liberdade", "vendas", "online", "rendaextra"]
      }
    ]
  },

  saude: {
    id: "saude",
    name: "Saúde, Medicina & Bem-Estar",
    description: "Cuidados médicos, nutrição, dermatologia, fisioterapia e longevidade.",
    images: [
      {
        id: "sau-1",
        url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop",
        title: "Consulta Médica e Estetoscópio",
        keywords: ["medico", "medicina", "saude", "doutor", "clinica", "exame"]
      },
      {
        id: "sau-2",
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
        title: "Profissional de Saúde com Prancheta Digital",
        keywords: ["hospital", "enfermagem", "cuidados", "atendimento", "doutora"]
      },
      {
        id: "sau-3",
        url: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1200&auto=format&fit=crop",
        title: "Acolhimento e Cuidado Humanizado",
        keywords: ["humanizado", "terapia", "cuidador", "idosos", "reabilitacao"]
      },
      {
        id: "sau-4",
        url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
        title: "Skincare, Beleza & Dermatologia Estética",
        keywords: ["pele", "skincare", "estetica", "beleza", "dermatologia", "rosto"]
      },
      {
        id: "sau-5",
        url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
        title: "Ingredientes Naturais e Fitoterapia",
        keywords: ["ervas", "natural", "cha", "fitoterapia", "cura", "natureza"]
      },
      {
        id: "sau-6",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
        title: "Sorriso Radiante e Odontologia Moderna",
        keywords: ["dente", "dentista", "sorriso", "odontologia", "aparelho"]
      },
      {
        id: "sau-7",
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
        title: "Fisioterapia e Alongamento Postural",
        keywords: ["fisioterapia", "postura", "coluna", "pilates", "alongamento"]
      },
      {
        id: "sau-8",
        url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop",
        title: "Laboratório de Vacinas e Imunologia",
        keywords: ["vacina", "laboratorio", "ciencia", "pesquisa", "remedio"]
      },
      {
        id: "sau-9",
        url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
        title: "Equipamentos Cirúrgicos de Alta Precisão",
        keywords: ["cirurgia", "hospital", "equipamento", "bloco", "medicina"]
      },
      {
        id: "sau-10",
        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
        title: "Caminhada Terapêutica ao Ar Livre",
        keywords: ["arLivre", "caminhada", "longevidade", "respiracao", "natureza"]
      },
      {
        id: "sau-11",
        url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop",
        title: "Consultório Odontológico Impecável",
        keywords: ["consultorio", "dentista", "higiene", "saudebucal"]
      },
      {
        id: "sau-12",
        url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1200&auto=format&fit=crop",
        title: "Hospital Moderno e Atendimento de Urgência",
        keywords: ["hospital", "leito", "atendimento", "estrutura", "saude"]
      },
      {
        id: "sau-13",
        url: "https://images.unsplash.com/photo-1583912267670-6575ad373688?q=80&w=1200&auto=format&fit=crop",
        title: "Óleos Essenciais e Aromaterapia",
        keywords: ["aroma", "oleos", "massagem", "spa", "relaxamento"]
      },
      {
        id: "sau-14",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        title: "Acompanhamento Nutricional e Bioimpedância",
        keywords: ["nutricionista", "dieta", "peso", "gordura", "saude"]
      },
      {
        id: "sau-15",
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
        title: "Rotina Matinal Saudável & Água com Limão",
        keywords: ["agua", "detox", "manha", "habitos", "vitalidade"]
      }
    ]
  },

  culinaria: {
    id: "culinaria",
    name: "Culinária, Gastronomia & Receitas",
    description: "Pratos gourmet, saladas frescas, confeitaria fina, cafés especiais e vinhos.",
    images: [
      {
        id: "cul-1",
        url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop",
        title: "Prato Gourmet Nutritivo & Colorido",
        keywords: ["receita", "nutricao", "saude", "prato", "comida", "fit", "gourmet"]
      },
      {
        id: "cul-2",
        url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop",
        title: "Salada Orgânica com Folhas e Castanhas",
        keywords: ["salada", "organico", "dieta", "emagrecer", "verde", "vegetais"]
      },
      {
        id: "cul-3",
        url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop",
        title: "Bowl de Frutas Frescas e Café da Manhã",
        keywords: ["cafe", "frutas", "suco", "energia", "cafeDaManha", "bowl"]
      },
      {
        id: "cul-4",
        url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop",
        title: "Chef de Cozinha Finalizando Prato",
        keywords: ["cozinha", "chef", "culinaria", "gastronomia", "preparo", "restaurante"]
      },
      {
        id: "cul-5",
        url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1200&auto=format&fit=crop",
        title: "Massa Italiana Artesanal com Molho de Tomate",
        keywords: ["massa", "pasta", "italiana", "molho", "jantar", "macarrao"]
      },
      {
        id: "cul-6",
        url: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?q=80&w=1200&auto=format&fit=crop",
        title: "Bolo de Chocolate & Confeitaria Fina",
        keywords: ["bolo", "confeitaria", "doce", "chocolate", "sobremesa", "festa"]
      },
      {
        id: "cul-7",
        url: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1200&auto=format&fit=crop",
        title: "Sanduíche Gourmet Artesanal com Ovos",
        keywords: ["lanche", "hamburguer", "artesanal", "pao", "queijo", "brunch"]
      },
      {
        id: "cul-8",
        url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
        title: "Churrasco Nobre e Carnes Grelhadas",
        keywords: ["carne", "churrasco", "grelhado", "bbq", "proteina", "bife"]
      },
      {
        id: "cul-9",
        url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200&auto=format&fit=crop",
        title: "Taça de Vinho Tinto & Sommelier",
        keywords: ["vinho", "tinto", "sommelier", "degustacao", "jantar", "adega"]
      },
      {
        id: "cul-10",
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
        title: "Café Espresso Cremoso & Latte Art",
        keywords: ["cafe", "barista", "latte", "espresso", "graos", "cafeteria"]
      },
      {
        id: "cul-11",
        url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
        title: "Pão de Fermentação Natural Rústico",
        keywords: ["pao", "sourdough", "fermentacao", "padaria", "trigo"]
      },
      {
        id: "cul-12",
        url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
        title: "Sushi e Gastronomia Japonesa Tradicional",
        keywords: ["sushi", "japonesa", "salmao", "oriental", "peixe"]
      },
      {
        id: "cul-13",
        url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
        title: "Sucos Naturais Detox & Frutas Tropicais",
        keywords: ["detox", "suco", "laranja", "verde", "frutas", "vitaminas"]
      },
      {
        id: "cul-14",
        url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1200&auto=format&fit=crop",
        title: "Mesa de Brunch com Waffles e Frutas",
        keywords: ["waffle", "brunch", "mel", "morango", "sobremesa"]
      },
      {
        id: "cul-15",
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop",
        title: "Pizza Artesanal Italiana no Forno a Lenha",
        keywords: ["pizza", "queijo", "manjericao", "italiana", "artesanal"]
      }
    ]
  },

  fitness: {
    id: "fitness",
    name: "Fitness, Treino & Esportes",
    description: "Musculação, crossfit, maratona, ioga, lutas e alta performance física.",
    images: [
      {
        id: "fit-1",
        url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
        title: "Halteres de Academia & Treino de Força",
        keywords: ["academia", "halter", "musculacao", "forca", "treino", "peso"]
      },
      {
        id: "fit-2",
        url: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1200&auto=format&fit=crop",
        title: "Atleta Correndo ao Ar Livre no Nascer do Sol",
        keywords: ["corrida", "maratona", "cardio", "atleta", "resistencia", "rua"]
      },
      {
        id: "fit-3",
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
        title: "Prática de Yoga & Flexibilidade",
        keywords: ["yoga", "postura", "alongamento", "flexibilidade", "mente", "corpo"]
      },
      {
        id: "fit-4",
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
        title: "Crossfit & Corda Naval de Alta Intensidade",
        keywords: ["crossfit", "corda", "hiit", "condicionamento", "resistencia"]
      },
      {
        id: "fit-5",
        url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
        title: "Foco Total antes do Levantamento de Peso",
        keywords: ["atleta", "foco", "disciplina", "campeao", "barra"]
      },
      {
        id: "fit-6",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
        title: "Personal Trainer Instruindo Aluno",
        keywords: ["personal", "consultoria", "treinador", "aluno", "evolucao"]
      },
      {
        id: "fit-7",
        url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
        title: "Equipe de Treino Funcional",
        keywords: ["funcional", "grupo", "treino", "motivacao", "suor"]
      },
      {
        id: "fit-8",
        url: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=1200&auto=format&fit=crop",
        title: "Boxe & Treino de Luta com Luvas",
        keywords: ["boxe", "luta", "artesmarciais", "soco", "muaythai"]
      },
      {
        id: "fit-9",
        url: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1200&auto=format&fit=crop",
        title: "Bicicleta e Ciclismo de Estrada",
        keywords: ["ciclismo", "bike", "bicicleta", "pedal", "estrada"]
      },
      {
        id: "fit-10",
        url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop",
        title: "Pausa para Hidratação com Garrafa d'Água",
        keywords: ["agua", "hidratacao", "descanso", "saude", "suplemento"]
      }
    ]
  },

  mindset: {
    id: "mindset",
    name: "Mindset, Psicologia & Hábitos",
    description: "Superação, inteligência emocional, foco, disciplina, estoicismo e autoconhecimento.",
    images: [
      {
        id: "min-1",
        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
        title: "Meditação e Serenidade no Topo da Montanha",
        keywords: ["mindset", "meditacao", "paz", "foco", "mente", "espiritual"]
      },
      {
        id: "min-2",
        url: "https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?q=80&w=1200&auto=format&fit=crop",
        title: "Amanhecer no Lago Espelhado",
        keywords: ["amanhecer", "silencio", "calma", "sol", "horizonte", "esperanca"]
      },
      {
        id: "min-3",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
        title: "Conquista do Pico da Montanha",
        keywords: ["sucesso", "superacao", "meta", "pico", "topo", "vitoria"]
      },
      {
        id: "min-4",
        url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop",
        title: "Diário de Gratidão, Livro e Café",
        keywords: ["escrita", "diario", "gratidao", "habitos", "reflexao", "cafe"]
      },
      {
        id: "min-5",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
        title: "Oceano Profundo e Mente Aberta",
        keywords: ["mar", "oceano", "profundidade", "emocao", "psicologia"]
      },
      {
        id: "min-6",
        url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
        title: "Céu Estrelado & Reflexão Filosófica",
        keywords: ["universo", "astro", "proposito", "existencia", "filosofia"]
      },
      {
        id: "min-7",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop",
        title: "Caminho na Estrada Iluminada ao Pôr do Sol",
        keywords: ["caminho", "jornada", "futuro", "destino", "escolha"]
      },
      {
        id: "min-8",
        url: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1200&auto=format&fit=crop",
        title: "Luz Criativa e Despertar da Mente",
        keywords: ["consciencia", "despertar", "luz", "iluminacao", "transformacao"]
      },
      {
        id: "min-9",
        url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop",
        title: "Raios de Sol Filtrados pela Floresta",
        keywords: ["paz", "clareza", "natureza", "silencio", "energia"]
      },
      {
        id: "min-10",
        url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200&auto=format&fit=crop",
        title: "Campos Verdes de Simplicidade e Calma",
        keywords: ["simplicidade", "minimalismo", "paz", "alegria", "vida"]
      },
      {
        id: "min-11",
        url: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1200&auto=format&fit=crop",
        title: "Gotas de Chuva e Resiliência Emocional",
        keywords: ["resiliencia", "forca", "superacao", "dor", "cura"]
      },
      {
        id: "min-12",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
        title: "Canyon Grandioso & Autoconhecimento",
        keywords: ["autoconhecimento", "profundidade", "perspectiva", "psicologia"]
      },
      {
        id: "min-13",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
        title: "Sensação de Liberdade na Imensidão dos Alpes",
        keywords: ["liberdade", "coragem", "semMedo", "autonomia", "corpo"]
      },
      {
        id: "min-14",
        url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop",
        title: "Homem Pensativo Tomando Decisões Críticas",
        keywords: ["pensamento", "decisao", "clareza", "visao", "homem"]
      },
      {
        id: "min-15",
        url: "https://images.unsplash.com/photo-1507208773393-424a1c5d57d3?q=80&w=1200&auto=format&fit=crop",
        title: "Mulher Confiante e Empoderada",
        keywords: ["autoestima", "mulher", "confianca", "amorproprio", "poder"]
      }
    ]
  },

  espiritualidade: {
    id: "espiritualidade",
    name: "Espiritualidade, Fé & Bíblia",
    description: "Textos sagrados, oração, templos, velas, fé inabalável e propósito de vida.",
    images: [
      {
        id: "esp-1",
        url: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1200&auto=format&fit=crop",
        title: "Bíblia Sagrada Aberta com Luz Dourada",
        keywords: ["biblia", "deus", "fe", "oracao", "evangelho", "sagrado", "versiculo"]
      },
      {
        id: "esp-2",
        url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1200&auto=format&fit=crop",
        title: "Mãos em Oração e Gratidão Profunda",
        keywords: ["oracao", "maos", "clamor", "gratidao", "fe", "espiritual"]
      },
      {
        id: "esp-3",
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        title: "Vitral Iluminado de Catedral Histórica",
        keywords: ["catedral", "igreja", "vitral", "sagrado", "luz", "templo"]
      },
      {
        id: "esp-4",
        url: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=1200&auto=format&fit=crop",
        title: "Nuvens Celestiais e Raios Divinos",
        keywords: ["ceu", "anjo", "divino", "graca", "esperanca", "gloria"]
      },
      {
        id: "esp-5",
        url: "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=1200&auto=format&fit=crop",
        title: "Vela Acesa na Penumbra de Oração",
        keywords: ["vela", "luz", "chama", "vigilia", "paz", "silencio"]
      },
      {
        id: "esp-6",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop",
        title: "Cruz no Horizonte ao Pôr do Sol",
        keywords: ["cruz", "jesus", "salvacao", "cristo", "redencao"]
      },
      {
        id: "esp-7",
        url: "https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?q=80&w=1200&auto=format&fit=crop",
        title: "Quietude Matinal para Devocional",
        keywords: ["devocional", "estudobiblico", "manha", "oracao", "palavra"]
      },
      {
        id: "esp-8",
        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop",
        title: "Harmonia e Equilíbrio Interior",
        keywords: ["zen", "equilibrio", "paz", "energia", "sagrado"]
      },
      {
        id: "esp-9",
        url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop",
        title: "Luz Divina Iluminando o Caminho",
        keywords: ["luz", "verdade", "vida", "espirito", "bencao"]
      },
      {
        id: "esp-10",
        url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop",
        title: "Escrituras Antigas e Sabedoria Eterna",
        keywords: ["antigo", "sabedoria", "manuscrito", "historia", "fe"]
      }
    ]
  },

  arte: {
    id: "arte",
    name: "Arte, Design & Arquitetura",
    description: "Pinturas em tela, galerias, design de interiores, esculturas e moda.",
    images: [
      {
        id: "art-1",
        url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
        title: "Pintura Abstrata com Tintas Vibrantes",
        keywords: ["arte", "pintura", "criatividade", "cor", "artista", "quadro"]
      },
      {
        id: "art-2",
        url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
        title: "Galeria de Arte Contemporânea",
        keywords: ["galeria", "exposicao", "museu", "escultura", "quadros"]
      },
      {
        id: "art-3",
        url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop",
        title: "Estúdio de Design & Paleta de Cores Pantone",
        keywords: ["design", "paleta", "cores", "estudio", "pantone", "criativo"]
      },
      {
        id: "art-4",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
        title: "Arquitetura Minimalista & Luz Natural",
        keywords: ["arquitetura", "predio", "interiores", "casa", "design", "luxo"]
      },
      {
        id: "art-5",
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
        title: "Moda de Alta Costura & Desfile",
        keywords: ["moda", "fashion", "estilo", "roupa", "modelo", "desfile"]
      },
      {
        id: "art-6",
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
        title: "Câmera Fotográfica Vintage 35mm",
        keywords: ["fotografia", "camera", "foto", "lente", "retrato", "filme"]
      },
      {
        id: "art-7",
        url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop",
        title: "Explosão de Cores Acrílicas e Texturas",
        keywords: ["cores", "tinta", "acrilica", "textura", "abstrato"]
      },
      {
        id: "art-8",
        url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=1200&auto=format&fit=crop",
        title: "Cerâmica Artesanal Modelada à Mão",
        keywords: ["ceramica", "artesanato", "barro", "vaso", "feitoamao"]
      },
      {
        id: "art-9",
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop",
        title: "Design de Interiores Escandinavo Aconchegante",
        keywords: ["interiores", "sala", "moveis", "decoracao", "nordico"]
      },
      {
        id: "art-10",
        url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
        title: "Fotografia de Retrato Artístico em P&B",
        keywords: ["pb", "retrato", "pretoebranco", "arte", "olhar"]
      },
      {
        id: "art-11",
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
        title: "Ilustração Clássica e Detalhes Barrocos",
        keywords: ["classico", "barroco", "detalhe", "moldura", "ouro"]
      },
      {
        id: "art-12",
        url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200&auto=format&fit=crop",
        title: "Mesa de Aquarela com Pincéis Finos",
        keywords: ["aquarela", "pincel", "papel", "pintura", "arte"]
      }
    ]
  },

  musica: {
    id: "musica",
    name: "Música & Audiovisual",
    description: "Instrumentos, estúdios de gravação, shows, cinema e produção sonora.",
    images: [
      {
        id: "mus-1",
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
        title: "Violão Acústico & Partitura Clássica",
        keywords: ["musica", "violao", "som", "cancao", "partitura", "ritmo"]
      },
      {
        id: "mus-2",
        url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
        title: "Palco de Festival com Luzes Laser",
        keywords: ["show", "palco", "festa", "evento", "espetaculo", "luzes"]
      },
      {
        id: "mus-3",
        url: "https://images.unsplash.com/photo-1520523839898-507124053864?q=80&w=1200&auto=format&fit=crop",
        title: "Teclas Pretas e Brancas de Piano de Cauda",
        keywords: ["piano", "teclado", "classica", "harmonia", "concerto"]
      },
      {
        id: "mus-4",
        url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
        title: "Mesa de Mixagem de Áudio Profissional",
        keywords: ["audio", "estudio", "mixagem", "produtor", "som", "gravacao"]
      },
      {
        id: "mus-5",
        url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format&fit=crop",
        title: "Microfone Vintage de Estúdio e Canto",
        keywords: ["microfone", "canto", "voz", "podcast", "radio", "estudio"]
      },
      {
        id: "mus-6",
        url: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=1200&auto=format&fit=crop",
        title: "Bateria Acústica com Pratos de Bronze",
        keywords: ["bateria", "baquetas", "rock", "ritmo", "percussao"]
      },
      {
        id: "mus-7",
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop",
        title: "Fones de Ouvido Studio e Equalizador",
        keywords: ["fone", "ouvir", "musica", "equalizador", "som"]
      },
      {
        id: "mus-8",
        url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
        title: "Claquete de Cinema e Rolo de Filme",
        keywords: ["cinema", "filme", "claquete", "direcao", "video", "roteiro"]
      },
      {
        id: "mus-9",
        url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1200&auto=format&fit=crop",
        title: "Saxofone Dourado em Clube de Jazz",
        keywords: ["jazz", "saxofone", "blues", "instrumento", "noite"]
      },
      {
        id: "mus-10",
        url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
        title: "DJ Controlando Pickups na Balada",
        keywords: ["dj", "eletronica", "festa", "balada", "ritmo"]
      }
    ]
  },

  infantil: {
    id: "infantil",
    name: "Infantil & Educação Lúdica",
    description: "Livros infantis, brinquedos montessori, desenhos coloridos, escola e imaginação.",
    images: [
      {
        id: "inf-1",
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop",
        title: "Livro Infantil Aberto com Ilustrações Encantadoras",
        keywords: ["infantil", "crianca", "livro", "historia", "fabula", "escola"]
      },
      {
        id: "inf-2",
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
        title: "Lápis de Cor e Tintas Criativas",
        keywords: ["lapis", "desenho", "cor", "brincar", "escola", "arte"]
      },
      {
        id: "inf-3",
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
        title: "Sala de Aula Colorida e Estimulante",
        keywords: ["sala", "professor", "pedagogia", "aprender", "brincadeira"]
      },
      {
        id: "inf-4",
        url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop",
        title: "Crianças Lendo Juntas com Sorrisos",
        keywords: ["amigos", "leitura", "biblioteca", "estudo", "educacao"]
      },
      {
        id: "inf-5",
        url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1200&auto=format&fit=crop",
        title: "Brincadeiras Infantis no Gramado do Parque",
        keywords: ["parque", "natureza", "brincadeira", "correr", "alegria"]
      },
      {
        id: "inf-6",
        url: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?q=80&w=1200&auto=format&fit=crop",
        title: "Brinquedos Pedagógicos de Madeira",
        keywords: ["brinquedo", "madeira", "montessori", "bebe", "desenvolvimento"]
      },
      {
        id: "inf-7",
        url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop",
        title: "Blocos de Montar e Alfabeto Lúdico",
        keywords: ["blocos", "alfabeto", "abc", "montar", "lego"]
      },
      {
        id: "inf-8",
        url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&auto=format&fit=crop",
        title: "Bichinhos de Pelúcia no Quarto de Bebê",
        keywords: ["pelucia", "urso", "bebe", "quarto", "maternidade"]
      },
      {
        id: "inf-9",
        url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
        title: "Mochila Escolar e Material Pedagógico",
        keywords: ["mochila", "escola", "aulas", "estojo", "caderno"]
      },
      {
        id: "inf-10",
        url: "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?q=80&w=1200&auto=format&fit=crop",
        title: "Balões Coloridos Flutuando no Céu",
        keywords: ["baloes", "festa", "alegria", "aniversario", "infancia"]
      }
    ]
  },

  ficcao: {
    id: "ficcao",
    name: "Ficção, Fantasia & Mistério",
    description: "Castelos medievais, galáxias sci-fi, florestas encantadas e magia.",
    images: [
      {
        id: "fic-1",
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        title: "Castelo Místico nas Nuvens",
        keywords: ["castelo", "reino", "fantasia", "rei", "rainha", "princesa", "magia"]
      },
      {
        id: "fic-2",
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
        title: "Espada Lendária Forjada na Névoa",
        keywords: ["guerra", "batalha", "espada", "cavaleiro", "heroi", "lenda"]
      },
      {
        id: "fic-3",
        url: "https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=1200&auto=format&fit=crop",
        title: "Floresta Encantada dos Elfos",
        keywords: ["floresta", "misterio", "nevoa", "magia", "elfo", "sombra", "conto"]
      },
      {
        id: "fic-4",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
        title: "Galáxia Sci-Fi & Exploração Espacial",
        keywords: ["ficcao", "espaco", "alien", "futuro", "planeta", "nave"]
      },
      {
        id: "fic-5",
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
        title: "Farol Solitário no Mar Tempestuoso",
        keywords: ["mar", "oceano", "tempestade", "misterio", "suspense", "navegante"]
      },
      {
        id: "fic-6",
        url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
        title: "Biblioteca Antiga de Grimórios e Feitiços",
        keywords: ["biblioteca", "livro", "misterio", "segredo", "historia", "sabedoria"]
      },
      {
        id: "fic-7",
        url: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
        title: "Trilha na Floresta Obscura e Suspense",
        keywords: ["caminho", "suspense", "terror", "sombra", "fuga", "perigo"]
      },
      {
        id: "fic-8",
        url: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=1200&auto=format&fit=crop",
        title: "Confronto de Fogo e Gelo Elemental",
        keywords: ["elemento", "fogo", "gelo", "contraste", "magia", "batalha"]
      },
      {
        id: "fic-9",
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
        title: "Ruínas de Império Esquecido",
        keywords: ["ruinas", "arqueologia", "tesouro", "templo", "historia"]
      },
      {
        id: "fic-10",
        url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop",
        title: "Diário com Selo de Cera e Segredos",
        keywords: ["diario", "segredo", "carta", "passado", "romance"]
      }
    ]
  },

  natureza: {
    id: "natureza",
    name: "Natureza, Viagem & Aventura",
    description: "Montanhas imponentes, praias paradisíacas, cachoeiras, trilhas e viagens pelo mundo.",
    images: [
      {
        id: "nat-1",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
        title: "Aventureiro Observando os Vales Gigantes",
        keywords: ["viajante", "explorador", "liberdade", "mundo", "jornada", "aventura"]
      },
      {
        id: "nat-2",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
        title: "Praia Paradisíaca com Mar Azul Turquesa",
        keywords: ["praia", "mar", "verao", "turquesa", "ferias", "sol"]
      },
      {
        id: "nat-3",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
        title: "Picos Nevados e Montanhas Épicas",
        keywords: ["montanha", "pico", "neve", "escalada", "altitude", "alpes"]
      },
      {
        id: "nat-4",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
        title: "Cachoeira Grandiosa no Vale Verde",
        keywords: ["cachoeira", "rio", "agua", "natureza", "floresta", "paraiso"]
      },
      {
        id: "nat-5",
        url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop",
        title: "Asa de Avião Acima das Nuvens",
        keywords: ["aviao", "voo", "viagem", "turismo", "passaporte", "mundo"]
      },
      {
        id: "nat-6",
        url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop",
        title: "Barco Navegando em Lago Alpino Suíço",
        keywords: ["barco", "lago", "suica", "alpes", "turismo", "paz"]
      },
      {
        id: "nat-7",
        url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
        title: "Acampamento Sob o Céu Estrelado",
        keywords: ["camping", "barraca", "fogueira", "estrelas", "noite"]
      },
      {
        id: "nat-8",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop",
        title: "Floresta Tropical com Névoa Matinal",
        keywords: ["selva", "amazonia", "arvores", "verde", "oxigenio"]
      },
      {
        id: "nat-9",
        url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop",
        title: "Palmeiras Tropicais ao Pôr do Sol",
        keywords: ["palmeiras", "tropical", "sunset", "caribe", "ilha"]
      },
      {
        id: "nat-10",
        url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200&auto=format&fit=crop",
        title: "Colinas Douradas ao Fim da Tarde",
        keywords: ["colina", "campo", "sol", "horizonte", "tranquilidade"]
      }
    ]
  },

  direito_academico: {
    id: "direito_academico",
    name: "Direito, Educação & Acadêmico",
    description: "Balança da justiça, becas de formatura, universidades e bibliotecas clássicas.",
    images: [
      {
        id: "dir-1",
        url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop",
        title: "Balança da Justiça Dourada e Martelo de Juiz",
        keywords: ["direito", "justica", "advogado", "juiz", "lei", "oab", "tribunal"]
      },
      {
        id: "dir-2",
        url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
        title: "Biblioteca Universitária Clássica com Livros Raros",
        keywords: ["biblioteca", "livros", "estudo", "universidade", "pesquisa", "concurso"]
      },
      {
        id: "dir-3",
        url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
        title: "Estudantes Universitários em Grupo de Pesquisa",
        keywords: ["estudantes", "faculdade", "pesquisa", "grupo", "academico"]
      },
      {
        id: "dir-4",
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
        title: "Capelo de Formatura e Diploma Acadêmico",
        keywords: ["formatura", "diploma", "graduacao", "posgraduacao", "mestrado", "doutorado"]
      },
      {
        id: "dir-5",
        url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
        title: "Caneta Tinteiro Escrevendo Tese Acadêmica",
        keywords: ["tese", "monografia", "artigo", "escrita", "autor"]
      },
      {
        id: "dir-6",
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
        title: "Foco Total em Concurso Público e Provas",
        keywords: ["concurso", "prova", "estudo", "aprovacao", "edital"]
      },
      {
        id: "dir-7",
        url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop",
        title: "Campus Universitário Histórico de Tijolos",
        keywords: ["campus", "faculdade", "harvard", "oxford", "historia"]
      },
      {
        id: "dir-8",
        url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop",
        title: "Vade Mecum e Código de Leis Constitucionais",
        keywords: ["constituicao", "leis", "codigo", "juridico", "advocacia"]
      },
      {
        id: "dir-9",
        url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop",
        title: "Pilha de Livros e Sabedoria",
        keywords: ["livros", "leitura", "conhecimento", "cultura", "estudo"]
      },
      {
        id: "dir-10",
        url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop",
        title: "Palestra em Auditório Acadêmico",
        keywords: ["congresso", "seminario", "palestra", "auditorio", "aula"]
      }
    ]
  }
};

/**
 * Smart matching function that finds the BEST cover image from the library
 * based on category, title, description, and keywords.
 */
export function getSmartCoverImage(genre: string = "", title: string = "", description: string = ""): string {
  const fullText = `${genre} ${title} ${description}`.toLowerCase();
  
  // Map genre text to library key
  let catKey = "negocios";
  if (/(ficcao|ficção|literatura|romance|fantasia|aventura|misterio|conto|poesia|dramaturgia|personagens|sci-fi)/i.test(fullText)) {
    catKey = "ficcao";
  } else if (/(tecnologia|programação|programacao|software|ia|ai|digital|cyber|codigo|código|algoritmo|dev|web|app|dados)/i.test(fullText)) {
    catKey = "tecnologia";
  } else if (/(finan|invest|dinheiro|bolsa|cripto|bitcoin|ações|acoes|rico|patrimonio|lucro|faturamento)/i.test(fullText)) {
    catKey = "financas";
  } else if (/(marketing|tráfego|trafego|vendas|copy|redes sociais|instagram|anuncio|publicidade|branding)/i.test(fullText)) {
    catKey = "marketing";
  } else if (/(nutri|receita|cozinha|gastronomia|culinária|culinaria|prato|gourmet|chef|alimento|comida)/i.test(fullText)) {
    catKey = "culinaria";
  } else if (/(treino|musculação|musculacao|fitness|academia|corrida|atleta|crossfit|hiit|maratona|exercício|exercicio)/i.test(fullText)) {
    catKey = "fitness";
  } else if (/(saúde|saude|medicina|médico|medico|hospital|enfermagem|dente|dentista|fisioterapia|pele|skincare)/i.test(fullText)) {
    catKey = "saude";
  } else if (/(espiritual|fé|fe|bíblia|biblia|deus|oração|oracao|evangelho|jesus|igreja|cristão|sagrado)/i.test(fullText)) {
    catKey = "espiritualidade";
  } else if (/(mindset|medita|paz|alma|psicologia|autoajuda|motiva|habito|estoicismo|superacao|inteligencia emocional)/i.test(fullText)) {
    catKey = "mindset";
  } else if (/(arte|design|fotografia|moda|estilo|criatividade|arquitetura|pintura|decoracao)/i.test(fullText)) {
    catKey = "arte";
  } else if (/(música|musica|violao|violão|piano|audio|som|gravacao|gravação|show|podcast|cinema)/i.test(fullText)) {
    catKey = "musica";
  } else if (/(infantil|criança|crianca|kids|pedagogia|brincar|historinha|fábula|fabula|maternidade)/i.test(fullText)) {
    catKey = "infantil";
  } else if (/(viagem|praia|natureza|aventura|trilha|montanha|turismo|mundo|voo|ferias)/i.test(fullText)) {
    catKey = "natureza";
  } else if (/(direito|advog|advocacia|lei|oab|concurso|faculdade|academico|graduacao|estudo|juiz)/i.test(fullText)) {
    catKey = "direito_academico";
  }

  const category = COVER_IMAGE_LIBRARY[catKey] || COVER_IMAGE_LIBRARY["negocios"];
  const images = category.images;

  // Score each image based on keyword matches
  let bestImage = images[0];
  let highestScore = -1;

  images.forEach((img) => {
    let score = 0;
    img.keywords.forEach((kw) => {
      if (fullText.includes(kw.toLowerCase())) {
        score += 3;
      }
    });

    if (score > highestScore) {
      highestScore = score;
      bestImage = img;
    }
  });

  // If score is 0, use a deterministic hash of (title + genre) to pick one of the images
  if (highestScore <= 0) {
    let hash = 0;
    const str = `${title}_${genre}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % images.length;
    bestImage = images[index];
  }

  return bestImage.url;
}

export function getCategoryName(key: string): string {
  if (key in COVER_IMAGE_LIBRARY) {
    return COVER_IMAGE_LIBRARY[key].name;
  }
  return key;
}

export function getSmartCoverImageList(
  genre: string = "",
  title: string = "",
  description: string = "",
  limit: number = 8
): CoverImageItem[] {
  const fullText = `${genre} ${title} ${description}`.toLowerCase();

  let catKey = "negocios";
  if (/(ficcao|ficção|literatura|romance|fantasia|aventura|misterio|conto|poesia|dramaturgia|personagens)/i.test(fullText)) {
    catKey = "ficcao";
  } else if (/(tecnologia|programação|programacao|software|ia|ai|digital|cyber|codigo|código|algoritmo|dev|web)/i.test(fullText)) {
    catKey = "tecnologia";
  } else if (/(finan|invest|dinheiro|bolsa|cripto|bitcoin|ações|acoes|lucro|renda)/i.test(fullText)) {
    catKey = "financas";
  } else if (/(marketing|tráfego|trafego|vendas|copy|redes sociais|instagram|anuncio|publicidade|branding)/i.test(fullText)) {
    catKey = "marketing";
  } else if (/(nutri|receita|cozinha|gastronomia|culinária|culinaria|prato|gourmet|chef|alimento|comida)/i.test(fullText)) {
    catKey = "culinaria";
  } else if (/(treino|musculação|musculacao|fitness|academia|corrida|atleta|crossfit|hiit|maratona)/i.test(fullText)) {
    catKey = "fitness";
  } else if (/(saúde|saude|medicina|médico|medico|hospital|enfermagem|dente|dentista|pele|skincare)/i.test(fullText)) {
    catKey = "saude";
  } else if (/(espiritual|fé|fe|bíblia|biblia|deus|oração|oracao|evangelho|jesus|igreja|cristão)/i.test(fullText)) {
    catKey = "espiritualidade";
  } else if (/(mindset|medita|paz|alma|psicologia|autoajuda|motiva|habito|estoicismo|superacao)/i.test(fullText)) {
    catKey = "mindset";
  } else if (/(arte|design|fotografia|moda|estilo|criatividade|arquitetura|pintura)/i.test(fullText)) {
    catKey = "arte";
  } else if (/(música|musica|violao|piano|audio|som|gravacao|show|podcast|cinema)/i.test(fullText)) {
    catKey = "musica";
  } else if (/(infantil|criança|crianca|kids|pedagogia|brincar|historinha|fábula|fabula)/i.test(fullText)) {
    catKey = "infantil";
  } else if (/(viagem|praia|natureza|aventura|trilha|montanha|turismo|mundo|ferias)/i.test(fullText)) {
    catKey = "natureza";
  } else if (/(direito|advog|advocacia|lei|oab|concurso|faculdade|academico|graduacao)/i.test(fullText)) {
    catKey = "direito_academico";
  }

  const category = COVER_IMAGE_LIBRARY[catKey] || COVER_IMAGE_LIBRARY["negocios"];
  const ranked = category.images.map((img) => {
    let score = 0;
    img.keywords.forEach((kw) => {
      if (fullText.includes(kw.toLowerCase())) {
        score += 3;
      }
    });
    return {
      id: img.id,
      url: img.url,
      title: img.title,
      category: catKey,
      keywords: img.keywords,
      score,
    };
  });

  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit);
}
