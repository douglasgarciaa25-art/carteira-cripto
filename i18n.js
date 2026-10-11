/* Cripto Radar V19.0 • Internationalization (pt-BR / en / es) */
(function(){
  'use strict';
  const STORAGE_KEY='crRadarLanguageV16';
  const textOriginal=new WeakMap();
  const attrOriginal=new WeakMap();
  let applying=false;

  const STRINGS={
    en:{
      'acesso protegido':'protected access','Primeira configuração':'First setup','Crie seu acesso':'Create your access',
      'Usuário ou e-mail':'Username or email','Senha':'Password','Confirmar senha':'Confirm password','Seu usuário':'Your username',
      'Mínimo de 8 caracteres':'At least 8 characters','Digite novamente':'Type it again','Ativar biometria neste aparelho':'Enable biometrics on this device',
      'Quando disponível, o Android usará digital, rosto ou o bloqueio seguro do aparelho.':'When available, Android will use fingerprint, face recognition, or the device secure lock.',
      'Criar acesso protegido':'Create protected access','Área protegida':'Protected area','Desbloquear Radar':'Unlock Radar','Usuário':'User',
      'Conta local deste aparelho':'Local account on this device','◉ Entrar com biometria':'◉ Sign in with biometrics','ou use sua senha':'or use your password',
      'Entrar':'Sign in','Usar PIN':'Use PIN','PIN de 4 a 6 números':'4 to 6 digit PIN','Desbloquear com PIN':'Unlock with PIN','Sua senha':'Your password',
      'Navegação adaptativa':'Adaptive navigation','Principal':'Main','Início':'Home','Resumo e destaques':'Overview and highlights','Carteira':'Portfolio',
      'Print, aporte e posições':'Screenshot, contributions and positions','Mercado':'Market','Ranking, notícias e tendências':'Ranking, news and trends','Alertas':'Alerts',
      'Alarmes e notificações':'Alarms and notifications','IA Radar':'AI Radar','Análise da carteira':'Portfolio analysis','Segurança':'Security','Senha, PIN e biometria':'Password, PIN and biometrics',
      'PRO Anual':'Annual PRO','IA, Push 24h, sinais e ferramentas avançadas':'AI, 24h Push, signals and advanced tools','Profissional':'Professional','Motor':'Engine',
      'V10/V11 e diagnóstico':'V10/V11 and diagnostics','Histórico e calibração':'History and calibration','Validação sem ordens reais':'Validation without real orders','Sistema':'System',
      'Fontes, proteção e saúde':'Sources, protection and health','Nível da interface':'Interface level','🙂 Amador':'🙂 Beginner','⚙️ Profissional':'⚙️ Professional',
      'PRIMEIRO ACESSO':'FIRST ACCESS','Como você quer usar o Radar?':'How do you want to use Radar?','Modo Amador':'Beginner Mode','USAR MODO AMADOR':'USE BEGINNER MODE',
      'Modo Profissional':'Professional Mode','USAR MODO PROFISSIONAL':'USE PROFESSIONAL MODE','painel inteligente de mercado':'smart market dashboard','RADAR ATIVO':'RADAR ACTIVE',
      'Visão geral':'Overview','Iniciando…':'Starting…','Segundo plano: iniciando…':'Background: starting…','ÁREA ATUAL':'CURRENT AREA','Amador':'Beginner','Pro':'Pro',
      'INTERFACE SIMPLIFICADA':'SIMPLIFIED INTERFACE','CRIPTO RADAR PRO':'CRIPTO RADAR PRO','Plano Anual':'Annual Plan','Libere os recursos avançados e mantenha o Radar trabalhando 24h.':'Unlock advanced features and keep Radar working 24/7.',
      'PLANO ANUAL':'ANNUAL PLAN','R$ 99,90/ano':'R$ 99.90/year','IA Radar avançada':'Advanced AI Radar','Análises e diagnóstico.':'Analysis and diagnostics.',
      'Push 24h':'24h Push','Alertas com app fechado.':'Alerts while the app is closed.','Espelhamento':'Smart Mirroring','Sinais e simulação proporcional.':'Signals and proportional simulation.',
      'Sinais PRO':'PRO Signals','Pullback, motor e filtros avançados.':'Pullback, engine and advanced filters.','ASSINAR PRO ANUAL':'SUBSCRIBE TO ANNUAL PRO',
      'RESTAURAR COMPRA':'RESTORE PURCHASE','GERENCIAR':'MANAGE','Verificando Google Play Billing…':'Checking Google Play Billing…','Desbloqueie o Radar completo':'Unlock the full Radar',
      'Uma assinatura anual, cobrada e gerenciada pelo Google Play.':'An annual subscription billed and managed by Google Play.','✓ IA Radar avançada e Modo Profissional':'✓ Advanced AI Radar and Professional Mode',
      '✓ Push 24h e alertas com tela bloqueada':'✓ 24h Push and lock-screen alerts','✓ Espelhamento Inteligente e sinais PRO':'✓ Smart Mirroring and PRO signals',
      '✓ Motor V10/V11, backtest e Paper Trading':'✓ V10/V11 engine, backtest and Paper Trading','ASSINAR AGORA':'SUBSCRIBE NOW','JÁ ASSINEI / RESTAURAR':'I ALREADY SUBSCRIBED / RESTORE',
      'Segurança do acesso':'Access security','Gerencie a proteção local do Cripto Radar neste aparelho.':'Manage Cripto Radar local protection on this device.','PROTEGIDO':'PROTECTED',
      'Conta':'Account','Biometria':'Biometrics','Bloqueio':'Lock','Biometria do aparelho':'Device biometrics','Ativar / atualizar biometria':'Enable / update biometrics','Remover':'Remove',
      'PIN rápido':'Quick PIN','4 a 6 números':'4 to 6 digits','Salvar':'Save','Bloqueio automático':'Automatic lock','Proteção de sessão':'Session protection','Bloquear após inatividade':'Lock after inactivity',
      '1 minuto':'1 minute','5 minutos':'5 minutes','15 minutos':'15 minutes','30 minutos':'30 minutes','Bloquear em segundo plano após 30 segundos':'Lock in background after 30 seconds',
      'Trocar senha':'Change password','Exige a senha atual':'Requires current password','Alterar senha':'Change password','Bloquear aplicativo agora':'Lock app now',
      'PATRIMÔNIO MONITORADO':'MONITORED PORTFOLIO','Carregando…':'Loading…','atualização automática pela carteira':'automatic portfolio update','Abrir carteira':'Open portfolio',
      'Alarme':'Alarm','Analisando…':'Analyzing…','Top oportunidade':'Top opportunity','Buscando…':'Searching…','LEITURA DO RADAR':'RADAR READING','MODO AMADOR':'BEGINNER MODE',
      'O Radar está reunindo as primeiras leituras do mercado.':'Radar is gathering the first market readings.','Acesso rápido':'Quick access','toque para abrir':'tap to open','Posições e aporte':'Positions and contributions',
      'Ranking e tendências':'Ranking and trends','Risco e oportunidade':'Risk and opportunity','Leitura orientada':'Guided reading','⚡ Radar Pro • Central':'⚡ Radar Pro • Hub','Dados':'Data','Carregando':'Loading',
      'Melhor sinal':'Best signal','Notificações':'Notifications','Inicializando diagnóstico…':'Initializing diagnostics…','Iniciando':'Starting','Preço':'Price','Sinal':'Signal','🔔 TESTAR NOTIFICAÇÃO':'🔔 TEST NOTIFICATION',
      'Executando diagnóstico…':'Running diagnostics…','Live':'Live','Conectando':'Connecting','Sinais avaliados':'Signals evaluated','Acertos (após 1h)':'Hits (after 1h)','Aguardando':'Waiting','Proteção diária':'Daily protection',
      'Ranking atual':'Current ranking','Aguardando sinais…':'Waiting for signals…','Iniciando IA…':'Starting AI…','Carregando análise do mercado…':'Loading market analysis…','PERGUNTAR':'ASK',
      'Informativo: não executa compras ou vendas e não garante retorno.':'Informational only: does not execute buys or sells and does not guarantee returns.','🪞 Espelhamento Inteligente':'🪞 Smart Mirroring','SIMULAÇÃO':'SIMULATION',
      '🧪 Simulação':'🧪 Simulation','🔔 Só alertas':'🔔 Alerts only','Capital de referência':'Reference capital','Risco por sinal':'Risk per signal','Aguardando um sinal técnico confirmado…':'Waiting for a confirmed technical signal…',
      '📊 Estratégia Radar':'📊 Radar Strategy','Aguardando sinal…':'Waiting for signal…','👤 Sua carteira':'👤 Your portfolio','↻ Atualizar análise':'↻ Refresh analysis','🔔 Notificações do Radar':'🔔 Radar Notifications',
      'Agora o Radar usa':'Radar now uses','Push 24h pelo servidor':'server-powered 24h Push','📡 ATIVAR PUSH 24H':'📡 ENABLE 24H PUSH','🛰️ TESTAR PUSH':'🛰️ TEST PUSH','🔒 TESTAR BLOQUEADO':'🔒 TEST LOCKED',
      '🧪 TESTAR LOCAL':'🧪 TEST LOCAL','📲 INSTALAR APP':'📲 INSTALL APP','Notificações ainda não ativadas.':'Notifications not enabled yet.','Push servidor: verificando…':'Server Push: checking…','Agendador externo:':'External scheduler:',
      'Segundo plano local: preparando…':'Local background: preparing…','🚨 Alarme Inteligente V2':'🚨 Smart Alarm V2','CARTEIRA + MERCADO':'PORTFOLIO + MARKET','Analisando sinais e buscando confirmações…':'Analyzing signals and looking for confirmations…',
      '⭐ Destaques agora':'⭐ Highlights now','Buscando os melhores destaques…':'Finding the best highlights…','💰 Quanto investir':'💰 How much to invest','Recalcular':'Recalculate','🤖 Movimentação inteligente da carteira':'🤖 Smart portfolio movement',
      'Aguardando dados da carteira e do mercado…':'Waiting for portfolio and market data…','🏆 Melhores oportunidades agora':'🏆 Best opportunities now','Buscando oportunidades…':'Searching opportunities…','✨ NOVO • CARTEIRA POR PRINT':'✨ NEW • PORTFOLIO FROM SCREENSHOT',
      'EXTRA':'EXTRA','📸 Atualizar minha carteira por print':'📸 Update my portfolio from screenshot','Envie o print':'Upload the screenshot','da sua carteira':'of your portfolio','Revise os ativos':'Review assets','confira moedas e quantidades':'check coins and quantities',
      'Confirmar':'Confirm','e atualizar':'and update','Carregar print da carteira':'Upload portfolio screenshot','Selecione uma imagem com as moedas e as quantidades visíveis.':'Select an image showing the coins and quantities.',
      'Imagem selecionada':'Image selected','Pronta para leitura':'Ready to read','📤 CARREGAR PRINT DA CARTEIRA':'📤 UPLOAD PORTFOLIO SCREENSHOT','Adicionar manualmente':'Add manually','Inserir moedas e quantidades':'Enter coins and quantities',
      'Importar lista do ChatGPT':'Import ChatGPT list','Cole a lista recebida':'Paste the received list','Pronto para receber um print da sua carteira.':'Ready to receive a screenshot of your portfolio.','Preparando leitura…':'Preparing reading…','Fechar':'Close',
      'Use esta opção quando o OCR não reconhecer o print corretamente. Cole uma moeda por linha.':'Use this option when OCR does not correctly recognize the screenshot. Paste one coin per line.','Confira antes de salvar':'Review before saving',
      'Corrija qualquer moeda ou quantidade antes de confirmar.':'Correct any coin or quantity before confirming.','+ Adicionar linha':'+ Add row','✓ CONFIRMAR E ATUALIZAR':'✓ CONFIRM AND UPDATE','Valor aproximado da carteira':'Approximate portfolio value','Atualização automática':'Automatic update',
      '⚡ Conectando tempo real…':'⚡ Connecting real time…','RADAR SOCIAL':'SOCIAL RADAR','Boatos e notícias do mercado':'Market rumors and news','ao vivo':'live','Minha carteira':'My portfolio','Confirmados':'Confirmed','Buscando informações públicas do mercado…':'Searching public market information…',
      'Diagnóstico das fontes':'Source diagnostics','O app tenta as fontes em sequência. A primeira que responder com dados válidos é usada.':'The app tries sources in sequence. The first one that returns valid data is used.','🌐 Radar geral de tendências':'🌐 General trend radar',
      'Fonte automática':'Automatic source','Análise no aplicativo':'In-app analysis','Radar integrado':'Integrated Radar','Decisão':'Decision','Você confirma':'You confirm','📊 V8 • Backtest & Calibração':'📊 V8 • Backtest & Calibration','HISTÓRICO REAL':'REAL HISTORY',
      'Moeda':'Coin','Período':'Period','30 dias':'30 days','60 dias':'60 days','90 dias':'90 days','Taxa %/lado':'Fee %/side','Slippage %/lado':'Slippage %/side','RODAR BACKTEST':'RUN BACKTEST','Aguardando backtest.':'Waiting for backtest.',
      'Correlação/exposição: aguardando dados.':'Correlation/exposure: waiting for data.','Saúde dos dados: verificando…':'Data health: checking…','🧪 Paper Trading & Validação':'🧪 Paper Trading & Validation','SEM ORDENS REAIS':'NO REAL ORDERS','Capital simulado (US$)':'Simulated capital (US$)',
      'Risco/operação (%)':'Risk/trade (%)','ZERAR PAPER':'RESET PAPER','Motor do Paper: iniciando…':'Paper engine: starting…','📓 Diário automático':'📓 Automatic journal','Derivativos: aguardando ativos elegíveis.':'Derivatives: waiting for eligible assets.','Proteção':'Protection','Importante':'Important','Menu':'Menu',
      'Idioma':'Language','Automático (dispositivo)':'Automatic (device)','Português (Brasil)':'Portuguese (Brazil)','Inglês':'English','Espanhol':'Spanish','Idioma do aplicativo':'App language','Escolha o idioma da interface e das notificações.':'Choose the language for the interface and notifications.'
    },
    es:{
      'acesso protegido':'acceso protegido','Primeira configuração':'Primera configuración','Crie seu acesso':'Crea tu acceso','Usuário ou e-mail':'Usuario o correo','Senha':'Contraseña','Confirmar senha':'Confirmar contraseña','Seu usuário':'Tu usuario','Mínimo de 8 caracteres':'Mínimo 8 caracteres','Digite novamente':'Escríbela de nuevo',
      'Ativar biometria neste aparelho':'Activar biometría en este dispositivo','Quando disponível, o Android usará digital, rosto ou o bloqueio seguro do aparelho.':'Cuando esté disponible, Android usará huella, rostro o el bloqueo seguro del dispositivo.','Criar acesso protegido':'Crear acceso protegido','Área protegida':'Área protegida','Desbloquear Radar':'Desbloquear Radar','Usuário':'Usuario','Conta local deste aparelho':'Cuenta local de este dispositivo','◉ Entrar com biometria':'◉ Entrar con biometría','ou use sua senha':'o usa tu contraseña','Entrar':'Entrar','Usar PIN':'Usar PIN','PIN de 4 a 6 números':'PIN de 4 a 6 números','Desbloquear com PIN':'Desbloquear con PIN','Sua senha':'Tu contraseña',
      'Navegação adaptativa':'Navegación adaptativa','Principal':'Principal','Início':'Inicio','Resumo e destaques':'Resumen y destacados','Carteira':'Cartera','Print, aporte e posições':'Captura, aportes y posiciones','Mercado':'Mercado','Ranking, notícias e tendências':'Ranking, noticias y tendencias','Alertas':'Alertas','Alarmes e notificações':'Alarmas y notificaciones','IA Radar':'IA Radar','Análise da carteira':'Análisis de cartera','Segurança':'Seguridad','Senha, PIN e biometria':'Contraseña, PIN y biometría','PRO Anual':'PRO Anual','IA, Push 24h, sinais e ferramentas avançadas':'IA, Push 24h, señales y herramientas avanzadas','Profissional':'Profesional','Motor':'Motor','V10/V11 e diagnóstico':'V10/V11 y diagnóstico','Histórico e calibração':'Historial y calibración','Validação sem ordens reais':'Validación sin órdenes reales','Sistema':'Sistema','Fontes, proteção e saúde':'Fuentes, protección y salud','Nível da interface':'Nivel de interfaz','🙂 Amador':'🙂 Principiante','⚙️ Profissional':'⚙️ Profesional',
      'PRIMEIRO ACESSO':'PRIMER ACCESO','Como você quer usar o Radar?':'¿Cómo quieres usar Radar?','Modo Amador':'Modo Principiante','USAR MODO AMADOR':'USAR MODO PRINCIPIANTE','Modo Profissional':'Modo Profesional','USAR MODO PROFISSIONAL':'USAR MODO PROFESIONAL','painel inteligente de mercado':'panel inteligente de mercado','RADAR ATIVO':'RADAR ACTIVO','Visão geral':'Vista general','Iniciando…':'Iniciando…','Segundo plano: iniciando…':'Segundo plano: iniciando…','ÁREA ATUAL':'ÁREA ACTUAL','Amador':'Principiante','Pro':'Pro','INTERFACE SIMPLIFICADA':'INTERFAZ SIMPLIFICADA',
      'Plano Anual':'Plan Anual','Libere os recursos avançados e mantenha o Radar trabalhando 24h.':'Desbloquea los recursos avanzados y mantén Radar trabajando 24/7.','PLANO ANUAL':'PLAN ANUAL','R$ 99,90/ano':'R$ 99,90/año','IA Radar avançada':'IA Radar avanzada','Análises e diagnóstico.':'Análisis y diagnóstico.','Push 24h':'Push 24h','Alertas com app fechado.':'Alertas con la app cerrada.','Espelhamento':'Replicación inteligente','Sinais e simulação proporcional.':'Señales y simulación proporcional.','Sinais PRO':'Señales PRO','Pullback, motor e filtros avançados.':'Pullback, motor y filtros avanzados.','ASSINAR PRO ANUAL':'SUSCRIBIR PRO ANUAL','RESTAURAR COMPRA':'RESTAURAR COMPRA','GERENCIAR':'GESTIONAR','Verificando Google Play Billing…':'Verificando Google Play Billing…','Desbloqueie o Radar completo':'Desbloquea Radar completo','Uma assinatura anual, cobrada e gerenciada pelo Google Play.':'Una suscripción anual, cobrada y gestionada por Google Play.','✓ IA Radar avançada e Modo Profissional':'✓ IA Radar avanzada y Modo Profesional','✓ Push 24h e alertas com tela bloqueada':'✓ Push 24h y alertas con pantalla bloqueada','✓ Espelhamento Inteligente e sinais PRO':'✓ Replicación Inteligente y señales PRO','✓ Motor V10/V11, backtest e Paper Trading':'✓ Motor V10/V11, backtest y Paper Trading','ASSINAR AGORA':'SUSCRIBIR AHORA','JÁ ASSINEI / RESTAURAR':'YA ME SUSCRIBÍ / RESTAURAR',
      'Segurança do acesso':'Seguridad de acceso','Gerencie a proteção local do Cripto Radar neste aparelho.':'Gestiona la protección local de Cripto Radar en este dispositivo.','PROTEGIDO':'PROTEGIDO','Conta':'Cuenta','Biometria':'Biometría','Bloqueio':'Bloqueo','Biometria do aparelho':'Biometría del dispositivo','Ativar / atualizar biometria':'Activar / actualizar biometría','Remover':'Eliminar','PIN rápido':'PIN rápido','4 a 6 números':'4 a 6 números','Salvar':'Guardar','Bloqueio automático':'Bloqueo automático','Proteção de sessão':'Protección de sesión','Bloquear após inatividade':'Bloquear tras inactividad','1 minuto':'1 minuto','5 minutos':'5 minutos','15 minutos':'15 minutos','30 minutos':'30 minutos','Bloquear em segundo plano após 30 segundos':'Bloquear en segundo plano después de 30 segundos','Trocar senha':'Cambiar contraseña','Exige a senha atual':'Requiere la contraseña actual','Alterar senha':'Cambiar contraseña','Bloquear aplicativo agora':'Bloquear la app ahora',
      'PATRIMÔNIO MONITORADO':'PATRIMONIO MONITOREADO','Carregando…':'Cargando…','atualização automática pela carteira':'actualización automática por la cartera','Abrir carteira':'Abrir cartera','Alarme':'Alarma','Analisando…':'Analizando…','Top oportunidade':'Mejor oportunidad','Buscando…':'Buscando…','LEITURA DO RADAR':'LECTURA DEL RADAR','MODO AMADOR':'MODO PRINCIPIANTE','O Radar está reunindo as primeiras leituras do mercado.':'Radar está reuniendo las primeras lecturas del mercado.','Acesso rápido':'Acceso rápido','toque para abrir':'toca para abrir','Posições e aporte':'Posiciones y aportes','Ranking e tendências':'Ranking y tendencias','Risco e oportunidade':'Riesgo y oportunidad','Leitura orientada':'Lectura guiada','Dados':'Datos','Carregando':'Cargando','Melhor sinal':'Mejor señal','Notificações':'Notificaciones','Inicializando diagnóstico…':'Inicializando diagnóstico…','Iniciando':'Iniciando','Preço':'Precio','Sinal':'Señal','🔔 TESTAR NOTIFICAÇÃO':'🔔 PROBAR NOTIFICACIÓN','Executando diagnóstico…':'Ejecutando diagnóstico…','Live':'En vivo','Conectando':'Conectando','Sinais avaliados':'Señales evaluadas','Acertos (após 1h)':'Aciertos (después de 1h)','Aguardando':'Esperando','Proteção diária':'Protección diaria','Ranking atual':'Ranking actual','Aguardando sinais…':'Esperando señales…','Iniciando IA…':'Iniciando IA…','Carregando análise do mercado…':'Cargando análisis del mercado…','PERGUNTAR':'PREGUNTAR','Informativo: não executa compras ou vendas e não garante retorno.':'Informativo: no ejecuta compras ni ventas y no garantiza rentabilidad.',
      '🪞 Espelhamento Inteligente':'🪞 Replicación Inteligente','SIMULAÇÃO':'SIMULACIÓN','🧪 Simulação':'🧪 Simulación','🔔 Só alertas':'🔔 Solo alertas','Capital de referência':'Capital de referencia','Risco por sinal':'Riesgo por señal','Aguardando um sinal técnico confirmado…':'Esperando una señal técnica confirmada…','📊 Estratégia Radar':'📊 Estrategia Radar','Aguardando sinal…':'Esperando señal…','👤 Sua carteira':'👤 Tu cartera','↻ Atualizar análise':'↻ Actualizar análisis','🔔 Notificações do Radar':'🔔 Notificaciones de Radar','Agora o Radar usa':'Ahora Radar usa','Push 24h pelo servidor':'Push 24h desde el servidor','📡 ATIVAR PUSH 24H':'📡 ACTIVAR PUSH 24H','🛰️ TESTAR PUSH':'🛰️ PROBAR PUSH','🔒 TESTAR BLOQUEADO':'🔒 PROBAR BLOQUEADO','🧪 TESTAR LOCAL':'🧪 PROBAR LOCAL','📲 INSTALAR APP':'📲 INSTALAR APP','Notificações ainda não ativadas.':'Notificaciones aún no activadas.','Push servidor: verificando…':'Push del servidor: verificando…','Agendador externo:':'Programador externo:','Segundo plano local: preparando…':'Segundo plano local: preparando…','🚨 Alarme Inteligente V2':'🚨 Alarma Inteligente V2','CARTEIRA + MERCADO':'CARTERA + MERCADO','Analisando sinais e buscando confirmações…':'Analizando señales y buscando confirmaciones…','⭐ Destaques agora':'⭐ Destacados ahora','Buscando os melhores destaques…':'Buscando los mejores destacados…','💰 Quanto investir':'💰 Cuánto invertir','Recalcular':'Recalcular','🤖 Movimentação inteligente da carteira':'🤖 Movimiento inteligente de la cartera','Aguardando dados da carteira e do mercado…':'Esperando datos de cartera y mercado…','🏆 Melhores oportunidades agora':'🏆 Mejores oportunidades ahora','Buscando oportunidades…':'Buscando oportunidades…',
      '✨ NOVO • CARTEIRA POR PRINT':'✨ NUEVO • CARTERA POR CAPTURA','📸 Atualizar minha carteira por print':'📸 Actualizar mi cartera por captura','Envie o print':'Sube la captura','da sua carteira':'de tu cartera','Revise os ativos':'Revisa los activos','confira moedas e quantidades':'comprueba monedas y cantidades','Confirmar':'Confirmar','e atualizar':'y actualizar','Carregar print da carteira':'Subir captura de cartera','Selecione uma imagem com as moedas e as quantidades visíveis.':'Selecciona una imagen con las monedas y cantidades visibles.','Imagem selecionada':'Imagen seleccionada','Pronta para leitura':'Lista para lectura','📤 CARREGAR PRINT DA CARTEIRA':'📤 SUBIR CAPTURA DE CARTERA','Adicionar manualmente':'Añadir manualmente','Inserir moedas e quantidades':'Introducir monedas y cantidades','Importar lista do ChatGPT':'Importar lista de ChatGPT','Cole a lista recebida':'Pega la lista recibida','Pronto para receber um print da sua carteira.':'Listo para recibir una captura de tu cartera.','Preparando leitura…':'Preparando lectura…','Fechar':'Cerrar','Confira antes de salvar':'Revisa antes de guardar','Corrija qualquer moeda ou quantidade antes de confirmar.':'Corrige cualquier moneda o cantidad antes de confirmar.','+ Adicionar linha':'+ Añadir fila','✓ CONFIRMAR E ATUALIZAR':'✓ CONFIRMAR Y ACTUALIZAR','Valor aproximado da carteira':'Valor aproximado de la cartera','Atualização automática':'Actualización automática','⚡ Conectando tempo real…':'⚡ Conectando en tiempo real…','RADAR SOCIAL':'RADAR SOCIAL','Boatos e notícias do mercado':'Rumores y noticias del mercado','ao vivo':'en vivo','Minha carteira':'Mi cartera','Confirmados':'Confirmados','Buscando informações públicas do mercado…':'Buscando información pública del mercado…','Diagnóstico das fontes':'Diagnóstico de fuentes','O app tenta as fontes em sequência. A primeira que responder com dados válidos é usada.':'La app prueba las fuentes en secuencia. Se usa la primera que responda con datos válidos.','🌐 Radar geral de tendências':'🌐 Radar general de tendencias','Fonte automática':'Fuente automática','Análise no aplicativo':'Análisis en la app','Radar integrado':'Radar integrado','Decisão':'Decisión','Você confirma':'Tú confirmas','📊 V8 • Backtest & Calibração':'📊 V8 • Backtest y Calibración','HISTÓRICO REAL':'HISTORIAL REAL','Moeda':'Moneda','Período':'Período','30 dias':'30 días','60 dias':'60 días','90 dias':'90 días','Taxa %/lado':'Comisión %/lado','Slippage %/lado':'Slippage %/lado','RODAR BACKTEST':'EJECUTAR BACKTEST','Aguardando backtest.':'Esperando backtest.','Correlação/exposição: aguardando dados.':'Correlación/exposición: esperando datos.','Saúde dos dados: verificando…':'Salud de datos: verificando…','🧪 Paper Trading & Validação':'🧪 Paper Trading y Validación','SEM ORDENS REAIS':'SIN ÓRDENES REALES','Capital simulado (US$)':'Capital simulado (US$)','Risco/operação (%)':'Riesgo/operación (%)','ZERAR PAPER':'REINICIAR PAPER','Motor do Paper: iniciando…':'Motor de Paper: iniciando…','📓 Diário automático':'📓 Diario automático','Derivativos: aguardando ativos elegíveis.':'Derivados: esperando activos elegibles.','Proteção':'Protección','Importante':'Importante','Menu':'Menú',
      'Idioma':'Idioma','Automático (dispositivo)':'Automático (dispositivo)','Português (Brasil)':'Portugués (Brasil)','Inglês':'Inglés','Espanhol':'Español','Idioma do aplicativo':'Idioma de la aplicación','Escolha o idioma da interface e das notificações.':'Elige el idioma de la interfaz y de las notificaciones.'
    }
  };

  // V19.1: strings do novo formulário responsivo de aporte.
  Object.assign(STRINGS.en, {
    'Analisar aporte':'Analyze contribution',
    'Valor do novo aporte (R$)':'New contribution amount (BRL)',
    'Valor do aporte em reais':'Contribution amount in BRL',
    'Simular aporte':'Simulate contribution',
    '💰 Simulador de aporte':'💰 Contribution simulator',
    'Informe quanto deseja investir. O Radar compara sua carteira, o mercado e os riscos para simular cenários conservador, equilibrado e agressivo.':'Enter how much you want to invest. Radar compares your portfolio, the market and risks to simulate conservative, balanced and aggressive scenarios.'
  });
  Object.assign(STRINGS.es, {
    'Analisar aporte':'Analizar aporte',
    'Valor do novo aporte (R$)':'Importe del nuevo aporte (BRL)',
    'Valor do aporte em reais':'Importe del aporte en reales',
    'Simular aporte':'Simular aporte',
    '💰 Simulador de aporte':'💰 Simulador de aportes',
    'Informe quanto deseja investir. O Radar compara sua carteira, o mercado e os riscos para simular cenários conservador, equilibrado e agressivo.':'Introduce cuánto quieres invertir. Radar compara tu cartera, el mercado y los riesgos para simular escenarios conservadores, equilibrados y agresivos.'
  });
  const FALLBACK={
    en:[['Aguardando','Waiting'],['Carregando','Loading'],['Buscando','Searching'],['Iniciando','Starting'],['Atualizando','Updating'],['Atualizado','Updated'],['Falha ao','Failed to'],['Falha no','Failure in'],['Nenhum sinal confirmado agora.','No confirmed signal right now.'],['Capital detectado para simulação.','Capital detected for simulation.'],['Entrada','Entry'],['Alvo','Target'],['Risco no stop','Stop risk'],['Projeção no alvo','Target projection'],['Exposição','Exposure'],['Valor proporcional','Proportional amount'],['Risco efetivo','Effective risk'],['Risco : retorno','Risk : reward'],['possível continuação da alta','possible bullish continuation'],['possível continuação da baixa','possible bearish continuation'],['sinal técnico','technical signal'],['mercado indisponível','market unavailable']],
    es:[['Aguardando','Esperando'],['Carregando','Cargando'],['Buscando','Buscando'],['Iniciando','Iniciando'],['Atualizando','Actualizando'],['Atualizado','Actualizado'],['Falha ao','Error al'],['Falha no','Error en'],['Nenhum sinal confirmado agora.','No hay señal confirmada ahora.'],['Capital detectado para simulação.','Capital detectado para simulación.'],['Entrada','Entrada'],['Alvo','Objetivo'],['Risco no stop','Riesgo en stop'],['Projeção no alvo','Proyección al objetivo'],['Exposição','Exposición'],['Valor proporcional','Valor proporcional'],['Risco efetivo','Riesgo efectivo'],['Risco : retorno','Riesgo : retorno'],['possível continuação da alta','posible continuación alcista'],['possível continuação da baixa','posible continuación bajista'],['sinal técnico','señal técnica'],['mercado indisponível','mercado no disponible']]
  };


  // Navegação inferior em caixa alta, incluindo rótulos adicionados depois do V16.
  Object.assign(STRINGS.en, {'INÍCIO':'HOME','CARTEIRA':'PORTFOLIO','MERCADO':'MARKET','ALERTAS':'ALERTS','MENU':'MENU',
    'CENTRAL DO RADAR':'RADAR CENTER','AO VIVO':'LIVE','MONITORANDO':'MONITORING','CONFIGURAÇÕES':'SETTINGS',
    'COMPRA CONFIRMADA':'CONFIRMED BUY','EM OBSERVAÇÃO':'ON WATCH','PLANO ANUAL':'ANNUAL PLAN',
    'A IA usa a mesma decisão para carteira, aporte e oportunidades: sem confirmação técnica, não mostra “aportar” nem “oportunidade confirmada”.':'The AI uses one decision for portfolio, contributions and opportunities. Without technical confirmation it does not recommend new contributions.'});
  Object.assign(STRINGS.es, {'INÍCIO':'INICIO','CARTEIRA':'CARTERA','MERCADO':'MERCADO','ALERTAS':'ALERTAS','MENU':'MENÚ',
    'CENTRAL DO RADAR':'CENTRO DEL RADAR','AO VIVO':'EN VIVO','MONITORANDO':'MONITOREANDO','CONFIGURAÇÕES':'AJUSTES',
    'EM OBSERVAÇÃO':'EN OBSERVACIÓN','PLANO ANUAL':'PLAN ANUAL',
    'A IA usa a mesma decisão para carteira, aporte e oportunidades: sem confirmação técnica, não mostra “aportar” nem “oportunidade confirmada”.':'La IA utiliza la misma decisión para la cartera, los aportes y las oportunidades. Sin confirmación técnica, no recomienda aportar.'});
  /* V19: novos rótulos de Carteira/Alertas, inclusive HTML regenerado. */
  Object.assign(STRINGS.en, {
  "Idioma da interface": "Interface language",
  "Idioma do aplicativo": "App language",
  "Escolha o idioma da interface.": "Choose the app language.",
  "Escolha o idioma da interface e das notificações.": "Choose the language for the interface and notifications.",
  "ÁREA ATUAL": "CURRENT VIEW",
  "Área atual": "Current view",
  "RADAR ATIVO": "RADAR LIVE",
  "Navegação adaptativa": "Adaptive navigation",
  "Resumo e destaques": "Summary and highlights",
  "CENTRAL DO RADAR": "RADAR CENTER",
  "Visão rápida": "Quick overview",
  "AO VIVO": "LIVE",
  "Alarme": "Alarm",
  "Leitura do Radar": "Radar insights",
  "Visão geral": "Overview",
  "Minha carteira": "My portfolio",
  "Carteira": "Portfolio",
  "Mercado": "Market",
  "Alertas": "Alerts",
  "Configurações": "Settings",
  "Início": "Home",
  "Idioma": "Language",
  "Valor estimado": "Estimated value",
  "Patrimônio total": "Total portfolio",
  "Valor da carteira": "Portfolio value",
  "PATRIMÔNIO MONITORADO": "TRACKED PORTFOLIO",
  "Abrir carteira": "Open portfolio",
  "Acesso rápido": "Quick access",
  "toque para abrir": "tap to open",
  "Mudança estimada em 24h": "Estimated 24h change",
  "Resultado não realizado": "Unrealized P&L",
  "Reserva estável": "Stablecoin reserve",
  "Sem cotação": "Price unavailable",
  "Cadastre os preços médios": "Enter average purchase prices",
  "Dados 24h insuficientes": "Insufficient 24h data",
  "Dados não atualizados": "Outdated data",
  "Dados pendentes": "Pending data",
  "⚠️ Dados parciais": "⚠️ Partial data",
  "Atualização do mercado": "Market update",
  "Posições cadastradas": "Positions recorded",
  "Sem preços válidos": "No valid prices",
  "Quantidade": "Quantity",
  "Preço atual": "Current price",
  "Qualidade técnica": "Technical quality",
  "Risco técnico": "Technical risk",
  "Preço médio de compra (R$ por unidade)": "Average buy price (BRL per unit)",
  "(sem preço médio)": "(no cost basis)",
  "Salvar": "Save",
  "Limpar": "Clear",
  "Pesquisar moeda": "Search coin",
  "Pesquisar": "Search",
  "Todas as moedas": "All coins",
  "Todas": "All",
  "Maior valor": "Highest value",
  "Nome A-Z": "Name A–Z",
  "Maior alta 24h": "Biggest 24h gain",
  "Maior risco": "Highest risk",
  "Maior lucro": "Highest profit",
  "Recalcular": "Recalculate",
  "Exportar CSV": "Export CSV",
  "Participação": "Allocation",
  "Distribuição da carteira": "Portfolio allocation",
  "Risco e concentração": "Risk and concentration",
  "Concentração": "Concentration",
  "Lucro e prejuízo": "Profit and loss",
  "Moeda estável, usada como reserva. Ainda pode variar em BRL.": "Stablecoin used as reserve. Its BRL value may still vary.",
  "A cotação não está atualizada. Não há sinal de compra válido.": "The price is outdated. There is no valid buy signal.",
  "Sinal técnico confirmado pelo motor atual. Não é garantia de retorno.": "Technical signal confirmed by the engine; returns are not guaranteed.",
  "Aguardando mais confluência técnica para uma entrada.": "Waiting for additional technical confirmation before entry.",
  "Opcional e salvo apenas neste aparelho; ajuste se comprar ou vender ativos.": "Optional and stored only on this device. Update after trading.",
  "COMPRA CONFIRMADA": "CONFIRMED BUY",
  "EVITAR ENTRADA": "AVOID BUY",
  "CANDIDATA • AGUARDANDO": "CANDIDATE • WAITING",
  "CANDIDATA A COMPRA": "BUY CANDIDATE",
  "OBSERVAR": "WATCH",
  "RESERVA": "RESERVE",
  "DADOS PENDENTES": "DATA PENDING",
  "Pendente": "Pending",
  "Dados indisponíveis": "Data unavailable",
  "Sem sinal": "No signal",
  "Central de Alertas": "Alert Center",
  "CENTRAL DE ALERTAS": "ALERT CENTER",
  "Central de alertas": "Alert center",
  "ALERTAS INTELIGENTES": "SMART ALERTS",
  "Alertas da carteira": "Portfolio alerts",
  "Somente importantes": "Important only",
  "MAIOR PRIORIDADE AGORA": "HIGHEST PRIORITY NOW",
  "STATUS DA CARTEIRA": "PORTFOLIO STATUS",
  "RISCO CRÍTICO": "CRITICAL RISK",
  "QUEDA FORTE CONFIRMADA": "CONFIRMED SHARP DROP",
  "AVALIAR REALIZAÇÃO": "CONSIDER TAKING PROFITS",
  "REVISAR REDUÇÃO": "REVIEW REDUCTION",
  "VENDA / PROTEÇÃO": "SELL / PROTECT",
  "RISCO": "RISK",
  "EM OBSERVAÇÃO": "WATCHING",
  "COMPRA": "BUY",
  "VENDA": "SELL",
  "Observação": "Watchlist",
  "Marcar como lido": "Mark as read",
  "Marcar todos como lidos": "Mark all as read",
  "✓ Lido": "✓ Read",
  "• Lido": "• Read",
  "• Novo sinal": "• New signal",
  "Novo sinal": "New signal",
  "Tipo": "Type",
  "Orientação:": "Guidance:",
  "Atualizado": "Updated",
  "Atualizar": "Refresh",
  "↻ Atualizar": "↻ Refresh",
  "Aguardando dados recentes": "Waiting for recent data",
  "Nenhum sinal confirmado agora": "No confirmed signal now",
  "Nenhum sinal confirmado agora.": "No confirmed signal now.",
  "Sem alertas que atendam aos critérios atuais. A análise continua monitorando o mercado.": "No alerts meet the current criteria. Monitoring continues.",
  "Nenhum sinal corresponde ao filtro selecionado.": "No alerts match this filter.",
  "Ainda sem dados recentes ou sinais verificáveis.": "No recent data or verifiable signals yet.",
  "Nenhuma mudança registrada neste aparelho ainda.": "No changes recorded on this device yet.",
  "Notificações:": "Notifications:",
  "Permitidas no navegador": "Allowed in browser",
  "Bloqueadas no aparelho": "Blocked on device",
  "Aguardando autorização": "Awaiting permission",
  "Indisponíveis": "Unavailable",
  "Push 24h: verificar servidor abaixo": "Push 24h: check server below",
  "Falta confirmar:": "Still required:",
  "Confluência técnica": "Technical alignment",
  "Simulação inteligente de aporte": "Smart contribution simulator",
  "Ranking técnico do mercado": "Market technical ranking",
  "O que evitar ou esperar": "What to avoid or wait for",
  "Divisão sugerida": "Suggested allocation",
  "Reserva estratégica": "Strategic reserve",
  "Aporte": "Contribution",
  "Perfil": "Profile",
  "Objetivo": "Goal",
  "Entrada": "Entry",
  "Agora": "Now",
  "Em correção": "On pullback",
  "Na confirmação": "On confirmation",
  "Conservador": "Conservative",
  "Equilibrado": "Balanced",
  "Agressivo": "Aggressive",
  "Proteção": "Protection",
  "Equilíbrio": "Balance",
  "Crescimento": "Growth",
  "Parcelada": "Phased",
  "Só após confirmação": "Only after confirmation",
  "Mais imediata": "Earlier entry",
  "Qualidade": "Quality",
  "Tendência": "Trend",
  "Momentum": "Momentum",
  "Liquidez": "Liquidity",
  "Timing": "Timing",
  "Nova atualização disponível": "New update available",
  "Preferências salvas automaticamente neste aparelho.": "Settings saved automatically on this device.",
  "Ver plano PRO": "View PRO plan",
  "Área protegida": "Secure area",
  "MODO AMADOR": "BEGINNER MODE",
  "Modo Amador": "Beginner Mode",
  "Modo Profissional": "Professional Mode",
  "Dados recebidos": "Data received",
  "Aguardando confirmação": "Waiting for confirmation",
  "Dados parciais": "Partial data",
  "Risco baixo": "Low risk",
  "Risco médio": "Medium risk",
  "Risco alto": "High risk"
});
  Object.assign(STRINGS.es, {
  "Idioma da interface": "Idioma de la interfaz",
  "Idioma do aplicativo": "Idioma de la aplicación",
  "Escolha o idioma da interface.": "Elige el idioma de la interfaz.",
  "Escolha o idioma da interface e das notificações.": "Elige el idioma de la interfaz y las notificaciones.",
  "ÁREA ATUAL": "VISTA ACTUAL",
  "RADAR ATIVO": "RADAR ACTIVO",
  "CENTRAL DO RADAR": "CENTRO DEL RADAR",
  "Visão rápida": "Vista rápida",
  "AO VIVO": "EN VIVO",
  "Valor estimado": "Valor estimado",
  "Patrimônio total": "Patrimonio total",
  "Valor da carteira": "Valor de la cartera",
  "PATRIMÔNIO MONITORADO": "PATRIMONIO MONITOREADO",
  "Abrir carteira": "Abrir cartera",
  "Acesso rápido": "Acceso rápido",
  "toque para abrir": "toca para abrir",
  "Mudança estimada em 24h": "Cambio estimado en 24 h",
  "Resultado não realizado": "Ganancia/pérdida no realizada",
  "Reserva estável": "Reserva estable",
  "Sem cotação": "Sin cotización",
  "Cadastre os preços médios": "Registra los precios medios",
  "Dados 24h insuficientes": "Datos de 24 h insuficientes",
  "Dados não atualizados": "Datos desactualizados",
  "Dados pendentes": "Datos pendientes",
  "⚠️ Dados parciais": "⚠️ Datos parciales",
  "Atualização do mercado": "Actualización de mercado",
  "Posições cadastradas": "Posiciones registradas",
  "Sem preços válidos": "Sin precios válidos",
  "Quantidade": "Cantidad",
  "Preço atual": "Precio actual",
  "Qualidade técnica": "Calidad técnica",
  "Risco técnico": "Riesgo técnico",
  "Preço médio de compra (R$ por unidade)": "Precio medio de compra (BRL por unidad)",
  "(sem preço médio)": "(sin precio medio)",
  "Salvar": "Guardar",
  "Limpar": "Limpiar",
  "Pesquisar moeda": "Buscar moneda",
  "Pesquisar": "Buscar",
  "Todas as moedas": "Todas las monedas",
  "Todas": "Todas",
  "Maior valor": "Mayor valor",
  "Nome A-Z": "Nombre A–Z",
  "Maior alta 24h": "Mayor subida 24 h",
  "Maior risco": "Mayor riesgo",
  "Maior lucro": "Mayor ganancia",
  "Recalcular": "Recalcular",
  "Exportar CSV": "Exportar CSV",
  "Participação": "Participación",
  "Distribuição da carteira": "Distribución de cartera",
  "Risco e concentração": "Riesgo y concentración",
  "Concentração": "Concentración",
  "Lucro e prejuízo": "Ganancias y pérdidas",
  "Moeda estável, usada como reserva. Ainda pode variar em BRL.": "Moneda estable usada como reserva. Su valor en BRL puede variar.",
  "A cotação não está atualizada. Não há sinal de compra válido.": "La cotización está desactualizada. No hay señal de compra válida.",
  "Sinal técnico confirmado pelo motor atual. Não é garantia de retorno.": "Señal técnica confirmada por el motor; no garantiza rentabilidad.",
  "Aguardando mais confluência técnica para uma entrada.": "Esperando más confirmación técnica para entrar.",
  "Opcional e salvo apenas neste aparelho; ajuste se comprar ou vender ativos.": "Opcional; se guarda solo en este dispositivo. Actualízalo tras operar.",
  "COMPRA CONFIRMADA": "COMPRA CONFIRMADA",
  "EVITAR ENTRADA": "EVITAR COMPRA",
  "CANDIDATA • AGUARDANDO": "CANDIDATA • ESPERANDO",
  "CANDIDATA A COMPRA": "CANDIDATA A COMPRA",
  "OBSERVAR": "OBSERVAR",
  "RESERVA": "RESERVA",
  "DADOS PENDENTES": "DATOS PENDIENTES",
  "Central de Alertas": "Centro de Alertas",
  "CENTRAL DE ALERTAS": "CENTRO DE ALERTAS",
  "ALERTAS INTELIGENTES": "ALERTAS INTELIGENTES",
  "Alertas da carteira": "Alertas de cartera",
  "Somente importantes": "Solo importantes",
  "MAIOR PRIORIDADE AGORA": "MÁXIMA PRIORIDAD AHORA",
  "STATUS DA CARTEIRA": "ESTADO DE LA CARTERA",
  "RISCO CRÍTICO": "RIESGO CRÍTICO",
  "QUEDA FORTE CONFIRMADA": "CAÍDA FUERTE CONFIRMADA",
  "AVALIAR REALIZAÇÃO": "EVALUAR TOMA DE GANANCIAS",
  "REVISAR REDUÇÃO": "REVISAR REDUCCIÓN",
  "VENDA / PROTEÇÃO": "VENTA / PROTECCIÓN",
  "RISCO": "RIESGO",
  "EM OBSERVAÇÃO": "EN OBSERVACIÓN",
  "COMPRA": "COMPRA",
  "VENDA": "VENTA",
  "Observação": "Observación",
  "Marcar como lido": "Marcar como leído",
  "Marcar todos como lidos": "Marcar todos como leídos",
  "✓ Lido": "✓ Leído",
  "• Lido": "• Leído",
  "• Novo sinal": "• Nueva señal",
  "Novo sinal": "Nueva señal",
  "Tipo": "Tipo",
  "Orientação:": "Orientación:",
  "Atualizado": "Actualizado",
  "Atualizar": "Actualizar",
  "↻ Atualizar": "↻ Actualizar",
  "Aguardando dados recentes": "Esperando datos recientes",
  "Nenhum sinal confirmado agora": "Ninguna señal confirmada ahora",
  "Nenhum sinal confirmado agora.": "Ninguna señal confirmada ahora.",
  "Sem alertas que atendam aos critérios atuais. A análise continua monitorando o mercado.": "No hay alertas que cumplan los criterios. El monitoreo continúa.",
  "Nenhum sinal corresponde ao filtro selecionado.": "No hay alertas que coincidan con el filtro.",
  "Ainda sem dados recentes ou sinais verificáveis.": "Todavía no hay datos recientes ni señales verificables.",
  "Nenhuma mudança registrada neste aparelho ainda.": "Aún no hay cambios registrados en este dispositivo.",
  "Notificações:": "Notificaciones:",
  "Permitidas no navegador": "Permitidas en el navegador",
  "Bloqueadas no aparelho": "Bloqueadas en el dispositivo",
  "Aguardando autorização": "Esperando permiso",
  "Indisponíveis": "No disponibles",
  "Push 24h: verificar servidor abaixo": "Push 24 h: verifica el servidor abajo",
  "Falta confirmar:": "Falta confirmar:",
  "Simulação inteligente de aporte": "Simulador inteligente de aportes",
  "Ranking técnico do mercado": "Ranking técnico del mercado",
  "O que evitar ou esperar": "Qué evitar o esperar",
  "Divisão sugerida": "Distribución sugerida",
  "Reserva estratégica": "Reserva estratégica",
  "Aporte": "Aporte",
  "Perfil": "Perfil",
  "Objetivo": "Objetivo",
  "Entrada": "Entrada",
  "Agora": "Ahora",
  "Em correção": "En retroceso",
  "Na confirmação": "Con confirmación",
  "Conservador": "Conservador",
  "Equilibrado": "Equilibrado",
  "Agressivo": "Agresivo",
  "Proteção": "Protección",
  "Equilíbrio": "Equilibrio",
  "Crescimento": "Crecimiento",
  "Parcelada": "Escalonada",
  "Só após confirmação": "Solo tras confirmación",
  "Mais imediata": "Entrada más inmediata",
  "Qualidade": "Calidad",
  "Tendência": "Tendencia",
  "Momentum": "Momentum",
  "Liquidez": "Liquidez",
  "Timing": "Timing",
  "Nova atualização disponível": "Nueva actualización disponible",
  "Preferências salvas automaticamente neste aparelho.": "Preferencias guardadas automáticamente en este dispositivo.",
  "Área protegida": "Área protegida",
  "Modo Amador": "Modo Principiante",
  "Modo Profissional": "Modo Profesional",
  "Dados recebidos": "Datos recibidos",
  "Aguardando confirmação": "Esperando confirmación",
  "Dados parciais": "Datos parciales",
  "Risco baixo": "Riesgo bajo",
  "Risco médio": "Riesgo medio",
  "Risco alto": "Riesgo alto"
});

  function resolve(choice){
    if(choice&&choice!=='auto')return ['en','es','pt-BR'].includes(choice)?choice:'pt-BR';
    const n=(navigator.language||'pt-BR').toLowerCase();
    if(n.startsWith('en'))return'en'; if(n.startsWith('es'))return'es'; return'pt-BR';
  }
  const PHRASES={
    en:[['Falta confirmar:','Still required:'],[' do total',' of total'],[' da carteira',' of portfolio'],[' em 24h',' in 24h'],[' ativo(s)',' asset(s)'],[' sinal(is)',' signal(s)'],[' último ciclo',' last run'],[' preço médio',' average price'],[' cotação desatualizada',' stale quotation'],[' • Novo sinal',' • New signal'],['Nenhuma compra confirmada agora','No confirmed buy right now'],['CANDIDATA • AGUARDANDO','CANDIDATE • WAITING']],
    es:[['Falta confirmar:','Falta confirmar:'],[' do total',' del total'],[' da carteira',' de la cartera'],[' em 24h',' en 24 h'],[' ativo(s)',' activo(s)'],[' sinal(is)',' señal(es)'],[' último ciclo',' último ciclo'],[' preço médio',' precio medio'],[' cotação desatualizada',' cotización desactualizada'],[' • Novo sinal',' • Nueva señal'],['Nenhuma compra confirmada agora','Ninguna compra confirmada ahora']]
  };
  function tr(original,lang){
    if(lang==='pt-BR')return original;
    const exact=STRINGS[lang]?.[original]; if(exact!==undefined)return exact;
    let out=original;
    for(const [a,b] of PHRASES[lang]||[]){if(out.includes(a))out=out.split(a).join(b);}
    for(const [a,b] of FALLBACK[lang]||[]){if(out.includes(a))out=out.split(a).join(b);}
    return out;
  }
  const textState=new WeakMap(), attrState=new WeakMap();
  let internalWrite=false;
  function textRecord(node){
    const cur=node.nodeValue||''; let r=textState.get(node);
    if(!r||cur!==r.lastApplied)r={base:cur,lastApplied:cur};
    textState.set(node,r); return r;
  }
  function attrRecord(el,a){
    const cur=el.getAttribute(a); let all=attrState.get(el)||{},r=all[a];
    if(!r||cur!==r.lastApplied)r={base:cur,lastApplied:cur}; all[a]=r;attrState.set(el,all);return r;
  }
  function translateText(node,lang){
    const r=textRecord(node),base=r.base||'',trim=base.trim(); if(!trim)return;
    const out=tr(trim,lang),left=base.match(/^\s*/)?.[0]||'',right=base.match(/\s*$/)?.[0]||'';
    const val=left+out+right; if(node.nodeValue!==val){internalWrite=true;node.nodeValue=val;internalWrite=false}r.lastApplied=val;
  }
  function translateAttrs(el,lang){
    for(const a of ['placeholder','aria-label','title'])if(el.hasAttribute?.(a)){
      const r=attrRecord(el,a);if(r.base==null)continue;const val=tr(r.base,lang);if(el.getAttribute(a)!==val){internalWrite=true;el.setAttribute(a,val);internalWrite=false}r.lastApplied=val;
    }
  }
  function translateTree(root,lang){
    if(!root)return;
    if(root.nodeType===Node.TEXT_NODE){translateText(root,lang);return}
    if(root.nodeType!==Node.ELEMENT_NODE)return;
    translateAttrs(root,lang);
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','CODE','PRE'].includes(p.tagName))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
    let n;while(n=w.nextNode())translateText(n,lang);
    root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(el=>translateAttrs(el,lang));
  }
  function selectedChoice(){return localStorage.getItem(STORAGE_KEY)||'auto'}
  function syncSelectors(choice){
    bindSelectors(); document.querySelectorAll('[data-cr-language-select]').forEach(s=>{if(s.value!==choice)s.value=choice});
    const badge=document.getElementById('appLanguageBadge');if(badge){const l=resolve(choice);badge.textContent=l==='pt-BR'?'PT':l.toUpperCase()}
  }
  function apply(choice,save=true){
    choice=choice||'auto';const lang=resolve(choice);if(save)localStorage.setItem(STORAGE_KEY,choice);
    document.documentElement.lang=lang;document.documentElement.dataset.crLanguage=lang;
    translateTree(document.body,lang);syncSelectors(choice);
    window.dispatchEvent(new CustomEvent('criptoradar:languagechange',{detail:{choice,language:lang}}));return lang;
  }
  function t(key){return tr(key,resolve(selectedChoice()))}
  function bindSelectors(){document.querySelectorAll('[data-cr-language-select]').forEach(sel=>{if(sel.dataset.bound)return;sel.dataset.bound='1';sel.addEventListener('change',()=>apply(sel.value,true))});}
  const mo=new MutationObserver(list=>{
    if(internalWrite)return;const lang=resolve(selectedChoice());
    for(const m of list){
      if(m.type==='characterData')translateText(m.target,lang);
      else if(m.type==='childList')m.addedNodes.forEach(n=>{if(n.nodeType===1||n.nodeType===3)translateTree(n,lang)});
      else if(m.type==='attributes')translateAttrs(m.target,lang);
    }
  });
  function init(){bindSelectors();apply(selectedChoice(),false);mo.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']})}
  window.CriptoRadarI18n={setLanguage:v=>apply(v,true),getLanguage:()=>resolve(selectedChoice()),getChoice:selectedChoice,t,supported:['pt-BR','en','es'],refresh:()=>apply(selectedChoice(),false)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
