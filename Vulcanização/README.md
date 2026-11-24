# Game Arena Bioquality V10 — Vídeos por matéria e pré-quiz

## Novidades da V10
- Acesse Administração → Publicidade e vídeos → Nova campanha, ou Matérias e questões → Adicionar vídeo / anúncio na matéria desejada.
- Cadastre título, descrição, banner (PNG, JPEG ou WebP até 1 MB), botão com link HTTPS e vídeo do YouTube ou arquivo MP4/WebM de até 30 MiB.
- Selecione uma matéria ou Todas as matérias. Marque os locais de exibição: página inicial, antes de iniciar o quiz, sala de espera da Arena ao Vivo (ou combinação). Marque Publicar. As campanhas antigas permanecem na página inicial até serem editadas. O vínculo com matéria filtra quiz e arena, não a página inicial. Limite de 12 campanhas cadastradas. A reprodução é opcional e não automática. Ao iniciar uma prova ou rodada, os anúncios são retirados da tela; o tempo de visualização anterior não entra na pontuação. Na arena, alterações de campanhas são consultadas periodicamente e a sala é atualizada a cada 1,5 segundo.
- Use links de WhatsApp, Instagram ou site para o botão. O YouTube é exibido por youtube-nocookie.com; o vídeo deve permitir incorporação. Para arquivos enviados, use MP4 H.264/AAC para maior compatibilidade.
- Os arquivos enviados ficam em `DATA_DIR/campaign-media/`. O cadastro das campanhas fica em `DATA_DIR/quiz-v2.json`. Preserve ambos e faça backup antes de atualizar. A V10 acrescenta os campos de vínculo e exibição sem apagar os registros anteriores.
- O limite de 30 MiB é da aplicação. A Hostinger pode impor um limite menor de corpo HTTP ou de armazenamento. Se um upload falhar, tente vídeo menor ou link do YouTube. Um envio de vídeo em andamento salva a campanha como rascunho; caso falhe, revise e publique novamente depois.
- As variáveis de ambiente e comandos de implantação permanecem iguais aos da V8. Não há dependências externas de servidor adicionais.
- Os testes de integração cobrem permissões, cadastro, publicação, ocultação, edição, exclusão, imagem, upload e acesso parcial do vídeo, persistência, limpeza, vínculo com matéria, filtragem de locais e ocultação após o início. Teste a reprodução real e a interface no navegador após publicar.

## Documentação anterior (funcionalidades preservadas)

# Game Arena Bioquality — versão 8.0

Aplicação Node.js com as 40 questões originais de vulcanização, área do aluno, área administrativa, logo personalizável e várias matérias. Sem SQLite nativo, sem MySQL, sem bibliotecas externas e sem flags de inicialização. As perguntas e o gabarito permanecem no servidor (apenas as perguntas sem respostas são entregues ao aluno antes da conclusão).

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

Admin: criar aluno com nome, usuário, empresa/turma opcional e senha inicial (mínimo 8 caracteres); pesquisar, acompanhar status e pontuação, redefinir senha; consultar relatórios individuais com gabarito e desempenho por tema; exportar CSV e imprimir/salvar PDF pelo navegador. Aluno: estudar os fundamentos, iniciar, responder, revisar, retomar progresso após novo login, entregar e consultar o resultado comentado. Uma tentativa por aluno e por matéria; um ponto por acerto, total variável conforme a matéria; sem nota mínima predefinida. O resultado não equivale à certificação de aptidão prática.

## 4. Dados, migração e segurança

Armazenamento JSON privado no servidor, com gravação atômica. Adequado para turmas pequenas/médias em UMA instância Node.js e volume persistente. Não use múltiplos processos/réplicas compartilhando o mesmo arquivo; para maior escala, adote banco transacional externo. Faça backup periódico de `quiz-v2.json`, proteja o arquivo e restrinja acesso. Senhas usam scrypt; sessões são opacas, com cookies HttpOnly; há controle de acesso, limites de login e correção no servidor. Não há recuperação por e-mail nem auditoria de segurança independente.

Se já houver dados na versão anterior, pare o servidor antigo e faça uma cópia integral do diretório SQLite (incluindo WAL/SHM, se existentes). Em ambiente com Node.js 22.13+ execute `node migrate-v1.js /caminho/da/copia`. O script lê o banco anterior e cria `quiz-v2.json`, preservando usuários e resultados sem sobrescrever arquivos existentes. Configure DATA_DIR no novo servidor para o diretório migrado. Se o banco antigo estiver presente sem migração, o sistema exibe diagnóstico em vez de criar outro conjunto de dados. Faça nova cópia de segurança antes de migrar. O script requer SQLite nativo somente durante a migração, não durante a execução normal. O administrador é criado apenas no primeiro início; mudar a variável de senha depois disso não altera a conta existente.

## 5. Testes

`npm test`: servidor inicia sem senha e informa configuração pendente; login correto e incorreto; cadastro e duplicidade; autorização admin/aluno; gabarito protegido; salvamento parcial; retomada após reinício; entrega de 40 questões; nota calculada corretamente; bloqueio de alteração após entrega; relatórios; CSV; redefinição de senha. Verificação de sintaxe com `npm run build`. A execução no navegador de teste foi bloqueada pela política do ambiente; a publicação real na Hostinger ainda precisa ser validada.

## 6. Novidades da versão 3.0

- No painel administrativo, clique em **Alterar logo**, selecione uma imagem PNG, JPEG ou WebP (até 1 MB) e salve. A imagem substitui o ícone padrão do cabeçalho em todas as áreas. O nome textual Game Arena Bioquality permanece. É possível restaurar a logo padrão.
- Clique em **Matérias e questões > Nova matéria**. Preencha o nome, descrição, textos teóricos e questões. Cada questão tem tópico, enunciado, quatro alternativas, indicação da resposta correta e justificativa opcional. Clique em Salvar matéria e questões. Marque Publicar para todos os alunos quando estiver pronta; desmarque para arquivar ou manter em rascunho. Matérias arquivadas não permitem novas tentativas, mas alunos que já iniciaram podem concluir e consultar resultados.
- É possível adicionar, editar ou excluir questões e textos. Cada matéria aceita até 200 questões e 50 textos, respeitado o limite de 1,5 MB por requisição. Alterações afetam novas tentativas; avaliações existentes utilizam uma cópia das questões, teoria, título e gabarito no momento do início, preservando a nota e a revisão histórica.
- Alunos autenticados visualizam todas as matérias publicadas e aquelas que já iniciaram. Não há restrição de matérias por turma nesta versão. Os relatórios administrativos e CSV são filtrados pela matéria selecionada. O percentual é calculado pelo total de questões da tentativa.

## 7. Atualizar da versão 2.0 sem perder dados

1. Antes de reimplantar, interrompa a instância anterior para impedir alterações durante a cópia. Faça backup privado do arquivo `quiz-v2.json` (na pasta `DATA_DIR` ou, se omitida, `data/` do projeto). Não publique esse arquivo nem o inclua em um repositório aberto.
2. Preserve o diretório persistente e mantenha `DATA_DIR` apontando para ele. Se o caminho antigo estiver dentro da pasta substituída pelo deploy, copie o arquivo para um novo diretório privado e gravável antes de atualizar e ajuste `DATA_DIR` para esse caminho.
3. Envie o ZIP v3 mantendo as configurações Node.js e demais variáveis da v2. O arquivo de dados continua com o mesmo nome `quiz-v2.json`; a versão 3 acrescenta automaticamente matérias, logo e snapshots das avaliações antigas. Usuários, senhas, sessões, respostas e notas permanecem no mesmo arquivo. Se a pasta estiver vazia, a aplicação criará um novo conjunto de dados, não recuperará dados perdidos.
4. Verifique `/health`, a lista de alunos, relatórios antigos e a matéria original de 40 questões. Se precisar voltar à v2, use a cópia de segurança anterior à atualização, sabendo que os registros gerados após a atualização não estarão nela.

## 8. Validação da versão 3

Os testes automatizados incluem os fluxos antigos e a criação/edição/publicação/arquivamento de matérias, controle de acesso, integridade das tentativas após mudanças, relatórios por matéria, upload/restauração da logo, persistência e migração de dados v2. O teste de navegação em Chromium não pôde ser executado porque o ambiente bloqueou o acesso ao endereço local. A implantação na Hostinger deve ser validada com uma conta de teste antes do uso real.


## 9. Corrida do conhecimento (v5)

- Administrador: entre no painel, clique em Corrida ao vivo, escolha uma matéria publicada e a meta de acertos, abra a sala de espera e aguarde os alunos. Inicie a rodada; use Projetar pista para tela cheia.
- Aluno: faça login e clique em Entrar na corrida de conhecimento, entre na sala de espera e aguarde o início. Cada questão aceita uma única resposta definitiva. Cada acerto move o personagem; erro não move. O personagem avança proporcionalmente à meta e a pista apresenta cinco etapas.
- A classificação é calculada no servidor e atualizada a cada 1,5 segundo (mais latência da rede). A meta de acertos é visual; o vencedor é definido ao final entre os alunos que responderam todas as questões, por pontuação combinada de acertos e tempo. Troféu e confetes aparecem nos dispositivos conectados. O administrador pode encerrar a rodada e excluir os resultados incompletos da disputa pelo primeiro lugar (sem apagar os registros).
- Pontos de conhecimento = 80 × acertos/total. Bônus de velocidade = 20 × acertos/total × máximo(0, 1 − tempo em segundos/(60 × total)). Total = soma dos componentes arredondados a duas casas. Referência de tempo: 1 minuto por questão, não é um limite de prova. Ex.: 40/40 em 10 min = 95 pontos; 36/40 em 20 min = 81 pontos. Empates: mais acertos, menor tempo e ID de aluno como último critério estável. O tempo é medido pelo servidor desde a largada da corrida até a última resposta aceita (incluindo pausas e reconexões); na avaliação tradicional, desde o início individual até a entrega. Notas de acertos originais permanecem intactas. O ranking das avaliações tradicionais também exibe a pontuação combinada e o tempo, inclusive para resultados anteriores com datas válidas.
- Corridas criadas na v4 conservam sua regra original de primeira chegada; novas rodadas usam a fórmula v5. O ranking parcial não atribui bônus de tempo antes da conclusão. A tabela aparece no painel administrativo e no celular do aluno; o CSV contém tempo em segundos e os componentes da pontuação.
- Histórico e CSV de cada rodada são independentes dos relatórios de avaliações tradicionais. Uma rodada ativa por vez; todos os alunos autenticados podem ingressar enquanto a sala estiver aberta.
- Atualização v2/v3/v4 → v5: faça backup do quiz-v2.json e mantenha o DATA_DIR e as variáveis da instalação que já funciona. O servidor adiciona automaticamente a coleção de corridas aos dados existentes.
- Para turmas pequenas/médias em uma instância Node.js com armazenamento persistente. Teste a concorrência com sua turma e valide a publicação na Hostinger antes da aplicação real.

Validação v5: `npm run build` e `npm test` aprovados, incluindo a fórmula e classificação, corrida multiusuário, persistência e os fluxos existentes. A navegação Chromium foi bloqueada pelo ambiente (ERR_BLOCKED_BY_ADMINISTRATOR) na versão anterior; não foi possível confirmar a renderização final da v5 em navegador. A publicação efetiva na Hostinger ainda deve ser validada.

## 10. Atualização visual v6

- Identidade Game Arena Bioquality em todas as telas, com marca padrão substituível por upload.
- Interface responsiva, entrada gamificada, central de competições, indicadores de rodada, pista e classificação renovadas.
- O formato dos dados, as rotas, os critérios de pontuação e as configurações de implantação da v5 permanecem iguais. Faça backup de quiz-v2.json e preserve o DATA_DIR antes de implantar.

Validação v6: npm run build e npm test aprovados. Tentativa de navegação Chromium local bloqueada pela política do ambiente (ERR_BLOCKED_BY_ADMINISTRATOR); validação visual em navegador e publicação na Hostinger pendentes.


## 11. Game Arena Bioquality v8 — Arena 3D

- Frontend JavaScript puro, HTML e CSS; servidor Node.js. Sem dependências npm adicionais.
- Avatares poligonais tridimensionais: malhas de elipsoides e segmentos articulados, projeção em Canvas, iluminação por face, animação por quadros e cores por competidor. Visual estilizado de armadura tecnológica, não fotorrealista. Não exige WebGL ou motor externo.
- Iluminação verde neon, partículas, pistas com profundidade, rastro de avanço, efeito de vitória e adaptação a telas menores. Suporte à preferência de movimento reduzido.
- Tipografia Space Grotesk e Manrope via Google Fonts (opcional, com fontes do sistema como fallback); política de conteúdo permite exclusivamente os dois domínios de fontes além do próprio site.
- Mantidos os acessos, 40 questões iniciais, logo, matérias, pontuações, regras de classificação e relatórios.
- Atualização: mantenha o DATA_DIR persistente e faça backup de quiz-v2.json. Mantenha as variáveis existentes. ZIP com arquivos diretamente na raiz.
- npm run build e npm test aprovados. A tentativa de navegação no Chromium foi bloqueada com ERR_BLOCKED_BY_ADMINISTRATOR. A aparência final, o desempenho em dispositivos reais e a implantação na Hostinger devem ser confirmados.
