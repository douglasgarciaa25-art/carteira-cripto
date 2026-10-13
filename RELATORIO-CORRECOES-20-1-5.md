# Cripto Radar 20.1.5 — correções da análise aprofundada

13/10/2026. Base: d3091a418d136410bc0147486f3041c6adb153ac.

## Correções

1. O motor antigo V7, com capital padrão de US$10.000 e piso de US$100, foi substituído por uma visão da mesma conta do Trader local. O painel antigo não tem mais execução automática independente. Saldo, posições, diário e parada local são compartilhados.
2. O botão de teste antigo agora abre o formulário do Trader local. A confirmação e as proteções existentes continuam obrigatórias.
3. A conta local usa o UUID autenticado. O histórico do Trader 20 anterior só migra se sua referência Binance já estiver vinculada ao mesmo usuário. Trocar de conta não carrega os dados do usuário anterior.
4. Removida a execução baseada em rótulos de texto do motor antigo, que aceitava “COMPRA NÃO CONFIRMADA”. O Trader usa os indicadores de prontidão, atualização e confirmação do motor atual. Diagnóstico e captura de sinais também exigem essas condições.
5. Removido o capital fictício de R$100 no espelhamento. A projeção usa somente USDT livre de uma referência Binance válida da conta atual, convertido para BRL. Saldo zero continua zero; saldo indisponível aguarda sincronização.
6. Alertas de espelhamento em segundo plano não calculam alocação com o patrimônio total antigo ou com capital inventado. Orientam abrir o aplicativo para uma simulação baseada no saldo atualizado. Textos novos incluem traduções EN/ES.
7. Falha na consulta do saldo invalida imediatamente a fotografia usada pelo simulador local. Uma referência ainda recente não continua autorizando simulações depois que a consulta falha.
8. O aplicativo tenta recuperar a leitura de perfil/conexão após uma falha temporária na abertura, ao retornar à tela ou recuperar internet, respeitando a preferência de sincronização.
9. Retiradas maiores que a reserva virtual criam um ajuste pendente explícito. O caixa fica no mínimo em zero; o ajuste é deduzido do patrimônio e compensado pelas próximas entradas de saldo ou vendas fictícias. Isso preserva posições, histórico, custos e resultado, sem criar lucro artificial.
10. Vendas fictícias que reduzem um ajuste pendente podem liquidar posições mesmo quando o limite percentual de compra ou intervalo bloquearia a saída. Saldo de ativo, cotação válida, precisão e parada de emergência continuam obrigatórios.
11. Reiniciar o simulador local aceita saldo Binance zero. O automático permanece desligado e a parada de emergência é preservada.
12. Corrigido o tratamento de risco técnico igual a zero, que antes era convertido em risco 100 por uso de valor padrão.

## Verificação

- 64 testes automatizados aprovados: os 50 anteriores e 14 novas regressões.
- Novos testes cobrem retirada, depósito, venda e migração de saldo negativo nos dois motores; invalidação após falha; retomada da conexão; remoção do motor antigo; visão única; isolamento por UUID; migração vinculada; espelhamento sem capital artificial.
- 57 verificações de sintaxe de scripts externos e embutidos sem falhas; verificações adicionais dos arquivos ajustados também aprovadas.
- Novo recurso radar-paper-view.js incluído no build estático e confirmado acessível no domínio público.
- Vercel: publicação de produção 20.1.5.
- Supabase: worker versão 10 ACTIVE, mantendo autenticação própria existente por usuário/agendador.
- Execução pós-publicação retornou HTTP 200: 1 conta verificada, 5 mercados, nenhuma pausa por erro e nenhuma nova ordem fictícia.
- Conta do servidor confirmada na versão 20.1.5, sem erro de sincronização e sem ajuste pendente, às 13h00 de Brasília.
- index.html, binance-wallet.js, radar-trader-core.js, radar-paper-view.js e sw.js conferidos contra os bytes publicados na primeira publicação desta versão. A publicação final acrescenta traduções de notificações.

## Preservação e limites

- O histórico global do V7 antigo continua no armazenamento do aparelho, mas não é misturado automaticamente com contas identificadas: ele não registra de forma confiável quem é seu dono. Ele deixa de alimentar os painéis e os motores ativos. O histórico já vinculado do Trader 20 é migrado para o mesmo usuário.
- A conta fictícia LOCAL e a conta fictícia do SERVIDOR continuam independentes, como informado nos painéis. Ambas usam a referência Binance da conta autenticada. Unificamos os painéis locais antigos, não somamos duas carteiras fictícias distintas.
- O patrimônio virtual líquido pode ficar negativo após retirada total e perdas/taxas fictícias. Isso é mostrado como ajuste pendente, sem caixa negativo e sem apagar prejuízo. Um reinício autorizado pelo usuário zera somente a simulação.
- A simulação local depende do app aberto; o worker de nuvem mantém o agendamento de 5 minutos. Isso não é atualização contínua por WebSocket nem garantia de execução ininterrupta.
- Testes autenticados no navegador do aparelho, notificações com tela bloqueada, biometria e cobrança Play não foram executados nesta rodada. Os testes de código usam dados fictícios; a verificação de produção usou o agendador já autorizado.
- Permanecem as observações anteriores: aviso de runtime DEP0169; proteção de senhas vazadas desativada no diagnóstico anterior; limite atual de 8 contas por execução do worker. Não houve alteração de plano, credenciais ou permissões.
- Não há garantia de ausência de todos os defeitos possíveis. Esta versão resolve os problemas descritos com a cobertura acima.

## Aplicação ao GitHub

O site e o worker foram atualizados diretamente. A integração GitHub não permite escrita no repositório (403 observado anteriormente).

Extraia o ZIP e envie todos os arquivos à raiz de carteira-cripto, substituindo os correspondentes e mantendo os demais. Inclua radar-paper-view.js e vercel.json, pois o recurso novo depende dessa configuração. Nenhuma subpasta é necessária.

O ZIP é uma atualização, não uma cópia completa do repositório. Execute `npm test` no projeto completo para repetir a suíte.
