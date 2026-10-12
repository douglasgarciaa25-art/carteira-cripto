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


  /* V19.2: correção de cobertura integral de rótulos e descrições fixas. */
  Object.assign(STRINGS.en, {
  "A Central exibirá apenas condições verificáveis dos dados disponíveis.": "The center will only show verifiable conditions based on available data.",
  "ATIVAR PRO": "ACTIVATE PRO",
  "Acerto técnico": "Technical hit rate",
  "Aguardando a análise": "Waiting for analysis",
  "Aguardando dados do Radar…": "Waiting for Radar data…",
  "Aguardando dados suficientes…": "Waiting for enough data…",
  "Ajusta a forma como a interface destaca risco e oportunidade.": "Adjust how the interface highlights risk and opportunity.",
  "Alertas com menos ruído": "Less noisy alerts",
  "Alertas e oportunidades importantes salvos neste aparelho.": "Important alerts and opportunities saved on this device.",
  "Alertas e oportunidades recentes": "Recent alerts and opportunities",
  "Alertas essenciais": "Essential alerts",
  "Alertas, risco, favoritas e idioma": "Alerts, risk, favorites and language",
  "Altera a interface e mantém a preferência neste aparelho.": "Changes the interface and saves the preference on this device.",
  "Analisando moedas cadastradas...": "Analyzing your coins…",
  "Analisando...": "Analyzing…",
  "Análise em preparação": "Preparing analysis",
  "Ativa": "Active",
  "Ativar Push": "Enable Push",
  "Atualizando dados…": "Updating data…",
  "BEM-VINDO AO CRIPTO RADAR": "WELCOME TO CRIPTO RADAR",
  "Buscando tendência": "Checking trend",
  "CARTEIRA INTELIGENTE • V18.7": "SMART PORTFOLIO • V18.7",
  "CONTINUAR": "CONTINUE",
  "Candidatas": "Candidates",
  "Carregando Inteligência de Mercado V18…": "Loading Market Intelligence V18…",
  "Carregando informações da carteira...": "Loading portfolio information…",
  "Carteira e acompanhamento básico": "Portfolio and basic tracking",
  "Compare Grátis e Premium": "Compare Free and Premium",
  "Compra confirmada, sinal forte e candidatas.": "Confirmed buys, strong signals and candidates.",
  "Compra, venda, risco e oportunidades da sua carteira em uma única tela.": "Buy, sell, risk and portfolio opportunities in one screen.",
  "Compras": "Buys",
  "Compras confirmadas": "Confirmed buys",
  "Confirmadas": "Confirmed",
  "Controle quanto o Radar deve interromper você.": "Control how often Radar should interrupt you.",
  "Dados: verificando": "Data: checking",
  "Desempenho por tipo de sinal": "Performance by signal type",
  "Distribuição dos ativos": "Asset allocation",
  "ESSENCIAL": "ESSENTIAL",
  "Em observação": "On watch",
  "Escolha o nível certo para você": "Choose the right level for you",
  "Espelhamento Inteligente em simulação/alerta": "Smart Mirroring in simulation/alert mode",
  "Espelhamento com segurança": "Safe mirroring",
  "Ferramenta técnica de validação. Não é recomendação de compra.": "Technical validation tool. Not investment advice.",
  "Grátis": "Free",
  "Histórico": "History",
  "Histórico de decisões da IA": "AI decision history",
  "IA avançada e Modo Profissional": "Advanced AI and Professional Mode",
  "Informativo: o Cripto Radar não executa compras ou vendas automaticamente.": "For information only: Cripto Radar does not automatically buy or sell.",
  "LIMPAR": "CLEAR",
  "Leitura do Radar:": "Radar reading:",
  "Leitura orientada da carteira": "Guided portfolio insights",
  "Maior posição": "Largest holding",
  "Maior resultado": "Best return",
  "Maior risco técnico": "Highest technical risk",
  "Manter acesso ao fechar/voltar dentro de 1 hora": "Stay signed in when leaving and returning within 1 hour",
  "Mede como os sinais anteriores evoluíram e registra as mudanças de decisão do Radar.": "Tracks how past signals evolved and records Radar decision changes.",
  "Mercado, destaques e tendências": "Market, highlights and trends",
  "Meus ativos": "My assets",
  "Moderado": "Moderate",
  "Modo Profissional completo": "Full Professional Mode",
  "Monitorando": "Monitoring",
  "Monitorando posições": "Monitoring positions",
  "Motor V10/V11, Backtest e Paper Trading": "V10/V11 Engine, Backtest and Paper Trading",
  "Nenhum registro ainda.": "No records yet.",
  "Nenhuma mudança registrada ainda.": "No changes recorded yet.",
  "Não lidos": "Unread",
  "Oportunidades": "Opportunities",
  "Ordem alfabética": "Alphabetical order",
  "Os sinais aparecerão aqui quando mudarem de estado.": "Signals will appear here when their status changes.",
  "PREFERÊNCIAS DO APLICATIVO": "APP PREFERENCES",
  "PRIORIDADE DO RADAR": "RADAR PRIORITY",
  "PULAR": "SKIP",
  "Painel inteligente de mercado": "Smart market dashboard",
  "Personalize o Radar sem alterar a lógica central do mercado.": "Customize Radar without changing the underlying market logic.",
  "Pior drawdown": "Worst drawdown",
  "Precisa atenção": "Needs attention",
  "Push 24h com app fechado": "24h Push with app closed",
  "Push 24h e ferramentas PRO": "24h Push and PRO tools",
  "Push: verificando": "Push: checking",
  "RADAR PRO • CENTRAL INTELIGENTE": "RADAR PRO • INTELLIGENCE CENTER",
  "REGISTRO LOCAL": "LOCAL HISTORY",
  "Ranking e oportunidades": "Ranking and opportunities",
  "Regime": "Market regime",
  "Registra quando o status de uma moeda muda.": "Records whenever a coin's status changes.",
  "Resumo rápido do mercado, carteira e funcionamento do Radar.": "Quick summary of the market, portfolio and Radar operation.",
  "Retorno médio": "Average return",
  "Riscos": "Risks",
  "Riscos / vendas": "Risks / sell signals",
  "SEM INTERNET • usando dados em cache": "OFFLINE • using cached data",
  "Saldo, composição e aporte": "Balance, holdings and contributions",
  "Sem alerta crítico": "No critical alert",
  "Separe por vírgulas. Ex.: BTC, ETH, SOL, LINK.": "Separate with commas. E.g.: BTC, ETH, SOL, LINK.",
  "Sinal forte": "Strong signal",
  "Sua carteira em um só lugar": "Your portfolio in one place",
  "Só o que merece atenção": "Only what matters",
  "Testar": "Test",
  "Todos": "All",
  "Todos os confirmados": "All confirmed",
  "Todos os sinais": "All signals",
  "Vendas": "Sells",
  "Verificando licença…": "Checking license…",
  "Verificando mercado…": "Checking market…",
  "Verificando saúde do Push 24h…": "Checking 24h Push health…",
  "Visão clara de patrimônio, riscos e decisões da IA.": "Clear view of your portfolio, risks and AI decisions.",
  "aguardando": "waiting",
  "aguardando dados suficientes para gerar um resumo.": "waiting for sufficient data to summarize.",
  "aguardando primeira leitura": "waiting for first reading",
  "após o sinal": "after the signal",
  "heurístico": "heuristic",
  "histórico local": "local history",
  "histórico medido": "measured history",
  "mercado": "market",
  "saúde": "health",
  "• agora configurado a cada 1 min para alertas com o app fechado.": "• configured to run every minute for alerts when the app is closed.",
  "↓ Exportar CSV": "↓ Export CSV",
  "↻ ATUALIZAR AGORA": "↻ REFRESH NOW",
  "↻ Atualizar dados": "↻ Refresh data",
  "↻ RECALCULAR": "↻ RECALCULATE",
  "◈ Simular aporte": "◈ Simulate contribution",
  "⚠️ Aviso Financeiro": "⚠️ Financial Notice",
  "⭐ Moedas favoritas": "⭐ Favorite coins",
  "＋ Adicionar ou atualizar": "＋ Add or update",
  "🌐 Idioma": "🌐 Language",
  "🌐 Idioma do aplicativo": "🌐 App language",
  "👛 Minha carteira": "👛 My portfolio",
  "👛 VER CARTEIRA": "👛 VIEW PORTFOLIO",
  "📄 Termos de Uso": "📄 Terms of Use",
  "📈 V18.4 • Backtest & Histórico da IA": "📈 V18.4 • Backtest & AI History",
  "📈 VER MERCADO": "📈 VIEW MARKET",
  "📊 Painel de hoje": "📊 Today's dashboard",
  "📡 Push: verificando permissão": "📡 Push: checking permission",
  "🔐 Sou o desenvolvedor — liberar meu PRO": "🔐 I'm the developer — unlock my PRO",
  "🔒 Política de Privacidade": "🔒 Privacy Policy",
  "🔔 Frequência dos alertas": "🔔 Alert frequency",
  "🕘 Histórico de mudanças": "🕘 Change history",
  "🕘 Histórico do Radar": "🕘 Radar history",
  "🚀 V18.1 • Live & Validação": "🚀 V18.1 • Live & Validation",
  "🚨 Central de Alertas": "🚨 Alert Center",
  "🛠️ DIAGNÓSTICO": "🛠️ DIAGNOSTICS",
  "🛡️ Nível de risco": "🛡️ Risk level",
  "🤖 Colar lista analisada pelo ChatGPT": "🤖 Paste ChatGPT-analyzed list",
  "🤖 IMPORTAR LISTA DO CHATGPT": "🤖 IMPORT CHATGPT LIST",
  "🧠 V18.1 • Motor Unificado": "🧠 V18.1 • Unified Engine",
  "🧪 Abrir operação Paper de teste BTC": "🧪 Open BTC test Paper trade",
  "A IA/Radar considera todas as moedas que você já possui e as melhores oportunidades atuais para sugerir onde manter, reduzir ou direcionar um novo aporte. É uma análise informativa e não garante lucro.": "Radar AI evaluates coins you hold and current opportunities to suggest where to hold, reduce exposure or allocate new funds. This information does not guarantee profits.",
  "A biometria exige HTTPS e suporte do navegador. Usuário + senha e PIN continuam disponíveis como alternativas.": "Biometrics requires HTTPS and browser support. Username, password and PIN remain available.",
  "A licença do criador é gratuita e não realiza compra pela Google Play. Necessita da chave segura configurada no Vercel.": "The creator license is free and does not charge through Google Play. It requires the secure key configured on Vercel.",
  "A simulação usa stop, alvo e risco proporcional. Resultados projetados não são promessa de retorno. Revise o sinal antes de operar.": "The simulation uses a stop, target and proportional risk. Projected results are not guaranteed. Review the signal before trading.",
  "Adicione suas moedas e acompanhe posições, mercado e oportunidades sem precisar navegar por várias telas.": "Add coins and follow your positions, market and opportunities without switching between multiple screens.",
  "Agente adaptativo no servidor: cruza liquidez, força, volume e estabilidade e pode guardar o desempenho dos sinais.": "Server-side adaptive agent: combines liquidity, momentum, volume and stability and can track signal performance.",
  "As 3 moedas com melhor pontuação do Radar aparecem aqui. Não são moedas fixas: entram, saem e mudam de posição automaticamente.": "The three highest-ranked coins appear here. They change automatically as the market moves.",
  "Assinatura com renovação automática pela Google Play. O Cripto Radar informa e simula cenários; não executa ordens e não garante retorno financeiro.": "Auto-renewing subscription through Google Play. Cripto Radar provides analysis and scenarios but does not trade or guarantee returns.",
  "Assinatura com renovação automática. Você pode cancelar pela Google Play. O Cripto Radar é uma ferramenta informativa e não garante lucro ou retorno financeiro.": "Auto-renewing subscription. You can cancel through Google Play. Cripto Radar provides information and does not guarantee returns.",
  "Backtest local e heurístico: usa dados observados pelo próprio aplicativo. Não representa promessa de retorno, não executa ordens e não substitui validação histórica profissional.": "Local heuristic backtest using data observed by the app. No returns are guaranteed; no orders are placed. It does not replace professional validation.",
  "Com as notificações permitidas, o servidor pode avisar sobre eventos importantes mesmo com o aplicativo fechado, respeitando as limitações do Android.": "With notifications enabled, the server can alert you about important events while the app is closed, subject to Android limitations.",
  "Comece com os recursos essenciais e desbloqueie ferramentas avançadas quando precisar de mais profundidade.": "Start with essential features and unlock advanced tools when needed.",
  "Cruza 1 min, 5 min, 15 min e 24h com volume, liquidez, peso na sua carteira e, quando disponível, funding/open interest/long-short. Também procura falha de pullback após rompimentos e exige 2 confirmações consecutivas nos sinais fortes para reduzir falso disparo.": "Combines 1m, 5m, 15m and 24h data with volume, liquidity and portfolio weight, plus derivatives data when available. It checks failed pullbacks and requires two consecutive confirmations for strong signals.",
  "Envie um print da corretora. O Radar identifica moedas e quantidades, cria uma prévia para conferência e só altera sua carteira depois da sua confirmação.": "Upload an exchange screenshot. Radar detects coins and quantities and only changes your portfolio after you confirm.",
  "Esta versão usa segurança local do aparelho. Não envia sua senha para o Cripto Radar e não possui recuperação por e-mail sem um serviço de conta na nuvem.": "This version uses local device security. Your password is not sent to Cripto Radar. Email recovery requires a cloud account service.",
  "Interface mais simples, focada em carteira, alertas, mercado e IA. Esconde ferramentas técnicas avançadas.": "Simplified interface focused on portfolio, alerts, market and AI. Advanced tools are hidden.",
  "Libera motor V10/V11, backtest, Paper Trading, diagnóstico de fontes e controles avançados.": "Unlocks the V10/V11 engine, backtesting, Paper Trading, source diagnostics and advanced controls.",
  "Mostrando só o essencial para acompanhar sua carteira, alertas e oportunidades sem excesso de informação técnica.": "Shows only what matters for your portfolio, alerts and opportunities.",
  "Notícias e rumores ficam separados do sinal técnico. Nada aqui vira compra ou venda sozinho.": "News and rumors are kept separate from technical signals. Neither triggers a buy or sell on its own.",
  "O Cripto Radar é uma ferramenta informativa. Sinais, scores, IA, espelhamento e simulações não constituem promessa de lucro, recomendação personalizada nem execução automática de operações.": "Cripto Radar provides information. Signals, scores, AI, mirroring and simulations do not guarantee profits, constitute personalized financial advice or execute trades.",
  "O Espelhamento Inteligente é somente simulação e alerta. Não envia ordens para corretoras.": "Smart Mirroring is for simulation and alerts only. It does not send exchange orders.",
  "O Radar prioriza sinais confirmados. Em Configurações você escolhe a frequência, o perfil de risco e as moedas favoritas.": "Radar prioritizes confirmed signals. Set alert frequency, risk profile and favorites in Settings.",
  "O painel só registra dados observados enquanto esta página está aberta. Push 24h depende da assinatura do dispositivo e do agendador externo. Sinais são heurísticos, não garantem lucro e não executam ordens.": "The dashboard records data while this page is open. 24h Push depends on device subscription and external scheduler. Signals are heuristic and do not place trades or guarantee returns.",
  "Os preços podem variar entre corretoras. O painel é informativo; “tempo real” depende da disponibilidade da fonte e da conexão do aparelho.": "Prices may vary across exchanges. Real-time availability depends on data sources and your connection.",
  "Preço ao vivo, ranking pelo mesmo motor V18, validação dos sinais confirmados e proteção diária do Paper.": "Live prices, ranking with the V18 engine, confirmed-signal validation and daily Paper protection.",
  "Renovação automática anual até o cancelamento. O preço final e eventuais impostos são sempre os exibidos pelo Google Play no momento da compra.": "Renews yearly until canceled. Final price and applicable taxes are those shown by Google Play at checkout.",
  "Resumo operacional em um só lugar. Mostra qualidade dos dados, melhor sinal, Paper Trading e notificações.": "Operational dashboard with data quality, best signal, Paper Trading and notifications.",
  "Seu usuário e sua senha ficam protegidos neste aparelho. Se o celular permitir, você também pode ativar digital ou reconhecimento facial.": "Your username and password stay protected on this device. You may enable fingerprint or face unlock if supported.",
  "Simula os sinais confirmados do Radar e mede o que acontece depois. Win rate, profit factor, expectancy e drawdown são calculados somente com operações simuladas encerradas.": "Simulates confirmed Radar signals and measures outcomes. Win rate, profit factor, expectancy and drawdown use closed simulated trades only.",
  "Somente dados públicos de mercado. Não solicita login, senha, 2FA ou chave API e não envia ordens. O Radar apenas acompanha preços, volume e variação para montar os destaques.": "Public market data only. Radar does not request credentials, 2FA or API keys, and does not place orders.",
  "Testa candles históricos públicos da Binance. Resultado inclui taxa e slippage configuráveis e compara a estratégia com comprar e manter BTC no mesmo período. Backtest não garante desempenho futuro.": "Tests public historical Binance candles with configurable fees/slippage and compares strategies against buy-and-hold BTC. Past results do not guarantee future performance.",
  "Top 5 dinâmico do mercado analisado. As moedas entram, saem e mudam de posição automaticamente conforme força de 24h, liquidez e volume.": "Dynamic Top 5 based on 24h strength, liquidity and volume. Coins enter, exit and change ranks automatically.",
  "Transforma sinais confirmados do Radar em uma simulação proporcional à sua carteira. Não copia terceiros e não envia ordens reais.": "Converts confirmed Radar signals into a proportional portfolio simulation. No copying or live trades.",
  "Uma única leitura para Mercado, Carteira, Paper e notificações. Todos usam o mesmo score V18 e a mesma classificação do sinal.": "Unified signals for Market, Portfolio, Paper and notifications, using the same V18 score and decision.",
  "Usa primeiro a Binance data-api que já funciona neste navegador e mantém fontes alternativas como reserva. Antes de considerar uma moeda, confira liquidez, volume, motivo da alta e risco de entrar após uma valorização excessiva.": "Uses Binance's data API first, with backup sources. Check liquidity, volume and entry risk before considering a coin after a sharp rise.",
  "Você pode trocar depois a qualquer momento. O mercado e a IA continuam os mesmos; muda apenas a quantidade de ferramentas e detalhes exibidos.": "You can change modes any time. Market data and AI remain the same; only the displayed tools change.",
  "🆕 entrou no Top 5 • ⬆️ subiu • ⬇️ caiu • ➖ manteve posição. O ranking é informativo e não garante retorno.": "🆕 joined Top 5 • ⬆️ rose • ⬇️ fell • ➖ held position. Rankings are informational and do not guarantee returns.",
  "🔔 Ative “Notificações do Radar”. O modo de segundo plano tentará manter o Paper e os alertas atualizados mesmo com o PWA minimizado, conforme os limites do Android/navegador.": "🔔 Enable “Radar Notifications”. Background mode will try to keep Paper and alerts updated while the PWA is minimized, subject to Android/browser limits."
});
  Object.assign(STRINGS.es, {
  "A Central exibirá apenas condições verificáveis dos dados disponíveis.": "El centro mostrará solo condiciones verificables con los datos disponibles.",
  "ATIVAR PRO": "ACTIVAR PRO",
  "Acerto técnico": "Tasa de acierto técnico",
  "Aguardando a análise": "Esperando el análisis",
  "Aguardando dados do Radar…": "Esperando datos del Radar…",
  "Aguardando dados suficientes…": "Esperando datos suficientes…",
  "Ajusta a forma como a interface destaca risco e oportunidade.": "Ajusta cómo la interfaz destaca riesgos y oportunidades.",
  "Alertas com menos ruído": "Alertas con menos ruido",
  "Alertas e oportunidades importantes salvos neste aparelho.": "Alertas y oportunidades importantes guardados en este dispositivo.",
  "Alertas e oportunidades recentes": "Alertas y oportunidades recientes",
  "Alertas essenciais": "Alertas esenciales",
  "Alertas, risco, favoritas e idioma": "Alertas, riesgo, favoritos e idioma",
  "Altera a interface e mantém a preferência neste aparelho.": "Cambia la interfaz y guarda la preferencia en este dispositivo.",
  "Analisando moedas cadastradas...": "Analizando tus monedas…",
  "Analisando...": "Analizando…",
  "Análise em preparação": "Preparando análisis",
  "Ativa": "Activa",
  "Ativar Push": "Activar Push",
  "Atualizando dados…": "Actualizando datos…",
  "BEM-VINDO AO CRIPTO RADAR": "BIENVENIDO A CRIPTO RADAR",
  "Buscando tendência": "Buscando tendencia",
  "CARTEIRA INTELIGENTE • V18.7": "CARTERA INTELIGENTE • V18.7",
  "CONTINUAR": "CONTINUAR",
  "Candidatas": "Candidatas",
  "Carregando Inteligência de Mercado V18…": "Cargando Inteligencia de Mercado V18…",
  "Carregando informações da carteira...": "Cargando información de la cartera…",
  "Carteira e acompanhamento básico": "Cartera y seguimiento básico",
  "Compare Grátis e Premium": "Compara Gratis y Premium",
  "Compra confirmada, sinal forte e candidatas.": "Compras confirmadas, señales fuertes y candidatas.",
  "Compra, venda, risco e oportunidades da sua carteira em uma única tela.": "Compra, venta, riesgos y oportunidades de tu cartera en una pantalla.",
  "Compras": "Compras",
  "Compras confirmadas": "Compras confirmadas",
  "Confirmadas": "Confirmadas",
  "Controle quanto o Radar deve interromper você.": "Controla con qué frecuencia Radar debe interrumpirte.",
  "Dados: verificando": "Datos: verificando",
  "Desempenho por tipo de sinal": "Rendimiento por tipo de señal",
  "Distribuição dos ativos": "Distribución de activos",
  "ESSENCIAL": "ESENCIAL",
  "Em observação": "En observación",
  "Escolha o nível certo para você": "Elige el nivel adecuado para ti",
  "Espelhamento Inteligente em simulação/alerta": "Espejo inteligente en modo simulación/alerta",
  "Espelhamento com segurança": "Espejo seguro",
  "Ferramenta técnica de validação. Não é recomendação de compra.": "Herramienta de validación técnica. No es una recomendación de compra.",
  "Grátis": "Gratis",
  "Histórico": "Historial",
  "Histórico de decisões da IA": "Historial de decisiones de IA",
  "IA avançada e Modo Profissional": "IA avanzada y Modo Profesional",
  "Informativo: o Cripto Radar não executa compras ou vendas automaticamente.": "Solo informativo: Cripto Radar no compra ni vende automáticamente.",
  "LIMPAR": "LIMPIAR",
  "Leitura do Radar:": "Lectura del Radar:",
  "Leitura orientada da carteira": "Lectura guiada de la cartera",
  "Maior posição": "Mayor posición",
  "Maior resultado": "Mejor resultado",
  "Maior risco técnico": "Mayor riesgo técnico",
  "Manter acesso ao fechar/voltar dentro de 1 hora": "Mantener sesión al salir y volver dentro de 1 hora",
  "Mede como os sinais anteriores evoluíram e registra as mudanças de decisão do Radar.": "Mide la evolución de señales anteriores y registra cambios de decisión.",
  "Mercado, destaques e tendências": "Mercado, destacados y tendencias",
  "Meus ativos": "Mis activos",
  "Moderado": "Moderado",
  "Modo Profissional completo": "Modo Profesional completo",
  "Monitorando": "Monitoreando",
  "Monitorando posições": "Monitoreando posiciones",
  "Motor V10/V11, Backtest e Paper Trading": "Motor V10/V11, Backtest y Paper Trading",
  "Nenhum registro ainda.": "Aún no hay registros.",
  "Nenhuma mudança registrada ainda.": "Aún no hay cambios registrados.",
  "Não lidos": "No leídos",
  "Oportunidades": "Oportunidades",
  "Ordem alfabética": "Orden alfabético",
  "Os sinais aparecerão aqui quando mudarem de estado.": "Las señales aparecerán aquí cuando cambien de estado.",
  "PREFERÊNCIAS DO APLICATIVO": "PREFERENCIAS DE LA APLICACIÓN",
  "PRIORIDADE DO RADAR": "PRIORIDAD DEL RADAR",
  "PULAR": "SALTAR",
  "Painel inteligente de mercado": "Panel inteligente de mercado",
  "Personalize o Radar sem alterar a lógica central do mercado.": "Personaliza Radar sin cambiar la lógica central del mercado.",
  "Pior drawdown": "Máxima caída",
  "Precisa atenção": "Necesita atención",
  "Push 24h com app fechado": "Push 24 h con la app cerrada",
  "Push 24h e ferramentas PRO": "Push 24 h y herramientas PRO",
  "Push: verificando": "Push: verificando",
  "RADAR PRO • CENTRAL INTELIGENTE": "RADAR PRO • CENTRO INTELIGENTE",
  "REGISTRO LOCAL": "REGISTRO LOCAL",
  "Ranking e oportunidades": "Ranking y oportunidades",
  "Regime": "Régimen de mercado",
  "Registra quando o status de uma moeda muda.": "Registra cuándo cambia el estado de una moneda.",
  "Resumo rápido do mercado, carteira e funcionamento do Radar.": "Resumen rápido del mercado, cartera y funcionamiento del Radar.",
  "Retorno médio": "Rentabilidad media",
  "Riscos": "Riesgos",
  "Riscos / vendas": "Riesgos / ventas",
  "SEM INTERNET • usando dados em cache": "SIN CONEXIÓN • usando datos en caché",
  "Saldo, composição e aporte": "Saldo, composición y aportes",
  "Sem alerta crítico": "Sin alerta crítica",
  "Separe por vírgulas. Ex.: BTC, ETH, SOL, LINK.": "Separa con comas. Ej.: BTC, ETH, SOL, LINK.",
  "Sinal forte": "Señal fuerte",
  "Sua carteira em um só lugar": "Tu cartera en un solo lugar",
  "Só o que merece atenção": "Solo lo importante",
  "Testar": "Probar",
  "Todos": "Todos",
  "Todos os confirmados": "Todos los confirmados",
  "Todos os sinais": "Todas las señales",
  "Vendas": "Ventas",
  "Verificando licença…": "Verificando licencia…",
  "Verificando mercado…": "Verificando mercado…",
  "Verificando saúde do Push 24h…": "Verificando estado del Push 24 h…",
  "Visão clara de patrimônio, riscos e decisões da IA.": "Vista clara del patrimonio, riesgos y decisiones de IA.",
  "aguardando": "esperando",
  "aguardando dados suficientes para gerar um resumo.": "esperando suficientes datos para crear un resumen.",
  "aguardando primeira leitura": "esperando la primera lectura",
  "após o sinal": "después de la señal",
  "heurístico": "heurístico",
  "histórico local": "historial local",
  "histórico medido": "historial medido",
  "mercado": "mercado",
  "saúde": "salud",
  "• agora configurado a cada 1 min para alertas com o app fechado.": "• configurado cada minuto para alertas con la app cerrada.",
  "↓ Exportar CSV": "↓ Exportar CSV",
  "↻ ATUALIZAR AGORA": "↻ ACTUALIZAR AHORA",
  "↻ Atualizar dados": "↻ Actualizar datos",
  "↻ RECALCULAR": "↻ RECALCULAR",
  "◈ Simular aporte": "◈ Simular aporte",
  "⚠️ Aviso Financeiro": "⚠️ Aviso financiero",
  "⭐ Moedas favoritas": "⭐ Monedas favoritas",
  "＋ Adicionar ou atualizar": "＋ Añadir o actualizar",
  "🌐 Idioma": "🌐 Idioma",
  "🌐 Idioma do aplicativo": "🌐 Idioma de la aplicación",
  "👛 Minha carteira": "👛 Mi cartera",
  "👛 VER CARTEIRA": "👛 VER CARTERA",
  "📄 Termos de Uso": "📄 Términos de uso",
  "📈 V18.4 • Backtest & Histórico da IA": "📈 V18.4 • Backtest e historial de IA",
  "📈 VER MERCADO": "📈 VER MERCADO",
  "📊 Painel de hoje": "📊 Panel de hoy",
  "📡 Push: verificando permissão": "📡 Push: verificando permiso",
  "🔐 Sou o desenvolvedor — liberar meu PRO": "🔐 Soy el desarrollador — desbloquear mi PRO",
  "🔒 Política de Privacidade": "🔒 Política de privacidad",
  "🔔 Frequência dos alertas": "🔔 Frecuencia de alertas",
  "🕘 Histórico de mudanças": "🕘 Historial de cambios",
  "🕘 Histórico do Radar": "🕘 Historial del Radar",
  "🚀 V18.1 • Live & Validação": "🚀 V18.1 • Live y validación",
  "🚨 Central de Alertas": "🚨 Centro de alertas",
  "🛠️ DIAGNÓSTICO": "🛠️ DIAGNÓSTICO",
  "🛡️ Nível de risco": "🛡️ Nivel de riesgo",
  "🤖 Colar lista analisada pelo ChatGPT": "🤖 Pegar lista analizada por ChatGPT",
  "🤖 IMPORTAR LISTA DO CHATGPT": "🤖 IMPORTAR LISTA DE CHATGPT",
  "🧠 V18.1 • Motor Unificado": "🧠 V18.1 • Motor unificado",
  "🧪 Abrir operação Paper de teste BTC": "🧪 Abrir operación Paper de prueba BTC",
  "A IA/Radar considera todas as moedas que você já possui e as melhores oportunidades atuais para sugerir onde manter, reduzir ou direcionar um novo aporte. É uma análise informativa e não garante lucro.": "La IA de Radar evalúa tus monedas y oportunidades actuales para sugerir dónde mantener, reducir o aportar capital nuevo. No garantiza beneficios.",
  "A biometria exige HTTPS e suporte do navegador. Usuário + senha e PIN continuam disponíveis como alternativas.": "La biometría requiere HTTPS y compatibilidad del navegador. Usuario, contraseña y PIN siguen disponibles.",
  "A licença do criador é gratuita e não realiza compra pela Google Play. Necessita da chave segura configurada no Vercel.": "La licencia del creador es gratuita y no realiza compras mediante Google Play. Requiere la clave segura configurada en Vercel.",
  "A simulação usa stop, alvo e risco proporcional. Resultados projetados não são promessa de retorno. Revise o sinal antes de operar.": "La simulación usa stop, objetivo y riesgo proporcional. Los resultados previstos no están garantizados. Revisa la señal antes de operar.",
  "Adicione suas moedas e acompanhe posições, mercado e oportunidades sem precisar navegar por várias telas.": "Añade monedas y sigue posiciones, mercado y oportunidades sin pasar por varias pantallas.",
  "Agente adaptativo no servidor: cruza liquidez, força, volume e estabilidade e pode guardar o desempenho dos sinais.": "Agente adaptativo en el servidor: combina liquidez, fuerza, volumen y estabilidad y puede registrar el rendimiento de señales.",
  "As 3 moedas com melhor pontuação do Radar aparecem aqui. Não são moedas fixas: entram, saem e mudam de posição automaticamente.": "Aquí aparecen las tres monedas con mayor puntuación, que cambian automáticamente según el mercado.",
  "Assinatura com renovação automática pela Google Play. O Cripto Radar informa e simula cenários; não executa ordens e não garante retorno financeiro.": "Suscripción con renovación automática en Google Play. Cripto Radar informa y simula escenarios; no opera ni garantiza beneficios.",
  "Assinatura com renovação automática. Você pode cancelar pela Google Play. O Cripto Radar é uma ferramenta informativa e não garante lucro ou retorno financeiro.": "Suscripción con renovación automática. Puedes cancelarla en Google Play. Cripto Radar es informativo y no garantiza beneficios.",
  "Backtest local e heurístico: usa dados observados pelo próprio aplicativo. Não representa promessa de retorno, não executa ordens e não substitui validação histórica profissional.": "Backtest local y heurístico con datos observados por la app. No garantiza ganancias, no ejecuta órdenes ni sustituye validación profesional.",
  "Com as notificações permitidas, o servidor pode avisar sobre eventos importantes mesmo com o aplicativo fechado, respeitando as limitações do Android.": "Con las notificaciones permitidas, el servidor puede avisarte de eventos importantes aunque la app esté cerrada, según los límites de Android.",
  "Comece com os recursos essenciais e desbloqueie ferramentas avançadas quando precisar de mais profundidade.": "Empieza con las funciones esenciales y desbloquea herramientas avanzadas cuando las necesites.",
  "Cruza 1 min, 5 min, 15 min e 24h com volume, liquidez, peso na sua carteira e, quando disponível, funding/open interest/long-short. Também procura falha de pullback após rompimentos e exige 2 confirmações consecutivas nos sinais fortes para reduzir falso disparo.": "Combina datos de 1m, 5m, 15m y 24h con volumen, liquidez y peso en cartera, además de derivados cuando estén disponibles. Busca fallos de retroceso y exige dos confirmaciones consecutivas para señales fuertes.",
  "Envie um print da corretora. O Radar identifica moedas e quantidades, cria uma prévia para conferência e só altera sua carteira depois da sua confirmação.": "Envía una captura de la plataforma. Radar identifica monedas y cantidades y solo cambia tu cartera tras tu confirmación.",
  "Esta versão usa segurança local do aparelho. Não envia sua senha para o Cripto Radar e não possui recuperação por e-mail sem um serviço de conta na nuvem.": "Esta versión usa seguridad local. Tu contraseña no se envía a Cripto Radar. Recuperarla por correo requiere una cuenta en la nube.",
  "Interface mais simples, focada em carteira, alertas, mercado e IA. Esconde ferramentas técnicas avançadas.": "Interfaz simplificada centrada en cartera, alertas, mercado e IA. Oculta herramientas avanzadas.",
  "Libera motor V10/V11, backtest, Paper Trading, diagnóstico de fontes e controles avançados.": "Desbloquea motor V10/V11, backtest, Paper Trading, diagnóstico de fuentes y controles avanzados.",
  "Mostrando só o essencial para acompanhar sua carteira, alertas e oportunidades sem excesso de informação técnica.": "Muestra solo lo esencial para tu cartera, alertas y oportunidades.",
  "Notícias e rumores ficam separados do sinal técnico. Nada aqui vira compra ou venda sozinho.": "Noticias y rumores se separan de señales técnicas. Ninguno desencadena compras o ventas por sí solo.",
  "O Cripto Radar é uma ferramenta informativa. Sinais, scores, IA, espelhamento e simulações não constituem promessa de lucro, recomendação personalizada nem execução automática de operações.": "Cripto Radar ofrece información. Señales, puntuaciones, IA, simulaciones y replicación no garantizan beneficios ni ejecutan operaciones.",
  "O Espelhamento Inteligente é somente simulação e alerta. Não envia ordens para corretoras.": "La replicación inteligente solo simula y envía alertas. No envía órdenes a plataformas.",
  "O Radar prioriza sinais confirmados. Em Configurações você escolhe a frequência, o perfil de risco e as moedas favoritas.": "Radar prioriza señales confirmadas. Ajusta frecuencia, riesgo y favoritos en Configuración.",
  "O painel só registra dados observados enquanto esta página está aberta. Push 24h depende da assinatura do dispositivo e do agendador externo. Sinais são heurísticos, não garantem lucro e não executam ordens.": "El panel registra datos mientras está abierto. Push 24 h depende de la suscripción del dispositivo y el planificador externo. Las señales son heurísticas y no operan ni garantizan ganancias.",
  "Os preços podem variar entre corretoras. O painel é informativo; “tempo real” depende da disponibilidade da fonte e da conexão do aparelho.": "Los precios pueden variar entre plataformas. Los datos en tiempo real dependen de las fuentes y de tu conexión.",
  "Preço ao vivo, ranking pelo mesmo motor V18, validação dos sinais confirmados e proteção diária do Paper.": "Precios en vivo, ranking del motor V18, validación de señales confirmadas y protección diaria de Paper.",
  "Renovação automática anual até o cancelamento. O preço final e eventuais impostos são sempre os exibidos pelo Google Play no momento da compra.": "Se renueva anualmente hasta la cancelación. El precio final e impuestos son los que muestra Google Play al pagar.",
  "Resumo operacional em um só lugar. Mostra qualidade dos dados, melhor sinal, Paper Trading e notificações.": "Panel operativo con calidad de datos, mejor señal, Paper Trading y notificaciones.",
  "Seu usuário e sua senha ficam protegidos neste aparelho. Se o celular permitir, você também pode ativar digital ou reconhecimento facial.": "Tu usuario y contraseña permanecen protegidos en el dispositivo. Puedes activar huella o reconocimiento facial si es compatible.",
  "Simula os sinais confirmados do Radar e mede o que acontece depois. Win rate, profit factor, expectancy e drawdown são calculados somente com operações simuladas encerradas.": "Simula señales confirmadas y mide los resultados. Las estadísticas usan solo operaciones simuladas cerradas.",
  "Somente dados públicos de mercado. Não solicita login, senha, 2FA ou chave API e não envia ordens. O Radar apenas acompanha preços, volume e variação para montar os destaques.": "Solo datos públicos de mercado. Radar no solicita contraseñas, 2FA ni claves API, y no envía órdenes.",
  "Testa candles históricos públicos da Binance. Resultado inclui taxa e slippage configuráveis e compara a estratégia com comprar e manter BTC no mesmo período. Backtest não garante desempenho futuro.": "Prueba velas históricas públicas de Binance con tarifas y slippage configurables y compara con comprar y mantener BTC. El pasado no garantiza resultados futuros.",
  "Top 5 dinâmico do mercado analisado. As moedas entram, saem e mudam de posição automaticamente conforme força de 24h, liquidez e volume.": "Top 5 dinámico según fuerza de 24 h, liquidez y volumen. Las monedas entran, salen y cambian de puesto automáticamente.",
  "Transforma sinais confirmados do Radar em uma simulação proporcional à sua carteira. Não copia terceiros e não envia ordens reais.": "Convierte señales confirmadas en una simulación proporcional a tu cartera, sin copiar ni ejecutar órdenes reales.",
  "Uma única leitura para Mercado, Carteira, Paper e notificações. Todos usam o mesmo score V18 e a mesma classificação do sinal.": "Una sola lectura para Mercado, Cartera, Paper y notificaciones, con la misma puntuación V18 y clasificación.",
  "Usa primeiro a Binance data-api que já funciona neste navegador e mantém fontes alternativas como reserva. Antes de considerar uma moeda, confira liquidez, volume, motivo da alta e risco de entrar após uma valorização excessiva.": "Usa primero la API de Binance y fuentes alternativas. Revisa liquidez, volumen y riesgo antes de entrar tras una subida fuerte.",
  "Você pode trocar depois a qualquer momento. O mercado e a IA continuam os mesmos; muda apenas a quantidade de ferramentas e detalhes exibidos.": "Puedes cambiar el modo cuando quieras. El mercado y la IA no cambian; solo las herramientas visibles.",
  "🆕 entrou no Top 5 • ⬆️ subiu • ⬇️ caiu • ➖ manteve posição. O ranking é informativo e não garante retorno.": "🆕 entró al Top 5 • ⬆️ subió • ⬇️ bajó • ➖ mantuvo posición. No garantiza beneficios.",
  "🔔 Ative “Notificações do Radar”. O modo de segundo plano tentará manter o Paper e os alertas atualizados mesmo com o PWA minimizado, conforme os limites do Android/navegador.": "🔔 Activa “Notificaciones de Radar”. El segundo plano intentará actualizar Paper y alertas con la PWA minimizada, según los límites de Android/navegador."
});
  const DYNAMIC_V192={
  "en": [
    [
      "Valor e variação de 24h são estimativas de mercado. Resultado não realizado usa apenas posições com preço médio cadastrado; não inclui taxas ou impostos. Pontuação técnica não é probabilidade de lucro.",
      "24h values and changes are market estimates. Unrealized P&L requires a recorded average cost and excludes fees and taxes. Technical scores are not profit probabilities."
    ],
    [
      "A IA não libera aporte quando o Radar ainda está em espera e não manda reduzir apenas por diferença de alocação.",
      "AI does not approve contributions while Radar is waiting or recommend reductions based only on allocation differences."
    ],
    [
      "Nenhuma compra está confirmada agora. A IA mantém o capital novo em espera em vez de forçar um aporte.",
      "No buy is confirmed. The AI holds new capital in reserve rather than forcing an entry."
    ],
    [
      "Quando preço e dados técnicos forem atualizados, o Radar mostrará os alertas verificáveis.",
      "Radar will show verifiable alerts when price and technical data are refreshed."
    ],
    [
      "Aguardando estrutura, tendência e indicadores técnicos antes de classificar a entrada.",
      "Waiting for structure, trend and technical indicators before assessing entry."
    ],
    [
      "A análise está ativa, mas a memória permanente não está disponível nesta execução.",
      "Analysis is active, but persistent memory is unavailable in this session."
    ],
    [
      "Memória ativa. A próxima avaliação só ocorre depois de uma janela mínima de",
      "Memory active. The next evaluation will only run after at least"
    ],
    [
      "posição(ões) seguem em espera e o capital novo deve permanecer reservado.",
      "position(s) remain on hold and new capital should stay reserved."
    ],
    [
      "Sem alertas de concentração extrema ou de dados ausentes nesta leitura.",
      "No concentration or missing-data alerts in this reading."
    ],
    [
      "cenário incompleto; aguardar melhora antes de elevar a exposição.",
      "incomplete setup; wait for improvement before adding exposure."
    ],
    [
      "💵 Aporte novo: manter em reserva até surgir confirmação técnica.",
      "💵 New contribution: hold in reserve until technical confirmation."
    ],
    [
      "A IA bloqueou qualquer movimentação até os dados normalizarem.",
      "The AI has blocked new actions until data are current."
    ],
    [
      "A IA usa a mesma decisão para carteira, aporte e oportunidades",
      "AI uses one decision for portfolio, contributions and opportunities"
    ],
    [
      "Importe um print ou adicione moedas manualmente para começar.",
      "Import a screenshot or add coins manually to start."
    ],
    [
      "IA temporariamente indisponível • nova tentativa automática",
      "AI temporarily unavailable • retrying automatically"
    ],
    [
      "Sua carteira ainda não foi enviada para a IA nesta leitura.",
      "Your portfolio has not been sent to the AI for this reading."
    ],
    [
      "posição(ões) da carteira com entrada confirmada pelo Radar.",
      "portfolio position(s) with confirmed Radar entries."
    ],
    [
      "posição(ões) pedem redução/revisão antes de aumentar risco.",
      "position(s) need reduction or review before increasing risk."
    ],
    [
      "Esse ativo não aparece na carteira enviada nesta leitura.",
      "This asset is not included in your portfolio for this reading."
    ],
    [
      "Sua carteira não tem aporte liberado agora, mas existem",
      "Your portfolio has no eligible new contributions now, but there are"
    ],
    [
      "oportunidade(s) externa(s) confirmada(s) para observar.",
      "confirmed external opportunities worth monitoring."
    ],
    [
      "A carteira merece reequilíbrio antes de aumentar risco",
      "Consider rebalancing before increasing risk"
    ],
    [
      "Sem posições precificadas para mostrar a distribuição.",
      "No priced positions to display the allocation."
    ],
    [
      "Movimento confirmado em duas leituras; score de risco",
      "Movement confirmed in two readings; risk score"
    ],
    [
      "Revisar proteção e concentração antes de movimentar.",
      "Review protection and concentration before acting."
    ],
    [
      "Reserva de moedas estáveis abaixo de 5% da carteira",
      "Stablecoin reserve below 5% of the portfolio"
    ],
    [
      "tendência de alta alinhada entre os tempos gráficos",
      "aligned bullish trend across timeframes"
    ],
    [
      "Adicione seus ativos para iniciar o monitoramento.",
      "Add assets to start monitoring."
    ],
    [
      "ativo(s) sem cotação: não incluídos no valor total",
      "asset(s) without prices: excluded from the total value"
    ],
    [
      "Conferir posição, risco e taxas antes de decidir.",
      "Review position, risk and fees before deciding."
    ],
    [
      "Confira valor do aporte e limite de concentração.",
      "Check contribution amount and concentration limits."
    ],
    [
      "boa base técnica, mas ainda merece confirmação de",
      "solid technical basis, but still requires confirmation of"
    ],
    [
      "movimento 24h já avançado; evitar perseguir preço",
      "24h move already extended; avoid chasing price"
    ],
    [
      "Confluência confirmada no Radar V5 e no mercado;",
      "Technical alignment confirmed by Radar V5 and the market;"
    ],
    [
      "avançaram. Os pesos são ajustados gradualmente.",
      "moved up. Weights adjust gradually."
    ],
    [
      "em reserva até aparecer confluência suficiente.",
      "in reserve until enough technical alignment appears."
    ],
    [
      "Aguardar fechamento das confirmações técnicas.",
      "Wait for technical confirmations to close."
    ],
    [
      "alta de 24h menos esticada (aguardar correção)",
      "less extended 24h rise (wait for pullback)"
    ],
    [
      "ativo(s) com bloqueio ou risco técnico elevado",
      "asset(s) blocked or with high technical risk"
    ],
    [
      "posição(ões) da carteira liberadas para aporte",
      "portfolio position(s) eligible for contributions"
    ],
    [
      "Condição de redução sinalizada pela carteira.",
      "Portfolio reduction condition detected."
    ],
    [
      "abaixo do VWAP; reversão ainda não confirmada",
      "below VWAP; reversal not yet confirmed"
    ],
    [
      "Aguardar confirmação, sem aporte automático.",
      "Wait for confirmation. No automatic contribution."
    ],
    [
      "Há cotações desatualizadas no valor estimado",
      "Estimated value contains outdated quotes"
    ],
    [
      "Avaliar liquidez e risco antes de investir.",
      "Assess liquidity and risk before investing."
    ],
    [
      "estrutura 4h ainda mista; falta confirmação",
      "mixed 4h structure; confirmation missing"
    ],
    [
      "minutos para evitar aprendizado por ruído.",
      "minutes to avoid learning from noise."
    ],
    [
      "A IA bloqueia novos aportes conflitantes.",
      "AI blocks conflicting new contributions."
    ],
    [
      "A carteira está em condição intermediária",
      "The portfolio is in an intermediate condition"
    ],
    [
      "Analisando sinais e buscando confirmações",
      "Analyzing signals and seeking confirmation"
    ],
    [
      "oportunidade(s) externa(s) confirmada(s).",
      "confirmed external opportunity(ies)."
    ],
    [
      "A carteira está estruturalmente saudável",
      "The portfolio is structurally healthy"
    ],
    [
      "Nenhuma moeda corresponde a este filtro.",
      "No coins match this filter."
    ],
    [
      "e o mercado geral pede postura defensiva",
      "and the wider market warrants a defensive stance"
    ],
    [
      "indicadores 15m, 4h e diário atualizados",
      "updated 15m, 4h and daily indicators"
    ],
    [
      "Faltam critérios para liberar a compra.",
      "Some criteria are still missing for a buy."
    ],
    [
      "cotação e volume de mercado atualizados",
      "updated market price and volume"
    ],
    [
      "reserva alta; pode haver capital ocioso",
      "high reserve; some capital may be idle"
    ],
    [
      "sinais de uma fotografia com pelo menos",
      "signals from a snapshot at least"
    ],
    [
      "aguardando confirmação de preço/volume",
      "awaiting price/volume confirmation"
    ],
    [
      "capital novo deve permanecer reservado",
      "new capital should stay in reserve"
    ],
    [
      "há concentração elevada em uma posição",
      "there is high concentration in one position"
    ],
    [
      "preço próximo de zona saudável do VWAP",
      "price near a healthy VWAP zone"
    ],
    [
      "confirmação final do motor técnico V5",
      "final confirmation from V5 technical engine"
    ],
    [
      "estrutura de alta HH/HL no gráfico 4h",
      "bullish HH/HL structure on the 4h chart"
    ],
    [
      "Confluência detectada pelo motor V18",
      "Technical alignment detected by V18"
    ],
    [
      "Fonte/preço ainda não estão frescos.",
      "The data feed or price is outdated."
    ],
    [
      "da carteira: acompanhar concentração",
      "of the portfolio: monitor concentration"
    ],
    [
      "posição(ões) pedem proteção/revisão.",
      "position(s) need protection or review."
    ],
    [
      "Distribuição monitorada pelo Radar.",
      "Allocation monitored by Radar."
    ],
    [
      "RSI fora de extremo de compra/venda",
      "RSI outside buy/sell extremes"
    ],
    [
      "carteira concentrada em uma posição",
      "portfolio concentrated in one position"
    ],
    [
      "memória permanente não configurada",
      "persistent memory not configured"
    ],
    [
      "qualidade técnica mínima de 85/100",
      "minimum technical quality of 85/100"
    ],
    [
      "Aguardando confirmação do mercado",
      "Waiting for market confirmation"
    ],
    [
      "Aguardando confluência dos sinais",
      "Waiting for signal alignment"
    ],
    [
      "IA analisando mercado + carteira…",
      "AI analyzing market and portfolio…"
    ],
    [
      "Maior cautela entre os destaques:",
      "Most caution among highlights:"
    ],
    [
      "da carteira: concentração elevada",
      "of the portfolio: high concentration"
    ],
    [
      "Aguardando confirmação do Radar.",
      "Waiting for Radar confirmation."
    ],
    [
      "Cenário estimado de curto prazo:",
      "Estimated short-term scenario:"
    ],
    [
      "Confluência validada pelo Radar.",
      "Technical alignment validated by Radar."
    ],
    [
      "Esperando confluência adicional.",
      "Waiting for additional technical alignment."
    ],
    [
      "Nenhuma compra confirmada agora.",
      "No confirmed buys right now."
    ],
    [
      "qualidade técnica média positiva",
      "positive average technical quality"
    ],
    [
      "volume 15m confirmando a entrada",
      "15m volume confirming the entry"
    ],
    [
      "Informe um preço maior que zero",
      "Enter a price greater than zero"
    ],
    [
      "com regime de mercado favorável",
      "with a favorable market regime"
    ],
    [
      "A prioridade agora é proteção:",
      "Protection is the priority now:"
    ],
    [
      "Aguardando confirmação técnica",
      "Waiting for technical confirmation"
    ],
    [
      "Aguardando confluência técnica",
      "Waiting for technical alignment"
    ],
    [
      "Sua carteira está concentrada.",
      "Your portfolio is concentrated."
    ],
    [
      "liquidez de mercado suficiente",
      "sufficient market liquidity"
    ],
    [
      "possível continuação da baixa",
      "possible continuation lower"
    ],
    [
      "preço próximo de zona técnica",
      "price near a technical zone"
    ],
    [
      "Inclui cotação desatualizada",
      "Includes an outdated quote"
    ],
    [
      "aguardando confirmação final",
      "waiting for final confirmation"
    ],
    [
      "movimento 24h muito esticado",
      "24h move is overextended"
    ],
    [
      "possível continuação da alta",
      "possible continuation higher"
    ],
    [
      "🛡️ Monitoramento da carteira",
      "🛡️ Portfolio monitoring"
    ],
    [
      "força ADX suficiente no 15m",
      "sufficient ADX strength on 15m"
    ],
    [
      "força relativa acima do BTC",
      "strength above BTC"
    ],
    [
      "Sem alocação técnica agora",
      "No technical allocation right now"
    ],
    [
      "ativo(s) em acompanhamento",
      "asset(s) monitored"
    ],
    [
      "tendência diária favorável",
      "favorable daily trend"
    ],
    [
      "A IA cuidando da carteira",
      "AI managing your portfolio"
    ],
    [
      "Aguardando dados recentes",
      "Waiting for recent data"
    ],
    [
      "a diversificação está boa",
      "diversification is adequate"
    ],
    [
      "tendência 1d desfavorável",
      "unfavorable daily trend"
    ],
    [
      "Aguardando sinal técnico",
      "Waiting for technical signal"
    ],
    [
      "Oportunidades em análise",
      "Opportunities under review"
    ],
    [
      "Sua carteira está vazia.",
      "Your portfolio is empty."
    ],
    [
      "desde a última varredura",
      "since the last scan"
    ],
    [
      "fraqueza relativa ao BTC",
      "weakness relative to BTC"
    ],
    [
      "regime BTC/ETH favorável",
      "favorable BTC/ETH market regime"
    ],
    [
      "● Atualização de mercado",
      "● Market update"
    ],
    [
      "IA cuidando da carteira",
      "AI monitoring your portfolio"
    ],
    [
      "Memória ativa. Comparei",
      "Memory active. I compared"
    ],
    [
      "Novo alerta do mercado.",
      "New market alert."
    ],
    [
      "diversificação limitada",
      "limited diversification"
    ],
    [
      "mercado geral defensivo",
      "defensive broader market"
    ],
    [
      "nenhum sinal confirmado",
      "no confirmed signal"
    ],
    [
      "Aguardando novos dados",
      "Waiting for fresh data"
    ],
    [
      "Aguardar nova leitura.",
      "Wait for the next reading."
    ],
    [
      "Atualização de mercado",
      "Market update"
    ],
    [
      "CANDIDATA • AGUARDANDO",
      "CANDIDATE • WAITING"
    ],
    [
      "O motor prefere manter",
      "The engine prefers to keep"
    ],
    [
      "Sem compra confirmada.",
      "No confirmed buy."
    ],
    [
      "mercado geral em baixa",
      "broader market is bearish"
    ],
    [
      "regime geral favorável",
      "favorable broader market"
    ],
    [
      "risco agregado elevado",
      "elevated overall risk"
    ],
    [
      "risco dentro do perfil",
      "risk within your profile"
    ],
    [
      "volume abaixo do ideal",
      "volume below target"
    ],
    [
      "O Radar está marcando",
      "Radar indicates"
    ],
    [
      "RSI em faixa saudável",
      "RSI in a healthy range"
    ],
    [
      "Rompimento confirmado",
      "Confirmed breakout"
    ],
    [
      "SINAL FORTE DE COMPRA",
      "STRONG BUY SIGNAL"
    ],
    [
      "Variação indisponível",
      "Change unavailable"
    ],
    [
      "da carteira rastreada",
      "of tracked portfolio"
    ],
    [
      "estrutura 4h baixista",
      "bearish 4h structure"
    ],
    [
      "força relativa ao BTC",
      "relative strength versus BTC"
    ],
    [
      "liquidez no percentil",
      "liquidity percentile"
    ],
    [
      "minutos de intervalo;",
      "minutes apart;"
    ],
    [
      "risco acima do perfil",
      "risk exceeds profile"
    ],
    [
      "risco técnico elevado",
      "high technical risk"
    ],
    [
      "Concentração elevada",
      "High concentration"
    ],
    [
      "Dados desatualizados",
      "Stale data"
    ],
    [
      "Divergência de baixa",
      "Bearish divergence"
    ],
    [
      "Movimento relevante:",
      "Significant move:"
    ],
    [
      "a reserva está baixa",
      "reserves are low"
    ],
    [
      "capitalização global",
      "global market cap"
    ],
    [
      "momentum ainda fraco",
      "momentum remains weak"
    ],
    [
      "sinal(is) exibido(s)",
      "signal(s) shown"
    ],
    [
      "⚠️ Pontos de atenção",
      "⚠️ Needs attention"
    ],
    [
      "Atenção no mercado:",
      "Market caution:"
    ],
    [
      "Compras confirmadas",
      "Confirmed buys"
    ],
    [
      "Dados em tempo real",
      "Live data"
    ],
    [
      "Divergência de alta",
      "Bullish divergence"
    ],
    [
      "dos ativos em valor",
      "of portfolio value"
    ],
    [
      "força abaixo do BTC",
      "underperforming BTC"
    ],
    [
      "queda 24h relevante",
      "significant 24h decline"
    ],
    [
      "reserva muito baixa",
      "very low reserve"
    ],
    [
      "risco técnico baixo",
      "low technical risk"
    ],
    [
      "volume insuficiente",
      "insufficient volume"
    ],
    [
      "Última atualização:",
      "Last update:"
    ],
    [
      "AGUARDANDO ENTRADA",
      "WAITING FOR ENTRY"
    ],
    [
      "Aguardando entrada",
      "Waiting for entry"
    ],
    [
      "CANDIDATA A COMPRA",
      "BUY CANDIDATE"
    ],
    [
      "Entrada bloqueada.",
      "Entry blocked."
    ],
    [
      "Falha de pullback:",
      "Failed pullback:"
    ],
    [
      "TENDÊNCIA DE BAIXA",
      "DOWNTREND"
    ],
    [
      "Tendência de baixa",
      "Downtrend"
    ],
    [
      "alta 24h acelerada",
      "rapid 24h rally"
    ],
    [
      "confluência forte;",
      "strong technical alignment;"
    ],
    [
      "estrutura 4h HH/HL",
      "bullish 4h HH/HL structure"
    ],
    [
      "volume ainda baixo",
      "volume remains low"
    ],
    [
      "volume confirmando",
      "volume confirms"
    ],
    [
      "COMPRA CONFIRMADA",
      "CONFIRMED BUY"
    ],
    [
      "Candidata técnica",
      "Technical candidate"
    ],
    [
      "Dados atualizados",
      "Data updated"
    ],
    [
      "Dados recebidos •",
      "Data received •"
    ],
    [
      "Movimento rápido:",
      "Rapid move:"
    ],
    [
      "TENDÊNCIA DE ALTA",
      "UPTREND"
    ],
    [
      "Tendência de alta",
      "Uptrend"
    ],
    [
      "Tendência lateral",
      "Sideways trend"
    ],
    [
      "qualidade técnica",
      "technical quality"
    ],
    [
      "AGUARDAR ENTRADA",
      "WAIT FOR ENTRY"
    ],
    [
      "ANÁLISE PENDENTE",
      "ANALYSIS PENDING"
    ],
    [
      "Aguardando dados",
      "Waiting for data"
    ],
    [
      "Alertas do Radar",
      "Radar alerts"
    ],
    [
      "Falta confirmar:",
      "Still required:"
    ],
    [
      "Mercado em baixa",
      "Bearish market"
    ],
    [
      "VENDA CONFIRMADA",
      "CONFIRMED SELL"
    ],
    [
      "VENDER / REDUZIR",
      "SELL / REDUCE"
    ],
    [
      "distante do VWAP",
      "far from VWAP"
    ],
    [
      "valor aproximado",
      "estimated value"
    ],
    [
      "ADX ainda fraco",
      "ADX still weak"
    ],
    [
      "Atualizar dados",
      "Refresh data"
    ],
    [
      "Dados recebidos",
      "Data received"
    ],
    [
      "Falta confirmar",
      "Still to confirm"
    ],
    [
      "IA indisponível",
      "AI unavailable"
    ],
    [
      "Mercado ao vivo",
      "Live market"
    ],
    [
      "Mercado em alta",
      "Bullish market"
    ],
    [
      "RSI já aquecido",
      "RSI is getting hot"
    ],
    [
      "com preço médio",
      "with cost basis"
    ],
    [
      "EVITAR ENTRADA",
      "AVOID ENTRY"
    ],
    [
      "Maior posição:",
      "Largest holding:"
    ],
    [
      "Mercado agora:",
      "Market now:"
    ],
    [
      "Mercado neutro",
      "Neutral market"
    ],
    [
      "REALIZAR PARTE",
      "TAKE PARTIAL PROFITS"
    ],
    [
      "Sinais ao vivo",
      "Live signals"
    ],
    [
      "risco moderado",
      "moderate risk"
    ],
    [
      "% da carteira",
      "% of portfolio"
    ],
    [
      "AI analisando",
      "AI analyzing"
    ],
    [
      "Extreme Greed",
      "Extreme Greed"
    ],
    [
      "IA analisando",
      "AI analyzing"
    ],
    [
      "Queda rápida:",
      "Rapid drop:"
    ],
    [
      "RISCO ELEVADO",
      "ELEVATED RISK"
    ],
    [
      "medo/ganância",
      "fear/greed"
    ],
    [
      "memória ativa",
      "memory active"
    ],
    [
      "mercado geral",
      "overall market"
    ],
    [
      "Atualizando…",
      "Updating…"
    ],
    [
      "Extreme Fear",
      "Extreme Fear"
    ],
    [
      "RSI esticado",
      "overbought RSI"
    ],
    [
      "alvo técnico",
      "technical target"
    ],
    [
      "movimento de",
      "change of"
    ],
    [
      "volume forte",
      "strong volume"
    ],
    [
      "(confiança ",
      "(confidence "
    ],
    [
      "Abrir Radar",
      "Open Radar"
    ],
    [
      "Forte queda",
      "Sharp drop"
    ],
    [
      "Preço atual",
      "Current price"
    ],
    [
      "RISCO BAIXO",
      "LOW RISK"
    ],
    [
      "RISCO MÉDIO",
      "MEDIUM RISK"
    ],
    [
      "Risco baixo",
      "Low risk"
    ],
    [
      "Risco médio",
      "Medium risk"
    ],
    [
      "SINAL FORTE",
      "STRONG SIGNAL"
    ],
    [
      "Você possui",
      "You hold"
    ],
    [
      "com cotação",
      "with price data"
    ],
    [
      "risco Baixo",
      "low risk"
    ],
    [
      "risco Médio",
      "medium risk"
    ],
    [
      "risco baixo",
      "low risk"
    ],
    [
      "risco médio",
      "medium risk"
    ],
    [
      "Confiança ",
      "Confidence "
    ],
    [
      "EM ANÁLISE",
      "UNDER REVIEW"
    ],
    [
      "Forte alta",
      "Strong rally"
    ],
    [
      "RISCO ALTO",
      "HIGH RISK"
    ],
    [
      "Risco alto",
      "High risk"
    ],
    [
      "risco Alto",
      "high risk"
    ],
    [
      "risco alto",
      "high risk"
    ],
    [
      "volume US$",
      "volume US$"
    ],
    [
      "• filtrado",
      "• filtered"
    ],
    [
      " e score ",
      " and score "
    ],
    [
      " lateral ",
      " sideways "
    ],
    [
      ",lateral ",
      ",sideways "
    ],
    [
      "CONFIANÇA",
      "CONFIDENCE"
    ],
    [
      "Carteira:",
      "Portfolio:"
    ],
    [
      "EM ESPERA",
      "ON HOLD"
    ],
    [
      "em espera",
      "on hold"
    ],
    [
      "simulação",
      "simulation"
    ],
    [
      ", queda ",
      ", down "
    ],
    [
      "LIQUIDEZ",
      "LIQUIDITY"
    ],
    [
      "MOMENTUM",
      "MOMENTUM"
    ],
    [
      "liquidez",
      "liquidity"
    ],
    [
      "segundos",
      "seconds"
    ],
    [
      " queda ",
      " down "
    ],
    [
      "APORTAR",
      "ADD FUNDS"
    ],
    [
      "LATERAL",
      "SIDEWAYS"
    ],
    [
      "Neutral",
      "Neutral"
    ],
    [
      "Resumo ",
      "Summary "
    ],
    [
      "lateral",
      "sideways"
    ],
    [
      "minutos",
      "minutes"
    ],
    [
      " alta ",
      " up "
    ],
    [
      "MANTER",
      "HOLD"
    ],
    [
      "NEUTRO",
      "NEUTRAL"
    ],
    [
      "VOLUME",
      "VOLUME"
    ],
    [
      "em 24h",
      "over 24h"
    ],
    [
      "perfil",
      "profile"
    ],
    [
      "riscos",
      "risks"
    ],
    [
      "BAIXA",
      "DOWN"
    ],
    [
      "Greed",
      "Greed"
    ],
    [
      "nível",
      "level"
    ],
    [
      "ocupa",
      "represents"
    ],
    [
      "preço",
      "price"
    ],
    [
      "queda",
      "downside"
    ],
    [
      "risco",
      "risk"
    ],
    [
      " há ",
      " ago: "
    ],
    [
      "ALTA",
      "UP"
    ],
    [
      "BEAR",
      "BEARISH"
    ],
    [
      "BULL",
      "BULLISH"
    ],
    [
      "Fear",
      "Fear"
    ],
    [
      "alta",
      "upside"
    ],
    [
      "Há",
      "There are"
    ]
  ],
  "es": [
    [
      "Valor e variação de 24h são estimativas de mercado. Resultado não realizado usa apenas posições com preço médio cadastrado; não inclui taxas ou impostos. Pontuação técnica não é probabilidade de lucro.",
      "Los valores y cambios de 24 h son estimaciones. Ganancias/pérdidas no realizadas requieren precio medio y excluyen comisiones e impuestos. La puntuación técnica no es probabilidad de beneficio."
    ],
    [
      "A IA não libera aporte quando o Radar ainda está em espera e não manda reduzir apenas por diferença de alocação.",
      "La IA no autoriza aportes mientras Radar espera, ni recomienda reducir solo por diferencia de asignación."
    ],
    [
      "Nenhuma compra está confirmada agora. A IA mantém o capital novo em espera em vez de forçar um aporte.",
      "No hay compras confirmadas. La IA mantiene el capital nuevo en reserva en vez de forzar una entrada."
    ],
    [
      "Quando preço e dados técnicos forem atualizados, o Radar mostrará os alertas verificáveis.",
      "Radar mostrará alertas verificables cuando se actualicen los precios y los datos técnicos."
    ],
    [
      "Aguardando estrutura, tendência e indicadores técnicos antes de classificar a entrada.",
      "Esperando estructura, tendencia e indicadores técnicos antes de evaluar la entrada."
    ],
    [
      "A análise está ativa, mas a memória permanente não está disponível nesta execução.",
      "El análisis está activo, pero la memoria persistente no está disponible en esta sesión."
    ],
    [
      "Memória ativa. A próxima avaliação só ocorre depois de uma janela mínima de",
      "Memoria activa. La próxima evaluación solo ocurrirá después de al menos"
    ],
    [
      "posição(ões) seguem em espera e o capital novo deve permanecer reservado.",
      "posición(es) siguen en espera y el capital nuevo debe quedar reservado."
    ],
    [
      "Sem alertas de concentração extrema ou de dados ausentes nesta leitura.",
      "Sin alertas de concentración extrema ni datos faltantes en esta lectura."
    ],
    [
      "cenário incompleto; aguardar melhora antes de elevar a exposição.",
      "escenario incompleto; espera una mejora antes de aumentar la exposición."
    ],
    [
      "💵 Aporte novo: manter em reserva até surgir confirmação técnica.",
      "💵 Nuevo aporte: mantener en reserva hasta confirmación técnica."
    ],
    [
      "A IA bloqueou qualquer movimentação até os dados normalizarem.",
      "La IA bloqueó acciones nuevas hasta que los datos se actualicen."
    ],
    [
      "A IA usa a mesma decisão para carteira, aporte e oportunidades",
      "La IA utiliza una sola decisión para cartera, aportes y oportunidades"
    ],
    [
      "Importe um print ou adicione moedas manualmente para começar.",
      "Importa una captura o añade monedas manualmente para empezar."
    ],
    [
      "IA temporariamente indisponível • nova tentativa automática",
      "IA temporalmente no disponible • nuevo intento automático"
    ],
    [
      "Sua carteira ainda não foi enviada para a IA nesta leitura.",
      "Tu cartera todavía no se ha enviado a la IA en esta lectura."
    ],
    [
      "posição(ões) da carteira com entrada confirmada pelo Radar.",
      "posición(es) de la cartera con entrada confirmada por Radar."
    ],
    [
      "posição(ões) pedem redução/revisão antes de aumentar risco.",
      "posición(es) requieren reducción o revisión antes de aumentar el riesgo."
    ],
    [
      "Esse ativo não aparece na carteira enviada nesta leitura.",
      "Este activo no aparece en tu cartera para esta lectura."
    ],
    [
      "Sua carteira não tem aporte liberado agora, mas existem",
      "Tu cartera no permite aportes nuevos ahora, pero hay"
    ],
    [
      "oportunidade(s) externa(s) confirmada(s) para observar.",
      "oportunidad(es) externas confirmadas para observar."
    ],
    [
      "A carteira merece reequilíbrio antes de aumentar risco",
      "Conviene reequilibrar antes de aumentar el riesgo"
    ],
    [
      "Sem posições precificadas para mostrar a distribuição.",
      "No hay posiciones con precio para mostrar la distribución."
    ],
    [
      "Movimento confirmado em duas leituras; score de risco",
      "Movimiento confirmado en dos lecturas; puntuación de riesgo"
    ],
    [
      "Revisar proteção e concentração antes de movimentar.",
      "Revisa la protección y concentración antes de actuar."
    ],
    [
      "Reserva de moedas estáveis abaixo de 5% da carteira",
      "Reserva de monedas estables inferior al 5% de la cartera"
    ],
    [
      "tendência de alta alinhada entre os tempos gráficos",
      "tendencia alcista alineada en los marcos temporales"
    ],
    [
      "Adicione seus ativos para iniciar o monitoramento.",
      "Añade activos para iniciar el monitoreo."
    ],
    [
      "ativo(s) sem cotação: não incluídos no valor total",
      "activo(s) sin precio: excluidos del valor total"
    ],
    [
      "Conferir posição, risco e taxas antes de decidir.",
      "Revisa posición, riesgo y comisiones antes de decidir."
    ],
    [
      "Confira valor do aporte e limite de concentração.",
      "Comprueba el importe del aporte y el límite de concentración."
    ],
    [
      "boa base técnica, mas ainda merece confirmação de",
      "buena base técnica, pero aún requiere confirmación de"
    ],
    [
      "movimento 24h já avançado; evitar perseguir preço",
      "movimiento de 24 h avanzado; evita perseguir precio"
    ],
    [
      "Confluência confirmada no Radar V5 e no mercado;",
      "Confluencia confirmada por Radar V5 y el mercado;"
    ],
    [
      "avançaram. Os pesos são ajustados gradualmente.",
      "avanzaron. Los pesos se ajustan gradualmente."
    ],
    [
      "em reserva até aparecer confluência suficiente.",
      "en reserva hasta que haya confluencia suficiente."
    ],
    [
      "Aguardar fechamento das confirmações técnicas.",
      "Espera el cierre de las confirmaciones técnicas."
    ],
    [
      "alta de 24h menos esticada (aguardar correção)",
      "subida de 24 h menos extendida (espera corrección)"
    ],
    [
      "ativo(s) com bloqueio ou risco técnico elevado",
      "activo(s) bloqueados o con alto riesgo técnico"
    ],
    [
      "posição(ões) da carteira liberadas para aporte",
      "posición(es) aptas para aportes"
    ],
    [
      "Condição de redução sinalizada pela carteira.",
      "Condición de reducción detectada en la cartera."
    ],
    [
      "abaixo do VWAP; reversão ainda não confirmada",
      "por debajo del VWAP; reversión aún sin confirmar"
    ],
    [
      "Aguardar confirmação, sem aporte automático.",
      "Espera confirmación, sin aporte automático."
    ],
    [
      "Há cotações desatualizadas no valor estimado",
      "El valor estimado incluye cotizaciones desactualizadas"
    ],
    [
      "Avaliar liquidez e risco antes de investir.",
      "Evalúa liquidez y riesgo antes de invertir."
    ],
    [
      "estrutura 4h ainda mista; falta confirmação",
      "estructura de 4 h mixta; falta confirmación"
    ],
    [
      "minutos para evitar aprendizado por ruído.",
      "minutos para evitar aprender del ruido."
    ],
    [
      "A IA bloqueia novos aportes conflitantes.",
      "La IA bloquea nuevos aportes contradictorios."
    ],
    [
      "A carteira está em condição intermediária",
      "La cartera está en situación intermedia"
    ],
    [
      "Analisando sinais e buscando confirmações",
      "Analizando señales y buscando confirmaciones"
    ],
    [
      "oportunidade(s) externa(s) confirmada(s).",
      "oportunidad(es) externa(s) confirmada(s)."
    ],
    [
      "A carteira está estruturalmente saudável",
      "La cartera es estructuralmente sólida"
    ],
    [
      "Nenhuma moeda corresponde a este filtro.",
      "Ninguna moneda coincide con este filtro."
    ],
    [
      "e o mercado geral pede postura defensiva",
      "y el mercado general exige prudencia"
    ],
    [
      "indicadores 15m, 4h e diário atualizados",
      "indicadores actualizados de 15 min, 4 h y diario"
    ],
    [
      "Faltam critérios para liberar a compra.",
      "Aún faltan criterios para permitir la compra."
    ],
    [
      "cotação e volume de mercado atualizados",
      "precio y volumen de mercado actualizados"
    ],
    [
      "reserva alta; pode haver capital ocioso",
      "reserva alta; puede haber capital sin invertir"
    ],
    [
      "sinais de uma fotografia com pelo menos",
      "señales de una muestra separada por al menos"
    ],
    [
      "aguardando confirmação de preço/volume",
      "esperando confirmación de precio/volumen"
    ],
    [
      "capital novo deve permanecer reservado",
      "el capital nuevo debe permanecer en reserva"
    ],
    [
      "há concentração elevada em uma posição",
      "hay alta concentración en una posición"
    ],
    [
      "preço próximo de zona saudável do VWAP",
      "precio cerca de una zona saludable de VWAP"
    ],
    [
      "confirmação final do motor técnico V5",
      "confirmación final del motor técnico V5"
    ],
    [
      "estrutura de alta HH/HL no gráfico 4h",
      "estructura alcista HH/HL en el gráfico de 4 h"
    ],
    [
      "Confluência detectada pelo motor V18",
      "Confluencia detectada por V18"
    ],
    [
      "Fonte/preço ainda não estão frescos.",
      "La fuente o el precio están desactualizados."
    ],
    [
      "da carteira: acompanhar concentração",
      "de la cartera: vigilar concentración"
    ],
    [
      "posição(ões) pedem proteção/revisão.",
      "posición(es) necesitan protección o revisión."
    ],
    [
      "Distribuição monitorada pelo Radar.",
      "Distribución monitoreada por Radar."
    ],
    [
      "RSI fora de extremo de compra/venda",
      "RSI fuera de extremos de compra/venta"
    ],
    [
      "carteira concentrada em uma posição",
      "cartera concentrada en una posición"
    ],
    [
      "memória permanente não configurada",
      "memoria persistente no configurada"
    ],
    [
      "qualidade técnica mínima de 85/100",
      "calidad técnica mínima de 85/100"
    ],
    [
      "Aguardando confirmação do mercado",
      "Esperando confirmación del mercado"
    ],
    [
      "Aguardando confluência dos sinais",
      "Esperando alineación de señales"
    ],
    [
      "IA analisando mercado + carteira…",
      "IA analizando mercado y cartera…"
    ],
    [
      "Maior cautela entre os destaques:",
      "Mayor precaución entre destacados:"
    ],
    [
      "da carteira: concentração elevada",
      "de la cartera: concentración alta"
    ],
    [
      "Aguardando confirmação do Radar.",
      "Esperando confirmación de Radar."
    ],
    [
      "Cenário estimado de curto prazo:",
      "Escenario estimado a corto plazo:"
    ],
    [
      "Confluência validada pelo Radar.",
      "Confluencia validada por Radar."
    ],
    [
      "Esperando confluência adicional.",
      "Esperando confluencia técnica adicional."
    ],
    [
      "Nenhuma compra confirmada agora.",
      "Ninguna compra confirmada ahora."
    ],
    [
      "qualidade técnica média positiva",
      "calidad técnica media positiva"
    ],
    [
      "volume 15m confirmando a entrada",
      "volumen de 15 min confirmando la entrada"
    ],
    [
      "Informe um preço maior que zero",
      "Introduce un precio mayor que cero"
    ],
    [
      "com regime de mercado favorável",
      "con un régimen de mercado favorable"
    ],
    [
      "A prioridade agora é proteção:",
      "La prioridad ahora es proteger:"
    ],
    [
      "Aguardando confirmação técnica",
      "Esperando confirmación técnica"
    ],
    [
      "Aguardando confluência técnica",
      "Esperando confluencia técnica"
    ],
    [
      "Sua carteira está concentrada.",
      "Tu cartera está concentrada."
    ],
    [
      "liquidez de mercado suficiente",
      "liquidez de mercado suficiente"
    ],
    [
      "possível continuação da baixa",
      "posible continuación bajista"
    ],
    [
      "preço próximo de zona técnica",
      "precio próximo a zona técnica"
    ],
    [
      "Inclui cotação desatualizada",
      "Incluye cotización desactualizada"
    ],
    [
      "aguardando confirmação final",
      "esperando confirmación final"
    ],
    [
      "movimento 24h muito esticado",
      "movimiento de 24 h demasiado extendido"
    ],
    [
      "possível continuação da alta",
      "posible continuación alcista"
    ],
    [
      "🛡️ Monitoramento da carteira",
      "🛡️ Monitoreo de cartera"
    ],
    [
      "força ADX suficiente no 15m",
      "fuerza ADX suficiente en 15 min"
    ],
    [
      "força relativa acima do BTC",
      "fuerza relativa superior a BTC"
    ],
    [
      "Sem alocação técnica agora",
      "Sin asignación técnica por ahora"
    ],
    [
      "ativo(s) em acompanhamento",
      "activo(s) monitoreado(s)"
    ],
    [
      "tendência diária favorável",
      "tendencia diaria favorable"
    ],
    [
      "A IA cuidando da carteira",
      "IA gestionando tu cartera"
    ],
    [
      "Aguardando dados recentes",
      "Esperando datos recientes"
    ],
    [
      "a diversificação está boa",
      "la diversificación es adecuada"
    ],
    [
      "tendência 1d desfavorável",
      "tendencia diaria desfavorable"
    ],
    [
      "Aguardando sinal técnico",
      "Esperando señal técnica"
    ],
    [
      "Oportunidades em análise",
      "Oportunidades en análisis"
    ],
    [
      "Sua carteira está vazia.",
      "Tu cartera está vacía."
    ],
    [
      "desde a última varredura",
      "desde el último análisis"
    ],
    [
      "fraqueza relativa ao BTC",
      "debilidad relativa frente a BTC"
    ],
    [
      "regime BTC/ETH favorável",
      "régimen BTC/ETH favorable"
    ],
    [
      "● Atualização de mercado",
      "● Actualización de mercado"
    ],
    [
      "IA cuidando da carteira",
      "IA cuidando de tu cartera"
    ],
    [
      "Memória ativa. Comparei",
      "Memoria activa. Comparé"
    ],
    [
      "Novo alerta do mercado.",
      "Nueva alerta del mercado."
    ],
    [
      "diversificação limitada",
      "diversificación limitada"
    ],
    [
      "mercado geral defensivo",
      "mercado general defensivo"
    ],
    [
      "nenhum sinal confirmado",
      "ninguna señal confirmada"
    ],
    [
      "Aguardando novos dados",
      "Esperando datos nuevos"
    ],
    [
      "Aguardar nova leitura.",
      "Espera la próxima lectura."
    ],
    [
      "Atualização de mercado",
      "Actualización de mercado"
    ],
    [
      "CANDIDATA • AGUARDANDO",
      "CANDIDATA • ESPERANDO"
    ],
    [
      "O motor prefere manter",
      "El motor prefiere mantener"
    ],
    [
      "Sem compra confirmada.",
      "Sin compra confirmada."
    ],
    [
      "mercado geral em baixa",
      "mercado general bajista"
    ],
    [
      "regime geral favorável",
      "mercado general favorable"
    ],
    [
      "risco agregado elevado",
      "riesgo global elevado"
    ],
    [
      "risco dentro do perfil",
      "riesgo dentro de tu perfil"
    ],
    [
      "volume abaixo do ideal",
      "volumen por debajo de lo ideal"
    ],
    [
      "O Radar está marcando",
      "Radar indica"
    ],
    [
      "RSI em faixa saudável",
      "RSI en un rango saludable"
    ],
    [
      "Rompimento confirmado",
      "Ruptura confirmada"
    ],
    [
      "SINAL FORTE DE COMPRA",
      "SEÑAL FUERTE DE COMPRA"
    ],
    [
      "Variação indisponível",
      "Variación no disponible"
    ],
    [
      "da carteira rastreada",
      "de la cartera monitoreada"
    ],
    [
      "estrutura 4h baixista",
      "estructura bajista de 4 h"
    ],
    [
      "força relativa ao BTC",
      "fuerza relativa frente a BTC"
    ],
    [
      "liquidez no percentil",
      "percentil de liquidez"
    ],
    [
      "minutos de intervalo;",
      "minutos de intervalo;"
    ],
    [
      "risco acima do perfil",
      "el riesgo supera el perfil"
    ],
    [
      "risco técnico elevado",
      "riesgo técnico elevado"
    ],
    [
      "Concentração elevada",
      "Concentración elevada"
    ],
    [
      "Dados desatualizados",
      "Datos desactualizados"
    ],
    [
      "Divergência de baixa",
      "Divergencia bajista"
    ],
    [
      "Movimento relevante:",
      "Movimiento relevante:"
    ],
    [
      "a reserva está baixa",
      "la reserva es baja"
    ],
    [
      "capitalização global",
      "capitalización global"
    ],
    [
      "momentum ainda fraco",
      "impulso todavía débil"
    ],
    [
      "sinal(is) exibido(s)",
      "señal(es) mostrada(s)"
    ],
    [
      "⚠️ Pontos de atenção",
      "⚠️ Puntos de atención"
    ],
    [
      "Atenção no mercado:",
      "Atención al mercado:"
    ],
    [
      "Compras confirmadas",
      "Compras confirmadas"
    ],
    [
      "Dados em tempo real",
      "Datos en tiempo real"
    ],
    [
      "Divergência de alta",
      "Divergencia alcista"
    ],
    [
      "dos ativos em valor",
      "del valor de los activos"
    ],
    [
      "força abaixo do BTC",
      "fuerza inferior a BTC"
    ],
    [
      "queda 24h relevante",
      "caída importante de 24 h"
    ],
    [
      "reserva muito baixa",
      "reserva muy baja"
    ],
    [
      "risco técnico baixo",
      "riesgo técnico bajo"
    ],
    [
      "volume insuficiente",
      "volumen insuficiente"
    ],
    [
      "Última atualização:",
      "Última actualización:"
    ],
    [
      "AGUARDANDO ENTRADA",
      "ESPERANDO ENTRADA"
    ],
    [
      "Aguardando entrada",
      "Esperando entrada"
    ],
    [
      "CANDIDATA A COMPRA",
      "CANDIDATA A COMPRA"
    ],
    [
      "Entrada bloqueada.",
      "Entrada bloqueada."
    ],
    [
      "Falha de pullback:",
      "Fallo de retroceso:"
    ],
    [
      "TENDÊNCIA DE BAIXA",
      "TENDENCIA BAJISTA"
    ],
    [
      "Tendência de baixa",
      "Tendencia bajista"
    ],
    [
      "alta 24h acelerada",
      "subida acelerada de 24 h"
    ],
    [
      "confluência forte;",
      "confluencia técnica fuerte;"
    ],
    [
      "estrutura 4h HH/HL",
      "estructura alcista HH/HL de 4 h"
    ],
    [
      "volume ainda baixo",
      "el volumen sigue bajo"
    ],
    [
      "volume confirmando",
      "volumen confirmando"
    ],
    [
      "COMPRA CONFIRMADA",
      "COMPRA CONFIRMADA"
    ],
    [
      "Candidata técnica",
      "Candidata técnica"
    ],
    [
      "Dados atualizados",
      "Datos actualizados"
    ],
    [
      "Dados recebidos •",
      "Datos recibidos •"
    ],
    [
      "Movimento rápido:",
      "Movimiento rápido:"
    ],
    [
      "TENDÊNCIA DE ALTA",
      "TENDENCIA ALCISTA"
    ],
    [
      "Tendência de alta",
      "Tendencia alcista"
    ],
    [
      "Tendência lateral",
      "Tendencia lateral"
    ],
    [
      "qualidade técnica",
      "calidad técnica"
    ],
    [
      "AGUARDAR ENTRADA",
      "ESPERAR ENTRADA"
    ],
    [
      "ANÁLISE PENDENTE",
      "ANÁLISIS PENDIENTE"
    ],
    [
      "Aguardando dados",
      "Esperando datos"
    ],
    [
      "Alertas do Radar",
      "Alertas de Radar"
    ],
    [
      "Falta confirmar:",
      "Falta confirmar:"
    ],
    [
      "Mercado em baixa",
      "Mercado bajista"
    ],
    [
      "VENDA CONFIRMADA",
      "VENTA CONFIRMADA"
    ],
    [
      "VENDER / REDUZIR",
      "VENDER / REDUCIR"
    ],
    [
      "distante do VWAP",
      "lejos del VWAP"
    ],
    [
      "valor aproximado",
      "valor aproximado"
    ],
    [
      "ADX ainda fraco",
      "ADX aún débil"
    ],
    [
      "Atualizar dados",
      "Actualizar datos"
    ],
    [
      "Dados recebidos",
      "Datos recibidos"
    ],
    [
      "Falta confirmar",
      "Falta confirmar"
    ],
    [
      "IA indisponível",
      "IA no disponible"
    ],
    [
      "Mercado ao vivo",
      "Mercado en vivo"
    ],
    [
      "Mercado em alta",
      "Mercado alcista"
    ],
    [
      "RSI já aquecido",
      "RSI ya sobrecalentado"
    ],
    [
      "com preço médio",
      "con precio medio"
    ],
    [
      "EVITAR ENTRADA",
      "EVITAR ENTRADA"
    ],
    [
      "Maior posição:",
      "Mayor posición:"
    ],
    [
      "Mercado agora:",
      "Mercado ahora:"
    ],
    [
      "Mercado neutro",
      "Mercado neutral"
    ],
    [
      "REALIZAR PARTE",
      "REALIZAR PARTE"
    ],
    [
      "Sinais ao vivo",
      "Señales en vivo"
    ],
    [
      "risco moderado",
      "riesgo moderado"
    ],
    [
      "% da carteira",
      "% de la cartera"
    ],
    [
      "AI analisando",
      "IA analizando"
    ],
    [
      "Extreme Greed",
      "Codicia extrema"
    ],
    [
      "IA analisando",
      "IA analizando"
    ],
    [
      "Queda rápida:",
      "Caída rápida:"
    ],
    [
      "RISCO ELEVADO",
      "RIESGO ELEVADO"
    ],
    [
      "medo/ganância",
      "miedo/codicia"
    ],
    [
      "memória ativa",
      "memoria activa"
    ],
    [
      "mercado geral",
      "mercado general"
    ],
    [
      "Atualizando…",
      "Actualizando…"
    ],
    [
      "Extreme Fear",
      "Miedo extremo"
    ],
    [
      "RSI esticado",
      "RSI sobrecomprado"
    ],
    [
      "alvo técnico",
      "objetivo técnico"
    ],
    [
      "movimento de",
      "movimiento de"
    ],
    [
      "volume forte",
      "volumen fuerte"
    ],
    [
      "(confiança ",
      "(confianza "
    ],
    [
      "Abrir Radar",
      "Abrir Radar"
    ],
    [
      "Forte queda",
      "Caída fuerte"
    ],
    [
      "Preço atual",
      "Precio actual"
    ],
    [
      "RISCO BAIXO",
      "RIESGO BAJO"
    ],
    [
      "RISCO MÉDIO",
      "RIESGO MEDIO"
    ],
    [
      "Risco baixo",
      "Riesgo bajo"
    ],
    [
      "Risco médio",
      "Riesgo medio"
    ],
    [
      "SINAL FORTE",
      "SEÑAL FUERTE"
    ],
    [
      "Você possui",
      "Tienes"
    ],
    [
      "com cotação",
      "con cotización"
    ],
    [
      "risco Baixo",
      "riesgo bajo"
    ],
    [
      "risco Médio",
      "riesgo medio"
    ],
    [
      "risco baixo",
      "riesgo bajo"
    ],
    [
      "risco médio",
      "riesgo medio"
    ],
    [
      "Confiança ",
      "Confianza "
    ],
    [
      "EM ANÁLISE",
      "EN ANÁLISIS"
    ],
    [
      "Forte alta",
      "Fuerte subida"
    ],
    [
      "RISCO ALTO",
      "RIESGO ALTO"
    ],
    [
      "Risco alto",
      "Riesgo alto"
    ],
    [
      "risco Alto",
      "riesgo alto"
    ],
    [
      "risco alto",
      "riesgo alto"
    ],
    [
      "volume US$",
      "volumen USD"
    ],
    [
      "• filtrado",
      "• filtrado"
    ],
    [
      " e score ",
      " y puntuación "
    ],
    [
      " lateral ",
      " lateral "
    ],
    [
      ",lateral ",
      ",lateral "
    ],
    [
      "CONFIANÇA",
      "CONFIANZA"
    ],
    [
      "Carteira:",
      "Cartera:"
    ],
    [
      "EM ESPERA",
      "EN ESPERA"
    ],
    [
      "em espera",
      "en espera"
    ],
    [
      "simulação",
      "simulación"
    ],
    [
      ", queda ",
      ", caída "
    ],
    [
      "LIQUIDEZ",
      "LIQUIDEZ"
    ],
    [
      "MOMENTUM",
      "IMPULSO"
    ],
    [
      "liquidez",
      "liquidez"
    ],
    [
      "segundos",
      "segundos"
    ],
    [
      " queda ",
      " caída "
    ],
    [
      "APORTAR",
      "APORTAR"
    ],
    [
      "LATERAL",
      "LATERAL"
    ],
    [
      "Neutral",
      "Neutral"
    ],
    [
      "Resumo ",
      "Resumen "
    ],
    [
      "lateral",
      "lateral"
    ],
    [
      "minutos",
      "minutos"
    ],
    [
      " alta ",
      " alza "
    ],
    [
      "MANTER",
      "MANTENER"
    ],
    [
      "NEUTRO",
      "NEUTRAL"
    ],
    [
      "VOLUME",
      "VOLUMEN"
    ],
    [
      "em 24h",
      "en 24 h"
    ],
    [
      "perfil",
      "perfil"
    ],
    [
      "riscos",
      "riesgos"
    ],
    [
      "BAIXA",
      "BAJA"
    ],
    [
      "Greed",
      "Codicia"
    ],
    [
      "nível",
      "nivel"
    ],
    [
      "ocupa",
      "representa"
    ],
    [
      "preço",
      "precio"
    ],
    [
      "queda",
      "bajada"
    ],
    [
      "risco",
      "riesgo"
    ],
    [
      " há ",
      " hace "
    ],
    [
      "ALTA",
      "ALZA"
    ],
    [
      "BEAR",
      "BAJISTA"
    ],
    [
      "BULL",
      "ALCISTA"
    ],
    [
      "Fear",
      "Miedo"
    ],
    [
      "alta",
      "subida"
    ],
    [
      "Há",
      "Hay"
    ]
  ]
};

  function resolve(choice){
    if(choice&&choice!=='auto')return ['en','es','pt-BR'].includes(choice)?choice:'pt-BR';
    const n=(navigator.language||'pt-BR').toLowerCase();
    if(n.startsWith('en'))return'en'; if(n.startsWith('es'))return'es'; return'pt-BR';
  }
  /* V19.5: traduções completas para cartões dinâmicos de carteira, aporte e Radar.
     Fontes do aplicativo continuam PT-BR: nunca traduzimos ticker, preço ou símbolo. */
  Object.assign(STRINGS.en,{
    'Moeda':'Coin','Qtd.':'Qty.','Quantidade':'Quantity','Valor':'Value','Ações':'Actions',
    'Editar':'Edit','Excluir':'Delete','Tendência de preço • últimos 7 dias':'Price trend • last 7 days',
    'Carregando gráfico…':'Loading chart…','Sua carteira ainda está vazia.':'Your portfolio is still empty.',
    'Dicas para minha carteira':'Tips for my portfolio','💡 Dicas para minha carteira':'💡 Portfolio tips',
    'O que merece sua atenção agora, usando composição da carteira + direcionamento técnico do Radar.':'What deserves attention now, based on portfolio composition and Radar technical analysis.',
    '📌 O que fazer agora':'📌 What to do now','Revisar concentração em USDT':'Review USDT concentration',
    'O Radar detectou pressão de venda confirmada por liquidez. Considere reduzir exposição após revisar o mercado.':'Radar detected selling pressure supported by liquidity. Reassess your exposure after reviewing the market.',
    'Revisar posições muito pequenas':'Review very small positions','Sem ação urgente':'No urgent action',
    'Os dados atuais não mostram uma mudança forte que exija ação imediata. Continue acompanhando os sinais.':'Current data shows no major change requiring immediate action. Keep watching the signals.',
    'O preço teve uma alta forte, mas alta diária não comprova lucro pessoal. Confira seu preço médio, taxas e risco antes de decidir.':'Price rose sharply, but the daily gain does not prove your personal profit. Check entry price, fees and risk before deciding.',
    'O movimento está esticado. Considere realizar uma parte e manter o restante exposto.':'The price move is extended. Consider reviewing partial profit taking and remaining exposure.',
    'As dicas são informativas e mudam com os dados do mercado. Não executam ordens automaticamente.':'Tips are informational, change with market data, and never execute orders automatically.',
    '🧭 Direcionamento da minha carteira':'🧭 Portfolio guidance',
    'Leitura automática por ativo usando preço, variação 24h, volume e liquidez relativa.':'Asset-by-asset guidance using price, 24h change, volume and relative liquidity.',
    'Direcionamento informativo: não executa ordens e não usa boatos como gatilho isolado. Reavalie antes de operar.':'Informational guidance; no trades are executed and rumors alone never trigger signals. Reassess before trading.',
    '🔵 Mercado mais comprador':'🔵 Mostly buying market','Mercado mais comprador':'Mostly buying market',
    '📊 Informações do mercado':'📊 Market information','Clima geral':'Market sentiment',
    'Sua carteira · média 24h':'Your portfolio · 24h average',
    'Ativos em upside':'Assets rising','Ativos em downside':'Assets falling',
    'Atenção ao peso de':'Review weight of','Revisar concentração em':'Review concentration in',
    'Revisar alta em':'Review strong rise in','Avaliar lucro em':'Review possible gain in',
    'AVALIAR ALTA':'REVIEW RALLY','VENDER / REDUZIR':'SELL / REDUCE','ATENÇÃO PARA VENDA':'SELLING RISK',
    'AGUARDAR ENTRADA':'WAIT FOR ENTRY','MANTER':'HOLD','AGUARDAR':'WAIT',
    'COMPRAR / APORTAR':'BUY / ADD','REALIZAR PARTE':'REVIEW PARTIAL SALE',
    'RESERVA ESTRATÉGICA':'STRATEGIC RESERVE','SEM COMPRA':'NO BUY SIGNAL','🔵 ESTÁVEL':'🔵 STABLE',
    'Ativo de referência/estável; sem sinal direcional pelo Radar.':'Stable reference asset; Radar has no directional signal.',
    'Dados de mercado ainda insuficientes.':'Market data is not sufficient yet.',
    'Sem confirmação suficiente para comprar ou vender.':'Not enough confirmation to buy or sell.',
    'Entrada com preço e liquidez alinhados.':'Price and liquidity support the entry.',
    'Há sinais favoráveis, mas a confirmação ainda é parcial.':'Some signals are favorable, but confirmation is still partial.',
    'Analisando os ativos da carteira…':'Analyzing portfolio assets…',
    '🎯 Melhores opções da sua carteira':'🎯 Portfolio highlights',
    '🌐 Alarmes de compra do mercado':'🌐 Market buy alerts',
    'Nenhuma oportunidade confirmada no mercado agora. Aguardando preço e liquidez alinharem.':'No confirmed market opportunity right now. Waiting for price and liquidity to align.',
    'Radar informativo: nenhuma ordem é enviada automaticamente e boatos não são usados como gatilho isolado.':'Informational Radar: no automatic orders. Rumors alone cannot trigger a trade.',
    'V18 • MARKET INTELLIGENCE':'V18 • MARKET INTELLIGENCE',
    '🧠 Central de Mercado & Aporte':'🧠 Market & Contribution Center',
    'Cruza tendência, momentum, volume, liquidez, VWAP, força vs BTC, risco, regime e composição da sua carteira.':'Combines trend, momentum, volume, liquidity, VWAP, strength vs BTC, risk, market regime and portfolio composition.',
    'análise ativa':'analysis active','Regime':'Regime','Saúde da carteira':'Portfolio health',
    'Reserva atual':'Current reserve','Leitura da IA/Radar':'AI/Radar reading',
    'Simulação inteligente de aporte':'Smart contribution simulator',
    'Compare perfis antes de decidir como distribuir capital novo.':'Compare profiles before allocating new capital.',
    'Aporte':'Contribution','Perfil':'Profile','Objetivo':'Goal','Entrada':'Entry',
    'Conservador':'Conservative','Equilibrado':'Balanced','Agressivo':'Aggressive',
    'Proteção':'Protection','Equilíbrio':'Balance','Crescimento':'Growth',
    'Parcelada':'Phased','Só após confirmação':'After confirmation only','Mais imediata':'More immediate',
    'Aguardar':'Wait','Divisão sugerida — Equilibrado':'Suggested allocation — Balanced',
    'Divisão sugerida — Conservador':'Suggested allocation — Conservative',
    'Divisão sugerida — Agressivo':'Suggested allocation — Aggressive',
    'Reserva + ativos priorizados com limite de concentração.':'Reserve + prioritized assets within concentration limits.',
    'Sem alocação técnica agora':'No technical allocation right now',
    'Reserva de':'Reserve of','aguardando confirmação':'waiting for confirmation',
    'Ativos sob observação (não são compras)':'Assets under observation (not buy signals)',
    'Todos os perfis estão em espera porque não há compras tecnicamente confirmadas. Os perfis mudam limites e riscos, mas não inventam sinais.':'All profiles are waiting because there are no technically confirmed buys. Profiles change risk limits, not signal confirmation.',
    'A escolha de perfil não libera compras sem confirmação, por isso os três cenários podem manter 100% em reserva.':'Choosing a profile cannot bypass confirmation. All three scenarios may therefore retain a 100% reserve.',
    'As entradas só entram na divisão após confirmação.':'Assets are only allocated after confirmation.',
    'Aguarde nova leitura do mercado ou atualize os dados. Não há aporte obrigatório.':'Wait for new market data or refresh. No contribution is required.',
    'Ranking técnico do mercado':'Market technical ranking','Qualidade do sinal, não previsão de lucro.':'Signal quality, not a profit forecast.',
    'O que evitar ou esperar':'What to avoid or wait for','Ativos com risco, timing ruim ou bloqueios técnicos.':'Assets with risk, poor timing or technical blockers.',
    'Nenhum bloqueio forte entre os ativos analisados agora.':'No strong blockers among assets analyzed now.',
    'Simulação informativa. O Cripto Radar não executa ordens, não garante lucro e não substitui avaliação financeira individual.':'Informational simulation only. Cripto Radar does not execute trades, guarantee profits, or replace individual financial assessment.',
    '🛡️ Reserva estratégica':'🛡️ Strategic reserve','Agora':'Now','Correção':'Pullback','Confirmação':'Confirmation',
    'qualidade':'quality','do aporte':'of contribution', 'Em correção':'On pullback','Na confirmação':'On confirmation',
    'Tendência':'Trend','Liquidez':'Liquidity','Risco':'Risk','Favorável':'Favorable','Seletivo':'Selective','Defensivo':'Defensive',
    'carteira vazia':'empty portfolio','risco médio':'medium risk','risco baixo':'low risk','risco alto':'high risk',
    'ALTA':'BULLISH','BAIXA':'BEARISH','LATERAL':'RANGE','NEUTRO':'NEUTRAL',
    'CANDIDATA • AGUARDANDO':'CANDIDATE • WAITING','SINAL FORTE DE COMPRA':'STRONG BUY SIGNAL',
    'Sem compra confirmada.':'No confirmed buy.','Entrada bloqueada.':'Entry blocked.',
    'Aguardar nova leitura.':'Wait for a new reading.',
    'ANÁLISE PENDENTE':'ANALYSIS PENDING','Dados insuficientes:':'Insufficient data:',
    'Falta confirmar:':'Still needs confirmation:',
    'Aguardando estrutura, tendência e indicadores técnicos antes de classificar a entrada.':'Waiting for structure, trend, and technical indicators before classifying an entry.',
    'Estratégia conservadora':'Conservative strategy',
    'Nenhuma compra confirmada agora':'No confirmed buy right now',
    'Nenhuma compra confirmada agora.':'No confirmed buy right now.',
    'A carteira está estruturalmente saudável':'The portfolio is structurally healthy',
    'A carteira está em condição intermediária':'The portfolio is in moderate condition',
    'A carteira merece reequilíbrio antes de aumentar risco':'The portfolio needs rebalancing before adding risk',
    'há concentração elevada em uma posição':'one position has high concentration',
    'a diversificação está boa':'diversification is good','a reserva está baixa':'cash reserves are low',
    'com regime de mercado favorável':'under a favorable market regime',
    'e o mercado geral pede postura defensiva':'and the broad market calls for caution',
    'O motor prefere manter':'The engine prefers to keep','em reserva até aparecer confluência suficiente.':'in reserve until technical confirmation improves.',
    'confluência técnica e validação dos sinais':'technical confluence and signal validation',
    'Moedas e posições':'Coins and positions'
  });
  Object.assign(STRINGS.es,{
    'Moeda':'Moneda','Qtd.':'Cant.','Quantidade':'Cantidad','Valor':'Valor','Ações':'Acciones',
    'Editar':'Editar','Excluir':'Eliminar','Tendência de preço • últimos 7 dias':'Tendencia de precio • últimos 7 días',
    'Carregando gráfico…':'Cargando gráfico…','Sua carteira ainda está vazia.':'Tu cartera está vacía.',
    '💡 Dicas para minha carteira':'💡 Consejos para mi cartera','📌 O que fazer agora':'📌 Qué hacer ahora',
    'O que merece sua atenção agora, usando composição da carteira + direcionamento técnico do Radar.':'Lo que merece atención ahora según la composición de la cartera y el análisis técnico de Radar.',
    'As dicas são informativas e mudam com os dados do mercado. Não executam ordens automaticamente.':'Los consejos son informativos y cambian con los datos del mercado. No ejecutan órdenes.',
    '🧭 Direcionamento da minha carteira':'🧭 Orientación de mi cartera',
    'Leitura automática por ativo usando preço, variação 24h, volume e liquidez relativa.':'Análisis automático por activo según precio, variación 24 h, volumen y liquidez relativa.',
    'Direcionamento informativo: não executa ordens e não usa boatos como gatilho isolado. Reavalie antes de operar.':'Orientación informativa: no ejecuta órdenes ni usa rumores como único criterio. Revisa antes de operar.',
    '📊 Informações do mercado':'📊 Información del mercado','Clima geral':'Sentimiento del mercado',
    'Sua carteira · média 24h':'Tu cartera · media 24 h','Ativos em upside':'Activos en alza','Ativos em downside':'Activos en baja',
    'Revisar alta em':'Revisar subida de','Avaliar lucro em':'Evaluar beneficio en','Revisar concentração em':'Revisar concentración en',
    'AVALIAR ALTA':'EVALUAR SUBIDA','VENDER / REDUZIR':'VENDER / REDUCIR','ATENÇÃO PARA VENDA':'RIESGO DE VENTA',
    'AGUARDAR ENTRADA':'ESPERAR ENTRADA','MANTER':'MANTENER','AGUARDAR':'ESPERAR',
    'COMPRAR / APORTAR':'COMPRAR / APORTAR','REALIZAR PARTE':'EVALUAR VENTA PARCIAL',
    'Ativo de referência/estável; sem sinal direcional pelo Radar.':'Activo estable de referencia; sin señal direccional de Radar.',
    'Dados de mercado ainda insuficientes.':'Datos de mercado insuficientes.',
    'Sem confirmação suficiente para comprar ou vender.':'Sin confirmación suficiente para comprar o vender.',
    'Há sinais favoráveis, mas a confirmação ainda é parcial.':'Hay señales favorables, pero la confirmación aún es parcial.',
    'Analisando os ativos da carteira…':'Analizando activos de la cartera…',
    '🎯 Melhores opções da sua carteira':'🎯 Activos destacados de la cartera',
    '🌐 Alarmes de compra do mercado':'🌐 Alertas de compra del mercado',
    'Nenhuma oportunidade confirmada no mercado agora. Aguardando preço e liquidez alinharem.':'Ninguna oportunidad confirmada ahora. Esperando que precio y liquidez se alineen.',
    'Radar informativo: nenhuma ordem é enviada automaticamente e boatos não são usados como gatilho isolado.':'Radar informativo: no se envían órdenes y los rumores solos no activan operaciones.',
    '🧠 Central de Mercado & Aporte':'🧠 Centro de mercado y aportes',
    'Cruza tendência, momentum, volume, liquidez, VWAP, força vs BTC, risco, regime e composição da sua carteira.':'Combina tendencia, impulso, volumen, liquidez, VWAP, fuerza frente a BTC, riesgo, régimen y composición de cartera.',
    'análise ativa':'análisis activo','Regime':'Régimen','Saúde da carteira':'Salud de la cartera',
    'Reserva atual':'Reserva actual','Leitura da IA/Radar':'Lectura de IA/Radar',
    'Simulação inteligente de aporte':'Simulación inteligente de aportes',
    'Compare perfis antes de decidir como distribuir capital novo.':'Compara perfiles antes de distribuir nuevo capital.',
    'Aporte':'Aporte','Perfil':'Perfil','Objetivo':'Objetivo','Entrada':'Entrada',
    'Conservador':'Conservador','Equilibrado':'Equilibrado','Agressivo':'Agresivo',
    'Proteção':'Protección','Equilíbrio':'Equilibrio','Crescimento':'Crecimiento',
    'Parcelada':'Por etapas','Só após confirmação':'Solo tras confirmación','Mais imediata':'Más inmediata',
    'Divisão sugerida — Equilibrado':'Asignación sugerida — Equilibrado',
    'Divisão sugerida — Conservador':'Asignación sugerida — Conservador',
    'Divisão sugerida — Agressivo':'Asignación sugerida — Agresivo',
    'Reserva + ativos priorizados com limite de concentração.':'Reserva + activos priorizados con límite de concentración.',
    'Sem alocação técnica agora':'Sin asignación técnica ahora',
    'Ativos sob observação (não são compras)':'Activos en observación (no son compras)',
    'Todos os perfis estão em espera porque não há compras tecnicamente confirmadas. Os perfis mudam limites e riscos, mas não inventam sinais.':'Todos los perfiles esperan porque no hay compras técnicamente confirmadas. Los perfiles cambian los límites de riesgo, no inventan señales.',
    'A escolha de perfil não libera compras sem confirmação, por isso os três cenários podem manter 100% em reserva.':'Elegir un perfil no evita la confirmación; los tres escenarios pueden mantener el 100% como reserva.',
    'As entradas só entram na divisão após confirmação.':'Los activos solo se asignan después de la confirmación.',
    'Aguarde nova leitura do mercado ou atualize os dados. Não há aporte obrigatório.':'Espera nuevos datos del mercado o actualiza. No hay aporte obligatorio.',
    'Ranking técnico do mercado':'Clasificación técnica del mercado',
    'Qualidade do sinal, não previsão de lucro.':'Calidad de señal, no pronóstico de ganancias.',
    'O que evitar ou esperar':'Qué evitar o esperar','Ativos com risco, timing ruim ou bloqueios técnicos.':'Activos con riesgo, mal momento o bloqueos técnicos.',
    'Nenhum bloqueio forte entre os ativos analisados agora.':'Ningún bloqueo fuerte entre los activos analizados ahora.',
    'Simulação informativa. O Cripto Radar não executa ordens, não garante lucro e não substitui avaliação financeira individual.':'Simulación informativa. Cripto Radar no ejecuta órdenes ni garantiza ganancias o reemplaza una evaluación individual.',
    '🛡️ Reserva estratégica':'🛡️ Reserva estratégica','Agora':'Ahora','Correção':'Corrección','Confirmação':'Confirmación',
    'qualidade':'calidad','do aporte':'del aporte','Em correção':'En corrección','Na confirmação':'En confirmación',
    'Tendência':'Tendencia','Liquidez':'Liquidez','Risco':'Riesgo','Favorável':'Favorable','Seletivo':'Selectivo','Defensivo':'Defensivo',
    'carteira vazia':'cartera vacía','risco médio':'riesgo medio','risco baixo':'riesgo bajo','risco alto':'riesgo alto',
    'ALTA':'ALCISTA','BAIXA':'BAJISTA','LATERAL':'LATERAL','NEUTRO':'NEUTRAL',
    'CANDIDATA • AGUARDANDO':'CANDIDATA • EN ESPERA','SINAL FORTE DE COMPRA':'SEÑAL FUERTE DE COMPRA',
    'Sem compra confirmada.':'Sin compra confirmada.','Entrada bloqueada.':'Entrada bloqueada.',
    'Aguardar nova leitura.':'Esperar nuevos datos.',
    'ANÁLISE PENDENTE':'ANÁLISIS PENDIENTE','Dados insuficientes:':'Datos insuficientes:',
    'Falta confirmar:':'Falta confirmar:',
    'Aguardando estrutura, tendência e indicadores técnicos antes de classificar a entrada.':'Esperando estructura, tendencia e indicadores técnicos antes de clasificar la entrada.',
    'Nenhuma compra confirmada agora':'Ninguna compra confirmada ahora',
    'A carteira está estruturalmente saudável':'La cartera está estructuralmente sana',
    'A carteira está em condição intermediária':'La cartera está en condición intermedia',
    'A carteira merece reequilíbrio antes de aumentar risco':'La cartera requiere reequilibrio antes de asumir más riesgo',
    'há concentração elevada em uma posição':'hay alta concentración en una posición',
    'a diversificação está boa':'la diversificación es buena','a reserva está baixa':'la reserva es baja',
    'com regime de mercado favorável':'con un régimen favorable de mercado',
    'e o mercado geral pede postura defensiva':'y el mercado general requiere prudencia',
    'confluência técnica e validação dos sinais':'confluencia técnica y validación de señales'
  });
  Object.assign(STRINGS.en,{
    'Ferramentas avançadas liberadas: motor V10/V11, backtest, Paper Trading, diagnóstico e controles técnicos.':'Advanced tools unlocked: V10/V11 engine, backtesting, Paper Trading, diagnostics and technical controls.',
    'Ferramentas avançadas liberadas: motor V10/V11, backtest, Paper Trading, diagnóstico e controles técnicos.':'Advanced tools unlocked: V10/V11 engine, backtesting, Paper Trading, diagnostics and technical controls.',
    'PAINEL COMPLETO':'FULL DASHBOARD',
    'Dados da carteira':'Portfolio data','Radar tendências':'Trend Radar',
    'Reserva de moedas estáveis abaixo de 5% da carteira':'Stablecoin reserve is below 5% of the portfolio',
    'Há cotações desatualizadas no valor estimado':'Some estimated prices are outdated',
    'Qualidade técnica média positiva':'Positive average technical quality',
    'risco agregado elevado':'high aggregate risk',
    'a reserva alta; pode haver capital ocioso':'high reserve; some capital may be idle',
    'carteira concentrada em uma posição':'portfolio concentrated in one position',
    'Período':'Period','Valor de referência':'Reference value',
    'Negociação simulada':'Simulated trade',
    'Resumo rápido do mercado, carteira e funcionamento do Radar.':'Quick overview of market, portfolio and Radar status.',
    'Mercado em tempo real':'Live market','Dados atualizados':'Data updated',
    'Nenhuma compra confirmada':'No confirmed buy',
    'Ativos com risco, timing ruim ou bloqueios técnicos.':'Assets with risk, poor timing or technical restrictions.'
  });
  Object.assign(STRINGS.es,{
    'Ferramentas avançadas liberadas: motor V10/V11, backtest, Paper Trading, diagnóstico e controles técnicos.':'Herramientas avanzadas habilitadas: motor V10/V11, backtest, Paper Trading, diagnóstico y controles técnicos.',
    'PAINEL COMPLETO':'PANEL COMPLETO',
    'Dados da carteira':'Datos de cartera','Radar tendências':'Radar de tendencias',
    'Reserva de moedas estáveis abaixo de 5% da carteira':'Reserva de monedas estables inferior al 5% de la cartera',
    'Há cotações desatualizadas no valor estimado':'Hay cotizaciones desactualizadas en el valor estimado',
    'carteira concentrada em uma posição':'cartera concentrada en una posición',
    'Período':'Período','Valor de referência':'Valor de referencia',
    'Resumo rápido do mercado, carteira e funcionamento do Radar.':'Resumen rápido del mercado, cartera y estado de Radar.',
    'Mercado em tempo real':'Mercado en tiempo real','Dados atualizados':'Datos actualizados',
    'Nenhuma compra confirmada':'Ninguna compra confirmada'
  });
  Object.assign(STRINGS.en,{
    '🔴 ALERTA DE VENDA':'🔴 SELL ALERT','🟠 AVALIAR ALTA':'🟠 REVIEW RALLY',
    'ALERTA DE VENDA':'SELL ALERT','AVALIAR ALTA':'REVIEW RALLY',
    'ALTA FORTE':'STRONG RALLY','Aguardando confirmação de mercado':'Waiting for market confirmation',
    'Ativos em alta':'Rising assets','Ativos em queda':'Falling assets',
    'Mercado mais vendedor':'Mostly selling market','Mercado misto':'Mixed market',
    'Alertas cruzam variação de 24h com liquidez relativa ao mercado. Quedas sem confirmação de liquidez ficam apenas em atenção. São sinais informativos, não ordens automáticas de venda.':'Alerts combine 24h changes with relative market liquidity. Drops without confirming liquidity remain watch-only. These are informational signals, not automatic sell orders.'
  });
  Object.assign(STRINGS.es,{
    '🔴 ALERTA DE VENDA':'🔴 ALERTA DE VENTA','🟠 AVALIAR ALTA':'🟠 EVALUAR SUBIDA',
    'ALERTA DE VENDA':'ALERTA DE VENTA','AVALIAR ALTA':'EVALUAR SUBIDA',
    'ALTA FORTE':'SUBIDA FUERTE','Aguardando confirmação de mercado':'Esperando confirmación del mercado',
    'Ativos em alta':'Activos en alza','Ativos em queda':'Activos en baja',
    'Mercado mais vendedor':'Mercado más vendedor','Mercado misto':'Mercado mixto',
    'Alertas cruzam variação de 24h com liquidez relativa ao mercado. Quedas sem confirmação de liquidez ficam apenas em atenção. São sinais informativos, não ordens automáticas de venda.':'Las alertas combinan variación de 24 h con liquidez relativa del mercado. Las caídas sin confirmación de liquidez quedan en observación. Son señales informativas, no órdenes automáticas.'
  });
  const V195_PHRASES={
    en:[
      ['Aproximadamente ','About '],[' do valor da carteira está neste ativo.',' of portfolio value is held in this asset.'],
      ['Evite aumentar a posição sem avaliar o risco de concentração.','Consider concentration risk before increasing this position.'],
      ['O preço teve uma alta forte, mas alta diária não comprova lucro pessoal.','Price rose sharply, but daily gains do not establish your actual profit.'],
      ['Confira seu preço médio, taxas e risco antes de decidir.','Check entry cost, fees and risk before deciding.'],
      ['Representa cerca de ','This represents about '],[' da carteira. Um novo aporte pode aumentar a concentração.',' of the portfolio. A new contribution may increase concentration.'],
      [' posições abaixo de 3% da carteira.',' positions under 3% of your portfolio.'],
      ['Veja se ainda fazem sentido na sua estratégia.','Review whether they still fit your strategy.'],
      ['Ativo(s) monitorado(s) não passaram','Monitored assets did not pass'],
      [' ativo(s) monitorado(s) não passaram pelos critérios obrigatórios de compra.',' monitored asset(s) did not pass the mandatory buy criteria.'],
      ['Ainda não há dados técnicos suficientes e atualizados para liberar uma entrada.','There is not enough fresh technical data to allow an entry.'],
      ['Exemplo do que falta para avançar:','Examples of missing requirements:'],
      ['Reserva de ','Reserve of '],[' — aguardando confirmação',' — waiting for confirmation'],
      ['A escolha de perfil não libera compras sem confirmação, por isso os três cenários podem manter 100% em reserva.','Profile choice cannot override buy confirmation. All scenarios may hold 100% in reserve.'],
      ['Ativos sob observação (não são compras)','Assets under observation (not buy signals)'],
      ['A carteira merece reequilíbrio antes de aumentar risco','The portfolio needs rebalancing before increasing risk'],
      ['A carteira está em condição intermediária','The portfolio is in moderate condition'],
      ['A carteira está estruturalmente saudável','The portfolio is structurally healthy'],
      ['há concentração elevada em uma posição','one position has elevated concentration'],
      ['risco de devolver parte do movimento','risk of giving back part of the move'],
      ['Alta de 24h muito forte','Very strong 24h gain'],
      ['Queda forte','Sharp drop'],['Pressão negativa','Selling pressure'],['Sem confirmação suficiente para comprar ou vender.','Not enough confirmation to buy or sell.'],
      ['Aguardando dados da carteira e do mercado','Waiting for portfolio and market data'],
      ['liquidez muito alta','very high liquidity'],['liquidez alta','high liquidity'],['liquidez média','medium liquidity'],['liquidez baixa','low liquidity'],
      ['movimento está esticado','price move is extended'],
      ['O que fazer agora','What to do now'],['Dicas para minha carteira','Portfolio tips'],
      ['Direcionamento da minha carteira','Portfolio guidance'],['Melhores opções da sua carteira','Portfolio highlights']
    ],
    es:[
      ['Aproximadamente ','Aproximadamente '],[' do valor da carteira está neste ativo.',' del valor de la cartera está en este activo.'],
      ['Evite aumentar a posição sem avaliar o risco de concentração.','Evita aumentar la posición sin evaluar la concentración.'],
      ['Representa cerca de ','Representa cerca del '],[' da carteira. Um novo aporte pode aumentar a concentração.',' de la cartera. Un nuevo aporte puede aumentar la concentración.'],
      [' posições abaixo de 3% da carteira.',' posiciones por debajo del 3% de la cartera.'],
      ['Veja se ainda fazem sentido na sua estratégia.','Revisa si aún encajan en tu estrategia.'],
      ['Ainda não há dados técnicos suficientes e atualizados para liberar uma entrada.','No hay suficientes datos técnicos actualizados para permitir una entrada.'],
      [' ativo(s) monitorado(s) não passaram pelos critérios obrigatórios de compra.',' activo(s) vigilado(s) no cumplió(eron) los requisitos obligatorios de compra.'],
      ['Exemplo do que falta para avançar:','Ejemplos de condiciones pendientes:'],
      ['Reserva de ','Reserva de '],[' — aguardando confirmação',' — esperando confirmación'],
      ['Alta de 24h muito forte','Alza de 24 h muy fuerte'],['Queda forte','Caída fuerte'],['Pressão negativa','Presión vendedora'],
      ['liquidez muito alta','liquidez muy alta'],['liquidez alta','liquidez alta'],['liquidez média','liquidez media'],['liquidez baixa','liquidez baja'],
      ['O que fazer agora','Qué hacer ahora'],['Dicas para minha carteira','Consejos para mi cartera'],
      ['Direcionamento da minha carteira','Orientación de mi cartera'],['Melhores opções da sua carteira','Destacados de la cartera']
    ]
  };

  // V19.5.1: translate complete UI and generated phrases BEFORE generic fragment rules.
  // Avoid generic connective replacements (" e " => " and "), which generated mixed-language sentences.
  Object.assign(STRINGS.en, {
  "🗣️ Boatos e notícias do mercado": "🗣️ Market rumors and news",
  "🗣️ Boatos que podem mexer com sua carteira": "🗣️ Rumors that may affect your portfolio",
  "Boatos e notícias do mercado": "Market rumors and news",
  "Boatos que podem mexer com sua carteira": "Rumors that may affect your portfolio",
  "Notícias e rumores ficam separados do sinal técnico. Nada aqui vira compra ou venda sozinho.": "News and rumors are separate from technical signals. Neither triggers a buy or sell on its own.",
  "Fluxos institucionais e ETFs seguem como catalisador observado para Bitcoin": "Institutional flows and ETFs remain potential catalysts for Bitcoin",
  "Ecossistema Sui mantém anúncios e eventos como possíveis catalisadores": "Sui ecosystem announcements and events remain potential catalysts",
  "Chainlink continua sensível a notícias de adoção institucional, integrações e derivativos": "Chainlink remains sensitive to institutional adoption, integration and derivatives news",
  "Contexto de mercado": "Market context",
  "Fonte pública": "Public source",
  "ℹ️ MERCADO": "ℹ️ MARKET",
  "⚠️ BOATO": "⚠️ RUMOR",
  "✅ CONFIRMADO": "✅ CONFIRMED",
  "🟢 possível impacto positivo • 🟡 incerto • 🔴 possível impacto negativo • ✅ confirmado": "🟢 potentially positive impact • 🟡 uncertain • 🔴 potentially negative impact • ✅ confirmed",
  "possível impacto positivo": "potential positive impact",
  "possível impacto negativo": "potential negative impact",
  "incerto": "uncertain",
  "confirmado": "confirmed",
  "Nenhuma informação confirmada disponível agora.": "No confirmed information available right now.",
  "Filtro do feed": "Feed filter",
  "Agora o Radar usa Push 24h pelo servidor. O mercado continua sendo verificado fora do celular e o Android pode receber os alertas mesmo com o app fechado ou a tela bloqueada.": "Radar now uses server-powered 24h Push. The market is checked outside your phone, and Android can receive alerts with the app closed or the screen locked.",
  "✓ Notificações ativas neste aparelho.": "✓ Notifications enabled on this device.",
  "Assinatura Push encontrada neste navegador; confirme a entrega em TESTAR PUSH • última varredura 1 min atrás": "Push subscription found in this browser. Confirm delivery using TEST PUSH • last check 1 minute ago",
  "Servidor e agendador respondendo. Este aparelho possui inscrição Push local. O recebimento automático com o app fechado só é confirmado ao receber um teste agendado.": "Server and scheduler are responding. This device has a local Push subscription. Automatic delivery while the app is closed is only verified after a scheduled test arrives.",
  "O recebimento automático com o app fechado só é confirmado ao receber um teste agendado.": "Automatic delivery while the app is closed is only verified after a scheduled test arrives.",
  "Servidor e agendador respondendo.": "Server and scheduler are responding.",
  "Este aparelho possui inscrição Push local.": "This device has a local Push subscription.",
  "Segundo plano: Worker + SW prontos para alertas": "Background: Worker + SW ready for alerts",
  "Notificações ativas neste aparelho.": "Notifications enabled on this device.",
  "Status geral": "Overall status",
  "Carteira": "Portfolio",
  "sem risco forte confirmado": "no major risk confirmed",
  "sem oportunidade forte confirmada": "no strong opportunity confirmed",
  "Carteira sem risco forte agora": "No major portfolio risk right now",
  "O Radar continua cruzando movimento, volume, liquidez e concentração.": "Radar continues evaluating price movement, volume, liquidity and concentration.",
  "Nenhuma oportunidade forte confirmada agora": "No strong opportunity confirmed right now",
  "O Radar continua verificando automaticamente.": "Radar continues checking automatically.",
  "Última análise:": "Last analysis:",
  "heurística do Radar, não probabilidade garantida.": "Radar heuristic, not a guaranteed probability.",
  "🔁 FALHA DE PULLBACK • 15 MIN": "🔁 PULLBACK FAILURE • 15 MIN",
  "↩️ FALHA DE PULLBACK • 15 MIN": "↩️ PULLBACK FAILURE • 15 MIN",
  "FALHA DE PULLBACK • 15 MIN": "PULLBACK FAILURE • 15 MIN",
  "FALHA DE PULLBACK": "PULLBACK FAILURE",
  "1/2 CONFIRMAÇÕES": "1/2 CONFIRMATIONS",
  "✓ 2/2 CONFIRMADO": "✓ 2/2 CONFIRMED",
  "O contra-movimento perdeu força após o rompimento.": "The countertrend move weakened after the breakout.",
  "Nível testado": "Level tested",
  "preço": "price",
  "volume do rompimento": "breakout volume",
  "Ação do Radar:": "Radar guidance:",
  "PROTEGER POSIÇÃO • AGUARDAR NOVA ESTRUTURA": "PROTECT POSITION • WAIT FOR A NEW SETUP",
  "OBSERVAR CONTINUAÇÃO • EVITAR ENTRAR ESTICADO": "WATCH CONTINUATION • AVOID CHASING THE MOVE",
  "Nenhuma falha de pullback confirmada agora": "No pullback failure confirmed right now",
  "O Radar procura rompimento, reteste do nível, rejeição e retomada com tendência/volume alinhados.": "Radar checks breakouts, retests, rejections and follow-through when trend and volume align.",
  "Falha de pullback:": "Pullback failure:",
  "score técnico": "technical score",
  "nível": "level",
  "RADAR SOCIAL": "SOCIAL RADAR",
  "▶ Atualização automática": "▶ Automatic update",
  "🔔 Ativar Push 24h": "🔔 Enable 24h Push",
  "Agendador externo:": "External scheduler:",
  "última varredura": "last check",
  "último ciclo:": "last run:",
  "Última análise": "Last analysis",
  "Radar conectado": "Radar connected",
  "Radar ao vivo": "Radar live",
  "ANÁLISE ATIVA": "ANALYSIS ACTIVE",
  "Confluência V5": "V5 confluence",
  "continuação de alta": "bullish continuation",
  "CONFIRMAÇÕES": "CONFIRMATIONS",
  "Risco forte": "Major risk",
  "Últimos alertas": "Recent alerts",
  "AVALIAR REALIZAÇÃO": "CONSIDER TAKING PROFITS",
  "⚠️ Revisar concentração em": "⚠️ Review concentration in",
  "risco médio": "medium risk",
  "risco baixo": "low risk",
  "risco alto": "high risk",
  "concentração": "concentration",
  "Liquidez": "Liquidity",
  "Tendência": "Trend"
});
  Object.assign(STRINGS.es, {
  "🗣️ Boatos e notícias do mercado": "🗣️ Rumores y noticias del mercado",
  "🗣️ Boatos que podem mexer com sua carteira": "🗣️ Rumores que pueden afectar a tu cartera",
  "Boatos e notícias do mercado": "Rumores y noticias del mercado",
  "Boatos que podem mexer com sua carteira": "Rumores que pueden afectar a tu cartera",
  "Notícias e rumores ficam separados do sinal técnico. Nada aqui vira compra ou venda sozinho.": "Las noticias y rumores se separan de las señales técnicas. Por sí solos no activan compras ni ventas.",
  "Fluxos institucionais e ETFs seguem como catalisador observado para Bitcoin": "Los flujos institucionales y los ETF siguen siendo posibles catalizadores para Bitcoin",
  "Ecossistema Sui mantém anúncios e eventos como possíveis catalisadores": "Los anuncios y eventos del ecosistema Sui siguen siendo posibles catalizadores",
  "Chainlink continua sensível a notícias de adoção institucional, integrações e derivativos": "Chainlink sigue siendo sensible a noticias de adopción institucional, integraciones y derivados",
  "Contexto de mercado": "Contexto del mercado",
  "Fonte pública": "Fuente pública",
  "ℹ️ MERCADO": "ℹ️ MERCADO",
  "⚠️ BOATO": "⚠️ RUMOR",
  "✅ CONFIRMADO": "✅ CONFIRMADO",
  "🟢 possível impacto positivo • 🟡 incerto • 🔴 possível impacto negativo • ✅ confirmado": "🟢 posible impacto positivo • 🟡 incierto • 🔴 posible impacto negativo • ✅ confirmado",
  "possível impacto positivo": "posible impacto positivo",
  "possível impacto negativo": "posible impacto negativo",
  "incerto": "incierto",
  "confirmado": "confirmado",
  "Nenhuma informação confirmada disponível agora.": "No hay información confirmada disponible ahora.",
  "Filtro do feed": "Filtro de noticias",
  "Agora o Radar usa Push 24h pelo servidor. O mercado continua sendo verificado fora do celular e o Android pode receber os alertas mesmo com o app fechado ou a tela bloqueada.": "Radar ahora usa Push 24h mediante el servidor. El mercado sigue vigilado fuera del móvil, y Android puede recibir alertas con la app cerrada o la pantalla bloqueada.",
  "✓ Notificações ativas neste aparelho.": "✓ Notificaciones activas en este dispositivo.",
  "Servidor e agendador respondendo. Este aparelho possui inscrição Push local. O recebimento automático com o app fechado só é confirmado ao receber um teste agendado.": "El servidor y el programador responden. Este dispositivo tiene suscripción Push local. La entrega con la app cerrada solo se verifica al recibir una prueba programada.",
  "O recebimento automático com o app fechado só é confirmado ao receber um teste agendado.": "La entrega con la app cerrada solo se verifica tras recibir una prueba programada.",
  "Servidor e agendador respondendo.": "El servidor y el programador responden.",
  "Este aparelho possui inscrição Push local.": "Este dispositivo tiene suscripción Push local.",
  "Segundo plano: Worker + SW prontos para alertas": "Segundo plano: Worker + SW listos para alertas",
  "Status geral": "Estado general",
  "sem risco forte confirmado": "sin riesgo importante confirmado",
  "sem oportunidade forte confirmada": "sin oportunidad fuerte confirmada",
  "Carteira sem risco forte agora": "Cartera sin riesgo importante ahora",
  "O Radar continua cruzando movimento, volume, liquidez e concentração.": "Radar sigue cruzando movimiento, volumen, liquidez y concentración.",
  "Nenhuma oportunidade forte confirmada agora": "Ninguna oportunidad fuerte confirmada ahora",
  "O Radar continua verificando automaticamente.": "Radar sigue verificando automáticamente.",
  "Última análise:": "Último análisis:",
  "heurística do Radar, não probabilidade garantida.": "heurística de Radar, no una probabilidad garantizada.",
  "↩️ FALHA DE PULLBACK • 15 MIN": "↩️ FALLO DE RETROCESO • 15 MIN",
  "FALHA DE PULLBACK": "FALLO DE RETROCESO",
  "1/2 CONFIRMAÇÕES": "1/2 CONFIRMACIONES",
  "✓ 2/2 CONFIRMADO": "✓ 2/2 CONFIRMADO",
  "O contra-movimento perdeu força após o rompimento.": "El contramovimiento perdió fuerza después de la ruptura.",
  "Nível testado": "Nivel probado",
  "preço": "precio",
  "volume do rompimento": "volumen de ruptura",
  "Ação do Radar:": "Acción de Radar:",
  "PROTEGER POSIÇÃO • AGUARDAR NOVA ESTRUTURA": "PROTEGER POSICIÓN • ESPERAR NUEVA ESTRUCTURA",
  "OBSERVAR CONTINUAÇÃO • EVITAR ENTRAR ESTICADO": "VIGILAR CONTINUACIÓN • EVITAR PERSEGUIR EL PRECIO",
  "Nenhuma falha de pullback confirmada agora": "Ningún fallo de retroceso confirmado ahora",
  "O Radar procura rompimento, reteste do nível, rejeição e retomada com tendência/volume alinhados.": "Radar busca rupturas, retesteos, rechazos y continuación con tendencia y volumen alineados.",
  "Falha de pullback:": "Fallo de retroceso:",
  "score técnico": "puntuación técnica",
  "nível": "nivel",
  "RADAR SOCIAL": "RADAR SOCIAL",
  "Radar conectado": "Radar conectado",
  "Radar ao vivo": "Radar en vivo",
  "ANÁLISE ATIVA": "ANÁLISIS ACTIVO",
  "Confluência V5": "Confluencia V5",
  "continuação de alta": "continuación alcista",
  "CONFIRMAÇÕES": "CONFIRMACIONES",
  "Risco forte": "Riesgo importante",
  "Últimos alertas": "Alertas recientes",
  "AVALIAR REALIZAÇÃO": "EVALUAR TOMA DE BENEFICIOS",
  "⚠️ Revisar concentração em": "⚠️ Revisar concentración en",
  "risco médio": "riesgo medio",
  "risco baixo": "riesgo bajo",
  "risco alto": "riesgo alto",
  "concentração": "concentración",
  "Liquidez": "Liquidez",
  "Tendência": "Tendencia"
});
  const V1951_PHRASES={
  "en": [
    [
      "O mercado continua sendo verificado fora do celular e o Android pode receber os alertas mesmo com o app fechado ou a tela bloqueada.",
      "The market is still monitored outside the phone and Android may receive alerts even with the app closed or screen locked."
    ],
    [
      "Chainlink continua sensível a notícias de adoção institucional, integrações e derivativos",
      "Chainlink remains sensitive to institutional adoption, integration and derivatives news"
    ],
    [
      " O recebimento automático com o app fechado só é confirmado ao receber um teste agendado.",
      " Automatic delivery with the app closed is verified only after a scheduled test arrives."
    ],
    [
      "Assinatura Push encontrada neste navegador; confirme a entrega em TESTAR PUSH",
      "Push subscription found in this browser. Confirm delivery using TEST PUSH"
    ],
    [
      "Fluxos institucionais e ETFs seguem como catalisador observado para Bitcoin",
      "Institutional flows and ETFs remain potential catalysts for Bitcoin"
    ],
    [
      "Ecossistema Sui mantém anúncios e eventos como possíveis catalisadores",
      "Sui ecosystem announcements and events remain potential catalysts"
    ],
    [
      "O Radar continua cruzando movimento, volume, liquidez e concentração.",
      "Radar continues evaluating price movement, volume, liquidity and concentration."
    ],
    [
      "O contra-movimento perdeu força após o rompimento. Nível testado ",
      "The countertrend move weakened after the breakout. Tested level "
    ],
    [
      "score = heurística do Radar, não probabilidade garantida.",
      "score = a Radar heuristic, not a guaranteed probability."
    ],
    [
      "OBSERVAR CONTINUAÇÃO • EVITAR ENTRAR ESTICADO",
      "WATCH CONTINUATION • AVOID CHASING THE MOVE"
    ],
    [
      "O Radar continua verificando automaticamente.",
      "Radar continues checking automatically."
    ],
    [
      "PROTEGER POSIÇÃO • AGUARDAR NOVA ESTRUTURA",
      "PROTECT POSITION • WAIT FOR A NEW SETUP"
    ],
    [
      "🔔 Notificações ativas neste aparelho.",
      "🔔 Notifications active on this device."
    ],
    [
      " • sem oportunidade forte confirmada",
      " • no strong opportunity confirmed"
    ],
    [
      " • possível continuação da baixa",
      " • possible bearish continuation"
    ],
    [
      " • possível continuação da alta",
      " • possible bullish continuation"
    ],
    [
      " • sem risco forte confirmado",
      " • no major risk confirmed"
    ],
    [
      " • volume do rompimento ",
      " • breakout volume "
    ],
    [
      " • última varredura ",
      " • last check "
    ],
    [
      " alerta(s) forte(s)",
      " major alert(s)"
    ],
    [
      "FALHA DE PULLBACK ",
      "PULLBACK FAILURE "
    ],
    [
      " • score técnico ",
      " • technical score "
    ],
    [
      " oportunidade(s)",
      " opportunity(ies)"
    ],
    [
      "Ação do Radar: ",
      "Radar guidance: "
    ],
    [
      " minutos atrás",
      " minutes ago"
    ],
    [
      " min atrás",
      " min ago"
    ],
    [
      " seg atrás",
      " seconds ago"
    ],
    [
      " ainda não",
      " not yet"
    ],
    [
      " • preço ",
      " • price "
    ],
    [
      " • nível ",
      " • level "
    ]
  ],
  "es": [
    [
      "O mercado continua sendo verificado fora do celular e o Android pode receber os alertas mesmo com o app fechado ou a tela bloqueada.",
      "El mercado continúa vigilado fuera del móvil y Android puede recibir alertas con la aplicación cerrada o la pantalla bloqueada."
    ],
    [
      "Chainlink continua sensível a notícias de adoção institucional, integrações e derivativos",
      "Chainlink sigue siendo sensible a noticias de adopción institucional, integraciones y derivados"
    ],
    [
      "Assinatura Push encontrada neste navegador; confirme a entrega em TESTAR PUSH",
      "Suscripción Push detectada en este navegador. Confirma la entrega con PROBAR PUSH"
    ],
    [
      "Fluxos institucionais e ETFs seguem como catalisador observado para Bitcoin",
      "Los flujos institucionales y los ETF siguen siendo posibles catalizadores para Bitcoin"
    ],
    [
      "Ecossistema Sui mantém anúncios e eventos como possíveis catalisadores",
      "Los anuncios y eventos del ecosistema Sui siguen siendo posibles catalizadores"
    ],
    [
      "O contra-movimento perdeu força após o rompimento. Nível testado ",
      "El contramovimiento perdió fuerza después de la ruptura. Nivel probado "
    ],
    [
      "score = heurística do Radar, não probabilidade garantida.",
      "puntuación = heurística de Radar, no probabilidad garantizada."
    ],
    [
      "OBSERVAR CONTINUAÇÃO • EVITAR ENTRAR ESTICADO",
      "VIGILAR CONTINUACIÓN • EVITAR PERSEGUIR EL PRECIO"
    ],
    [
      "PROTEGER POSIÇÃO • AGUARDAR NOVA ESTRUTURA",
      "PROTEGER POSICIÓN • ESPERAR NUEVA ESTRUCTURA"
    ],
    [
      " • volume do rompimento ",
      " • volumen de ruptura "
    ],
    [
      " • última varredura ",
      " • última comprobación "
    ],
    [
      " alerta(s) forte(s)",
      " alerta(s) importante(s)"
    ],
    [
      "FALHA DE PULLBACK ",
      "FALLO DE RETROCESO "
    ],
    [
      " • score técnico ",
      " • puntuación técnica "
    ],
    [
      " oportunidade(s)",
      " oportunidad(es)"
    ],
    [
      "Ação do Radar: ",
      "Acción de Radar: "
    ],
    [
      " minutos atrás",
      " minutos atrás"
    ],
    [
      " min atrás",
      " min atrás"
    ],
    [
      " • preço ",
      " • precio "
    ],
    [
      " • nível ",
      " • nivel "
    ]
  ]
};
  const PHRASES={
    en:[['Falta confirmar:','Still required:'],[' do total',' of total'],[' da carteira',' of portfolio'],[' em 24h',' in 24h'],[' ativo(s)',' asset(s)'],[' sinal(is)',' signal(s)'],[' último ciclo',' last run'],[' preço médio',' average price'],[' cotação desatualizada',' stale quotation'],[' • Novo sinal',' • New signal'],['Nenhuma compra confirmada agora','No confirmed buy right now'],['CANDIDATA • AGUARDANDO','CANDIDATE • WAITING']],
    es:[['Falta confirmar:','Falta confirmar:'],[' do total',' del total'],[' da carteira',' de la cartera'],[' em 24h',' en 24 h'],[' ativo(s)',' activo(s)'],[' sinal(is)',' señal(es)'],[' último ciclo',' último ciclo'],[' preço médio',' precio medio'],[' cotação desatualizada',' cotización desactualizada'],[' • Novo sinal',' • Nueva señal'],['Nenhuma compra confirmada agora','Ninguna compra confirmada ahora']]
  };

  /* V19.5.2: validated whole-message translations. These override the old phrase fragments. */
  const V1952_EXACT={
  "en": {
    "Comprar / aportar": "Buy / add funds",
    "Nenhum bloqueio forte entre os ativos analisados agora.": "No major restrictions among the assets analyzed right now.",
    "Cruza tendência, momentum, volume, liquidez, VWAP, força vs BTC, risco, regime e composição da sua carteira.": "Combines trend, momentum, volume, liquidity, VWAP, relative strength vs BTC, risk, market regime and portfolio composition.",
    "Compare perfis antes de decidir como distribuir capital novo.": "Compare profiles before deciding how to allocate new funds.",
    "Todos os perfis estão em espera porque não há compras tecnicamente confirmadas. Os perfis mudam limites e riscos, mas não inventam sinais.": "All profiles are on hold because there are no technically confirmed buys. Profiles change limits and risk settings; they do not invent signals.",
    "Reserva + ativos priorizados com limite de concentração.": "Reserve plus prioritized assets with concentration limits.",
    "Qualidade do sinal, não previsão de lucro.": "Signal quality, not a profit forecast.",
    "Ativos com risco, timing ruim ou bloqueios técnicos.": "Assets with risk, poor entry timing or technical restrictions.",
    "Simulação informativa. O Cripto Radar não executa ordens, não garante lucro e não substitui avaliação financeira individual.": "For information only. Cripto Radar does not place orders, guarantee returns or replace individual financial assessment.",
    "Valor e variação de 24h são estimativas de mercado. Resultado não realizado usa apenas posições com preço médio cadastrado; não inclui taxas ou impostos. Pontuação técnica não é probabilidade de lucro.": "Value and 24h changes are market estimates. Unrealized P&L only includes positions with a recorded average purchase price; fees and taxes are excluded. A technical score is not a probability of profit.",
    "Ativos sob observação (não são compras)": "Assets on watch (not buy signals)",
    "A escolha de perfil não libera compras sem confirmação, por isso os três cenários podem manter 100% em reserva.": "Choosing a profile does not authorize unconfirmed buys, so all three scenarios may hold 100% in reserve.",
    "Aguarde nova leitura do mercado ou atualize os dados. Não há aporte obrigatório.": "Wait for the next market reading or refresh the data. No purchase is required.",
    "Ainda não há dados técnicos suficientes e atualizados para liberar uma entrada.": "There is not enough current technical data to confirm an entry.",
    "Exemplo do que falta para avançar:": "Examples of outstanding requirements:",
    "As entradas só entram na divisão após confirmação.": "Assets are added to the allocation only after confirmation.",
    "Simulação inteligente de aporte": "Smart contribution simulation",
    "Divisão sugerida —": "Suggested allocation —",
    "Ranking técnico do mercado": "Technical market ranking",
    "O que evitar ou esperar": "What to avoid or wait for",
    "Central de Mercado & Aporte": "Market & Contribution Center",
    "Leitura da IA/Radar": "AI/Radar assessment",
    "Saúde da carteira": "Portfolio health",
    "Reserva atual": "Current reserve",
    "análise ativa": "analysis active",
    "Defensivo": "Defensive",
    "Favorável": "Favorable",
    "Seletivo": "Selective",
    "carteira vazia": "empty portfolio",
    "Aporte": "Contribution",
    "Objetivo": "Goal",
    "Entrada": "Entry",
    "Parcelada": "Phased",
    "Só após confirmação": "Only after confirmation",
    "Mais imediata": "More immediate",
    "Proteção": "Protection",
    "Equilíbrio": "Balance",
    "Crescimento": "Growth",
    "Conservador": "Conservative",
    "Equilibrado": "Balanced",
    "Agressivo": "Aggressive",
    "qualidade": "quality",
    "Agora": "Now",
    "Correção": "Pullback",
    "Confirmação": "Confirmation",
    "Reserva estratégica": "Strategic reserve",
    "Tendência": "Trend",
    "Liquidez": "Liquidity",
    "Risco": "Risk",
    "Para confirmar:": "To confirm:",
    "Aguardar": "Wait",
    "mercado": "market",
    "Saúde": "Health",
    "Risco técnico": "Technical risk",
    "Pontos de atenção": "Points to review",
    "Distribuição monitorada pelo Radar.": "Radar is tracking the allocation.",
    "Sua carteira está concentrada.": "Your portfolio is concentrated.",
    "Sua carteira está vazia.": "Your portfolio is empty.",
    "Importe um print ou adicione moedas manualmente para começar.": "Import a screenshot or add coins manually to begin.",
    "Sem posições precificadas para mostrar a distribuição.": "No priced positions available to show the allocation.",
    "Sem alertas de concentração extrema ou de dados ausentes nesta leitura.": "No extreme concentration or missing-data alerts in this reading.",
    "Adicione seus ativos para iniciar o monitoramento.": "Add your assets to start monitoring.",
    "Nenhuma moeda corresponde a este filtro.": "No coins match this filter.",
    "Monitoramento da carteira": "Portfolio monitoring",
    "Atualização de mercado": "Market update",
    "Inclui cotação desatualizada": "Includes stale quotes",
    "Posições cadastradas": "Recorded positions",
    "Dados 24h insuficientes": "Insufficient 24h data",
    "Cadastre os preços médios": "Enter average purchase prices",
    "Sem preços válidos": "No valid prices",
    "Sem cotação": "No quote available",
    "Variação indisponível": "Change unavailable",
    "Dados não atualizados": "Data not updated",
    "Preço atual": "Current price",
    "Quantidade": "Quantity",
    "Qualidade técnica": "Technical quality",
    "Preço médio de compra (R$ por unidade)": "Average purchase price (BRL per unit)",
    "Opcional e salvo apenas neste aparelho; ajuste se comprar ou vender ativos.": "Optional and saved only on this device. Update it when you buy or sell assets.",
    "Resultado não realizado": "Unrealized P&L",
    "(sem preço médio)": "(without average purchase price)",
    "Pendente": "Pending",
    "Atualizando…": "Updating…",
    "↻ Atualizar dados": "↻ Refresh data",
    "Nenhum sinal corresponde ao filtro selecionado.": "No signals match the selected filter.",
    "Ainda sem dados recentes ou sinais verificáveis.": "No recent data or verifiable signals yet.",
    "Nenhuma mudança registrada neste aparelho ainda.": "No changes have been recorded on this device yet.",
    "Esperando confluência adicional.": "Waiting for additional technical alignment.",
    "Aguardar fechamento das confirmações técnicas.": "Wait for technical confirmations to complete.",
    "Confluência validada pelo Radar.": "Radar has validated technical alignment.",
    "Confira valor do aporte e limite de concentração.": "Review contribution amount and concentration limit.",
    "Aguardar confirmação, sem aporte automático.": "Wait for confirmation; no automatic contribution.",
    "Conferir posição, risco e taxas antes de decidir.": "Review position, risk and fees before deciding.",
    "Revisar proteção e concentração antes de movimentar.": "Review protection and concentration before making changes.",
    "Minha carteira": "My portfolio",
    "Marcar como lido": "Mark as read",
    "✓ Lido": "✓ Read",
    " • Lido": " • Read",
    " • Novo sinal": " • New signal",
    "Orientação:": "Guidance:",
    "Atualizado": "Updated",
    "Tipo": "Type",
    "Notificações:": "Notifications:",
    "Permitidas no navegador": "Allowed in browser",
    "Bloqueadas no aparelho": "Blocked on device",
    "Aguardando autorização": "Waiting for permission",
    "Indisponíveis": "Unavailable",
    "Push 24h: verificar servidor abaixo": "24h Push: check server status below",
    "Dados recebidos": "Data received",
    "Aguardando dados recentes": "Waiting for recent data",
    "Nenhum sinal confirmado agora": "No confirmed signals right now",
    "Sem alertas que atendam aos critérios atuais. A análise continua monitorando o mercado.": "No alerts meet the current criteria. Analysis continues monitoring the market.",
    "Quando preço e dados técnicos forem atualizados, o Radar mostrará os alertas verificáveis.": "Radar will show verifiable alerts when price and technical data are updated.",
    "MAIOR PRIORIDADE AGORA": "TOP PRIORITY NOW",
    "STATUS DA CARTEIRA": "PORTFOLIO STATUS",
    "RISCO CRÍTICO": "CRITICAL RISK",
    "QUEDA FORTE CONFIRMADA": "SHARP DECLINE CONFIRMED",
    "AVALIAR REALIZAÇÃO": "REVIEW PROFIT TAKING",
    "REVISAR REDUÇÃO": "REVIEW REDUCTION",
    "REVISAR RISCO": "REVIEW RISK",
    "REVISAR PROTEÇÃO": "REVIEW PROTECTION",
    "REVISAR ENTRADA": "REVIEW ENTRY",
    "RISCO": "RISK",
    "VENDA / PROTEÇÃO": "SELL / PROTECTION",
    "CANDIDATA • AGUARDANDO": "CANDIDATE • WAITING",
    "CONFIRMAÇÃO NECESSÁRIA": "CONFIRMATION REQUIRED",
    "OBSERVAR": "WATCH",
    "EVITAR ENTRADA": "AVOID ENTRY",
    "ANÁLISE PENDENTE": "ANALYSIS PENDING",
    "COMPRA CONFIRMADA": "CONFIRMED BUY",
    "SINAL FORTE": "STRONG SIGNAL",
    "CANDIDATA A COMPRA": "BUY CANDIDATE",
    "risco técnico baixo": "low technical risk",
    "risco técnico elevado": "high technical risk",
    "mercado geral defensivo": "broader market is defensive",
    "regime geral favorável": "favorable overall market regime",
    "volume confirmando": "volume confirms the move",
    "volume abaixo do ideal": "volume below ideal levels",
    "preço próximo de zona técnica": "price near a technical zone",
    "RSI em faixa saudável": "RSI in a healthy range",
    "RSI já aquecido": "RSI already elevated",
    "RSI esticado": "RSI overstretched",
    "momentum ainda fraco": "momentum still weak",
    "força relativa acima do BTC": "relative strength above BTC",
    "fraqueza relativa ao BTC": "relative weakness against BTC",
    "estrutura 4h HH/HL": "4h HH/HL structure",
    "estrutura 4h baixista": "bearish 4h structure",
    "tendência 1d positiva": "positive daily trend",
    "tendência 1d desfavorável": "unfavorable daily trend",
    "distante do VWAP": "far from VWAP",
    "abaixo do VWAP; reversão ainda não confirmada": "below VWAP; reversal not yet confirmed",
    "movimento 24h muito esticado": "24h move is heavily extended",
    "alta 24h acelerada": "accelerating 24h rally",
    "queda 24h relevante": "significant 24h drop",
    "estrutura 4h ainda mista; falta confirmação": "4h structure remains mixed; confirmation is missing",
    "movimento 24h já avançado; evitar perseguir preço": "24h move is already extended; avoid chasing price",
    "liquidez e preço monitorados": "liquidity and price monitored",
    "faltam indicadores multi-timeframe": "multi-timeframe indicators are missing",
    "Aguardando estrutura, tendência e indicadores técnicos antes de classificar a entrada.": "Waiting for structure, trend and technical indicators before classifying the entry."
  },
  "es": {
    "Comprar / aportar": "Comprar / aportar",
    "Nenhum bloqueio forte entre os ativos analisados agora.": "No hay bloqueos importantes entre los activos analizados ahora.",
    "Cruza tendência, momentum, volume, liquidez, VWAP, força vs BTC, risco, regime e composição da sua carteira.": "Combina tendencia, impulso, volumen, liquidez, VWAP, fuerza relativa frente a BTC, riesgo, régimen de mercado y composición de la cartera.",
    "Compare perfis antes de decidir como distribuir capital novo.": "Compara perfiles antes de decidir cómo distribuir nuevos fondos.",
    "Todos os perfis estão em espera porque não há compras tecnicamente confirmadas. Os perfis mudam limites e riscos, mas não inventam sinais.": "Todos los perfiles están en espera porque no hay compras confirmadas técnicamente. Los perfiles cambian límites y riesgos, pero no inventan señales.",
    "Reserva + ativos priorizados com limite de concentração.": "Reserva y activos priorizados con límites de concentración.",
    "Qualidade do sinal, não previsão de lucro.": "Calidad de la señal, no previsión de ganancias.",
    "Ativos com risco, timing ruim ou bloqueios técnicos.": "Activos con riesgo, oportunidad de entrada desfavorable o bloqueos técnicos.",
    "Simulação informativa. O Cripto Radar não executa ordens, não garante lucro e não substitui avaliação financeira individual.": "Simulación informativa. Cripto Radar no ejecuta órdenes, no garantiza ganancias ni sustituye la evaluación financiera individual.",
    "Valor e variação de 24h são estimativas de mercado. Resultado não realizado usa apenas posições com preço médio cadastrado; não inclui taxas ou impostos. Pontuação técnica não é probabilidade de lucro.": "El valor y las variaciones de 24 h son estimaciones de mercado. El resultado no realizado solo incluye posiciones con precio medio registrado; no incluye comisiones ni impuestos. La puntuación técnica no es una probabilidad de ganancia.",
    "Ativos sob observação (não são compras)": "Activos en observación (no son señales de compra)",
    "A escolha de perfil não libera compras sem confirmação, por isso os três cenários podem manter 100% em reserva.": "Elegir un perfil no autoriza compras sin confirmar, por eso los tres escenarios pueden mantener el 100 % en reserva.",
    "Aguarde nova leitura do mercado ou atualize os dados. Não há aporte obrigatório.": "Espera una nueva lectura del mercado o actualiza los datos. No es obligatorio aportar.",
    "Ainda não há dados técnicos suficientes e atualizados para liberar uma entrada.": "Todavía no hay suficientes datos técnicos actualizados para confirmar una entrada.",
    "Exemplo do que falta para avançar:": "Ejemplos de requisitos pendientes:",
    "As entradas só entram na divisão após confirmação.": "Los activos solo se incluyen en la distribución tras la confirmación.",
    "Simulação inteligente de aporte": "Simulación inteligente de aportes",
    "Divisão sugerida —": "Distribución sugerida —",
    "Ranking técnico do mercado": "Clasificación técnica del mercado",
    "O que evitar ou esperar": "Qué evitar o cuándo esperar",
    "Central de Mercado & Aporte": "Centro de mercado y aportes",
    "Leitura da IA/Radar": "Evaluación IA/Radar",
    "Saúde da carteira": "Salud de la cartera",
    "Reserva atual": "Reserva actual",
    "análise ativa": "análisis activo",
    "Defensivo": "Defensivo",
    "Favorável": "Favorable",
    "Seletivo": "Selectivo",
    "carteira vazia": "cartera vacía",
    "Aporte": "Aporte",
    "Objetivo": "Objetivo",
    "Entrada": "Entrada",
    "Parcelada": "Por etapas",
    "Só após confirmação": "Solo tras confirmación",
    "Mais imediata": "Más inmediata",
    "Proteção": "Protección",
    "Equilíbrio": "Equilibrio",
    "Crescimento": "Crecimiento",
    "Conservador": "Conservador",
    "Equilibrado": "Equilibrado",
    "Agressivo": "Agresivo",
    "qualidade": "calidad",
    "Agora": "Ahora",
    "Correção": "Retroceso",
    "Confirmação": "Confirmación",
    "Reserva estratégica": "Reserva estratégica",
    "Tendência": "Tendencia",
    "Liquidez": "Liquidez",
    "Risco": "Riesgo",
    "Para confirmar:": "Para confirmar:",
    "Aguardar": "Esperar",
    "mercado": "mercado",
    "Saúde": "Salud",
    "Risco técnico": "Riesgo técnico",
    "Pontos de atenção": "Puntos de atención",
    "Distribuição monitorada pelo Radar.": "Radar supervisa la distribución.",
    "Sua carteira está concentrada.": "Tu cartera está concentrada.",
    "Sua carteira está vazia.": "Tu cartera está vacía.",
    "Importe um print ou adicione moedas manualmente para começar.": "Importa una captura de pantalla o añade monedas manualmente para empezar.",
    "Sem posições precificadas para mostrar a distribuição.": "No hay posiciones con precio para mostrar la distribución.",
    "Sem alertas de concentração extrema ou de dados ausentes nesta leitura.": "No hay alertas por concentración extrema ni datos ausentes en esta lectura.",
    "Adicione seus ativos para iniciar o monitoramento.": "Añade tus activos para empezar el seguimiento.",
    "Nenhuma moeda corresponde a este filtro.": "Ninguna moneda coincide con este filtro.",
    "Monitoramento da carteira": "Seguimiento de la cartera",
    "Atualização de mercado": "Actualización del mercado",
    "Inclui cotação desatualizada": "Incluye cotizaciones desactualizadas",
    "Posições cadastradas": "Posiciones registradas",
    "Dados 24h insuficientes": "Datos de 24 h insuficientes",
    "Cadastre os preços médios": "Registra los precios medios de compra",
    "Sem preços válidos": "Sin precios válidos",
    "Sem cotação": "Sin cotización",
    "Variação indisponível": "Variación no disponible",
    "Dados não atualizados": "Datos sin actualizar",
    "Preço atual": "Precio actual",
    "Quantidade": "Cantidad",
    "Qualidade técnica": "Calidad técnica",
    "Preço médio de compra (R$ por unidade)": "Precio medio de compra (BRL por unidad)",
    "Opcional e salvo apenas neste aparelho; ajuste se comprar ou vender ativos.": "Opcional y guardado solo en este dispositivo. Actualízalo al comprar o vender activos.",
    "Resultado não realizado": "Resultado no realizado",
    "(sem preço médio)": "(sin precio medio de compra)",
    "Pendente": "Pendiente",
    "Atualizando…": "Actualizando…",
    "↻ Atualizar dados": "↻ Actualizar datos",
    "Nenhum sinal corresponde ao filtro selecionado.": "Ninguna señal coincide con el filtro seleccionado.",
    "Ainda sem dados recentes ou sinais verificáveis.": "Todavía no hay datos recientes ni señales verificables.",
    "Nenhuma mudança registrada neste aparelho ainda.": "Todavía no se han registrado cambios en este dispositivo.",
    "Esperando confluência adicional.": "Esperando confluencia técnica adicional.",
    "Aguardar fechamento das confirmações técnicas.": "Esperar a que se completen las confirmaciones técnicas.",
    "Confluência validada pelo Radar.": "Radar ha validado la confluencia técnica.",
    "Confira valor do aporte e limite de concentração.": "Revisa el importe del aporte y el límite de concentración.",
    "Aguardar confirmação, sem aporte automático.": "Esperar confirmación; sin aportes automáticos.",
    "Conferir posição, risco e taxas antes de decidir.": "Revisa posición, riesgo y comisiones antes de decidir.",
    "Revisar proteção e concentração antes de movimentar.": "Revisa la protección y concentración antes de hacer cambios.",
    "Minha carteira": "Mi cartera",
    "Marcar como lido": "Marcar como leído",
    "✓ Lido": "✓ Leído",
    " • Lido": " • Leído",
    " • Novo sinal": " • Nueva señal",
    "Orientação:": "Orientación:",
    "Atualizado": "Actualizado",
    "Tipo": "Tipo",
    "Notificações:": "Notificaciones:",
    "Permitidas no navegador": "Permitidas en el navegador",
    "Bloqueadas no aparelho": "Bloqueadas en el dispositivo",
    "Aguardando autorização": "Esperando autorización",
    "Indisponíveis": "No disponibles",
    "Push 24h: verificar servidor abaixo": "Push 24 h: comprueba el estado del servidor abajo",
    "Dados recebidos": "Datos recibidos",
    "Aguardando dados recentes": "Esperando datos recientes",
    "Nenhum sinal confirmado agora": "No hay señales confirmadas ahora",
    "Sem alertas que atendam aos critérios atuais. A análise continua monitorando o mercado.": "Ninguna alerta cumple los criterios actuales. El análisis sigue vigilando el mercado.",
    "Quando preço e dados técnicos forem atualizados, o Radar mostrará os alertas verificáveis.": "Radar mostrará alertas verificables cuando se actualicen los precios y los datos técnicos.",
    "MAIOR PRIORIDADE AGORA": "MÁXIMA PRIORIDAD AHORA",
    "STATUS DA CARTEIRA": "ESTADO DE LA CARTERA",
    "RISCO CRÍTICO": "RIESGO CRÍTICO",
    "QUEDA FORTE CONFIRMADA": "CAÍDA FUERTE CONFIRMADA",
    "AVALIAR REALIZAÇÃO": "EVALUAR TOMA DE BENEFICIOS",
    "REVISAR REDUÇÃO": "REVISAR REDUCCIÓN",
    "REVISAR RISCO": "REVISAR RIESGO",
    "REVISAR PROTEÇÃO": "REVISAR PROTECCIÓN",
    "REVISAR ENTRADA": "REVISAR ENTRADA",
    "RISCO": "RIESGO",
    "VENDA / PROTEÇÃO": "VENTA / PROTECCIÓN",
    "CANDIDATA • AGUARDANDO": "CANDIDATA • EN ESPERA",
    "CONFIRMAÇÃO NECESSÁRIA": "CONFIRMACIÓN NECESARIA",
    "OBSERVAR": "OBSERVAR",
    "EVITAR ENTRADA": "EVITAR ENTRADA",
    "ANÁLISE PENDENTE": "ANÁLISIS PENDIENTE",
    "COMPRA CONFIRMADA": "COMPRA CONFIRMADA",
    "SINAL FORTE": "SEÑAL FUERTE",
    "CANDIDATA A COMPRA": "CANDIDATA A COMPRA",
    "risco técnico baixo": "riesgo técnico bajo",
    "risco técnico elevado": "riesgo técnico elevado",
    "mercado geral defensivo": "mercado general defensivo",
    "regime geral favorável": "régimen general favorable",
    "volume confirmando": "volumen confirma el movimiento",
    "volume abaixo do ideal": "volumen inferior al ideal",
    "preço próximo de zona técnica": "precio cerca de una zona técnica",
    "RSI em faixa saudável": "RSI en un rango saludable",
    "RSI já aquecido": "RSI ya elevado",
    "RSI esticado": "RSI sobreextendido",
    "momentum ainda fraco": "impulso aún débil",
    "força relativa acima do BTC": "fuerza relativa superior a BTC",
    "fraqueza relativa ao BTC": "debilidad relativa frente a BTC",
    "estrutura 4h HH/HL": "estructura 4 h HH/HL",
    "estrutura 4h baixista": "estructura bajista de 4 h",
    "tendência 1d positiva": "tendencia diaria positiva",
    "tendência 1d desfavorável": "tendencia diaria desfavorable",
    "distante do VWAP": "lejos del VWAP",
    "abaixo do VWAP; reversão ainda não confirmada": "por debajo del VWAP; reversión aún no confirmada",
    "movimento 24h muito esticado": "movimiento de 24 h muy extendido",
    "alta 24h acelerada": "subida acelerada en 24 h",
    "queda 24h relevante": "caída importante en 24 h",
    "estrutura 4h ainda mista; falta confirmação": "estructura de 4 h aún mixta; falta confirmación",
    "movimento 24h já avançado; evitar perseguir preço": "movimiento de 24 h ya avanzado; evita perseguir el precio",
    "liquidez e preço monitorados": "liquidez y precio monitorizados",
    "faltam indicadores multi-timeframe": "faltan indicadores de varios marcos temporales",
    "Aguardando estrutura, tendência e indicadores técnicos antes de classificar a entrada.": "Esperando estructura, tendencia e indicadores técnicos antes de clasificar la entrada."
  }
};
  Object.assign(STRINGS.en,V1952_EXACT.en);
  Object.assign(STRINGS.es,V1952_EXACT.es);
  Object.assign(STRINGS.en,{
  "1 hora": "1 hour",
  "Motor V10/V11": "V10/V11 Engine",
  "📈 Alta": "📈 Rise",
  "↔️ Lateral": "↔️ Sideways",
  "📉 Queda": "📉 Decline",
  "Alta": "Rise",
  "Lateral": "Sideways",
  "Queda": "Decline",
  "Confiança": "Confidence",
  "Plano unificado da carteira": "Unified portfolio plan",
  "● IA ativa": "● AI active",
  "memória ativa": "learning memory active",
  "memória permanente não configurada": "persistent learning not configured",
  "IA analisando mercado + carteira…": "AI analyzing market and portfolio…",
  "IA indisponível": "AI unavailable",
  "IA temporariamente indisponível • nova tentativa automática": "AI temporarily unavailable • retrying automatically",
  "🔊 Voz ligada": "🔊 Voice on",
  "🔇 Voz desligada": "🔇 Voice off",
  "🎙️ Falar": "🎙️ Speak",
  "🎙️ Voz não suportada": "🎙️ Voice not supported",
  "🔴 Ouvindo…": "🔴 Listening…",
  "Pergunte sobre mercado, uma moeda ou sua carteira…": "Ask about the market, a coin or your portfolio…",
  "Reserva de moedas estáveis abaixo de 5% da carteira": "Stablecoin reserve is below 5% of the portfolio",
  "Há cotações desatualizadas no valor estimado": "Estimated portfolio value includes stale quotes"
});
  Object.assign(STRINGS.es,{
  "Automático (dispositivo)": "Automático (dispositivo)",
  "Principal": "Principal",
  "Configurações": "Configuración",
  "PRO Anual": "PRO anual",
  "Iniciando…": "Iniciando…",
  "Segundo plano: iniciando…": "Segundo plano: iniciando…",
  "Idioma": "Idioma",
  "1 hora": "1 hora",
  "Buscando…": "Buscando…",
  "Inicializando diagnóstico…": "Iniciando diagnóstico…",
  "Verificando mercado…": "Verificando el mercado…",
  "Segundo plano local: preparando…": "Segundo plano local: preparando…",
  "Compras confirmadas": "Compras confirmadas",
  "📲 INSTALAR APP": "📲 INSTALAR APLICACIÓN",
  "◈ Simular aporte": "◈ Simular aporte",
  "↓ Exportar CSV": "↓ Exportar CSV",
  "Push: verificando": "Push: comprobando",
  "Motor V18.3": "Motor V18.3",
  "📈 VER MERCADO": "📈 VER MERCADO",
  "Buscando oportunidades…": "Buscando oportunidades…",
  "Use esta opção quando o OCR não reconhecer o print corretamente. Cole uma moeda por linha.": "Usa esta opción cuando el OCR no reconozca la captura correctamente. Pega una moneda por línea.",
  "Resultados históricos exigem uma amostra maior para serem interpretados com confiança.": "Los resultados históricos necesitan una muestra mayor para interpretarse con confianza.",
  "Slippage %/lado": "Deslizamiento %/lado",
  "Capital simulado (US$)": "Capital simulado (US$)",
  "↻ RECALCULAR": "↻ RECALCULAR",
  "RADAR SOCIAL": "RADAR SOCIAL",
  "Registro local": "Registro local",
  "Verificando Google Play Billing…": "Verificando la facturación de Google Play…",
  "Idioma da interface": "Idioma de la interfaz",
  "Confirmadas": "Confirmadas",
  "1 minuto": "1 minuto",
  "5 minutos": "5 minutos",
  "15 minutos": "15 minutos",
  "30 minutos": "30 minutos",
  "Motor V10/V11": "Motor V10/V11",
  "⚡ Radar Pro • Central": "⚡ Radar Pro • Centro",
  "Sua carteira ainda está vazia.": "Tu cartera todavía está vacía.",
  "Sua carteira ainda não foi enviada para a IA nesta leitura.": "Tu cartera todavía no se ha enviado a la IA en esta lectura.",
  "📈 Alta": "📈 Subida",
  "↔️ Lateral": "↔️ Lateral",
  "📉 Queda": "📉 Caída",
  "Alta": "Subida",
  "Lateral": "Lateral",
  "Queda": "Caída",
  "Confiança": "Confianza",
  "Plano unificado da carteira": "Plan unificado de la cartera",
  "● IA ativa": "● IA activa",
  "memória ativa": "memoria activa",
  "memória permanente não configurada": "memoria permanente no configurada",
  "IA analisando mercado + carteira…": "IA analizando mercado y cartera…",
  "IA indisponível": "IA no disponible",
  "IA temporariamente indisponível • nova tentativa automática": "IA temporalmente no disponible • nuevo intento automático",
  "🔊 Voz ligada": "🔊 Voz activada",
  "🔇 Voz desligada": "🔇 Voz desactivada",
  "🎙️ Falar": "🎙️ Hablar",
  "🎙️ Voz não suportada": "🎙️ Voz no compatible",
  "🔴 Ouvindo…": "🔴 Escuchando…",
  "Pergunte sobre mercado, uma moeda ou sua carteira…": "Pregunta por el mercado, una moneda o tu cartera…",
  "Realizar parte do lucro": "Tomar una parte de las ganancias",
  "Reserva de moedas estáveis abaixo de 5% da carteira": "Reserva de monedas estables por debajo del 5 % de la cartera",
  "Há cotações desatualizadas no valor estimado": "Hay cotizaciones desactualizadas en el valor estimado",
  "Atualização de mercado": "Actualización del mercado",
  "Verificando dados": "Comprobando datos"
});
  Object.assign(STRINGS.en,{"Alto": "High", "Baixo": "Low", "Médio": "Medium", "Regime": "Market regime", "Bloqueadas no aparelho": "Blocked on device", "Permitidas no navegador": "Allowed in browser", "Aguardando autorização": "Waiting for permission", "Notificações:": "Notifications:", "Em correção": "On pullback", "Na confirmação": "On confirmation", "Mercado geral": "Overall market", "Tendência": "Trend", "Liquidez": "Liquidity", "Carteira": "Portfolio", "Radar Social": "Radar Social", "A IA usa a mesma decisão para carteira, aporte e oportunidades: sem confirmação técnica, não mostra “aportar” nem “oportunidade confirmada”.": "AI applies the same criteria to portfolio, contributions and opportunities: without technical confirmation, it does not show a confirmed buying opportunity.", "Dados recebidos": "Data received", "Carteira vazia": "Empty portfolio"});
  Object.assign(STRINGS.es,{"Alto": "Alto", "Baixo": "Bajo", "Médio": "Medio", "Regime": "Régimen de mercado", "Bloqueadas no aparelho": "Bloqueadas en el dispositivo", "Permitidas no navegador": "Permitidas en el navegador", "Aguardando autorização": "Esperando autorización", "Notificações:": "Notificaciones:", "Em correção": "En retroceso", "Na confirmação": "Tras confirmación", "Mercado geral": "Mercado general", "Tendência": "Tendencia", "Liquidez": "Liquidez", "Carteira": "Cartera", "Radar Social": "Radar Social", "A IA usa a mesma decisão para carteira, aporte e oportunidades: sem confirmação técnica, não mostra “aportar” nem “oportunidade confirmada”.": "La IA aplica los mismos criterios a cartera, aportes y oportunidades: sin confirmación técnica, no muestra oportunidades de compra confirmadas.", "Dados recebidos": "Datos recibidos", "Carteira vazia": "Cartera vacía"});
  Object.assign(STRINGS.en,{
    'Alto risco':'High risk','Médio risco':'Medium risk','Baixo risco':'Low risk',
    'risco Alto':'high risk','risco Médio':'medium risk','risco Baixo':'low risk'
  });
  Object.assign(STRINGS.es,{
    'Alto risco':'riesgo alto','Médio risco':'riesgo medio','Baixo risco':'riesgo bajo',
    'risco Alto':'riesgo alto','risco Médio':'riesgo medio','risco Baixo':'riesgo bajo'
  });
  const V1952_SAFE_PHRASES={
    en:[['A escolha de perfil não libera compras sem confirmação, por isso os três cenários podem manter 100% em reserva.','Profile choice cannot override buy confirmation. All three scenarios may hold 100% in reserve.'],['Aguardando dados técnicos suficientes…','Waiting for sufficient technical data…'],['Bloqueadas no aparelho','Blocked on device'],['Permitidas no navegador','Allowed in browser'],['Aguardando autorização','Waiting for permission'],[' un.',' units']],
    es:[['A escolha de perfil não libera compras sem confirmação, por isso os três cenários podem manter 100% em reserva.','Elegir un perfil no autoriza compras sin confirmar, por lo que los tres escenarios pueden mantener el 100 % en reserva.'],['Aguardando dados técnicos suficientes…','Esperando suficientes datos técnicos…'],['Bloqueadas no aparelho','Bloqueadas en el dispositivo'],['Permitidas no navegador','Permitidas en el navegador'],['Aguardando autorização','Esperando autorización']]
  };
  const V1952_PATTERNS={
    en:[
      [/^(\d+) ativo\(s\) \u2022 (\d+) com cota\u00e7\u00e3o$/, '$1 asset(s) • $2 with prices'],
      [/^(\d+) sinal\(is\) exibido\(s\) \u2022 (\d+) ativo\(s\) em acompanhamento( \u2022 filtrado)?$/, '$1 signals shown • $2 assets monitored$3'],
      [/^(\d+) ativo\(s\) monitorado\(s\) n\u00e3o passaram pelos crit\u00e9rios obrigat\u00f3rios de compra\.$/, '$1 monitored assets did not meet the mandatory buy criteria.'],
      [/^Reserva de (R\$\s?[\d.,]+) \(100%\) \u2014 aguardando confirma\u00e7\u00e3o$/, 'Reserve of $1 (100%) — awaiting confirmation'],
      [/^Reserva (\d+)%$/, 'Reserve $1%'],
      [/^(\d+) ativo\(s\) sem cota\u00e7\u00e3o: n\u00e3o inclu\u00eddos no valor total$/, '$1 assets without quotes: excluded from total value'],
      [/^(\d+) ativo\(s\) com bloqueio ou risco t\u00e9cnico elevado$/, '$1 assets with restrictions or high technical risk'],
      [/^(.+?) ocupa ([\d,.]+)% da carteira: concentra\u00e7\u00e3o elevada$/, '$1 makes up $2% of the portfolio: high concentration'],
      [/^(.+?) ocupa ([\d,.]+)% da carteira: acompanhar concentra\u00e7\u00e3o$/, '$1 makes up $2% of the portfolio: review concentration'],
      [/^([\d,.]+)% da carteira$/, '$1% of portfolio'],
      [/^([\d,.]+)% do total$/, '$1% of total'],
      [/^([\d,.]+)% do aporte$/, '$1% of contribution'],
      [/^([\d,.]+)% da carteira rastreada$/, '$1% of portfolio tracked'],
      [/^([\d,.]+)% dos ativos em valor$/, '$1% of assets by value'],
      [/^(\d+) min$/, '$1 min'],
      [/^Sa\u00fade (\d+\/100) \u2022 risco (.+)$/, 'Health $1 • $2 risk'],
      [/^(.+) risco$/, '$1 risk'],
      [/^Maior posi\u00e7\u00e3o: (\w+) \(([\d,.]+)%\)\.$/, 'Largest position: $1 ($2%).'],
      [/^(\w+): boa base t\u00e9cnica, mas ainda merece confirma\u00e7\u00e3o de (.+)\.$/, '$1: promising technical setup, but confirmation is still needed for $2.'],
      [/^(\w+): cen\u00e1rio incompleto; aguardar melhora antes de elevar a exposi\u00e7\u00e3o\.$/, '$1: incomplete setup; wait for improvement before increasing exposure.'],
      [/^Movimento confirmado em duas leituras; score de risco (\d+\/100)\.$/, 'Move confirmed in two readings; risk score $1.'],
      [/^(.+?) \u2022 (\d+) sinal\(is\) \u00fateis$/, '$1 • $2 useful signals'],
      [/^Atualizado (.+)$/, 'Updated $1'],
      [/^Dados recebidos \u2022 (.+)$/, 'Data received • $1']
    ],
    es:[
      [/^(\d+) ativo\(s\) \u2022 (\d+) com cota\u00e7\u00e3o$/, '$1 activo(s) • $2 con cotización'],
      [/^(\d+) sinal\(is\) exibido\(s\) \u2022 (\d+) ativo\(s\) em acompanhamento( \u2022 filtrado)?$/, '$1 señales mostradas • $2 activos bajo seguimiento$3'],
      [/^(\d+) ativo\(s\) monitorado\(s\) n\u00e3o passaram pelos crit\u00e9rios obrigat\u00f3rios de compra\.$/, '$1 activos monitorizados no cumplieron los criterios obligatorios de compra.'],
      [/^Reserva de (R\$\s?[\d.,]+) \(100%\) \u2014 aguardando confirma\u00e7\u00e3o$/, 'Reserva de $1 (100 %) — esperando confirmación'],
      [/^Reserva (\d+)%$/, 'Reserva $1 %'],
      [/^(\d+) ativo\(s\) sem cota\u00e7\u00e3o: n\u00e3o inclu\u00eddos no valor total$/, '$1 activos sin cotización: excluidos del valor total'],
      [/^(\d+) ativo\(s\) com bloqueio ou risco t\u00e9cnico elevado$/, '$1 activos con restricciones o riesgo técnico elevado'],
      [/^(.+?) ocupa ([\d,.]+)% da carteira: concentra\u00e7\u00e3o elevada$/, '$1 representa el $2 % de la cartera: concentración elevada'],
      [/^(.+?) ocupa ([\d,.]+)% da carteira: acompanhar concentra\u00e7\u00e3o$/, '$1 representa el $2 % de la cartera: revisar concentración'],
      [/^([\d,.]+)% da carteira$/, '$1 % de la cartera'],
      [/^([\d,.]+)% do total$/, '$1 % del total'],
      [/^([\d,.]+)% do aporte$/, '$1 % del aporte'],
      [/^([\d,.]+)% da carteira rastreada$/, '$1 % de la cartera registrada'],
      [/^([\d,.]+)% dos ativos em valor$/, '$1 % de los activos por valor'],
      [/^Sa\u00fade (\d+\/100) \u2022 risco (.+)$/, 'Salud $1 • riesgo $2'],
      [/^(.+) risco$/, 'riesgo $1'],
      [/^Maior posi\u00e7\u00e3o: (\w+) \(([\d,.]+)%\)\.$/, 'Mayor posición: $1 ($2 %).'],
      [/^(\w+): boa base t\u00e9cnica, mas ainda merece confirma\u00e7\u00e3o de (.+)\.$/, '$1: base técnica prometedora, pero aún requiere confirmación de $2.'],
      [/^(\w+): cen\u00e1rio incompleto; aguardar melhora antes de elevar a exposi\u00e7\u00e3o\.$/, '$1: escenario incompleto; espera a una mejora antes de aumentar la exposición.'],
      [/^Movimento confirmado em duas leituras; score de risco (\d+\/100)\.$/, 'Movimiento confirmado en dos lecturas; puntuación de riesgo $1.'],
      [/^(.+?) \u2022 (\d+) sinal\(is\) \u00fateis$/, '$1 • $2 señales útiles'],
      [/^Atualizado (.+)$/, 'Actualizado $1'],
      [/^Dados recebidos \u2022 (.+)$/, 'Datos recibidos • $1']
    ]
  };

  /* V19.5.4: terminology fixes. Whole sentences first; only known Portuguese
     market terms are translated in mixed dynamic templates. External news and
     arbitrary user-generated prose are NOT machine translated. */
  const V1954_EXACT={
    en:{
      'Destaques do mercado':'Market highlights',
      'Risco do mercado':'Market risk',
      'Servidor e agendador':'Server and scheduler',
      'Mercado geral • em tempo real':'Overall market • live',
      'Mercado geral':'Overall market',
      'Inteligência de mercado • Sinais confirmados':'Market intelligence • Confirmed signals',
      'Inteligência de mercado':'Market intelligence',
      'Notificações locais':'Local notifications',
      'Análise da carteira':'Portfolio analysis',
      'Análise crítica de risco de compra.':'Critical buy-risk analysis.',
      'Análise da carteira: Aguardando sinais':'Portfolio analysis: Waiting for signals',
      'Risco alto e liquidez baixa':'High risk and low liquidity',
      'Falta confirmar: volume, liquidez e tendência.':'Still required: volume, liquidity and trend.',
      'Entrada bloqueada. Falta confirmar: volume, liquidez e tendência.':'Entry blocked. Still required: volume, liquidity and trend.',
      'Mercado em alta, mas as compras estão bloqueadas.':'The market is rising, but buy signals remain blocked.',
      'Não foi possível analisar a carteira.':'Could not analyze the portfolio.',
      'Reserva estável':'Stablecoin reserve',
      'O Radar detectou pressão de venda confirmada por liquidez. Considere reduzir exposição após revisar o mercado.':'Radar detected selling pressure supported by liquidity. Review your exposure before making changes.',
      'Pontos de atenção: BTC em queda':'Points to review: BTC declining',
      'Atualização do mercado e da carteira pendente.':'Market and portfolio update pending.'
    },
    es:{
      'Destaques do mercado':'Destacados del mercado',
      'Risco do mercado':'Riesgo del mercado',
      'Servidor e agendador':'Servidor y programador',
      'Mercado geral • em tempo real':'Mercado general • en tiempo real',
      'Mercado geral':'Mercado general',
      'Inteligência de mercado • Sinais confirmados':'Inteligencia de mercado • Señales confirmadas',
      'Inteligência de mercado':'Inteligencia de mercado',
      'Notificações locais':'Notificaciones locales',
      'Análise da carteira':'Análisis de cartera',
      'Análise crítica de risco de compra.':'Análisis crítico del riesgo de compra.',
      'Análise da carteira: Aguardando sinais':'Análisis de cartera: Esperando señales',
      'Risco alto e liquidez baixa':'Riesgo alto y liquidez baja',
      'Falta confirmar: volume, liquidez e tendência.':'Falta confirmar: volumen, liquidez y tendencia.',
      'Entrada bloqueada. Falta confirmar: volume, liquidez e tendência.':'Entrada bloqueada. Falta confirmar: volumen, liquidez y tendencia.',
      'Mercado em alta, mas as compras estão bloqueadas.':'El mercado está subiendo, pero las compras siguen bloqueadas.',
      'Não foi possível analisar a carteira.':'No se pudo analizar la cartera.',
      'Reserva estável':'Reserva de monedas estables',
      'O Radar detectou pressão de venda confirmada por liquidez. Considere reduzir exposição após revisar o mercado.':'Radar detectó presión vendedora respaldada por liquidez. Revisa tu exposición antes de realizar cambios.',
      'Pontos de atenção: BTC em queda':'Puntos de atención: BTC a la baja',
      'Atualização do mercado e da carteira pendente.':'Actualización de mercado y cartera pendiente.'
    }
  };
  const V1954_PHRASES={
    en:[
      ['Entrada bloqueada.', 'Entry blocked.'],
      ['Notificações locais:', 'Local notifications:'],
      ['alertas ativos', 'active alerts'],
      ['Alta confirmada com ', 'Rally confirmed with '],
      ['Cotação', 'Quote'],
      ['cotação', 'quote'],
      [' com ', ' with '],
      ['Falta confirmar:', 'Still required:'],
      ['em tempo real', 'in real time'],
      ['Mercado indisponível', 'Market unavailable'],
      ['nova tentativa em', 'retry in'],
      ['Última atualização:', 'Last update:'],
      ['Atualização do mercado', 'Market update'],
      ['Atualização da carteira', 'Portfolio update'],
      ['Mercado em alta', 'Rising market'],
      ['compras estão bloqueadas', 'buys remain blocked'],
      ['Dados técnicos suficientes', 'Sufficient technical data'],
      ['sinais confirmados', 'confirmed signals'],
      ['estrutura fraca', 'weak market structure'],
      ['tendência positiva', 'positive trend'],
      ['tendência negativa', 'negative trend'],
      ['risco controlado', 'controlled risk'],
      ['risco alto', 'high risk'],
      ['risco médio', 'medium risk'],
      ['risco baixo', 'low risk'],
      ['liquidez baixa', 'low liquidity'],
      ['liquidez alta', 'high liquidity'],
      ['queda forte', 'sharp decline'],
      ['alta confirmada', 'confirmed rally'],
      ['sinais de compra', 'buy signals'],
      ['sinais de venda', 'sell signals'],
      ['compra confirmada', 'confirmed buy'],
      ['análise de risco', 'risk analysis'],
      ['concentração elevada', 'high concentration'],
      ['Concentração', 'Concentration'], ['concentração', 'concentration'],
      ['Pontos de atenção', 'Points to review'],
      ['Inteligência de mercado', 'Market intelligence'],
      ['análise da carteira', 'portfolio analysis'],
      ['Análise da carteira', 'Portfolio analysis'],
      ['Análise crítica', 'Critical analysis'],
      ['Movimentação inteligente', 'Smart allocation'],
      ['Destaques do mercado', 'Market highlights'],
      ['mercado geral', 'overall market'],
      ['Servidor', 'Server'],['agendador', 'scheduler'],
      ['liquidez', 'liquidity'],['tendência', 'trend'],['Tendência', 'Trend'],
      ['estrutura', 'structure'],['Volume', 'Volume'],['volume', 'volume'],
      ['risco', 'risk'],['Risco', 'Risk'],['mercado', 'market'],['Mercado', 'Market'],
      ['carteira', 'portfolio'],['Carteira', 'Portfolio'],
      ['compra', 'buy'],['compras', 'buys'],['venda', 'sell'],
      ['sinal', 'signal'],['sinais', 'signals'],['confirmar', 'confirm'],
      ['confirmados', 'confirmed'],['confirmadas', 'confirmed'],
      ['ativos', 'assets'],['ativo', 'asset'],['alertas', 'alerts'],['alerta', 'alert'],
      ['moedas', 'coins'],['moeda', 'coin'],['reserva', 'reserve'],
      ['bloqueadas', 'blocked'],['bloqueados', 'blocked'],['pendente', 'pending'],
      ['Análise', 'Analysis'],['análise', 'analysis'],
      ['Dados', 'Data'],['dados', 'data'],['alta', 'rise'],['queda', 'decline'],
      ['baixa', 'low'],['forte', 'strong'],['positivo', 'positive'],['negativo', 'negative'],
      ['controlado', 'controlled'],['fraca', 'weak'],['elevada', 'high'],
      ['última', 'last'],['Última', 'Last'],['tempo', 'time'],['real', 'real'],
      ['atualização', 'update'],['Atualização', 'Update'],
      ['do ', 'of the '],['da ', 'of the '],['dos ', 'of the '],['das ', 'of the '],
      ['de ', 'of '],['em ', 'in '],['na ', 'in the '],['no ', 'in the '],
      [' e ', ' and '],[' ou ', ' or ']
    ],
    es:[
      ['Entrada bloqueada.', 'Entrada bloqueada.'],
      ['Notificações locais:', 'Notificaciones locales:'],
      ['alertas ativos', 'alertas activos'],
      ['Alta confirmada com ', 'Subida confirmada con '],
      ['Cotação', 'Cotización'],
      ['cotação', 'cotización'],
      [' com ', ' con '],
      ['Falta confirmar:', 'Falta confirmar:'],
      ['em tempo real', 'en tiempo real'],
      ['Mercado indisponível', 'Mercado no disponible'],
      ['nova tentativa em', 'nuevo intento en'],
      ['Última atualização:', 'Última actualización:'],
      ['Atualização do mercado', 'Actualización del mercado'],
      ['Atualização da carteira', 'Actualización de la cartera'],
      ['Mercado em alta', 'Mercado alcista'],
      ['compras estão bloqueadas', 'compras siguen bloqueadas'],
      ['Dados técnicos suficientes', 'Datos técnicos suficientes'],
      ['sinais confirmados', 'señales confirmadas'],
      ['estrutura fraca', 'estructura débil'],
      ['tendência positiva', 'tendencia positiva'],
      ['tendência negativa', 'tendencia negativa'],
      ['risco controlado', 'riesgo controlado'],
      ['risco alto', 'riesgo alto'],
      ['risco médio', 'riesgo medio'],
      ['risco baixo', 'riesgo bajo'],
      ['liquidez baixa', 'liquidez baja'],
      ['liquidez alta', 'liquidez alta'],
      ['queda forte', 'caída fuerte'],
      ['alta confirmada', 'subida confirmada'],
      ['sinais de compra', 'señales de compra'],
      ['sinais de venda', 'señales de venta'],
      ['compra confirmada', 'compra confirmada'],
      ['análise de risco', 'análisis de riesgo'],
      ['concentração elevada', 'concentración elevada'],
      ['Concentração', 'Concentración'], ['concentração', 'concentración'],
      ['Pontos de atenção', 'Puntos de atención'],
      ['Inteligência de mercado', 'Inteligencia de mercado'],
      ['análise da carteira', 'análisis de la cartera'],
      ['Análise da carteira', 'Análisis de la cartera'],
      ['Análise crítica', 'Análisis crítico'],
      ['Movimentação inteligente', 'Gestión inteligente'],
      ['Destaques do mercado', 'Destacados del mercado'],
      ['mercado geral', 'mercado general'],
      ['agendador', 'programador'],['Servidor', 'Servidor'],
      ['volume', 'volumen'],['Volume', 'Volumen'],
      ['tendência', 'tendencia'],['Tendência', 'Tendencia'],
      ['estrutura', 'estructura'],['Estrutura', 'Estructura'],
      ['risco', 'riesgo'],['Risco', 'Riesgo'],
      ['carteira', 'cartera'],['Carteira', 'Cartera'],
      ['sinal', 'señal'],['sinais', 'señales'],['confirmar', 'confirmar'],
      ['confirmados', 'confirmados'],['confirmadas', 'confirmadas'],
      ['ativos', 'activos'],['ativo', 'activo'],['alertas', 'alertas'],['alerta', 'alerta'],
      ['moedas', 'monedas'],['moeda', 'moneda'],
      ['bloqueadas', 'bloqueadas'],['bloqueados', 'bloqueados'],['pendente', 'pendiente'],
      ['Análise', 'Análisis'],['análise', 'análisis'],
      ['Dados', 'Datos'],['dados', 'datos'],['alta', 'alza'],['queda', 'caída'],
      ['baixa', 'baja'],['forte', 'fuerte'],
      ['atualização', 'actualización'],['Atualização', 'Actualización'],
      ['concentração', 'concentración'],['Última', 'Última'],
      ['do ', 'del '],['da ', 'de la '],['dos ', 'de los '],['das ', 'de las '],
      ['em ', 'en '],['na ', 'en la '],
      [' e ', ' y '],[' ou ', ' o ']
    ]
  };
  Object.assign(STRINGS.en,V1954_EXACT.en);
  Object.assign(STRINGS.es,V1954_EXACT.es);
  function tr(original,lang){
    if(lang==='pt-BR')return original;
    const exact=STRINGS[lang]?.[original]; if(exact!==undefined)return exact;
    // The Push status is assembled from several sentences; translate each
    // complete message first to avoid unsafe word-by-word mixed-language output.
    if(original.startsWith('Servidor Push disponível. ')){
      return original.split(/(?<=\.)\s+/).map(part=>tr(part,lang)).join(' ');
    }

    for(const [pattern,output] of V1955_DIAGNOSTIC_TEMPLATES[lang]||[])if(pattern.test(original))return original.replace(pattern,output);
    const riskHealth=original.match(/^Saúde (\d+\/100) • risco (alto|médio|baixo)$/i);
    if(riskHealth){const level=riskHealth[2].toLowerCase();return lang==='en'
      ?'Health '+riskHealth[1]+' • '+({alto:'high',médio:'medium',baixo:'low'}[level]||level)+' risk'
      :'Salud '+riskHealth[1]+' • riesgo '+({alto:'alto',médio:'medio',baixo:'bajo'}[level]||level);}
    const thereAre=original.match(/^(Na carteira|No mercado|Na análise) há (\d+) (ativos?|moedas?|alertas?|sinais?) e (\d+) (ativos?|moedas?|alertas?|sinais?)\.$/i);
    if(thereAre){const terms=lang==='en'?{ativo:'asset',ativos:'assets',moeda:'coin',moedas:'coins',alerta:'alert',alertas:'alerts',sinal:'signal',sinais:'signals'}:{ativo:'activo',ativos:'activos',moeda:'moneda',moedas:'monedas',alerta:'alerta',alertas:'alertas',sinal:'señal',sinais:'señales'};
      const where=lang==='en'?({'Na carteira':'In the portfolio','No mercado':'In the market','Na análise':'In the analysis'}[thereAre[1]]||'In the portfolio'):({'Na carteira':'En la cartera','No mercado':'En el mercado','Na análise':'En el análisis'}[thereAre[1]]||'En la cartera');
      return where+(lang==='en'?' there are ':' hay ')+thereAre[2]+' '+terms[thereAre[3]]+(lang==='en'?' and ':' y ')+thereAre[4]+' '+terms[thereAre[5]]+'.';}
    // Score summaries are assembled from known technical terms: preserve the asset symbol.
    const blocked=original.match(/^([A-Z0-9]{2,16}): (evitar entrada|observar|compra confirmada|sinal forte|candidata a compra) por (.+)\.$/i);
    if(blocked){
      const reasons=blocked[3].split(/ e (?=(?:risco|estrutura|mercado|volume|tendência|preço|RSI|VWAP))/i).map(x=>tr(x,lang)).join(lang==='en'?' and ':' y ');
      return blocked[1]+': '+tr(blocked[2].toUpperCase(),lang).toLowerCase()+(lang==='en'?' because ':' debido a ')+reasons+'.';
    }
    const positive=original.match(/^([A-Z0-9]{2,16}): confluência forte; (.+)\.$/);
    if(positive){
      const reasons=positive[2].split(/ e (?=(?:risco|estrutura|mercado|volume|tendência|preço|RSI|força|regime))/i).map(x=>tr(x,lang)).join(lang==='en'?' and ':' y ');
      return positive[1]+': '+(lang==='en'?'strong technical alignment; ':'fuerte confluencia técnica; ')+reasons+'.';
    }
    for(const [regex,replacement] of V1952_PATTERNS[lang]||[]){
      if(regex.test(original)) return original.replace(regex,replacement).replace(/ • filtrado$/,(lang==='en'?' • filtered':' • filtrado'));
    }
    let out=original;
    // Mensagens dinâmicas podem conter números, moedas e valores; traduza apenas o texto humano.
    // Do not translate a short Portuguese token inside another word (e.g., "alta" inside "Falta").
    const word=/[\p{L}\p{N}]/u;
    const replaceRule=(input,source,target)=>{
      if(!input.includes(source))return input;
      let out='',at=0,i;
      while((i=input.indexOf(source,at))!==-1){
        const prev=i>0?input[i-1]:'',next=input[i+source.length]||'';
        const startInside=word.test(source[0])&&prev&&word.test(prev);
        const endInside=word.test(source[source.length-1])&&next&&word.test(next);
        out+=input.slice(at,i)+(startInside||endInside?source:target);
        at=i+source.length;
      }
      return out+input.slice(at);
    };
    for(const [a,b] of V1952_SAFE_PHRASES[lang]||[])out=replaceRule(out,a,b);
    for(const [a,b] of V1951_PHRASES[lang]||[])out=replaceRule(out,a,b);
    for(const [a,b] of V195_PHRASES[lang]||[])out=replaceRule(out,a,b);
    for(const [a,b] of V1954_PHRASES[lang]||[])out=replaceRule(out,a,b);
    for(const [a,b] of DYNAMIC_V192[lang]||[])out=replaceRule(out,a,b);
    for(const [a,b] of PHRASES[lang]||[])out=replaceRule(out,a,b);
    for(const [a,b] of FALLBACK[lang]||[])out=replaceRule(out,a,b);
    if(lang==='en'){
      if(/\bhá\s+\d/i.test(original))out=out.replace(/ago:\s*(\d+)\s*(seconds|minutes|hours|days)/i,'$1 $2 ago');
      out=out.replace(/\bWaiting (\d+)\b/g,'Waiting for $1');
      out=out.replace(/\b(portfolio|market) ago:\s*(\d+)\b/gi,'$1 has $2');
    }
    return out;
  }
  // Exact translations for template labels, including versioned market headings.
  Object.assign(STRINGS.en,{
    'Valor do aporte':'Contribution amount',
    'V19.5.4 • INTELIGÊNCIA DE MERCADO':'V19.5.4 • MARKET INTELLIGENCE',
    'V19.6.0 • INTELIGÊNCIA DE MERCADO':'V19.6.0 • MARKET INTELLIGENCE',
    'ATUALIZAÇÃO EM TEMPO REAL':'LIVE UPDATE',
    'STATUS DA CARTEIRA':'PORTFOLIO STATUS'
  });
  Object.assign(STRINGS.es,{
    'Valor do aporte':'Importe del aporte',
    'V19.5.4 • INTELIGÊNCIA DE MERCADO':'V19.5.4 • INTELIGENCIA DE MERCADO',
    'V19.6.0 • INTELIGÊNCIA DE MERCADO':'V19.6.0 • INTELIGENCIA DE MERCADO',
    'ATUALIZAÇÃO EM TEMPO REAL':'ACTUALIZACIÓN EN TIEMPO REAL',
    'STATUS DA CARTEIRA':'ESTADO DE LA CARTERA'
  });
  // V19.5.3 — polished labels in both interfaces, before generic word substitutions.
  Object.assign(STRINGS.en, {"Perfil de aporte": "Contribution profile", "Aporte Perfil": "Contribution profile", "Reserva 100%": "100% in reserve", "Status da carteira": "Portfolio status", "Registro local": "Local history", "REGISTRO LOCAL": "LOCAL HISTORY", "Mercado geral": "Overall market", "Alertas de mercado": "Market alerts", "Candidatas": "Candidates", "Oportunidades": "Opportunities", "Confirmados": "Confirmed", "Informações": "Information", "Atualização em tempo real": "Live market update", "Compras confirmadas": "Confirmed buys", "Sem dados suficientes": "Not enough data", "Análise pendente": "Analysis pending", "Símbolo": "Symbol", "Objetivo": "Goal", "Perfil": "Profile", "Aporte": "Contribution", "Notificações locais": "Local notifications", "Local": "Local", "Detalhes": "Details", "Vender": "Sell", "Comprar": "Buy", "Atualizar": "Refresh", "Conservador": "Conservative", "Equilibrado": "Balanced", "Agressivo": "Aggressive", "Ativo": "Asset", "Ativos": "Assets", "Preço": "Price", "Variação": "Change", "Prioridade": "Priority", "Visão do mercado": "Market overview", "Alerta ativado": "Alert enabled", "Mercado indisponível": "Market unavailable", "Atualizando carteira…": "Updating portfolio…", "Aguardando atualização…": "Waiting for an update…", "⚠️ Pontos de atenção": "⚠️ Needs attention", "Aguardando dados técnicos suficientes…": "Waiting for sufficient technical data…", "Nova análise": "New analysis", "Aguardando confirmação": "Awaiting confirmation"});
  Object.assign(STRINGS.es, {"Área protegida": "Zona protegida", "Desbloquear Radar": "Desbloquear Radar", "Entrar": "Iniciar sesión", "Usar PIN": "Usar el PIN", "PIN de 4 a 6 números": "PIN de 4 a 6 dígitos", "Principal": "Inicio", "Configurações": "Configuración", "Iniciando…": "Iniciando…", "Segundo plano: iniciando…": "Segundo plano: iniciando…", "Compras confirmadas": "Compras confirmadas", "Idioma": "Idioma", "Auto": "Automático", "Buscando…": "Buscando…", "Confirmadas": "Confirmadas", "Segundo plano local: preparando…": "Segundo plano local: preparando…", "◈ Simular aporte": "◈ Simular aportación", "↓ Exportar CSV": "↓ Exportar CSV", "📈 VER MERCADO": "📈 VER MERCADO", "Aporte": "Aportación", "Aporte Perfil": "Perfil de aportación", "Perfil de aporte": "Perfil de aportación", "Simular aporte": "Simular aportación", "Simulação inteligente de aporte": "Simulación inteligente de aportaciones", "Reserva 100%": "100 % en reserva", "Perfil": "Perfil", "Radar Social": "Radar social", "Registro local": "Historial local", "REGISTRO LOCAL": "HISTORIAL LOCAL", "Entrar no radar": "Entrar al Radar", "Mercado geral": "Mercado general", "Candidatas": "Candidatas", "Alertas de mercado": "Alertas del mercado", "Atualização em tempo real": "Actualización en tiempo real", "Motor": "Motor", "Última leitura": "Última lectura", "Iniciando": "Iniciando", "Sem dados suficientes": "Datos insuficientes", "Análise pendente": "Análisis pendiente", "Símbolo": "Símbolo", "Objetivo": "Objetivo", "Ativo": "Activo", "Ativos": "Activos", "Preço": "Precio", "Variação": "Variación", "Prioridade": "Prioridad", "Visão do mercado": "Panorama del mercado", "Alerta ativado": "Alerta activada", "Mercado indisponível": "Mercado no disponible", "Atualizando carteira…": "Actualizando cartera…", "Aguardando atualização…": "Esperando actualización…", "⚠️ Pontos de atenção": "⚠️ Puntos de atención", "Aguardando dados técnicos suficientes…": "Esperando suficientes datos técnicos…", "Nova análise": "Nuevo análisis", "Aguardando confirmação": "Esperando confirmación", "Notificações locais": "Notificaciones locales", "Detalhes": "Detalles", "Vender": "Vender", "Comprar": "Comprar", "Atualizar": "Actualizar", "Local": "Local", "Reserva estável": "Reserva de monedas estables", "Oportunidades": "Oportunidades", "Confirmados": "Confirmados", "Monitoramento ativo": "Monitoreo activo", "Frase misturada": "Frase mezclada", "Tendência": "Tendencia", "Liquidez": "Liquidez", "Importante": "Importante", "Período": "Periodo"});
  Object.assign(STRINGS.en,{'🔒 Teste agendado. Feche o app e bloqueie o celular; ele será enviado na próxima execução do agendador externo (se estiver ativo).':'🔒 Test scheduled. Close the app and lock your phone; the message will be sent on the next external scheduler run (if active).'});
  Object.assign(STRINGS.es,{'🔒 Teste agendado. Feche o app e bloqueie o celular; ele será enviado na próxima execução do agendador externo (se estiver ativo).':'🔒 Prueba programada. Cierra la app y bloquea el móvil; el mensaje se enviará en la próxima ejecución del programador externo (si está activo).'});
  // V19.5.5: complete health/status messages; do not translate isolated words
  // from a composed diagnostics sentence. Dynamic count fields use templates.
  Object.assign(STRINGS.en,{
    'Servidor Push indisponível. Verifique a conexão e o armazenamento do servidor.':'Push server unavailable. Check your connection and server storage.',
    'Servidor Push disponível.':'Push server available.',
    'Agendador executou, mas a última varredura do mercado falhou.':'Scheduler ran, but the last market scan failed.',
    'Inscrição Push deste aparelho detectada.':'Push subscription detected on this device.',
    'Inscrição Push não detectada neste aparelho; toque em ATIVAR PUSH 24H.':'No Push subscription detected on this device. Tap ENABLE 24H PUSH.',
    'Nenhuma execução do agendador registrada; confira o agendamento externo.':'No scheduled scan recorded. Check the external scheduler.',
    'Agendador sem execução recente detectada.':'No recent scheduled scan detected.',
    'A entrega com o aplicativo fechado precisa ser comprovada por um teste recebido.':'Delivery with the app closed must be confirmed by receiving a scheduled test.',
    'Push: agendador recente':'Push: recent scan',
    'Push: verificar agendador':'Push: check scheduler',
    'Agendador externo:':'External scheduler:',
    'requer programação externa para alertas com o app fechado.':'requires external scheduling for alerts while the app is closed.',
    'Última execução do agendador:':'Last scheduled scan:'
  });
  Object.assign(STRINGS.es,{
    'Servidor Push indisponível. Verifique a conexão e o armazenamento do servidor.':'Servidor Push no disponible. Comprueba la conexión y el almacenamiento del servidor.',
    'Servidor Push disponível.':'Servidor Push disponible.',
    'Agendador executou, mas a última varredura do mercado falhou.':'El programador se ejecutó, pero falló el último análisis del mercado.',
    'Inscrição Push deste aparelho detectada.':'Suscripción Push detectada en este dispositivo.',
    'Inscrição Push não detectada neste aparelho; toque em ATIVAR PUSH 24H.':'No se detectó una suscripción Push en este dispositivo. Toca ACTIVAR PUSH 24 H.',
    'Nenhuma execução do agendador registrada; confira o agendamento externo.':'No hay ejecuciones programadas registradas. Comprueba la programación externa.',
    'Agendador sem execução recente detectada.':'No se detectó una ejecución programada reciente.',
    'A entrega com o aplicativo fechado precisa ser comprovada por um teste recebido.':'La entrega con la app cerrada debe confirmarse recibiendo una prueba programada.',
    'Push: agendador recente':'Push: ejecución reciente',
    'Push: verificar agendador':'Push: revisar programación',
    'Agendador externo:':'Programador externo:',
    'requer programação externa para alertas com o app fechado.':'requiere programación externa para recibir alertas con la app cerrada.',
    'Última execução do agendador:':'Última ejecución programada:'
  });
  const V1955_DIAGNOSTIC_TEMPLATES={
    en:[[/^Última execução do agendador: (\d+) min atrás\.$/, 'Last scheduled scan: $1 min ago.']],
    es:[[/^Última execução do agendador: (\d+) min atrás\.$/, 'Última ejecución programada: hace $1 min.']]
  };
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
  function nativeLocalized(node){const el=node?.nodeType===3?node.parentElement:node;return !!el?.closest?.('[data-cr-i18n-native]')}
  function translateText(node,lang){
    if(nativeLocalized(node))return;
    const r=textRecord(node),base=r.base||'',trim=base.trim(); if(!trim)return;
    const out=tr(trim,lang),left=base.match(/^\s*/)?.[0]||'',right=base.match(/\s*$/)?.[0]||'';
    const val=left+out+right; if(node.nodeValue!==val){internalWrite=true;node.nodeValue=val;internalWrite=false}r.lastApplied=val;
  }
  function translateAttrs(el,lang){
    if(nativeLocalized(el))return;
    for(const a of ['placeholder','aria-label','title','alt','data-label'])if(el.hasAttribute?.(a)){
      const r=attrRecord(el,a);if(r.base==null)continue;const val=tr(r.base,lang);if(el.getAttribute(a)!==val){internalWrite=true;el.setAttribute(a,val);internalWrite=false}r.lastApplied=val;
    }
  }
  function translateTree(root,lang){
    if(!root||nativeLocalized(root))return;
    if(root.nodeType===Node.TEXT_NODE){translateText(root,lang);return}
    if(root.nodeType!==Node.ELEMENT_NODE)return;
    translateAttrs(root,lang);
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||nativeLocalized(p)||['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','CODE','PRE'].includes(p.tagName))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
    let n;while(n=w.nextNode())translateText(n,lang);
    root.querySelectorAll?.('[placeholder],[aria-label],[title],[alt],[data-label]').forEach(el=>translateAttrs(el,lang));
  }
  function localizeNode(root){
    if(!root)return;
    // These cards are rendered from PT-BR templates; they are not native-language
    // server responses. Keep them observable so subsequent DOM updates and toggles
    // are translated, including when a fragment is updated without a full rerender.
    root.removeAttribute?.('data-cr-i18n-native');
    translateTree(root,resolve(selectedChoice()));
  }
  function selectedChoice(){return localStorage.getItem(STORAGE_KEY)||'auto'}
  function syncSelectors(choice){
    bindSelectors(); document.querySelectorAll('[data-cr-language-select]').forEach(s=>{if(s.value!==choice)s.value=choice});
    const badge=document.getElementById('appLanguageBadge');if(badge){const l=resolve(choice);badge.textContent=l==='pt-BR'?'PT':l.toUpperCase()}
  }
  function apply(choice,save=true){
    choice=choice||'auto';const lang=resolve(choice);if(save)localStorage.setItem(STORAGE_KEY,choice);
    document.documentElement.lang=lang;document.documentElement.dataset.crLanguage=lang;
    document.title='Cripto Radar • Radar PRO';
    document.querySelectorAll('[data-cr-i18n-native]').forEach(el=>{if(el.getAttribute('data-cr-i18n-native')!==lang)el.removeAttribute('data-cr-i18n-native')});
    translateTree(document.body,lang);syncSelectors(choice);
    window.dispatchEvent(new CustomEvent('criptoradar:languagechange',{detail:{choice,language:lang}}));return lang;
  }
  function t(key){return tr(String(key??''),resolve(selectedChoice()))}
  function fmtNumber(n,options){return new Intl.NumberFormat(resolve(selectedChoice()),options||{}).format(Number(n)||0)}
  function fmtCurrency(n,currency='BRL'){return new Intl.NumberFormat(resolve(selectedChoice()),{style:'currency',currency,maximumFractionDigits:2}).format(Number(n)||0)}
  function bindSelectors(){document.querySelectorAll('[data-cr-language-select]').forEach(sel=>{if(sel.dataset.bound)return;sel.dataset.bound='1';sel.addEventListener('change',()=>apply(sel.value,true))});}
  const mo=new MutationObserver(list=>{
    if(internalWrite)return;const lang=resolve(selectedChoice());
    for(const m of list){
      if(m.type==='characterData')translateText(m.target,lang);
      else if(m.type==='childList')m.addedNodes.forEach(n=>{if(n.nodeType===1||n.nodeType===3)translateTree(n,lang)});
      else if(m.type==='attributes')translateAttrs(m.target,lang);
    }
  });
  function init(){bindSelectors();apply(selectedChoice(),false);mo.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title','alt','data-label']})}
  window.CriptoRadarI18n={localizeNode,fmtNumber,fmtCurrency,setLanguage:v=>apply(v,true),getLanguage:()=>resolve(selectedChoice()),getChoice:selectedChoice,t,translate:t,supported:['pt-BR','en','es'],refresh:()=>apply(selectedChoice(),false)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
