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
