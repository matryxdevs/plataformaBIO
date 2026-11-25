# V27 — Arena ao Vivo: interface simplificada

- Faixa compacta de status, participantes, tempo e questões; sem repetição no texto de conexão.
- Pergunta em destaque, barra de questões respondidas, alternativas e botão de avanço manual. Em telas largas, pista e progresso pessoal ficam ao lado; em celulares, ficam abaixo.
- Classificação visual com personagens 3D, pistas compactas, duas colunas para seis ou mais competidores na visão de gestão em telas largas; tabela completa e histórico em seções expansíveis. A projeção em tela cheia permanece disponível.
- Mantém QR Code, permissões, publicidade na sala de espera, pontuação, persistência MySQL, backup e controle de acesso da V26. Nenhuma nova variável ou migração de dados. Preserve o banco e DATA_DIR e faça backup antes de publicar.

---

# V25 — Backup dos dados pelo painel

Administração → Backup dos dados → Baixar backup dos dados (JSON). A exportação é exclusiva do administrador, inclui o último estado confirmado no banco e não altera os dados de produção. Contém todas as matérias, questões, alternativas, gabaritos, textos, contas e hashes de senha, perfis, resultados, histórico de competições, contatos autorizados, imagens e configurações de logo, carrossel e campanhas. Não contém variáveis de ambiente, senhas em texto claro ou sessões ativas. Os convites de equipe são renovados na cópia e as sessões de equipes são excluídas; faça o backup entre rodadas. O arquivo contém dados pessoais, hashes e gabaritos: armazene com acesso restrito, preferencialmente criptografado.

**Vídeos:** os arquivos MP4/WebM não estão no JSON. Copie separadamente a pasta `DATA_DIR/campaign-media` preservando os nomes de arquivos. As imagens e URLs do YouTube estão no JSON.

**Recuperação em um ambiente novo:** pare a aplicação de destino; crie um banco MySQL novo e vazio; configure as variáveis DB_* para esse banco; coloque a cópia JSON no DATA_DIR de destino com o nome `quiz-v2.json` e copie a pasta `campaign-media`. Inicie a aplicação: a migração existente importará os dados no banco vazio. O backup não sobrescreve um banco já preenchido. Não apague o banco original. Valide os logins antigos e conteúdos no destino antes de mudar o ambiente de produção. Não há importação ou restauração destrutiva pelo painel.

**Backup da versão já publicada:** exporte todas as tabelas do MySQL via phpMyAdmin no formato SQL e copie a pasta de mídia. Em versões antigas exclusivamente JSON, copie o `quiz-v2.json` e demais arquivos do DATA_DIR. Faça backup antes do deploy.

# Game Bioquality V24 — MySQL com reconexão automática

## Implantação na Hostinger

1. Antes de atualizar, encerre a rodada ativa e interrompa as gravações da versão antiga. Faça backup integral de `DATA_DIR`, incluindo `quiz-v2.json`, `login-carousel.json` (se existir) e `campaign-media/`. Preserve esse diretório na nova implantação.
2. Se já utiliza a V23, mantenha o mesmo banco MySQL, usuário e senha. Exporte o banco pelo phpMyAdmin antes de atualizar. Não apague tabelas. Em uma instalação nova, use banco dedicado vazio e usuário com permissões de criar tabelas, consultar, inserir, atualizar e excluir registros. As tabelas InnoDB são criadas na inicialização.
3. Extraia o ZIP na raiz da aplicação Node.js. Use Node 22.x, arquivo inicial `server.js`, gerenciador npm. Execute `npm install` (instala `mysql2`), `npm run build` e `npm start`. O pacote não inclui `node_modules` nem lockfile: o acesso ao registro npm não estava disponível no ambiente de desenvolvimento, portanto não foi possível gerar um lockfile válido. Não utilize `npm ci` antes de gerar o lockfile com `npm install`.
4. Configure as variáveis abaixo pelo painel. Não envie credenciais para repositórios nem inclua `.env` no ZIP. A porta HTTP é atribuída pela hospedagem, não pela variável `DB_PORT`.

| Variável | Valor |
|---|---|
| `DB_HOST` | Host MySQL informado pela hospedagem (localhost somente se for o host indicado) |
| `DB_PORT` | 3306, salvo indicação diferente do provedor |
| `DB_NAME` | Nome completo do banco criado |
| `DB_USER` | Usuário do banco |
| `DB_PASSWORD` | Senha do usuário do banco |
| `DB_SSL` | true quando TLS estiver disponível/exigido; false apenas se a conexão local e o provedor permitirem |
| `DB_SSL_CA_FILE` | Opcional, caminho do certificado CA quando necessário |
| `ADMIN_LOGIN` | admin ou login administrativo inicial |
| `ADMIN_PASSWORD` | Senha inicial forte, 12–200 caracteres; não redefine senhas já cadastradas |
| `COOKIE_SECURE` | true em HTTPS |
| `NODE_ENV` | production |
| `DATA_DIR` | Mesmo caminho absoluto persistente da V22 (inclusive para os vídeos) |

5. Abra `/api/health` após iniciar e confira `ready: true` e `version: 25.0.0`. Se `ready: false`, consulte os logs e revise credenciais, host, permissões e conectividade. Não há fallback silencioso para JSON em produção. O modo JSON existe apenas para os testes de regressão, quando `NODE_ENV=test` e `STORAGE_DRIVER=json`.
6. Confira usuários, matérias, relatórios, contatos autorizados, carrossel, campanhas, reprodução de vídeos e uma rodada de teste via QR Code. Faça uma nova cópia de segurança do banco pelo phpMyAdmin ou ferramenta de backup do provedor. Guarde também os arquivos de mídia.

## Migração automática

Na primeira inicialização, se as tabelas do Game Bioquality estiverem vazias, a aplicação importa `quiz-v2.json` e `login-carousel.json` do `DATA_DIR`, se existirem. Caso não haja arquivo antigo, cria uma instalação nova. Não substitui um banco já inicializado. O arquivo legado permanece intacto. Não execute versões antiga e nova simultaneamente. Se o arquivo antigo não estiver no servidor, restaure a cópia antes da primeira inicialização; se o banco já foi inicializado, não apague tabelas sem backup e orientação. Alterações feitas na V23 não serão escritas de volta no JSON antigo.

## Estrutura e decisões técnicas

Tabelas: `gb_users`, `gb_sessions`, `gb_courses`, `gb_attempts`, `gb_races`, `gb_campaigns`, `gb_marketing_contacts`, `gb_metadata`, `gb_login_slides`. Cada registro tem chave primária, ordem e conteúdo JSON em LONGTEXT, preservando snapshots, dados históricos, gabaritos e compatibilidade. É persistência MySQL por entidade, não uma remodelagem relacional totalmente normalizada. Logo, banners e slides ficam no banco; vídeos enviados permanecem em `DATA_DIR/campaign-media/`. A aplicação mantém estado confirmado em memória para consultas rápidas, persiste somente registros alterados em transações e serializa gravações. Uma trava de sessão MySQL impede duas instâncias simultâneas no mesmo banco. Em caso de perda da conexão, a aplicação interrompe operações com HTTP 503, tenta reconectar automaticamente com intervalos progressivos de 1 a 30 segundos, readquire a trava exclusiva e recarrega os dados confirmados no MySQL. Nenhuma operação de escrita ambígua é repetida automaticamente. O heartbeat padrão é de 5 segundos; opcionalmente, DB_KEEPALIVE_MS pode ser configurado entre 1000 e 60000. A recuperação não importa arquivos JSON antigos se o banco anteriormente inicializado estiver vazio. Durante indisponibilidade, aguarde o retorno de ready:true e confira se a última operação foi registrada antes de reenviá-la. Não edite tabelas diretamente enquanto estiver rodando. Use um único processo Node.js; não use cluster nem réplicas simultâneas. A fila de gravações inclui uploads, portanto vídeos grandes podem atrasar respostas durante uma rodada; evite uploads durante a competição. O volume de histórico ainda afeta o consumo de memória. A atualização de 0,5 s e compressão da V22 foram preservadas, mas o desempenho real com MySQL não foi medido.

## Validação disponível

A V24 inclui `test-reconnect.js`, que simula perda da conexão ociosa, falhas consecutivas de reconexão e perda da confirmação de COMMIT, com recuperação dos dados e das sessões no mesmo processo HTTP. Não foi testada em servidor MySQL real.


`npm run build` e `npm test`: regressão funcional com armazenamento de teste JSON e testes do adaptador SQL com uma conexão simulada. Não houve teste contra servidor MySQL real, nem instalação de mysql2 no ambiente de desenvolvimento por indisponibilidade de DNS/rede. Valide em um banco de homologação antes de migrar produção. Para testar a instalação real, use as variáveis de um banco vazio de homologação e o procedimento acima. Os dados e credenciais de produção não foram acessados.

---

## Histórico das versões anteriores (instruções de armazenamento antigas não se aplicam à V23)

# Game Bioquality — V20

Nome da plataforma atualizado de Game Arena Bioquality para Game Bioquality em todas as telas, títulos, publicidade e identificação do servidor. A logo e os recursos da V19 foram preservados. Não há alteração de variáveis de ambiente, rotas ou formato de armazenamento. Preserve DATA_DIR e faça backup antes de atualizar. As referências ao nome anterior no histórico abaixo são mantidas por documentação.

# V14 — Reprodução automática dos vídeos

Os cartões de publicidade e as prévias administrativas usam fundo branco, texto escuro e botão de contato verde abaixo do vídeo ou banner. Os formatos horizontal e vertical continuam disponíveis por campanha. O texto e o endereço do botão continuam configuráveis. Nenhuma alteração em dados, variáveis de ambiente ou regras de pontuação. Preserve `DATA_DIR` e `campaign-media` e faça backup antes de reimplantar. O fundo interno do player permanece escuro para acomodar vídeos de outras proporções.

# V11 — Orientação de vídeo por campanha

Em Publicidade e vídeos → Nova campanha / Editar campanha → Vídeos e materiais de divulgação, escolha Horizontal (16:9) ou Vertical (9:16). A orientação é salva por campanha e usada na página inicial, no pré-quiz, na sala de espera da Arena e na prévia administrativa. Aplica-se a YouTube e arquivos MP4/WebM. Não gira nem recorta o vídeo; escolha um arquivo compatível com a proporção. Campanhas antigas ficam horizontais até serem editadas. Mantenha o DATA_DIR existente e faça backup antes de atualizar. As variáveis de ambiente não mudam.

# Game Arena Bioquality V10 — Vídeos por matéria e pré-quiz

## Novidades da V10
- Acesse Administração → Publicidade e vídeos → Nova campanha, ou Matérias e questões → Adicionar vídeo / anúncio na matéria desejada.
- Cadastre título, descrição, banner (PNG, JPEG ou WebP até 1 MB), botão com link HTTPS e vídeo do YouTube ou arquivo MP4/WebM de até 30 MiB.
- Selecione uma matéria ou Todas as matérias. Marque os locais de exibição: página inicial, antes de iniciar o quiz, sala de espera da Arena ao Vivo (ou combinação). Marque Publicar. As campanhas antigas permanecem na página inicial até serem editadas. O vínculo com matéria filtra quiz e arena, não a página inicial. Limite de 12 campanhas cadastradas. A reprodução é opcional. O primeiro vídeo da página tenta iniciar com áudio automaticamente. Se bloqueado, tenta sem áudio e oferece ativação manual. O YouTube inicia quando pelo menos metade do player está visível. Ao iniciar uma prova ou rodada, os anúncios são retirados da tela; o tempo de visualização anterior não entra na pontuação. Na arena, alterações de campanhas são consultadas periodicamente e a sala é atualizada a cada 1,5 segundo.
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


V12: Logo Bioquality aplicada como identidade padrão da plataforma.


## V14 — reprodução automática
- Aplica-se ao primeiro vídeo de cada tela do aluno; prévias administrativas e demais vídeos continuam manuais. O navegador pode bloquear o som e até a reprodução sem som. O botão de ativação e os controles nativos permitem iniciar manualmente. Não há repetição automática.
- Recarregar uma matéria mantém sua página. A publicidade é removida quando a avaliação inicia. Na Arena, a reprodução para quando a rodada começa.
- O YouTube usa a API oficial e depende da rede, das permissões de incorporação e das regras do navegador.

## V15 — Carrossel de login
No painel administrativo, clique em **Carrossel de login**. Adicione até 8 fotos PNG, JPG ou WebP, organize a ordem, publique/oculte, substitua ou exclua individualmente. O intervalo padrão é de 5 segundos e pode ser ajustado entre 3 e 15. O carrossel público substitui o painel original do personagem apenas quando há imagens publicadas. As fotos são exibidas integralmente (sem corte) sobre fundo branco, com navegação manual e pausa. As alterações são carregadas no próximo acesso/atualização do login. Imagens de até 1 MB são enviadas diretamente; as maiores (até 20 MB) são reduzidas no navegador quando compatível. O limite efetivo de cada arquivo enviado é 1 MB. Não há novas variáveis de ambiente. Preserve todo o DATA_DIR, incluindo login-carousel.json, quiz-v2.json e campaign-media. Nenhuma imagem publicitária de exemplo foi inserida. Testes: npm run build e npm test. A validação visual e a implantação na hospedagem devem ser realizadas após a publicação.


## V16 — Contatos WhatsApp
Campo opcional na tela de login, sem SMS ou validação de existência/titularidade. Apenas alunos autenticados que marcam autorização expressa têm o número armazenado; não se registram tentativas de login malsucedidas nem dados de administradores. Entrada com pontuação de telefone é normalizada para dígitos sem verificar comprimento ou DDD. Número em branco ou campo não autorizado não impede login. Cada conta mantém um contato ativo; login sem preencher novamente mantém a escolha anterior. Aluno pode atualizar ou cancelar em Meu WhatsApp e preferências. Administração > Contatos WhatsApp permite buscar, remover e exportar CSV. A base é armazenada em quiz-v2.json, no mesmo DATA_DIR. Não há disparo automático nem integração WhatsApp. Antes de importar contatos em plataforma de marketing, confirme titularidade e autorização, elimine duplicatas e sincronize cancelamentos inclusive em cópias exportadas. Defina política de retenção, aviso de privacidade institucional e acesso restrito aos responsáveis. Sem novas variáveis de ambiente. Faça backup antes de atualizar.

## V17 — Instrutores e perfis

- Acesse Administração > Usuários e perfis para cadastrar uma conta como Instrutor, promover uma conta existente ou retornar seu perfil para Aluno. A alteração encerra as sessões da conta; o usuário entra novamente com a mesma senha.
- O instrutor possui painel próprio, cadastro de alunos, criação e edição de matérias e questões, publicação de conteúdo, criação/início/encerramento de rodadas ao vivo, projeção e CSV da Arena. O banco de conteúdos e as rodadas são compartilhados entre instrutores e administradores; não há separação por turma. Permissões são verificadas no servidor.
- Somente o administrador gerencia perfis, redefine senhas, acessa relatórios gerais, campanhas, carrossel, contatos de marketing e identidade visual. Instrutores podem administrar apenas suas próprias preferências de WhatsApp.
- O administrador permanece protegido. A mudança de perfil de um participante em rodada ativa requer seu encerramento. Avaliações e histórico anteriores são preservados; instrutores não realizam provas enquanto estiverem nesse perfil.
- A tabela ao vivo exibe respondidas e questão atual. Não revela respostas corretas adicionais.
- Atualização: preserve o DATA_DIR e faça backup integral dos dados e mídias antes da implantação. Não há novas variáveis. Node.js 22.x, npm run build, npm start.
- Compilação e suíte npm test aprovadas, incluindo test-instructors.js. A validação visual em navegador e implantação na Hostinger não foram realizadas neste ciclo.

## V18 — Arena por equipes com QR Code

1. Entre como administrador ou instrutor e acesse Arena ao Vivo (`/corrida`).
2. Na nova rodada, selecione a matéria e o tipo **Equipes (QR Code sem login)**. Informe de 2 a 40 nomes distintos, um por linha, e abra a sala de espera.
3. O convite aparece automaticamente, com QR Code gerado localmente pelo servidor, link copiável e opção de projeção em tela cheia. O endereço usa a origem do site aberto pelo instrutor; use o domínio público HTTPS da Hostinger, não localhost.
4. Um representante de cada equipe escaneia o QR Code, seleciona um nome disponível e entra diretamente na Arena. Não há cadastro, senha nem coleta de WhatsApp nesse fluxo. A sessão de equipe é independente da conta individual, limitada a uma rodada e dura até 24 horas no mesmo navegador. Recarregar mantém a equipe.
5. A lista mostra equipes disponíveis e conectadas. Antes do início, o instrutor pode liberar uma vaga ocupada incorretamente, revogando a sessão do representante. Depois do início não são aceitas novas equipes nem liberações; o mesmo navegador pode continuar com a sessão existente. O QR de convite é compartilhável: projete apenas para a turma e confira a lista antes de iniciar. Não há verificação individual de identidade nesse modo.
6. Inicie a corrida. Uma resposta definitiva por questão por equipe; ranking, personagens, pontuação 80/20 (precisão/tempo) e CSV continuam funcionando. Os resultados ficam no histórico de Arena, com o nome da equipe, e não no relatório individual dos alunos. Campanhas de Arena podem aparecer na sala de espera e são retiradas ao iniciar.
7. Para avaliações individuais, escolha **Individual (login de aluno)**. Os dados existentes não são alterados. A versão continua usando o mesmo DATA_DIR e configuração de implantação. Faça backup do arquivo `quiz-v2.json` e dos arquivos de mídia antes de atualizar.

Validação: `npm run build` e `npm test` passaram (incluindo teste de convites, duplicidade, revogação, autorização, persistência, corrida e CSV). O QR de teste foi decodificado com sucesso. A validação visual automatizada no Chromium foi impedida por ERR_BLOCKED_BY_ADMINISTRATOR; confira em computador e celular após publicar. Nenhum serviço externo de geração de QR é usado.


## V19 — Logo transparente
Apenas a apresentação da marca foi ajustada. O PNG original já possui canal alfa; as margens vazias foram aparadas e a moldura/fundo do cabeçalho foi removida. A logo padrão anterior, quando reconhecida exatamente pelo hash, é substituída pela versão recortada; logos personalizadas são preservadas. Se a logo personalizada tiver fundo incorporado à imagem, restaure a logo padrão em Administração → Alterar logo. Use o mesmo DATA_DIR e faça backup antes da implantação.


## V21 — avanço manual na Arena Online
Após confirmar cada resposta (exceto a última), a questão permanece visível, com alternativas bloqueadas e feedback de acerto/erro. O botão Próxima pergunta libera a questão seguinte. O bloqueio é persistido no servidor, inclusive após recarga e reinício; funciona nos modos individual e equipe QR Code. A última resposta conclui automaticamente a participação, preservando o critério de pontuação e tempo. O tempo até clicar em avançar conta no tempo total da prova. Avaliações fora da Arena permanecem inalteradas. Rodadas anteriores preservam os resultados; uma rodada em andamento sem avanço pendente inicia a nova regra na próxima resposta.

## V22 — Otimização de desempenho

- Arena ativa: consulta automática a cada 500 ms (antes, 1500 ms), após a resposta anterior. Sala de espera: 650 ms; rodada encerrada/sem rodada: 1800 ms; aba oculta: 3500 ms. Recuperação progressiva após falhas, com consulta imediata ao voltar à aba. Ações do participante continuam solicitando atualização imediata.
- A API de estado retorna uma versão vinculada à rodada e à sessão. Se a versão não mudou, retorna apenas a confirmação e o relógio; autenticação e autorização continuam sendo verificadas em todas as consultas. A versão é invalidada em toda gravação e após reinício do servidor. Clientes antigos continuam recebendo o estado completo.
- Classificação e pista só são redesenhadas quando os dados relevantes mudam; renderização dos avatares observa novos elementos, em vez de varrer toda a página a cada alteração. A Arena carrega apenas o resumo das matérias no painel de criação de rodada.
- Arquivos públicos estáticos pré-carregados em memória, gzip negociado com o navegador e cache com ETag/304; logo revalidada por versão do conteúdo. Sem cache público dos dados de avaliação ou contatos. Preservada a gravação atômica e síncrona dos resultados, sem adiar a persistência.
- Teste local com 40 equipes: resposta de estado completo de 10.769 bytes e resposta sem mudança de 74 bytes; app.js de 37.519 bytes para 11.210 bytes com gzip. São medidas de tamanho de corpo, não garantias de latência em produção. A velocidade real depende da rede, da hospedagem e da frequência de alterações. Teste de navegador bloqueado pela política do ambiente (ERR_BLOCKED_BY_ADMINISTRATOR).
- Deploy: mesma configuração Node.js e DATA_DIR; faça backup antes de substituir a aplicação. Não é necessário instalar novas dependências ou alterar variáveis de ambiente. Execute `npm run build` e `npm test` para verificar.

## V26 — Controle de acesso
Administração → Usuários e perfis → Gerenciar acesso. Disponível somente ao administrador para contas de aluno e instrutor. Bloqueio indefinido, bloqueio até data/hora, desbloqueio, validade de acesso, renovação e remoção de validade. Bloqueio e validade são independentes. Datas são interpretadas no fuso do dispositivo do administrador e armazenadas em UTC. Alterações revogam sessões; o servidor também verifica prazos a cada requisição autenticada. Contas antigas sem restrições permanecem ativas. Exclusão lógica definitiva: revoga sessões, invalida a senha, remove o contato de marketing e reserva o login/ID; preserva nome, turma, avaliações e resultados para auditoria. Não equivale a eliminação integral de dados pessoais. Se uma conta for bloqueada ou expirar durante uma Arena, suas respostas já registradas permanecem; o instrutor pode encerrar a rodada manualmente se ela ficar aguardando esse participante. Convites QR de equipe são sessões independentes, sem conta de aluno. Não há alteração de variáveis nem de tabelas MySQL; os novos campos são persistidos no payload do usuário e no backup JSON. Execute backup antes do deploy.

## V28 — Controle de zoom
A escala inicial é 1 em todas as páginas (portal/login, Arena e entrada QR). O viewport solicita escala fixa e o CSS mantém gestos de rolagem horizontal e vertical, sem gesto de ampliação nas áreas sob controle da página. Os campos de formulário usam 16 px em dispositivos móveis para evitar o zoom automático ao digitar. O navegador ou sistema pode ignorar restrições por motivos de acessibilidade, e controles próprios do navegador (inclusive Ctrl +/−) e players incorporados não são controlados pelo site. Não há mudança no banco, variáveis ou dados.

## V29 — Reforço do controle de zoom
Além do viewport e CSS da V28, as três páginas carregam viewport.js antes da interação. O código cancela eventos canceláveis de pinça e gestos Safari, toque duplo na superfície da página, roda/trackpad com Ctrl ou Cmd e atalhos +/− que sejam entregues à página. Rolagem com um dedo, edição de campos, controles nativos e Ctrl/Cmd+0 são preservados; a regra de fonte mínima de 16 px permanece em dispositivos móveis. Os arquivos estáticos são versionados para evitar reaproveitar a versão anterior. Não há mudança no banco, variáveis ou dados.
Limitação: um site web não consegue impedir todos os tipos de zoom. Navegadores, menus, atalhos reservados, acessibilidade do sistema, players/iframes de terceiros e ampliação externa podem ignorar essas restrições. Bloquear zoom reduz a acessibilidade. Para controle integral em dispositivos da instituição, é necessário avaliar um ambiente gerenciado/quiosque com políticas próprias. Os testes de eventos simulados não equivalem à validação dos gestos em aparelhos reais.

## V31 — Materiais didáticos em imagens e vídeos

Em **Matérias e questões → Nova matéria / Editar matéria**, administradores e instrutores podem enviar arquivos diretamente do dispositivo e informar legendas opcionais. São três locais independentes: apresentação antes do quiz (até 12 arquivos), apresentação no topo durante o quiz (até 6) e mídia de cada questão (até 3). Cada seção aceita PNG, JPEG e WebP de até 5 MiB e MP4/WebM de até 30 MiB. Use MP4 com H.264/AAC para maior compatibilidade. O limite efetivo da hospedagem pode ser menor. Envie os arquivos e clique em **Salvar matéria e questões**. Para substituir, remova a referência e envie outro arquivo. O quiz individual mostra a apresentação antes do botão de início e o apoio geral no topo das perguntas; a Arena mostra a apresentação na sala de espera, o apoio geral durante a rodada e a mídia específica sob o enunciado. Funciona para equipes via QR Code. Os vídeos didáticos são manuais, com controles; durante a Arena o tempo continua correndo enquanto o vídeo é assistido. A publicidade mantém sua lógica anterior. Imagens são carregadas sob demanda, vídeos são servidos com suporte a Range. O upload didático não ocupa a fila de gravação MySQL. Os arquivos não são transcodificados; compatibilidade depende dos codecs do navegador.

**Persistência e backup:** os arquivos ficam em `DATA_DIR/course-media/`, com identificadores aleatórios e acesso autenticado (inclusive sessão temporária da equipe). O MySQL e o backup JSON armazenam apenas as referências, tipos e legendas. Copie também a pasta `course-media` integralmente ao fazer backup ou migrar, além de `campaign-media` e do banco. Remover uma mídia do editor retira a referência da próxima versão da matéria; os arquivos permanecem para preservar snapshots e históricos. Arquivos enviados e não vinculados também permanecem no disco; monitore o espaço. Não exclua arquivos manualmente sem conferir referências em matérias, tentativas e rodadas. Nenhuma variável nova é necessária. Encerre rodadas antes de implantar, mantenha o banco e DATA_DIR persistentes e faça backup. Testes de sintaxe e integração local aprovados, inclusive 40 equipes e acesso/entrega de mídia; MySQL real, codecs e interface no navegador da hospedagem ainda precisam de validação.


## V32 — Identidade visual Bioquality
- Cabeçalhos apenas com a logo institucional, sem nome textual ou slogan ao lado.
- Remoção do nome anterior dos títulos, rodapés e rótulos fixos. Logo configurada pelo administrador também na entrada por QR Code.
- Sem alterações no banco, na mídia, nos cadastros ou nas variáveis de ambiente. Identificadores internos de armazenamento e backup permanecem compatíveis.
