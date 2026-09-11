# Verificação da versão demonstrativa

## Verificado nesta entrega

- Sintaxe dos 19 arquivos JavaScript/MJS.
- Referências locais de HTML e ausência de IDs duplicados nas duas páginas.
- Estrutura de chaves dos três arquivos CSS.
- Ausência de SDK, configurações e credenciais Firebase no código executável.
- Ausência de chamadas `fetch` a APIs: as ações executam localmente.
- Fontes, marca e Chart.js disponíveis no próprio projeto.

## Teste de operações locais

Executado com Node.js e armazenamento isolado de teste:

- Criação de lead e gravação de sua atividade.
- Alteração de status junto com agendamento de follow-up.
- Reagendamento e remoção de follow-up.
- Observações e tags geram auditoria sem criar atividade comercial irrelevante.
- Arquivamento sem duplicação ao repetir a mesma ação e restauração.
- Fechamento cria contrato e atualiza o contato.
- Pagamento mensal avança de 31 de janeiro para 28 de fevereiro, preservando recorrência no dia 31.
- Repetição do pagamento da mesma competência não duplica o recebimento.
- Edição do valor financeiro.
- Cinco exportações CSV com codificação UTF-8/BOM.
- Reinício remove alterações da demonstração e restaura os exemplos.

O teste está incluído em `tests/demo.test.mjs` e pode ser executado por `npm test`.

## Integração da interface

Executada em DOM simulado (JSDOM), usando os arquivos HTML/JS da entrega e as operações locais reais:

- Abertura sem login e renderização de 24 leads no indicador.
- Navegação entre Dashboard, Contatos, Financeiro e Auditoria.
- Criação pelo botão/formulário e inclusão automática na lista.
- Abertura do contato, edição de observação, status e follow-up.
- Abertura do modal de fechamento e criação do contrato.
- Registro de pagamento pelo botão da interface.
- Disparo das cinco exportações pelos botões.
- Registro das ações visível na auditoria.
- Nenhum erro de aplicação nesse fluxo.

O teste de integração usa um substituto da API gráfica do Chart.js, pois o ambiente de DOM simulado não renderiza canvas. Isso verifica o fluxo da interface, mas não substitui a inspeção visual dos gráficos.

## Limites e conferência após o deploy

Não foi possível executar a revisão visual em um navegador real neste ambiente. Os estilos responsivos existentes do CRM foram preservados; a introdução e a moldura da demonstração têm adaptações para telas menores, mas ainda devem ser conferidas em desktop e celular após publicar.

Confira especialmente:

1. Entrada pela apresentação e botão para o CRM.
2. Aparência dos gráficos, textos, filtros e modais.
3. Campos de data no Safari/iPhone.
4. Persistência após recarregar e botão “Reiniciar demonstração”.
5. Downloads CSV no navegador usado pelo visitante.

O projeto não foi publicado na conta Vercel do usuário. A entrega é o projeto estático preparado para essa publicação.
