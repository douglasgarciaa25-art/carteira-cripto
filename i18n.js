/* Cripto Radar V16 • Internationalization (pt-BR / en / es) */
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

  const FALLBACK={
    en:[['Aguardando','Waiting'],['Carregando','Loading'],['Buscando','Searching'],['Iniciando','Starting'],['Atualizando','Updating'],['Atualizado','Updated'],['Falha ao','Failed to'],['Falha no','Failure in'],['Nenhum sinal confirmado agora.','No confirmed signal right now.'],['Capital detectado para simulação.','Capital detected for simulation.'],['Entrada','Entry'],['Alvo','Target'],['Risco no stop','Stop risk'],['Projeção no alvo','Target projection'],['Exposição','Exposure'],['Valor proporcional','Proportional amount'],['Risco efetivo','Effective risk'],['Risco : retorno','Risk : reward'],['possível continuação da alta','possible bullish continuation'],['possível continuação da baixa','possible bearish continuation'],['sinal técnico','technical signal'],['mercado indisponível','market unavailable']],
    es:[['Aguardando','Esperando'],['Carregando','Cargando'],['Buscando','Buscando'],['Iniciando','Iniciando'],['Atualizando','Actualizando'],['Atualizado','Actualizado'],['Falha ao','Error al'],['Falha no','Error en'],['Nenhum sinal confirmado agora.','No hay señal confirmada ahora.'],['Capital detectado para simulação.','Capital detectado para simulación.'],['Entrada','Entrada'],['Alvo','Objetivo'],['Risco no stop','Riesgo en stop'],['Projeção no alvo','Proyección al objetivo'],['Exposição','Exposición'],['Valor proporcional','Valor proporcional'],['Risco efetivo','Riesgo efectivo'],['Risco : retorno','Riesgo : retorno'],['possível continuação da alta','posible continuación alcista'],['possível continuação da baixa','posible continuación bajista'],['sinal técnico','señal técnica'],['mercado indisponível','mercado no disponible']]
  };

  function resolve(choice){
    if(choice&&choice!=='auto')return ['en','es','pt-BR'].includes(choice)?choice:'pt-BR';
    const n=(navigator.language||'pt-BR').toLowerCase();
    if(n.startsWith('en'))return'en'; if(n.startsWith('es'))return'es'; return'pt-BR';
  }
  function tr(original,lang){
    if(lang==='pt-BR')return original;
    const exact=STRINGS[lang]?.[original]; if(exact!==undefined)return exact;
    let out=original; for(const [a,b] of FALLBACK[lang]||[]){if(out.includes(a))out=out.split(a).join(b);} return out;
  }
  function rememberText(node){if(!textOriginal.has(node))textOriginal.set(node,node.nodeValue||'');}
  function rememberAttrs(el){
    if(attrOriginal.has(el))return; const o={};
    for(const a of ['placeholder','aria-label','title'])if(el.hasAttribute?.(a))o[a]=el.getAttribute(a);
    attrOriginal.set(el,o);
  }
  function translateTextNode(node,lang){
    rememberText(node); const base=textOriginal.get(node)||''; const trimmed=base.trim(); if(!trimmed)return;
    const translated=tr(trimmed,lang); if(translated===trimmed&&lang!=='pt-BR')return;
    const left=base.match(/^\s*/)?.[0]||'',right=base.match(/\s*$/)?.[0]||''; node.nodeValue=left+translated+right;
  }
  function translateElementAttrs(el,lang){
    rememberAttrs(el); const o=attrOriginal.get(el)||{}; for(const [a,v] of Object.entries(o))el.setAttribute(a,tr(v,lang));
  }
  function translateTree(root,lang){
    if(!root)return; applying=true;
    try{
      if(root.nodeType===Node.TEXT_NODE){translateTextNode(root,lang);return;}
      if(root.nodeType===Node.ELEMENT_NODE)translateElementAttrs(root,lang);
      const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','CODE','PRE'].includes(p.tagName))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
      let n; while(n=w.nextNode())translateTextNode(n,lang);
      root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(el=>translateElementAttrs(el,lang));
    }finally{applying=false;}
  }
  function selectedChoice(){return localStorage.getItem(STORAGE_KEY)||'auto';}
  function syncSelectors(choice){
    document.querySelectorAll('[data-cr-language-select]').forEach(s=>{if(s.value!==choice)s.value=choice;});
    const badge=document.getElementById('appLanguageBadge'); if(badge){const l=resolve(choice);badge.textContent=l==='pt-BR'?'PT':l.toUpperCase();}
  }
  function apply(choice,save=true){
    choice=choice||'auto'; const lang=resolve(choice); if(save)localStorage.setItem(STORAGE_KEY,choice);
    document.documentElement.lang=lang; document.documentElement.dataset.crLanguage=lang;
    translateTree(document.body,lang); syncSelectors(choice);
    window.dispatchEvent(new CustomEvent('criptoradar:languagechange',{detail:{choice,language:lang}}));
    return lang;
  }
  function t(key){return tr(key,resolve(selectedChoice()));}
  function createSelectors(){
    document.querySelectorAll('[data-cr-language-select]').forEach(sel=>{
      if(sel.dataset.bound)return; sel.dataset.bound='1'; sel.addEventListener('change',()=>apply(sel.value,true));
    }); syncSelectors(selectedChoice());
  }
  const mo=new MutationObserver(list=>{
    if(applying)return; const lang=resolve(selectedChoice());
    for(const m of list){
      if(m.type==='characterData'){
        textOriginal.set(m.target,m.target.nodeValue||''); translateTree(m.target,lang);
      } else if(m.type==='childList'){
        m.addedNodes.forEach(n=>translateTree(n,lang));
      } else if(m.type==='attributes'){
        const el=m.target,prev=attrOriginal.get(el)||{};prev[m.attributeName]=el.getAttribute(m.attributeName)||'';attrOriginal.set(el,prev);translateElementAttrs(el,lang);
      }
    }
  });
  function init(){
    createSelectors(); apply(selectedChoice(),false);
    mo.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
    document.addEventListener('change',e=>{if(e.target?.matches?.('[data-cr-language-select]'))apply(e.target.value,true);});
  }
  window.CriptoRadarI18n={setLanguage:(v)=>apply(v,true),getLanguage:()=>resolve(selectedChoice()),getChoice:selectedChoice,t,supported:['pt-BR','en','es']};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
