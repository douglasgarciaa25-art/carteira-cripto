# Revisão geral — Cripto Radar 20.1.8

Data: 13/10/2026. Base do GitHub: b15b1a8b236ee416f8e073d609b61c538580fd0f.

Revisão técnica do projeto publicado, cobrindo os principais fluxos, arquivos ativos e serviços. Não é uma certificação de ausência de todos os erros nem substitui testes de uso real em Android.

## Correções realizadas

| Área | Problema confirmado no código | Correção |
|---|---|---|
| Login e Binance | Requisições sem prazo de conclusão podiam manter o estado ocupado indefinidamente. | Prazo para resposta e corpo JSON, cancelamento do transporte, liberação de controles e preservação da sessão em falha temporária. |
| Simulador na nuvem | Uma chamada travada impedia nova consulta/ação e não esclarecia se a ação fora processada. | Limite de espera; mensagem orienta consultar o resultado antes de repetir uma ação. Nenhuma repetição automática de ordem. |
| Integridade dos saldos | Resposta sem lista de saldos podia virar lista vazia; campos inválidos eram omitidos no servidor. | Rejeição explícita de resposta incompleta, valores inválidos e horário antigo. Saldo indisponível bloqueia a referência; saldo zero válido continua permitido. |
| Interface | Cabeçalho ainda informava V19.6.8. | Versão visível e identificação acessível atualizadas para 20.1.8. |

## Evidências

- 90 testes aprovados: 21 de sincronização, 5 de sessão, 14 da auditoria anterior, 10 legados, 14 de integração unificada, 17 de vistoria e 9 novos desta revisão.
- Os novos testes reproduzem rede sem resposta, corpo JSON travado, renovação interrompida, desbloqueio do botão, resposta incompleta, saldo inválido, saldo zero e ausência de repetição de ação na nuvem.
- 54 verificações de sintaxe: arquivos JavaScript e scripts embutidos no index principal; nenhuma falha.
- Nenhum arquivo ausente nas referências locais do HTML principal ou nas entradas de build. Mantidas 12 funções Node na configuração Vercel.
- Navegador abriu a primeira configuração de acesso local. Nenhum erro do app apareceu no console observado; dois erros eram da extensão do navegador.
- Vistoria no servidor, execução do robô e agendamento de notificações ativos a cada 5 minutos.
- /api/push-status: ready=true, lastScanStatus=ok e lastFailedCount=0 na consulta desta revisão.
- Configuração de autenticação, preço BTC, configuração de push, manifesto, termos e privacidade responderam HTTP 200.
- /api/binance-wallet sem login respondeu HTTP 401, como esperado.
- Fontes privadas radar-binance-service.js, radar-paper-worker.ts e radar-health-worker.ts responderam HTTP 404 pelas URLs públicas.
- Revisadas as fronteiras de autenticação, criptografia das credenciais, sincronização do saldo, persistência, simulação, consulta da vistoria, cache e rotas compartilhadas da Vercel. Nenhuma ordem real, reinicialização de histórico ou notificação de teste foi enviada nesta revisão.

## Pendências relevantes

1. **Google Play:** /api/play-config retornou backendReady=false. A verificação de compras não está pronta no servidor; publicar o site não torna a assinatura paga operacional. Configuração da conta de serviço e teste real de compra continuam necessários.
2. **Interface autenticada:** o navegador disponível não possui o acesso local do aparelho do usuário. Não foram criadas credenciais nem contornada a proteção. O fluxo autenticado completo, navegação interna, biometria e interação em Android continuam pendentes de teste no dispositivo.
3. **Push em aparelho:** agendador e endpoints saudáveis não comprovam recebimento com tela bloqueada, bateria restrita ou permissão negada.
4. **Senhas vazadas:** o diagnóstico Supabase mantém o aviso de proteção contra senhas comprometidas desativada. Nenhuma configuração de plano ou contratação foi alterada. Referência: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
5. **Aviso do runtime:** DEP0169 sobre url.parse continua nos logs. Não foi encontrado uso direto nos arquivos .js revisados; a origem em dependência ou infraestrutura ainda precisa de rastreamento. Nenhuma falha funcional associada foi confirmada. A consulta agregada de erros falhou nesta rodada; a consulta alternativa de logs recentes funcionou.
6. **Escala e disponibilidade:** robô e vistoria processam até 8 contas por ciclo. Mais contas exigem dimensionamento; não foi feito teste de carga. Serviços externos indisponíveis podem atrasar o intervalo.
7. **Cobertura:** não foram testadas exaustivamente todas as combinações de indicadores, idiomas, versões Android ou estratégias históricas; probabilidades e resultados simulados não foram validados como desempenho futuro.

## Aplicar ao repositório

O ZIP contém somente as alterações desta revisão e este relatório. Suba todos os arquivos à raiz, substituindo os correspondentes e preservando os demais. Nenhuma pasta interna ou segredo foi incluído. Execute `npm test` na raiz do projeto completo.

O worker e o agendamento da vistoria 24h foram preservados; esta atualização altera o site e os handlers da Vercel.
