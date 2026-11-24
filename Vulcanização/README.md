# Bioquality | Quiz de Vulcanização — versão 2.0

Aplicação Node.js com 40 questões originais, área do aluno e área administrativa. Sem SQLite nativo, sem MySQL, sem bibliotecas externas e sem flags de inicialização. As perguntas e o gabarito permanecem no servidor (apenas as perguntas sem respostas são entregues ao aluno antes da conclusão).

## 1. Publicar na Hostinger

1. Faça backup dos dados e do projeto anterior antes de substituir a implantação. No hPanel, use a opção de aplicativo Node.js e envie o ZIP inteiro, não a pasta public.
2. Selecione Node.js 22.x (20 ou superior funciona com este código), npm, framework Other/Outro, raiz `./`, arquivo de entrada `server.js`. Se solicitado, configure comando de build `npm run build` e comando de início `npm start`. Se houver campo de diretório de saída para aplicativo servidor, use `.` (raiz). Não selecione modo estático.
3. Variáveis no hPanel: `ADMIN_LOGIN=admin`, `ADMIN_PASSWORD` com sua própria senha única de 12 a 200 caracteres, `COOKIE_SECURE=true` para HTTPS. `NODE_ENV=production` é opcional. Não defina PORT manualmente se fornecido pela hospedagem; o fallback é 3000.
4. Configure `DATA_DIR` com um caminho absoluto gravável e persistente fora da pasta substituída pela implantação. Se omitido, os dados ficam na pasta `data/` do projeto, que pode ser descartada no próximo deploy. Confirme o caminho e a persistência com a hospedagem. Não use um diretório público.
5. Reimplante e abra `https://SEU-DOMINIO/health` (resposta JSON running=true, ready=true). Se ready=false, abra a página inicial para ler o diagnóstico. Se continuar 503 antes de carregar a página, verifique os logs de implantação e execução: a plataforma pode não estar executando o arquivo de entrada.
6. Abra `/admin` e entre com o usuário e senha administrativa. Cadastre os alunos. Compartilhe `/aluno` e as credenciais individuais. O servidor identifica o perfil automaticamente independentemente do caminho de entrada.

## 2. Executar localmente

Node.js 20+; extraia o ZIP. Copie `.env.example` para `.env`, escolha uma senha própria (12 caracteres ou mais) e use `COOKIE_SECURE=false`. Execute `npm start` e abra http://localhost:3000. Não é preciso instalar pacotes externos. `npm run build` verifica a sintaxe; `npm test` executa testes de integração da API com dados temporários.

## 3. Uso

Admin: criar aluno com nome, usuário, empresa/turma opcional e senha inicial (mínimo 8 caracteres); pesquisar, acompanhar status e pontuação, redefinir senha; consultar relatórios individuais com gabarito e desempenho por tema; exportar CSV e imprimir/salvar PDF pelo navegador. Aluno: estudar os fundamentos, iniciar, responder, revisar, retomar progresso após novo login, entregar e consultar o resultado comentado. Uma tentativa por conta; 40 pontos máximos; sem nota mínima predefinida. O resultado não equivale à certificação de aptidão prática.

## 4. Dados, migração e segurança

Armazenamento JSON privado no servidor, com gravação atômica. Adequado para turmas pequenas/médias em UMA instância Node.js e volume persistente. Não use múltiplos processos/réplicas compartilhando o mesmo arquivo; para maior escala, adote banco transacional externo. Faça backup periódico de `quiz-v2.json`, proteja o arquivo e restrinja acesso. Senhas usam scrypt; sessões são opacas, com cookies HttpOnly; há controle de acesso, limites de login e correção no servidor. Não há recuperação por e-mail nem auditoria de segurança independente.

Se já houver dados na versão anterior, pare o servidor antigo e faça uma cópia integral do diretório SQLite (incluindo WAL/SHM, se existentes). Em ambiente com Node.js 22.13+ execute `node migrate-v1.js /caminho/da/copia`. O script lê o banco anterior e cria `quiz-v2.json`, preservando usuários e resultados sem sobrescrever arquivos existentes. Configure DATA_DIR no novo servidor para o diretório migrado. Se o banco antigo estiver presente sem migração, o sistema exibe diagnóstico em vez de criar outro conjunto de dados. Faça nova cópia de segurança antes de migrar. O script requer SQLite nativo somente durante a migração, não durante a execução normal. O administrador é criado apenas no primeiro início; mudar a variável de senha depois disso não altera a conta existente.

## 5. Testes

`npm test`: servidor inicia sem senha e informa configuração pendente; login correto e incorreto; cadastro e duplicidade; autorização admin/aluno; gabarito protegido; salvamento parcial; retomada após reinício; entrega de 40 questões; nota calculada corretamente; bloqueio de alteração após entrega; relatórios; CSV; redefinição de senha. Verificação de sintaxe com `npm run build`. A execução no navegador de teste foi bloqueada pela política do ambiente; a publicação real na Hostinger ainda precisa ser validada.

Base: 40 questões e teoria do documento anterior. Não modifique o gabarito enquanto existirem avaliações em andamento.
