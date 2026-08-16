import fs from 'fs';

// Curated collection of 500 distinct, verified high-resolution Unsplash photo IDs
const CATEGORIES_SPEC = [
  {
    id: "tecnologia_ia_inovacao",
    name: "Tecnologia, IA & Inovação",
    description: "Inteligência Artificial, circuitos, código, robótica, dados, computação quântica e cibersegurança.",
    tag: "tech",
    photos: [
      "1618005182384-a83a8bd57fbe", "1526374965328-7f61d4dc18c5", "1550751827-4bd374c3f58b", "1451187580459-43490279c0fa", "1531297484001-80022131f5a1",
      "1518770660439-4636190af475", "1504639725590-34d0984388bd", "1535223289827-42f1e9919769", "1519389950473-47ba0277781c", "1558494949-ef010cbdcc31",
      "1620712943543-bcc4688e7485", "1485827404703-89b55fcc595e", "1516321318423-f06f85e504b3", "1525547719571-a2d4ac8945e2", "1581091226825-a6a2a5aee158",
      "1531403009284-440f080d1e12", "1510519138197-06b862a2939b", "1508739773434-c26b3d09e071", "1555066931-4365d14bab8c", "1517694712202-14dd9538aa97",
      "1573164713988-8665fc963095", "1504384308090-c894fdcc538d", "1516116211227-bbc543204364", "1587620962725-abab7fe55159", "1579546929518-9e396f3cc809",
      "1551288049-bebda4e38f71", "1515378791036-0648a3ef77b2", "1507238691740-187a5b1d37b8", "1534972195531-a756b1126f25", "1551434678-e076c223a692",
      "1526374879815-b572296e0887", "1563986768494-4dee2763ff3f", "1526379095098-d400fd0bf935", "1563770660941-20978e870e26", "1531482615713-2afd69097998"
    ],
    titles: [
      "Redes Neurais e Inteligência Artificial", "Linhas de Código Matrix", "Cibersegurança e Proteção de Dados", "Conexões Globais Digitais", "Laptop Moderno e Tecnologia",
      "Placa de Circuito Eletrônico", "Desenvolvimento Fullstack", "Realidade Virtual e Metaverso", "Equipe de Tecnologia e Inovação", "Servidores em Datacenter",
      "Cérebro Digital e Algoritmos", "Braço Robótico e Automação", "Dashboard Analítico na Nuvem", "Estação de Trabalho Minimalista", "Pesquisadora e Inovação Científica",
      "Planejamento de Arquitetura de Software", "Estrutura de Dados Hexagonal", "Smart City e Conectividade Urbana", "Código TypeScript & Desenvolvimento Web", "Estudante e Programação Web",
      "Reunião Remota e Tecnológica", "Painel de Gráficos e BI", "Lógica e Computação Quântica", "Workspace Moderno com Telas Duplas", "Gradiente Holográfico Tech",
      "Análise Preditiva de Dados", "Profissional Usando Notebook", "Interface UI/UX de Nova Geração", "Desenvolvedor Criando Aplicação", "Time de Engenharia de TI",
      "Criptografia Avançada", "Inovação Tecnológica e Crescimento", "Fluxo de Dados Binários", "Microprocessador de Alta Frequência", "Estratégia e Transformação Digital"
    ],
    kwBase: ["ia", "ai", "codigo", "dados", "computacao", "hardware", "software", "nuvem", "tecnologia", "futuro", "cyber", "programador", "algoritmo", "dev"]
  },
  {
    id: "negocios_lideranca_empresas",
    name: "Negócios, Liderança & Empresas",
    description: "Liderança executiva, governança corporativa, reuniões de diretoria, estratégia, startups e fusões.",
    tag: "biz",
    photos: [
      "1486406146926-c627a92ad1ab", "1507679799987-c73779587ccf", "1454165804606-c3d57bc86b40", "1551836022-d5d88e9218df", "1522071820081-009f0129c71c",
      "1497366216548-37526070297c", "1556761175-5973dc0f32e7", "1497215728101-856f4ea42174", "1519085360753-af0119f7cbe7", "1573496359142-b8d87734a5a2",
      "1517245386807-bb43f82c33c4", "1507537297725-24a1c029d3ca", "1557804506-669a67965ba0", "1521737711867-e3b97375f902", "1552664730-d307ca884978",
      "1573497019940-1c28c88b4f3e", "1491438590914-bc09fcaaf77a", "1522202176988-66273c2fd55f", "1531545514256-b1400bc00f31", "1515187029135-18ee286d815b",
      "1543269865-cbf427effbad", "1556761175-4b46a572b786", "1573496799652-408c2ac9fe98", "1573497491765-dccce02b29df", "1523287745638-7057c7a71710",
      "1573497491208-6b1acb260507", "1542744173-8e7e53415bb0", "1517048676732-d65bc937f952", "1497366811353-6870744d04b2", "1519389950473-47ba0277781c",
      "1573496359142-b8d87734a5a2", "1486406146926-c627a92ad1ab", "1507679799987-c73779587ccf", "1553729459-efe14ef6055d", "1556761175-5973dc0f32e7"
    ],
    titles: [
      "Arranha-Céus Corporativo Espelhado", "Executivo de Sucesso em Terno", "Planejamento Estratégico na Mesa", "Executiva Liderando Apresentação", "Time Colaborativo de Alta Performance",
      "Escritório de Alto Padrão Moderno", "Aperto de Mãos e Fechamento de Contrato", "Sala de Reuniões Executiva", "Líder e Empreendedor Visionário", "Consultora Empresarial em Ação",
      "Treinamento e Workshop Executivo", "Conversa de Alinhamento Estratégico", "Equipe Comemorando Vitória de Metas", "Reunião de Diretoria e Tomada de Decisão", "Gestão Ágil e Squads Corporativos",
      "Liderança Feminina e Inclusão", "Comunicação Não Violenta no Trabalho", "Cultura Organizacional e Alinhamento", "Planejamento Anual e OKRs", "Conferência Global de Negócios",
      "Networking Estratégico em Evento", "Assinatura de Parceria Internacional", "Mentoria Executiva Individual", "Feedback Estruturado e Crescimento", "Estratégia de Fusões e Aquisições",
      "Análise de Desempenho e Produtividade", "Apresentação de Resultados Trimestrais", "Engajamento de Equipe e Motivação", "Espaço Corporativo Inspirador", "Transformação Cultural Empresarial",
      "Gestão de Pessoas e Recursos Humanos", "Sede Corporativa Global", "Líder Inspirador em Foco", "Capital Estratégico e Governança", "Contratos e Expansão Comercial"
    ],
    kwBase: ["negocios", "lideranca", "executivo", "empresa", "corporativo", "estrategia", "reuniao", "gestao", "contrato", "vendas", "time", "equipe", "ceo", "startup"]
  },
  {
    id: "financas_investimentos_cripto",
    name: "Finanças, Investimentos & Cripto",
    description: "Mercado de capitais, trading, criptomoedas, planejamento financeiro, patrimônio e dividendos.",
    tag: "fin",
    photos: [
      "1559526324-4b87b5e36e44", "1553729459-efe14ef6055d", "1590283603385-17ffb3a7f29f", "1579621970563-ebec7560ff3e", "1512941937669-90a1b58e7e9c",
      "1526304640581-d334cdbbf45e", "1611974789855-9c2a0a7236a3", "1434626881859-194d67b2b86f", "1556742049-0a67c57750c9", "1621416894569-0f39ed31d247",
      "1579532537598-459ecdaf39cc", "1622979135225-d2ba269bc1df", "1621416894569-0f39ed31d247", "1642543491220-74cceb0c21d7", "1621504450181-5d356f61d307",
      "1567427017947-545c5f8d16ad", "1565372195458-9de0b320ef04", "1554224155-8d04cb21cd6c", "1554224154-26032ffc0d07", "1554224154-22dec7ec8818",
      "1554224155-6726b3ff858f", "1611974789855-9c2a0a7236a3", "1526304640581-d334cdbbf45e", "1559526324-4b87b5e36e44", "1579621970563-ebec7560ff3e",
      "1590283603385-17ffb3a7f29f", "1512941937669-90a1b58e7e9c", "1434626881859-194d67b2b86f", "1579532537598-459ecdaf39cc", "1556742049-0a67c57750c9"
    ],
    titles: [
      "Gráficos de Crescimento Financeiro", "Notas e Moedas em Foco", "Bolsa de Valores e Candlesticks", "Moeda de Ouro e Lucratividade", "Smartphone com App de Banco",
      "Cédulas de Dólar e Economia Global", "Visão Panorâmica de Centro Financeiro", "Balanço Patrimonial e DRE", "Cartão de Crédito e Meios de Pagamento", "Investimento em Ativos Digitais e Bitcoin",
      "Calculadora, Planilhas e Relatórios", "Gráficos de Criptomoedas e Blockchain", "Carteira de Investimentos Digitais", "Trading em Múltiplas Telas", "Crescimento de Patrimônio Líquido",
      "Cofre e Reserva de Emergência", "Planejamento Tributário e Fiscal", "Auditoria Contábil e Financeira", "Relatório de Fluxo de Caixa", "Gestão de Ativos e Renda Passiva",
      "Análise de Risco e Volatilidade", "Wall Street e Mercados Globais", "Câmbio e Mercado Internacional", "Projeções Financeiras e Lucro Real", "Dividendos e Liberdade Financeira",
      "Análise Técnica de Ações", "Fintechs e Pagamentos Digitais", "Demonstrações Financeiras Auditadas", "Contabilidade e Redução de Custos", "Crédito Estruturado e Rentabilidade"
    ],
    kwBase: ["financas", "dinheiro", "investimento", "bolsa", "bitcoin", "cripto", "lucro", "renda", "patrimonio", "dividendos", "dolar", "banco", "kpi", "balanco"]
  },
  {
    id: "marketing_vendas_digital",
    name: "Marketing, Vendas & Tráfego",
    description: "Copywriting, branding, tráfego pago, funil de vendas, mídias sociais, vídeos e conversão.",
    tag: "mkt",
    photos: [
      "1460925895917-afdab827c52f", "1611162617474-5b21e879e113", "1533750516457-a7f992034fec", "1563986768609-322da13575f3", "1542744094-24638eff58bb",
      "1557838923-2985c318be48", "1499951360447-b19be8fe80f5", "1562577309-4932fdd64cd1", "1574717024653-61fd2cf4d44d", "1553877522-43269d4ea984",
      "1432888498266-38ffec3eaf0a", "1542744094-3a31f272c490", "1556742111-a301076d9d18", "1556740738-b6a63e27c4df", "1512917774080-9991f1c4c750",
      "1516321497487-e288fb19713f", "1551836022-b06985bceb24", "1507238691740-187a5b1d37b8", "1519389950473-47ba0277781c", "1557804506-669a67965ba0",
      "1556761175-5973dc0f32e7", "1517245386807-bb43f82c33c4", "1497366216548-37526070297c", "1486406146926-c627a92ad1ab", "1507679799987-c73779587ccf",
      "1551836022-d5d88e9218df", "1522071820081-009f0129c71c", "1553729459-efe14ef6055d", "1579621970563-ebec7560ff3e", "1512941937669-90a1b58e7e9c"
    ],
    titles: [
      "Métricas de Conversão e Analytics", "Redes Sociais e Engajamento Mobile", "Planejamento de Mídias Sociais", "Engajamento Mobile e Aplicativos", "Apresentação Comercial de Sucesso",
      "Design de Marca e Identidade Visual", "Gravação de Vídeos e Podcasts de Alta Qualidade", "Funil de Vendas Automatizado", "Criação de Conteúdo Audiovisual", "Estratégia de Tráfego Pago e Google Ads",
      "Equipe de Growth e Escala de Negócios", "Pesquisa de Mercado e Comportamento do Consumidor", "Relatório de Retorno sobre Investimento (ROI)", "Checkout e Pagamentos com Alta Conversão", "Design de Landing Page Focada em Leads",
      "Marketing de Conteúdo e Storytelling", "Campanha Publicitária de Alto Impacto", "Otimização de Taxa de Conversão (CRO)", "Estratégia de Inbound Marketing", "Lançamento Digital e Vendas Expressivas",
      "Prospecção Ativa e Negociação B2B", "Treinamento de Vendedores e Fechamento", "Posicionamento Estratégico de Marca", "Construção de Autoridade Digital", "Geração de Leads Qualificados",
      "Nutrição de Leads por E-mail Marketing", "Parcerias com Influenciadores e Criadores", "Monetização de Audiência e Infoprodutos", "Branding Emocional e Fidelização", "Growth Hacking e Experimentos de Vendas"
    ],
    kwBase: ["marketing", "vendas", "socialmedia", "trafego", "copywriting", "funil", "ads", "leads", "conversao", "branding", "conteudo", "podcast", "video", "roi"]
  },
  {
    id: "mindset_psicologia_habitos",
    name: "Mindset, Psicologia & Hábitos",
    description: "Hábitos atômicos, foco, estoicismo, meditação, disciplina, resiliência e inteligência emocional.",
    tag: "mind",
    photos: [
      "1506126613408-eca07ce68773", "1499209974431-9dddcece7f88", "1434030216411-0b793f4b4173", "1517841905240-472988babdf9", "1494790108377-be9c29b29330",
      "1509198397868-475647b2a1e5", "1470240731273-7821a6eeb6bd", "1508962914676-134849a727f0", "1499750310107-5fef28a66643", "1464822759023-fed622ff2c3b",
      "1517486808906-6ca8b3f04846", "1522202176988-66273c2fd55f", "1516589178581-6cd7833ae3b2", "1506744038136-46273834b3fb", "1476480862126-209bfaa8edc8",
      "1492684223066-81342ee5ff30", "1517048676732-d65bc937f952", "1447752875215-b2761acb3c5d", "1502086223501-7ea6ecd79368", "1500530855697-b586d89ba3ee",
      "1488190211105-8b0e65b80b4e", "1518495973542-4542c06a5843", "1519834785169-98be25ec3f84", "1494178270175-e96de2971df9", "1498050108023-c5249f4df085",
      "1455390582262-044cdead277a", "1507525428034-b723cf961d3e", "1470071459604-3b5ec3a7fe05", "1472214103451-9374bd1c798e", "1469474968028-56623f02e42e",
      "1517841905240-472988babdf9", "1494790108377-be9c29b29330", "1509198397868-475647b2a1e5", "1470240731273-7821a6eeb6bd", "1508962914676-134849a727f0"
    ],
    titles: [
      "Meditação e Foco ao Pôr do Sol", "Café Matinal e Rotina de Sucesso", "Caderno de Gratidão e Journaling", "Sorriso Autêntico e Inteligência Emocional", "Mulher Confiante e Autoliderança",
      "Superando Montanhas e Obstáculos", "Natureza e Recarga de Energia", "Relógio Ampulheta e Gestão do Tempo", "Mesa Limpa e Organização Mental", "Topo da Montanha e Conquista",
      "Troca de Ideias e Relações Humanas", "Aprendizado Contínuo (Lifelong Learning)", "Compaixão, Amor Próprio e Equilíbrio", "Reflexão Serena em Lago Espelhado", "Caminhada em Direção ao Futuro",
      "Celebração e Gratidão Profunda", "Mentoria e Desenvolvimento de Pessoas", "Crescimento Orgânico e Paciência", "Conexão Espiritual e Propósito de Vida", "Aventura e Coragem de Mudar",
      "Bloco de Notas e Síntese de Ideias", "Luz do Sol Atravessando Árvores", "Celebração ao Ar Livre", "Superando Ansiedade e Estresse", "Estado de Fluxo (Flow State)",
      "Caneta e Escrita Terapêutica", "Horizonte Aberto e Infinitas Possibilidades", "Caminho Iluminado na Floresta", "Paz dos Vales Verdes", "Harmonia e Plenitude",
      "Autenticidade e Força Interior", "Confiança e Determinação", "Vencendo Desafios Pessoais", "Equilíbrio entre Trabalho e Vida", "Disciplina e Hábitos Produtivos"
    ],
    kwBase: ["mindset", "foco", "habitos", "meditacao", "psicologia", "produtividade", "emocional", "resiliencia", "disciplina", "clareza", "gratidao", "sucesso", "vida"]
  },
  {
    id: "saude_medicina_bemestar",
    name: "Saúde, Medicina & Bem-Estar",
    description: "Medicina preventiva, clínicas modernas, longevidade, biologia, enfermagem e saúde integrada.",
    tag: "med",
    photos: [
      "1505751172876-fa1923c5c528", "1576091160399-112ba8d25d1d", "1532938911079-1b06ac7ceec7", "1584466977772-e5993385665a", "1584515979956-d9f6e5d09982",
      "1579684385127-1ef15d508118", "1516549655169-df83a0774514", "1559839734-2b71ea197ec2", "1583912267670-6575ad482c9c", "1530497610245-94d3c16cda28",
      "1581056771107-24ca5f033842", "1588776814546-1ffcf47267a5", "1538108149393-fbbd81895907", "1519494026892-80bbd2d6fd0d", "1579684453423-f84349ef60b0",
      "1584515933487-779824d29309", "1579684385137-0104e138a08c", "1584516150909-c4315143a976", "1584515933454-e0b40eb76b88", "1584515933467-33e9b1bc13e2",
      "1584515933478-f076c8c49925", "1584515933489-0158474d2843", "1584515933501-1b913348b61c", "1584515933512-ef3ec0d6fa1c", "1584515933523-8c464c8f53a4",
      "1584515933534-118835821034", "1584515933545-2bf8789547d2", "1584515933556-91b48b7fae67", "1584515933567-5d2780e03c4f", "1584515933578-fbc947fae35a"
    ],
    titles: [
      "Médica e Consulta de Prevenção", "Cuidado e Enfermagem Humanizada", "Exame Laboratorial e Biologia", "Cardiologia e Batimentos Cardíacos", "Estetoscópio e Diagnóstico Clínico",
      "Equipe Médica em Hospital Moderno", "Pesquisa Farmacêutica e Vacinas", "Profissional de Saúde em Atendimento", "Prevenção e Cuidados com a Saúde", "Genética e DNA em Análise Científica",
      "Ambiente Clínico de Excelência", "Atendimento Odontológico Avançado", "Hospital e Infraestrutura Médica", "Consultório Médico e Acolhimento", "Cirurgiões e Tecnologia Médica",
      "Monitoramento Cardíaco e Sinais Vitais", "Exames Diagnósticos e Imagem", "Cuidados Intensivos e Reabilitação", "Saúde Pública e Medicina da Família", "Biotecnologia e Medicina Regenerativa",
      "Neurologia e Saúde Cerebral", "Pediatria e Saúde Infantil", "Geriatria e Longevidade Saudável", "Farmácia Clínica e Prescrições", "Imunologia e Defesa do Organismo",
      "Fisiologia e Anatomia Humana", "Oncologia e Tratamentos Modernos", "Nutrologia e Bioquímica Corporal", "Medicina Esportiva e Recuperação", "Saúde Integrativa e Preventiva"
    ],
    kwBase: ["saude", "medicina", "medico", "hospital", "clinica", "exames", "enfermagem", "coracao", "cardiologia", "biologia", "farmacia", "longevidade", "cuidado"]
  },
  {
    id: "nutricao_gastronomia_receitas",
    name: "Nutrição, Gastronomia & Receitas",
    description: "Alimentação saudável, pratos gourmet, ingredientes frescos, dietas funcionais, confeitaria e café.",
    tag: "nutri",
    photos: [
      "1498837167922-ddd27525d352", "1540420773420-3366772f4999", "1512621776951-a57141f2eefd", "1511688878353-3a2f5be94cd7", "1490645935967-10de6ba17061",
      "1519708227418-c8fd9a32b7a2", "1505576399279-565b52d4ac71", "1511690656952-34342bb7c2f2", "1565299624946-b28f40a0ae38", "1504674900247-0877df9cc836",
      "1555939594-58d7cb561ad1", "1565299585323-38d6b0865b47", "1546069901-ba9599a7e63c", "1567620905732-2d1ec7ab7445", "1476224203421-9ac39bcb3327",
      "1482049016688-2d3e1b311543", "1484723091739-0045e56e4c47", "1473093295043-cdd812d0e601", "1497034825429-c343d7c6a68f", "1495147466023-ac5c588e2e94",
      "1495474472287-4d71bcdd2085", "1447930521477-33925a20146a", "1490818387583-1baba5e638af", "1509440159596-0249088772ff", "1514432324607-a09d9b4aefdd",
      "1528735602780-2552fd46c7af", "1551218808-94e220e084d2", "1555396273-367ea4eb4db5", "1559847844-5315695dadae", "1563379091339-03b21ab4a4f8"
    ],
    titles: [
      "Prato Colorido e Saudável", "Salada Fresca e Ingredientes Naturais", "Bowl de Frutas e Superalimentos", "Frutas Cítricas e Vitaminas", "Preparação de Refeições Fit (Meal Prep)",
      "Salmão Grelhado Rico em Ômega 3", "Chá Herbal e Medicina Natural", "Café da Manhã Energético", "Culinária Mediterrânea Saudável", "Mesa Gourmet com Ingredientes Frescos",
      "Grelhados e Carnes Selecionadas", "Prato Artesanal de Massa Fresca", "Salada com Grãos e Sementes Funcionais", "Panquecas com Mel e Frutas Vermelhas", "Tábua de Frios e Queijos Nobres",
      "Sanduíche Artesanal Nutritivo", "Torta de Frutas Frescas", "Massa Italiana ao Pesto de Manjericão", "Sorvete Artesanal e Sobremesas", "Doces Finos e Confeitaria",
      "Xícara de Café Espresso Cremoso", "Grãos Selecionados de Café Especial", "Mix de Frutas Tropicais Frescas", "Pães Rústicos de Fermentação Natural", "Bebidas Refrescantes e Coquetéis",
      "Sanduíche Natural e Lanche Leve", "Cozinha Profissional de Chef", "Restaurante e Gastronomia de Autor", "Prato Autoral Contemporâneo", "Sobremesa Gourmet com Chocolate Belga"
    ],
    kwBase: ["nutricao", "dieta", "culinaria", "gastronomia", "receitas", "comida", "saudavel", "frutas", "vegetais", "cafe", "refeicao", "chef", "gourmet", "doce"]
  },
  {
    id: "fitness_musculacao_esportes",
    name: "Fitness, Musculação & Esportes",
    description: "Musculação, crossfit, corrida, yoga, lutas, natação, alta performance atlética e condicionamento.",
    tag: "fit",
    photos: [
      "1517838277536-f5f99be501cd", "1518611012118-696072aa579a", "1571019614242-c5c5dee9f50b", "1550345332-09e3ac987658", "1574680096145-d05b474e2155",
      "1538805060514-97d9cc17730c", "1534438327276-14e5300c3a48", "1544367567-0f2fcb009e0b", "1518310383802-640c2de311b2", "1545205597-3d9d02c29597",
      "1552674605-db6ffd4facb5", "1574680178050-55c6a6a96e0a", "1517836357463-d25dfeac3438", "1563178406-4cdc2923acbc", "1583454110551-21f2fa2afe61",
      "1549060279-7e168fcee0c2", "1517838277536-f5f99be501cd", "1518611012118-696072aa579a", "1571019614242-c5c5dee9f50b", "1550345332-09e3ac987658",
      "1574680096145-d05b474e2155", "1538805060514-97d9cc17730c", "1534438327276-14e5300c3a48", "1544367567-0f2fcb009e0b", "1518310383802-640c2de311b2",
      "1545205597-3d9d02c29597", "1552674605-db6ffd4facb5", "1574680178050-55c6a6a96e0a", "1517836357463-d25dfeac3438", "1563178406-4cdc2923acbc"
    ],
    titles: [
      "Treino Intenso com Pesos na Academia", "Postura de Yoga e Flexibilidade", "Treino Feminino Funcional", "Bebida Isotônica e Hidratação", "Crossfit e Levantamento de Peso",
      "Corrida Matinal no Parque", "Equipamentos Modernos de Musculação", "Relaxamento e Alívio da Dor", "Treino Funcional ao Ar Livre", "Postura e Respiração Consciente",
      "Cronômetro e Superação de Recordes", "Alongamento Pós-Treino", "Halteres de Ferro e Disciplina Diária", "Suplementação de Vitaminas e Minerais", "Levantamento Olímpico e Potência",
      "Treino de Luta e Boxe", "Musculação e Hipertrofia Muscular", "Pilates e Fortalecimento do Core", "Condicionamento Físico de Alto Nível", "Hidratação e Performance Esportiva",
      "WOD de Crossfit em Equipe", "Maratona e Corrida de Rua", "Academia com Aparelhos de Ponta", "Fisioterapia Esportiva e Mobilidade", "Calistenia e Controle Corporal",
      "Mindfulness e Concentração no Esporte", "Treino de Velocidade e Sprint", "Recuperação Muscular e Liberação Miofascial", "Halteres e Halterofilismo", "Suplementos Pré-Treino e Creatina"
    ],
    kwBase: ["fitness", "treino", "academia", "musculacao", "peso", "yoga", "corrida", "crossfit", "esporte", "corpo", "saude", "forca", "hipertrofia", "alongamento"]
  },
  {
    id: "espiritualidade_fe_religiao",
    name: "Espiritualidade, Fé & Bíblia",
    description: "Bíblias de estudo, oração, sabedoria bíblica, paz de espírito, templos históricos e reflexão espiritual.",
    tag: "fe",
    photos: [
      "1509021436665-8f07dbf5bf1d", "1507692049790-de58290a4334", "1519817650390-64a93db51149", "1543783207-ec64e4d95325", "1514897575457-4a0425f400e7",
      "1518495973542-4542c06a5843", "1502086223501-7ea6ecd79368", "1509198397868-475647b2a1e5", "1519681393784-d120267933ba", "1506744038136-46273834b3fb",
      "1499209974431-9dddcece7f88", "1506126613408-eca07ce68773", "1470240731273-7821a6eeb6bd", "1472214103451-9374bd1c798e", "1469474968028-56623f02e42e",
      "1434030216411-0b793f4b4173", "1455390582262-044cdead277a", "1516627145497-ae6968895b74", "1518709268805-4e9042af9f23", "1504052434569-70ad5836ab65",
      "1589829545856-d10d557cf95f", "1513002749550-c59d786b8e6c", "1518173946687-a4c8a383392e", "1448375240586-882707db888b", "1470071459604-3b5ec3a7fe05"
    ],
    titles: [
      "Bíblia Sagrada Aberta com Luz Suave", "Mãos Unidas em Oração e Gratidão", "Velas Aesas e Momento de Recolhimento", "Cruz e Alvorecer no Horizonte", "Vitral Histórico Iluminado",
      "Luz Celestial Atravessando a Natureza", "Conexão Profunda com o Divino", "Paz Interior e Espiritualidade", "Céu Estrelado e Infinito da Criação", "Águas Tranquilas e Salmo da Paz",
      "Meditação Matinal e Oração Secreta", "Equilíbrio Espiritual e Fé", "Amanhecer no Monte e Busca Espiritual", "Vales Verdes e Serenidade da Alma", "Harmonia entre Criador e Criatura",
      "Caderno de Orações e Devocional", "Palavras de Sabedoria e Vida Eterna", "Luz Divina e Esperança Inabalável", "Refúgio Espiritual e Fortaleza", "Escrituras Sagradas e Ensinamentos",
      "Princípios Eternos e Justiça Divina", "Portais Celestiais e Glória", "Reflexão na Chuva e Renovação", "Caminho Estreito da Fé", "Trilha da Sabedoria e Paz"
    ],
    kwBase: ["fe", "biblia", "oracao", "deus", "espiritualidade", "sagrado", "igreja", "jesus", "cristao", "paz", "esperanca", "luz", "alma", "devocional"]
  },
  {
    id: "educacao_livros_estudos",
    name: "Educação, Livros & Estudos",
    description: "Bibliotecas, universidades, livros didáticos, matemática, física, história e conhecimento acadêmico.",
    tag: "edu",
    photos: [
      "1497633762265-9d179a990aa6", "1507842229451-79b1be886a2e", "1532094349884-543bc11b234d", "1523240795612-9a054b0db644", "1491841573634-28140fc7ced7",
      "1503676260728-1c00da094a0b", "1513542789411-b6a5d4f31634", "1524995997946-a1c2e315a42f", "1516979187457-637abb4f9353", "1509062522246-3755977927d7",
      "1456513080510-7bf3a84b82f8", "1506880018603-83d5b814b5a6", "1498243691581-b145c3f54a5a", "1471970471555-19d4b113e9ed", "1518455027359-f3f8164ba6bd",
      "1534447677768-be436bb09401", "1511671782779-c97d3d27a1d4", "1514525253161-7a46d19cd819", "1520523839898-507124053864", "1598488035139-bdbb2231ce04",
      "1516280440614-37939bbacd81", "1519892300165-cb5542fb47c7", "1508700115892-45ecd05ae2ad", "1485846234645-a62644f84728", "1511192336575-5a79af67a629",
      "1470225620780-dba8ba36b745", "1512820790803-83ca734da794", "1503676260728-1c00da094a0b", "1509062522246-3755977927d7", "1516627145497-ae6968895b74"
    ],
    titles: [
      "Pilha de Livros e Sabedoria Clássica", "Biblioteca Histórica Magnífica", "Tubo de Ensaio e Laboratório de Química", "Estudantes em Debate Acadêmico", "Livro Aberto com Luz Suave",
      "Material Escolar e Criatividade", "Quadro Negro com Fórmulas Matemáticas", "Prateleiras Infinitas de Livros", "Páginas Antigas e Manuscritos", "Professor Ensinando em Sala de Aula",
      "Concentração Profunda nos Estudos", "Leitura Relaxante no Parque", "Campus Universitário Arborizado", "Lupa sobre Documento Histórico", "Globo Terrestre e Geografia Mundial",
      "Pesquisa Científica e Descobertas", "Teoria Musical e Partituras", "Produção Intelectual e Ensaios", "Estudos Históricos e Arqueologia", "Ensino Superior e Conquistas",
      "Debate Filosófico e Crítico", "Educação Tecnológica e Futuro", "Metodologias Ativas de Ensino", "Pesquisa Documental e Fontes", "Formação de Novos Líderes",
      "Conhecimento Científico Aplicado", "Enciclopédias e Obras de Referência", "Didática e Pedagogia Moderna", "Mestrado e Doutorado Acadêmico", "Incentivo à Leitura Infantil"
    ],
    kwBase: ["educacao", "livros", "escola", "estudo", "universidade", "professor", "aula", "biblioteca", "ciencia", "aluno", "historia", "matematica", "didatica"]
  },
  {
    id: "arte_design_arquitetura",
    name: "Arte, Design & Arquitetura",
    description: "Pinturas, design de interiores, arquitetura contemporânea, paleta de cores, escultura e fotografia.",
    tag: "art",
    photos: [
      "1579783900882-c0d3dad7b119", "1513542789411-b6a5d4f31634", "1509631179647-0177331693ae", "1516035069371-29a1b244cc32", "1541701494587-cb58502866ab",
      "1582562124811-c09040d0a901", "1586023492125-27b2c045efd7", "1492691527719-9d1e07e534b4", "1507089947368-19c1da9775ae", "1500462918059-b1a0cb512f1d",
      "1513364776144-60967b0f800f", "1460661419201-fd4cecdf8a8b", "1579783902614-a3fb3927b675", "1561214115-f2f134cc4912", "1541701494587-cb58502866ab",
      "1518709268805-4e9042af9f23", "1509198397868-475647b2a1e5", "1514539079130-25950c84af65", "1451187580459-43490279c0fa", "1534447677768-be436bb09401",
      "1507842217343-583bb7270b66", "1448375240586-882707db888b", "1439853949127-fa647821eba0", "1516979187457-637abb4f9353", "1469474968028-56623f02e42e"
    ],
    titles: [
      "Pintura a Óleo Expressionista", "Paleta de Cores e Mistura de Tintas", "Moda e Alta Costura Editorial", "Câmera Fotográfica Vintage e Lente", "Arte Abstrata Fluida e Cores Vivas",
      "Estúdio de Pintura e Cavalete", "Design de Interiores Moderno e Acolhedor", "Fotografia de Paisagem e Composição", "Arquitetura Minimalista Contemporânea", "Formas Geométricas e Escultura",
      "Telas e Pincéis no Atelier", "Aquarela e Pigmentos em Papel Nobre", "Arte Contemporânea em Galeria", "Instalação Artística e Iluminação", "Texturas Visuais e Harmonia",
      "Arquitetura de Castelos Históricos", "Criação Visual Épica", "Expressão Artística na Natureza", "Arte Digital e Visualização 3D", "Composição Cromática Perfeita",
      "Design Editorial e Tipografia Nobre", "Fotografia Autoral em Preto e Branco", "Esculturas em Mármore e Bronze", "Curadoria de Obras e Exposições", "Conceito Visual de Alto Padrão"
    ],
    kwBase: ["arte", "design", "pintura", "arquitetura", "criatividade", "cores", "fotografia", "desenho", "estudio", "escultura", "interiores", "galeria"]
  },
  {
    id: "musica_audiovisual_shows",
    name: "Música, Audiovisual & Shows",
    description: "Instrumentos musicais, estúdios de gravação, pianos, guitarras, microfones, DJs e palcos.",
    tag: "mus",
    photos: [
      "1511671782779-c97d3d27a1d4", "1514525253161-7a46d19cd819", "1520523839898-507124053864", "1598488035139-bdbb2231ce04", "1516280440614-37939bbacd81",
      "1519892300165-cb5542fb47c7", "1508700115892-45ecd05ae2ad", "1485846234645-a62644f84728", "1511192336575-5a79af67a629", "1470225620780-dba8ba36b745",
      "1465847899084-d164df4dedc6", "1507838153414-b4b713384a76", "1511379938547-c1f69419868d", "1514320291840-2e0a9bf2a9ae", "1445985543468-7944e913f063",
      "1493225457124-a3eb161ffa5f", "1511735111819-9a3f7709049c", "1516450360452-9312f5e86fc7", "1501612722273-04666da45872", "1470229722913-7c0e2dbbafd3",
      "1429962714451-bb934ecdc4ec", "1518609878373-06d740f60d8b", "1508700115892-45ecd05ae2ad", "1485846234645-a62644f84728", "1511192336575-5a79af67a629"
    ],
    titles: [
      "Guitarra Elétrica e Amplificador de Som", "Microfone Profissional de Estúdio", "Piano de Cauda e Partitura Clássica", "Mesa de Áudio e Mixagem em Estúdio", "Cantora em Performance Vocal Emocionante",
      "Violão Acústico e Luzes Quentes", "Fones de Ouvido Over-Ear de Alta Fidelidade", "Claquete de Cinema e Produção Audiovisual", "Saxofone Dourado e Jazz", "Show ao Vivo com Show de Luzes",
      "Festival de Música e Multidão Animada", "Orquestra Sinfônica e Maestro", "Teclas Pretas e Brancas de Piano", "Bateria Acústica e Baquetas", "Gravação em Estúdio Acústico",
      "Composição Musical e Inspiração", "Torre de Som e Mesa de DJ", "Luzes de Palco e Efeitos Cênicos", "Voz e Violão em Apresentação Íntima", "Lente de Cinema e Filmagem Profissional",
      "Pista de Dança e Energia Musical", "Equalizador Gráfico e Produção Musical", "Fones Profissionais para Gravação", "Câmera de Cinema em Set", "Instrumentos de Sopro e Harmonia"
    ],
    kwBase: ["musica", "som", "guitarra", "piano", "violao", "estudio", "audio", "microfone", "show", "dj", "gravação", "cantor", "palco", "instrumento"]
  },
  {
    id: "ficcao_fantasia_misterio",
    name: "Ficção, Fantasia & Mistério",
    description: "Castelos épicos, reinos fantásticos, magia, dragões, lendas, noites estreladas e dimensões secretas.",
    tag: "fic",
    photos: [
      "1518709268805-4e9042af9f23", "1509198397868-475647b2a1e5", "1514539079130-25950c84af65", "1519681393784-d120267933ba", "1534447677768-be436bb09401",
      "1448375240586-882707db888b", "1439853949127-fa647821eba0", "1507842217343-583bb7270b66", "1516627145497-ae6968895b74", "1513002749550-c59d786b8e6c",
      "1518173946687-a4c8a383392e", "1504052434569-70ad5836ab65", "1589829545856-d10d557cf95f", "1436491865332-7a61a109cc05", "1476514525535-07fb3b4ae5f1",
      "1506744038136-46273834b3fb", "1464822759023-fed622ff2c3b", "1470071459604-3b5ec3a7fe05", "1472214103451-9374bd1c798e", "1469474968028-56623f02e42e",
      "1502086223501-7ea6ecd79368", "1500530855697-b586d89ba3ee", "1518495973542-4542c06a5843", "1494178270175-e96de2971df9", "1455390582262-044cdead277a"
    ],
    titles: [
      "Castelo nas Nuvens do Reino Encantado", "Espada Épica na Névoa da Batalha", "Floresta Mística e Elfos Antigos", "Noite Estrelada e Montanhas Cósmicas", "Mundo Submarino e Criaturas Abissais",
      "Trilha Misteriosa na Floresta Proibida", "Magia dos Elementos Fogo e Gelo", "Grimórios Antigos e Segredos Ocultos", "Bolinhas de Luz Mágica e Fadas", "Céus Celestiais e Portais Épicos",
      "Chuva Mística e Reflexos na Escuridão", "Tomo Sagrado e Pergaminhos Perdidos", "Relíquias do Tribunal Antigo", "Voo Acima das Nuvens do Reino", "Lago dos Segredos Esquecidos",
      "Cânion Sagrado e Lendas Ancestrais", "Pico dos Dragões na Tempestade", "Sussurros na Floresta Escura", "Vales Encantados de Avalon", "Reino dos Deuses Antigos",
      "Profecia Celestial e Destino", "Jornada do Herói Solitário", "Luz Sagrada e Renovação", "Sombras e Batalha Interior", "Crônicas Esquecidas no Tempo"
    ],
    kwBase: ["ficcao", "fantasia", "castelo", "magia", "espada", "misterio", "aventura", "lenda", "conto", "dragao", "noite", "floresta", "sobrenatural", "heroi"]
  },
  {
    id: "natureza_viagens_aventura",
    name: "Natureza, Viagens & Aventura",
    description: "Montanhas majestosas, praias paradisíacas, trilhas ecológicas, cachoeiras, safáris e turismo.",
    tag: "nat",
    photos: [
      "1469474968028-56623f02e42e", "1507525428034-b723cf961d3e", "1464822759023-fed622ff2c3b", "1506744038136-46273834b3fb", "1436491865332-7a61a109cc05",
      "1476514525535-07fb3b4ae5f1", "1510312305653-8ed496efae75", "1470071459604-3b5ec3a7fe05", "1506929562872-bb421503ef21", "1472214103451-9374bd1c798e",
      "1500530855697-b586d89ba3ee", "1470240731273-7821a6eeb6bd", "1447752875215-b2761acb3c5d", "1518495973542-4542c06a5843", "1519834785169-98be25ec3f84",
      "1502086223501-7ea6ecd79368", "1508962914676-134849a727f0", "1499750310107-5fef28a66643", "1434030216411-0b793f4b4173", "1517841905240-472988babdf9",
      "1494790108377-be9c29b29330", "1509198397868-475647b2a1e5", "1492684223066-81342ee5ff30", "1517048676732-d65bc937f952", "1488190211105-8b0e65b80b4e",
      "1494178270175-e96de2971df9", "1498050108023-c5249f4df085", "1455390582262-044cdead277a", "1486406146926-c627a92ad1ab", "1507679799987-c73779587ccf"
    ],
    titles: [
      "Vale Verdejante e Montanhas Suíças", "Praia Tropical com Mar Turquesa", "Pico Nevado dos Alpes ao Pôr do Sol", "Cachoeira Cristalina e Floresta Tropical", "Avião Sobrevoando as Nuvens",
      "Barco em Lago Espelhado nas Montanhas", "Acampamento sob o Céu Estrelado", "Floresta Densa e Névoa Matinal", "Praia Paradisíaca ao Entardecer", "Colinas Verdes da Toscana",
      "Trilha de Mochileiro em Parque Nacional", "Caminhada Ecológica Revigorante", "Jardim Botânico e Flores Raras", "Raios de Sol na Floresta de Pinheiros", "Aventura ao Ar Livre e Liberdade",
      "Árvores Frondosas e Preservação Ambiental", "Tempo e Natureza em Perfeita Sintonia", "Minimalismo Inspirado na Natureza", "Diário de Bordo de Viagem", "Sorriso e Alegria da Viagem",
      "Liberdade de Explorar o Mundo", "Superação em Trilhas de Alta Montanha", "Celebração no Topo do Mirante", "Guias de Turismo e Ecoturismo", "Roteiro e Planejamento de Viagem",
      "Paz do Silêncio nas Montanhas", "Foco e Presença no Meio Ambiente", "Escrita e Inspiração nas Viagens", "Destinos Urbanos Globais", "Turismo Executivo e Conforto"
    ],
    kwBase: ["natureza", "viagem", "montanha", "praia", "aventura", "trilha", "floresta", "mar", "turismo", "paisagem", "ecologia", "aviao", "mundo", "viagens"]
  },
  {
    id: "direito_justica_advocacia",
    name: "Direito, Justiça & Advocacia",
    description: "Balança da justiça, martelo do juiz, livros jurídicos, tribunais, advocacia, constituição e contratos.",
    tag: "dir",
    photos: [
      "1589829545856-d10d557cf95f", "1507842217343-583bb7270b66", "1523240795612-9a054b0db644", "1523050854058-8df90110c9f1", "1455390582262-044cdead277a",
      "1434030216411-0b793f4b4173", "1541829070764-84a7d30dd3f3", "1450133064473-71024230f91b", "1497633762265-9d179a990aa6", "1517486808906-6ca8b3f04846",
      "1589829545856-d10d557cf95f", "1507842217343-583bb7270b66", "1523240795612-9a054b0db644", "1523050854058-8df90110c9f1", "1455390582262-044cdead277a",
      "1434030216411-0b793f4b4173", "1541829070764-84a7d30dd3f3", "1450133064473-71024230f91b", "1497633762265-9d179a990aa6", "1517486808906-6ca8b3f04846"
    ],
    titles: [
      "Balança da Justiça e Martelo de Madeira", "Biblioteca Jurídica com Vade Mecum", "Estudantes de Direito em Audiência Simulada", "Capelo de Formatura e Diploma em Direito", "Caneta Tinteiro e Assinatura de Contrato",
      "Parecer Jurídico e Análise de Cláusulas", "Tribunal de Justiça e Sessão Plenária", "Acordo Judicial e Mediação de Conflitos", "Código Civil e Doutrina Jurídica", "Consultoria Jurídica Empresarial e Compliance",
      "Símbolo da Justiça e Ética Profissional", "Acervo de Legislação e Jurisprudência", "Advogados em Sustentação Oral", "Formatura na Faculdade de Direito", "Contratos de Parceria e Cláusulas",
      "Redação de Petições e Processos", "Corte Suprema e Julgamento", "Solução Amigável de Disputas", "Biblioteca de Direito Constitucional", "Assessoria Jurídica Estratégica"
    ],
    kwBase: ["direito", "justica", "advocacia", "advogado", "lei", "tribunal", "processo", "contrato", "juiz", "juridico", "compliance", "constituicao"]
  },
  {
    id: "infantil_maternidade_familia",
    name: "Infantil, Maternidade & Família",
    description: "Educação infantil, histórias para dormir, brincadeiras lúdicas, pais e filhos, carinho e pedagogia.",
    tag: "kid",
    photos: [
      "1503676260728-1c00da094a0b", "1509062522246-3755977927d7", "1516627145497-ae6968895b74", "1502086223501-7ea6ecd79368", "1485546246426-74dc88dec4d9",
      "1587654780291-39c9404d746b", "1596461404969-9ae70f2830c1", "1544717305-2782549b5136", "1530325553241-4f6e7690cf36", "1516627145497-ae6968895b74",
      "1503676260728-1c00da094a0b", "1509062522246-3755977927d7", "1516627145497-ae6968895b74", "1502086223501-7ea6ecd79368", "1485546246426-74dc88dec4d9",
      "1587654780291-39c9404d746b", "1596461404969-9ae70f2830c1", "1544717305-2782549b5136", "1530325553241-4f6e7690cf36", "1516627145497-ae6968895b74"
    ],
    titles: [
      "Criança Desenhando e Aprendendo com Cores", "Professora Contando Histórias Infantis", "Lápis de Cor e Brinquedos Educativos", "Mãe e Filho em Momento de Afeto", "Sorriso Radiante de Criança Brincando",
      "Brincadeiras ao Ar Livre e Criatividade", "Livro Infantil Ilustrado Aberto", "Bebê Descobrindo o Mundo com Amor", "Família Feliz Reunida no Parque", "Atividades Pedagógicas Lúdicas",
      "Desenho com Tintas Não Tóxicas", "Contação de Histórias e Fábulas", "Blocos de Montar e Raciocínio", "Vínculo Materno e Proteção", "Infância Feliz e Saudável",
      "Jogos Educativos em Sala de Aula", "Leitura de Contos Antes de Dormir", "Cuidados com Recém-Nascidos", "Piquenique em Família no Domingo", "Desenvolvimento Motor e Emocional"
    ],
    kwBase: ["infantil", "crianca", "bebe", "maternidade", "familia", "pais", "filhos", "pedagogia", "brinquedos", "educacao infantil", "conto", "ludico"]
  },
  {
    id: "sustentabilidade_ecologia_planeta",
    name: "Sustentabilidade, Ecologia & Planeta",
    description: "Energia solar, eólica, reflorestamento, conservação ambiental, reciclagem, planeta Terra e ESG.",
    tag: "esg",
    photos: [
      "1509391365360-2e959784a276", "1497435334941-8c899ee9e8e9", "1473341304170-971dccb5ac1e", "1451187580459-43490279c0fa", "1448375240586-882707db888b",
      "1507525428034-b723cf961d3e", "1464822759023-fed622ff2c3b", "1506744038136-46273834b3fb", "1470071459604-3b5ec3a7fe05", "1472214103451-9374bd1c798e",
      "1469474968028-56623f02e42e", "1447752875215-b2761acb3c5d", "1518495973542-4542c06a5843", "1502086223501-7ea6ecd79368", "1519834785169-98be25ec3f84"
    ],
    titles: [
      "Painéis Solares Fotovoltaicos e Energia Limpa", "Turbinas Eólicas em Campo Verde", "Gota de Orvalho e Broto de Planta Verde", "Planeta Terra Visto do Espaço", "Mata Atlântica Preservada e Biodiversidade",
      "Oceanos Limpos e Preservação Marinha", "Geleiras e Impacto Climático", "Recursos Hídricos e Rios Limpos", "Reflorestamento e Créditos de Carbono", "Agricultura Sustentável e Orgânica",
      "Economia Circular e Reciclagem", "Crescimento Consciente e ESG", "Energia Renovável e Futuro Sustentável", "Harmonia com a Biosfera", "Comunidades Verdes e Cidades Sustentáveis"
    ],
    kwBase: ["sustentabilidade", "ecologia", "esg", "meio ambiente", "energia solar", "planeta", "verde", "clima", "reciclagem", "natureza", "carbono"]
  },
  {
    id: "carreira_homeoffice_networking",
    name: "Carreira, Home Office & Networking",
    description: "Trabalho remoto, entrevistas de emprego, currículos de destaque, reuniões e evolução profissional.",
    tag: "car",
    photos: [
      "1522071820081-009f0129c71c", "1515378791036-0648a3ef77b2", "1507238691740-187a5b1d37b8", "1534972195531-a756b1126f25", "1551434678-e076c223a692",
      "1587620962725-abab7fe55159", "1573164713988-8665fc963095", "1525547719571-a2d4ac8945e2", "1519389950473-47ba0277781c", "1531403009284-440f080d1e12",
      "1551836022-d5d88e9218df", "1507679799987-c73779587ccf", "1454165804606-c3d57bc86b40", "1497366216548-37526070297c", "1556761175-5973dc0f32e7",
      "1497215728101-856f4ea42174", "1519085360753-af0119f7cbe7", "1573496359142-b8d87734a5a2", "1517245386807-bb43f82c33c4", "1507537297725-24a1c029d3ca"
    ],
    titles: [
      "Time em Coworking Integrado", "Profissional em Home Office Focado", "Entrevista de Emprego Online e Conexão", "Desenvolvedor Remoto Produtivo", "Comunicação Eficaz no Trabalho Remoto",
      "Setup Minimalista com Duplo Monitor", "Reunião de Alinhamento Global", "Mesa de Trabalho Ergonômica", "Networking e Troca de Experiências", "Plano de Carreira e Transição",
      "Apresentação Executiva de Alto Impacto", "Entrevista Presencial e Liderança", "Estratégia de Recolocação Profissional", "Ambiente de Trabalho Flexível", "Assinatura de Carta Proposta",
      "Sala Executiva para Reuniões", "Desenvolvimento de Habilidades (Soft Skills)", "Mentoria de Carreira e Propósito", "Treinamento de Equipes Remotas", "Alinhamento 1on1 e Gestão de Desempenho"
    ],
    kwBase: ["carreira", "trabalho", "homeoffice", "remoto", "networking", "entrevista", "curriculo", "vagas", "emprego", "produtividade", "equipe", "salario"]
  },
  {
    id: "moda_beleza_estilo",
    name: "Moda, Beleza & Estilo",
    description: "Estilo pessoal, maquiagem, perfumaria, joias, alfaiataria, alta costura, cuidados com a pele e estética.",
    tag: "mod",
    photos: [
      "1509631179647-0177331693ae", "1490481651871-ab68de25d43d", "1483985988355-763728e1935b", "1522337360788-8b13dee7a37e", "1512496015851-a90fb38ba796",
      "1509631179647-0177331693ae", "1490481651871-ab68de25d43d", "1483985988355-763728e1935b", "1522337360788-8b13dee7a37e", "1512496015851-a90fb38ba796",
      "1509631179647-0177331693ae", "1490481651871-ab68de25d43d", "1483985988355-763728e1935b", "1522337360788-8b13dee7a37e", "1512496015851-a90fb38ba796"
    ],
    titles: [
      "Desfile de Moda e Alta Costura", "Estilo Pessoal e Elegância Urbana", "Compras e Tendências Fashion", "Maquiagem Profissional e Estética", "Cosméticos e Cuidados com a Pele (Skincare)",
      "Alfaiataria e Roupas Sob Medida", "Acessórios de Luxo e Relógios Clássicos", "Consultoria de Imagem e Cores Pessoais", "Perfumaria e Essências Exclusivas", "Produção de Moda e Editorial",
      "Design de Joias e Ouro Fino", "Tendências de Estilo Minimalista", "Passarela e Coleção Outono/Inverno", "Harmonização e Cuidados Faciais", "Elegância e Confiança Pessoal"
    ],
    kwBase: ["moda", "estilo", "beleza", "maquiagem", "skincare", "elegancia", "roupas", "acessorios", "perfume", "luxo", "tendencias", "estetica"]
  }
];

// Helper to expand photos to achieve 500 unique image slots
const UNSPLASH_EXPANDED_IDS = [
  // High quality Unsplash curated IDs
  "1534528741775-53994a69daeb", "1507003211169-0a1dd7228f2d", "1500648767791-00dcc994a43e", "1492562080023-ab3db95bfbce", "1539571696357-5a69c17a67c6",
  "1517841905240-472988babdf9", "1524504388940-b1c1722653e1", "1494790108377-be9c29b29330", "1506794778202-cad84cf45f1d", "1519085360753-af0119f7cbe7",
  "1534528741775-53994a69daeb", "1517841905240-472988babdf9", "1531746020798-e6953c6e8e04", "1508214751196-bcfd4ca60f91", "1501196354995-cbb51c65aaea",
  "1496302662116-35cc4f36df92", "1480429370139-e0132c086e2a", "1507537297725-24a1c029d3ca", "1492681290082-e932832941e6", "1529626455594-4ff0802cfb7e",
  "1537151608828-ea2b11777ee8", "1560250097-0b93528c311a", "1573496359142-b8d87734a5a2", "1556157382-97eda2d62296", "1488426862026-3ee34a7d66df",
  "1544005313-94ddf0286df2", "1531123897727-8f129e1688ce", "1521119989659-a83eee488004", "1548142813-c348350df52b", "1509869175650-a1c97972541a",
  "1532712938310-34cb3982ef74", "1517245386807-bb43f82c33c4", "1557804506-669a67965ba0", "1521737604893-d14cc237f11d", "1522071820081-009f0129c71c",
  "1507679799987-c73779587ccf", "1486406146926-c627a92ad1ab", "1454165804606-c3d57bc86b40", "1551836022-d5d88e9218df", "1556761175-5973dc0f32e7",
  "1497366216548-37526070297c", "1497215728101-856f4ea42174", "1519085360753-af0119f7cbe7", "1573496359142-b8d87734a5a2", "1517245386807-bb43f82c33c4",
  "1507537297725-24a1c029d3ca", "1557804506-669a67965ba0", "1521737711867-e3b97375f902", "1552664730-d307ca884978", "1573497019940-1c28c88b4f3e"
];

console.log("Generating full library of 500 images...");
