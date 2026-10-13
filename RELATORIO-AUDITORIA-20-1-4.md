# Auditoria Cripto Radar — 20.1.4

Data: 13/10/2026. Base revisada: commit 3f9e125 do repositório carteira-cripto.
Resultado: correções publicadas e verificadas. Não é uma certificação de ausência de todos os erros possíveis.

## Falhas corrigidas

| Área | Falha e impacto | Correção e evidência |
|---|---|---|
| Sessão | Renovação em andamento podia restaurar a sessão após sair. | Respostas vinculadas à geração da sessão e ao token de renovação vigente; regressão de logout concorrente aprovada. |
| Isolamento entre contas | Respostas atrasadas de perfil/saldo podiam voltar após sair ou trocar de conta. | Descarte de respostas de sessões antigas; limpeza antes de notificar os painéis; testes de perfil e saldo atrasados aprovados. |
| Login | Consulta automática logo após entrar era ignorada pelo indicador de operação em andamento. | Liberação desse indicador antes de consultar; teste confirma leitura imediata. |
| Autenticação no servidor | HTTP 429/5xx do serviço de autenticação virava 401, causando logout indevido. | Retorno de indisponibilidade temporária, preservando a distinção de sessão inválida. Teste com 503 aprovado. |
| Painel na nuvem | Atualizações concorrentes e respostas atrasadas podiam sobrescrever uma ação mais recente. Uma troca de conta durante obtenção do token podia enviar a ação à nova conta. | Uma atualização por vez, invalidação de respostas antigas e verificação da conta antes do envio. Três regressões aprovadas. |
| Venda fictícia | Uma quantidade muito pequena podia arredondar a zero e ainda criar uma ordem. | Bloqueio por precisão antes da execução, tanto local quanto na nuvem; saldo e histórico preservados. |
| Limite diário na nuvem | Ordem manual não renovava a base diária; uma perda do dia anterior podia bloquear o dia seguinte. | Renovação UTC antes da execução manual, também usada pelas ordens automáticas. Teste de virada do dia aprovado. |
| Saldos pequenos | Cenário de alocação Binance + IA exigia pelo menos R$5, contrário ao comportamento solicitado. | Removido o piso monetário artificial; concentração e disponibilidade continuam limitando os valores. Teste com patrimônio de R$0,50 aprovado. |
| Notificações | Cadastro aceitava qualquer destino HTTPS, que poderia levar a requisições a destinos internos ou arbitrários. | Validação do domínio no cadastro e novamente no envio, aceitando provedores de navegadores suportados. Bloqueados IPs internos, credenciais na URL, portas alternativas e domínios que imitam provedores. Testes somente com mocks, sem envio de notificações. |
| Traduções | Textos EN/ES ainda afirmavam que o saldo durava somente a sessão. | Textos alinhados à conexão persistente e atualização automática. |
| Testes legados | A suíte antiga exigia literalmente a versão 19.6.0 e falhava em versões posteriores. | Asserções agora verificam formato da versão, recursos e fronteira do cache; fixtures de push usam um domínio de provedor válido. |

## Verificações realizadas

- 50 testes automatizados aprovados: 21 de saldos/ordens/autorização, 5 de sessão, 14 novos testes desta auditoria e 10 testes legados.
- 56 verificações de sintaxe JavaScript, incluindo scripts embutidos no index.html; nenhuma falha.
- Referências locais de scripts/estilos do index.html sem arquivos faltando; recursos do manifesto, cache e builds conferidos pela suíte.
- Endpoints públicos de autenticação, mercado, configuração de notificações e configuração Play responderam HTTP 200.
- Acesso anônimo ao saldo Binance respondeu HTTP 401; helpers privados e fonte do worker responderam HTTP 404 pela URL pública.
- Agendamentos do robô e das notificações ativos a cada 5 minutos. Estado do agendador push observado como OK.
- Versão publicada na Vercel: READY, dpl_DU6esRY9BAaNeHdQzHYa1RJub8iQ, ambiente production; domínio carteira-cripto-pi.vercel.app.
- Worker publicado no Supabase: versão 9 ACTIVE. Mantém autenticação própria por usuário ou segredo do agendador; nenhuma permissão de ordem real foi adicionada.
- Após a publicação, verificação do worker retornou HTTP 200: 1 conta verificada, 0 ordens novas, 0 contas pausadas e 5 mercados disponíveis.
- Registro da carteira confirmado como versão 20.1.4, sincronização em 13/10/2026 13:32:48 UTC, sem erro.
- Bytes de index.html, binance-wallet.js, radar-trader-core.js e radar-trader-cloud.js em produção iguais aos arquivos entregues.
- Navegador carregou sem erros atribuídos ao aplicativo no console observado. Erros de metadados de uma extensão do navegador foram separados dos erros do app.

## Pendências e limites da auditoria

1. **Aviso do runtime:** logs ainda exibem DEP0169 sobre url.parse(), inclusive em endpoints que usam apenas código simples. O código revisado não contém esse uso; a origem exata em dependência ou infraestrutura não foi determinada. Não foi ocultado. Não houve falha funcional associada nos endpoints consultados.
2. **Proteção de senhas vazadas:** o diagnóstico de segurança do Supabase informou que está desativada. Continua pendente de avaliação da configuração/plano; não houve alteração de plano ou contratação de serviço.
3. **Interface autenticada:** o navegador disponível abriu em “Crie seu acesso”, sem a sessão local do aparelho do usuário. Não foram criadas credenciais nem contornada essa proteção. Os fluxos autenticados foram verificados por testes de código com mocks e pela execução autorizada do worker existente, não por um ciclo completo de login no navegador.
4. **Dispositivo real:** recebimento de push com tela bloqueada, biometria, instalação Android e cobrança Google Play exigem verificação no dispositivo/ambiente correspondente. A disponibilidade dos endpoints não comprova esses fluxos finais.
5. **Escala:** o worker atual processa até 8 contas por execução, em ordem de última verificação. O comportamento sob muitas contas simultâneas não foi testado; com mais de 8 contas, não há garantia de atualização de todas a cada 5 minutos.
6. **Contabilidade virtual:** sincronização aplica a variação do USDT real à reserva virtual preservando posições fictícias. Uma retirada real superior à reserva virtual pode deixá-la negativa. Não foi alterada essa regra nesta auditoria; novas compras continuam sujeitas ao caixa e aos limites.
7. **Cobertura:** foi revisado o fluxo principal de saldo, sessões, simuladores e serviços, além da sintaxe do projeto e testes legados. Não houve teste exaustivo de todas as combinações de indicadores, idiomas, dispositivos, falhas de rede e funcionalidades históricas no grande index.html.
8. **GitHub:** a publicação foi feita diretamente. A integração disponível não permite gravar neste repositório (403 observado anteriormente). Para manter o GitHub alinhado e evitar que um deploy futuro restaure arquivos antigos, envie os arquivos deste pacote à raiz do repositório, substituindo os correspondentes e preservando os demais.

## Reproduzir os testes

Após aplicar os arquivos na raiz do projeto completo, execute `npm test`.
Todos os testes automatizados rodam com dados fictícios/mocks, sem chaves Binance e sem enviar ordens reais ou notificações.

## Referências para validação dos provedores push

- Apple: https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers
- Mozilla: https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/
- Microsoft: https://learn.microsoft.com/en-us/windows/apps/develop/notifications/push-notifications/wns-overview
- Google: https://web.dev/articles/push-notifications-web-push-protocol
