# ROASCE CRM — Demonstração para portfólio

Projeto independente, preparado a partir do CRM ROASCE. A página inicial apresenta o projeto e explica como explorar suas funções. O botão “Explorar demonstração” abre o CRM em `/admin/`.

## Publicar em um NOVO projeto na Vercel

1. Extraia o ZIP.
2. Crie um repositório separado, por exemplo `roasce-crm-demo`.
3. Coloque o CONTEÚDO da pasta `roasce-crm-demo` na raiz desse repositório. `index.html`, `vercel.json` e `package.json` devem ficar nessa raiz.
4. Importe esse novo repositório como um NOVO projeto na Vercel.
5. Use estas configurações:

| Campo | Valor |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Raiz do repositório |
| Build Command | Vazio — sem build |
| Output Directory | `.` |
| Variáveis de ambiente | Nenhuma |

O arquivo `vercel.json` já define o projeto estático e o diretório de saída. Não copie as variáveis de ambiente do CRM real. A demonstração não precisa de Firebase, banco de dados nem funções serverless.

Se você subir a pasta inteira dentro de um repositório, selecione essa pasta como Root Directory. O arquivo `index.html` da apresentação precisa estar na raiz selecionada.

Depois do deploy, use o endereço raiz da demonstração no LinkedIn. Assim a pessoa encontra primeiro a apresentação, e depois entra no CRM pelo botão.

Referência oficial das opções de publicação: [Configuração de build da Vercel](https://vercel.com/docs/builds/configure-a-build).

## O que funciona

- Apresentação estática com recursos, roteiro e contexto do desenvolvimento.
- Entrada direta, sem cadastro, na visão Owner demonstrativa.
- Dashboard com indicadores, gráficos, filtros e atividades recentes.
- Criação de lead, status, observações, origem, tags e follow-up.
- Prioridade automática e filtros de contatos.
- Arquivamento e restauração.
- Fechamento de venda com contrato mensal ou pontual.
- Edição do contrato, registro de pagamento, recorrência e histórico.
- Auditoria e histórico individual.
- Exportação de contatos, contratos, pagamentos, relatório comercial e relatório financeiro.
- Reinício da demonstração com confirmação.

## Dados e independência

A demonstração começa com 24 contatos fictícios, seis contratos e exemplos de pagamentos e atividades. As datas são relativas ao momento da primeira abertura ou do reinício.

Os dados ficam no `localStorage`, na chave `roasce-crm-demo-v1`. Ao recarregar, o visitante mantém suas alterações no mesmo navegador e endereço. Outros visitantes, dispositivos ou perfis do navegador têm seus próprios dados. Abas do mesmo navegador e endereço compartilham os dados; não se trata de um banco multiusuário.

O botão “Reiniciar demonstração” recria o cenário inicial com datas atualizadas. Se o armazenamento estiver bloqueado ou cheio, a interface avisa e mantém a sessão em memória, mas as alterações podem não persistir após sair.

Todos os nomes e valores são fictícios. Os e-mails iniciais usam `example.com`. Botões de contato explicam a ação original sem abrir WhatsApp ou enviar e-mail.

O projeto não inclui SDK do Firebase, credenciais, configurações do banco real, autenticação ou endpoints de produção. Gráficos, fonte e imagens estão incluídos localmente. Não há analytics ou envio dos dados inseridos para um backend.

## Arquitetura

| Arquivo/pasta | Responsabilidade |
| --- | --- |
| `index.html` e `intro.css` | Apresentação do projeto |
| `admin/index.html` e `admin/admin.css` | Estrutura e visual preservados do CRM |
| `admin/admin.js` | Interações, filtros, modais, indicadores e renderização |
| `admin/demo-data.js` | Geração dos exemplos iniciais |
| `admin/local-store.js` | Armazenamento local, consultas, operações agrupadas e atualização das telas |
| `admin/local-actions.js` | Despacho local das operações, sem requisições HTTP |
| `admin/actions/` | Regras comerciais e exportações adaptadas do projeto original |
| `admin/demo-ui.js` e `admin/demo.css` | Avisos, roteiro, reinício e moldura da demonstração |
| `assets/` | Marca, fonte Inter, Chart.js e licenças |
| `tests/demo.test.mjs` | Verificação automatizada dos principais fluxos |

As funções em `admin/actions/` executam no navegador. Embora reutilizem o formato de retorno das antigas APIs, elas NÃO são APIs, autenticação ou controles de segurança. A visão Owner serve para apresentar todos os recursos; a demonstração não testa permissões reais de Manager e Staff.

O projeto original usa Firebase e permissões por cargo. Esta diferença está explicada na página de apresentação para evitar atribuir segurança de backend à versão local.

## Executar localmente

Com Node.js instalado, na pasta do projeto:

```sh
npm start
```

Abra `http://localhost:3000`. Não é necessário instalar dependências.

Outra opção, com Python instalado:

```sh
python -m http.server 3000
```

Abra o mesmo endereço. Use um servidor local: abrir `index.html` por duplo clique (`file://`) não é adequado para módulos JavaScript e caminhos absolutos.

## Verificações

Execute:

```sh
npm test
```

O teste cobre criação, atualização, eventos simultâneos, observações sem eventos comerciais desnecessários, arquivamento idempotente, restauração, venda, pagamento mensal, prevenção de pagamento duplicado, edição financeira, cinco exportações e restauração dos dados iniciais.

Veja `VERIFICACAO.md` para os testes executados e seus limites.

## Ajustes futuros

- Textos da apresentação: `index.html`.
- Design da apresentação: `intro.css`.
- Dados fictícios iniciais: `admin/demo-data.js` (reinicie a demonstração após editar).
- Visual do CRM: `admin/admin.css`.
- Atualizações deste projeto são independentes do CRM real.

Não use esta versão como sistema de produção. Ela foi criada para demonstração pública com dados fictícios.
