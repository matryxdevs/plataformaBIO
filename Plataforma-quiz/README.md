# BIOQUALITY V59 — Termos de autorização de uso de imagem

## Deploy
Use o mesmo banco MySQL, DATA_DIR e variáveis de ambiente da V58. Faça backup antes da atualização. O usuário MySQL precisa de permissão CREATE TABLE para `gb_image_term_campaigns` e `gb_image_term_signatures`, criadas automaticamente. Acesse `/portal-v59` e verifique `/api/health-v59` (59.0.0). Não há alteração nas credenciais existentes.

## Uso
O administrador acessa **Termos de uso de imagem**, cria a coleta com treinamento (catálogo ou texto), data e quantidade prevista (1–1000), compartilha o link ou QR Code e acompanha os termos assinados. A previsão não fecha a coleta automaticamente; até 1000 assinaturas por coleta. O botão de encerramento bloqueia novos envios. Os termos continuam arquivados por treinamento e data. O relatório permite imprimir individualmente, em lote selecionado ou todos, em página independente A4, com assinatura vetorial e data/hora do servidor. Para PDF, use Salvar como PDF do navegador. A data informada no formulário é separada do horário efetivo de envio.

O colaborador não cria conta: informa nome, RG, CPF, telefone e data, lê e aceita o texto e desenha a assinatura. O texto da autorização é preservado na coleta. O CPF é validado matematicamente e só pode assinar uma vez por coleta. Não há verificação de identidade ou certificado ICP-Brasil. A assinatura é eletrônica manuscrita. O acesso aos documentos e à coleta é exclusivo do administrador; os outros módulos mantêm as permissões anteriores. O backup integral inclui as assinaturas, documentos e dados pessoais, portanto deve permanecer protegido. A cidade adotada no termo é Canaã dos Carajás – PA. Confirme a denominação jurídica das instituições e o texto com responsável jurídico/LGPD antes do uso. O prazo indeterminado não elimina o direito de revogação; solicitações de revogação devem ser tratadas pela instituição (não há fluxo automatizado nesta versão). Não condicione participação no treinamento à autorização.

## Validação
`npm run build` e `npm test` passaram, incluindo o novo fluxo público, validação de assinatura, autorização, CPF/RG, proteção de acesso, fechamento, impressão individual e múltipla, backup, reinício e adaptador MySQL simulado. Navegador real, impressão visual e MySQL de produção não validados nesta execução.

---

# BIOQUALITY V58 — acesso por convites e portal exclusivo de equipe

- Portal: `/portal-v58`; diagnóstico: `/api/health-v58` (58.0.0). As URLs dos recursos foram atualizadas para `/release-v58/`.
- Login somente para administradores e instrutores. A inscrição pública está desativada inclusive se `SELF_REGISTRATION=true` estiver configurado; não há criação de conta de colaborador. As contas antigas e seus resultados permanecem no banco, mas não podem iniciar sessão; as sessões antigas de aluno são descartadas. Crie instrutores pelo menu Instrutores e acessos.
- Administradores e instrutores podem operar Arena, Quiz por QR Code, frequências, matérias, empresas, colaboradores históricos, relatórios, publicidade e configurações visuais. Somente o administrador gerencia as contas de instrutores e baixa o backup integral, pois inclui hashes e dados pessoais. Os contatos históricos com consentimento são mantidos; os novos convites não coletam consentimento comercial nem adicionam telefones à lista de marketing.
- Arena: abra uma rodada individual ou por equipes; compartilhe o link ou QR Code da sala de espera. Informe nome completo, CPF e telefone celular brasileiro com DDD; no modo equipes, escolha também a equipe (uma vaga por equipe). CPF único por rodada; uma sessão temporária no navegador. CPF e telefone disponíveis na exportação restrita, nunca na classificação pública. Quiz: crie um convite em Quiz por QR Code. Os mesmos três campos identificam o resultado; uma tentativa por CPF por convite, sem senha. Guarde a aba original para retomar.
- Frequência: use lista aberta (nome digitado) ou nominal (nome selecionado), CPF e celular. A empresa é vinculada pelo responsável na criação da lista ou na relação nominal; sem vínculo definido, permanece em branco. Não há campo de empresa ou e-mail no formulário público. Entrada e saída continuam independentes, com saída liberada manualmente pelo responsável. Para saída de registros abertos anteriores, informe os mesmos dados de nome, CPF e telefone; para registros nominais históricos sem CPF/telefone, os dados informados na saída são anexados ao registro. Encerre listas e rodadas em andamento antes de atualizar, evitando diferenças entre os formulários antigos e novos.
- CPF validado pelos dígitos verificadores e celular pelo formato; não há verificação de titularidade. Links podem ser encaminhados. Não é autenticação de identidade, nem comprovação isolada de participação. Dados pessoais devem ter acesso restrito e retenção conforme a finalidade.
- Sem novas tabelas ou variáveis obrigatórias. Preserve banco MySQL, DATA_DIR e mídias; faça backup antes da implantação. Use o mesmo procedimento da V57 (Node 22, npm install, npm run build, npm start). `SELF_REGISTRATION` pode ser removida ou definida como false.
- Testes: `npm run build` e `npm test`. A suíte V58 contém teste integrado dos três fluxos de convidados, restrições de acesso, QR, impressão, CSV, persistência e backup, além de testes de interface simulada, pontuação, armazenamento e reconexão simulada. Os testes legados de contas de alunos foram preservados para referência, mas não compõem a suíte atual, pois testavam comportamentos removidos. MySQL real e navegador de produção não foram validados neste ambiente.

---

## Documentação histórica de versões anteriores (algumas instruções foram superadas pela V58)

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

## V34 — Cadastro público sem SMS

Em **Criar minha conta**, o aluno informa nome, usuário, senha e celular brasileiro com DDD (obrigatório); empresa/turma é opcional. Após conferir o formato do telefone, o usuário e a senha, o sistema cria a conta com perfil aluno e inicia a sessão. Não há envio de SMS nem verificação de titularidade. A confirmação de senha é feita no formulário. O telefone permanece no MySQL com `phoneVerifiedAt: null`; registros anteriormente verificados são preservados. O telefone não é utilizado como credencial nem como meio de recuperação de senha. A unicidade de usuário e telefone é mantida, inclusive para contas excluídas logicamente. Isso não impede que alguém informe um telefone de terceiros; em caso de conflito, procure a administração. O cadastro não autoriza publicidade automaticamente. O acesso às matérias publicadas e os controles de bloqueio, validade e exclusão permanecem disponíveis.

### Hostinger

Mantenha as credenciais MySQL e demais variáveis existentes, inclusive DATA_DIR. Configure `SELF_REGISTRATION=true` para habilitar o cadastro público. `false` ou ausência da variável desabilitam o cadastro. As três variáveis TWILIO da V33 podem ser removidas; não são lidas pela aplicação. Não há dependência de serviço externo de verificação. Faça backup do banco e das pastas de mídia antes do deploy. As contas e dados anteriores são compatíveis. Os limites locais de cadastro são de 60 tentativas de criação por minuto no total e por IP; contadores são reiniciados com o processo. Em hospedagens com proxy, diferentes alunos podem compartilhar o IP observado. Monitore cadastros abusivos e revise a política de privacidade e a finalidade de retenção dos telefones. Não trate números não verificados como comprovação de identidade.

Validação local: `npm run build` e `npm test` aprovados, com armazenamento local de teste e adaptador MySQL simulado. A interface em navegador real e MySQL de produção ainda precisam de validação na Hostinger.

## V35 — Escolaridade e interesse em curso técnico por competência

No cadastro público, os novos alunos informam situação escolar, série atual ou última série concluída (quando aplicável) e curso técnico por competência de interesse. O campo de série sugere anos do Ensino Fundamental, Médio e etapas de EJA e aceita texto livre; o campo de curso também aceita texto livre porque não foi fornecido um catálogo institucional. Há opções de não informar, não ter interesse ou ainda não ter decidido. A indicação de interesse não é matrícula, confirmação de oferta ou de elegibilidade. Os campos são validados no servidor, armazenados no registro do usuário no MySQL e incluídos no backup JSON. Contas anteriores e cadastros manuais permanecem válidos, com campos não informados. Nenhuma alteração de tabelas ou variáveis. Mantenha SELF_REGISTRATION=true.

O administrador consulta e pesquisa os dados em Usuários e perfis, e pode exportar CSV de alunos não excluídos (inclusive registros antigos sem preenchimento). O CSV contém dados pessoais e deve ser guardado de forma restrita. O registro de interesse não concede autorização de publicidade; o fluxo de consentimento WhatsApp permanece independente. Revise a política de privacidade e a finalidade de coleta e retenção, especialmente quando houver menores de idade. Faça backup do MySQL e das pastas de mídia antes do deploy.

Validação V35: npm run build e npm test aprovados, incluindo os novos campos, rejeição de dados inválidos, controle de acesso ao CSV e persistência após reinício. MySQL real e interface no navegador não foram testados nesta versão.

## V36 — Listas de presença

- Administração → Listas de presença → Criar lista de presença: informe o nome do treinamento/atividade, data de hoje ou futura e, opcionalmente, empresa/turma. Quando informada, a turma deve corresponder ao campo Empresa/Turma da conta (sem distinção de maiúsculas e minúsculas e ignorando espaços externos). Sem turma, qualquer aluno ativo poderá confirmar.
- A lista abre automaticamente na data programada e encerra ao terminar esse dia (fuso America/Fortaleza, horário de Brasília), ou antes, se o administrador selecionar Arquivar. O arquivamento é definitivo, sem exclusão dos registros. Listas de datas anteriores permanecem no histórico, mesmo se não foram arquivadas manualmente.
- Na página Minhas matérias do aluno, o cartão Lista de presença aparece acima das avaliações e é atualizado a cada 10 segundos, com atualização manual disponível. O aluno autenticado confirma em um clique. A data/hora e a identidade vêm do servidor; cliques repetidos mantêm o registro original. O aluno consulta suas próprias confirmações anteriores. Sessões anônimas de equipe por QR Code não podem marcar presença individual.
- Administração: histórico com busca por treinamento/turma, filtro de data e situação, contador de presenças, detalhes com atualização a cada 5 segundos, CSV e impressão/PDF pelo navegador. Somente administradores criam, arquivam, consultam ou exportam listas completas. Não há marcação de faltas, pois não existe lista nominal de convocados, nem edição retroativa dos registros pelo painel.
- Persistência: a tabela `gb_attendance` é criada automaticamente pelo adaptador MySQL na inicialização, com uma linha por lista e registros de confirmação no payload. O usuário MySQL precisa de permissão CREATE (já utilizada nas versões anteriores). O backup JSON administrativo inclui as listas e seus registros. Dados existentes permanecem compatíveis. Preserve o banco e DATA_DIR, incluindo mídias, e faça backup antes da implantação. Não há novas variáveis de ambiente. Mantenha `SELF_REGISTRATION=true` se desejar cadastro público.
- Controle de qualidade: a confirmação é autodeclarada por conta autenticada, não comprova presença física, identidade civil, tempo de permanência nem assinatura regulamentar. Para treinamentos com exigência de evidência adicional, mantenha os controles aplicáveis. As listas contêm dados pessoais; limite o acesso e retenção à finalidade institucional.
- Validação: npm run build e npm test aprovados, inclusive persistência JSON, adaptador MySQL simulado, permissões, duplicidade, fuso, exportação e backup. Interface em navegador real e MySQL da hospedagem não testados nesta versão.


## V37 — Empresas na lista de presença
- Administração > Listas de presença > Cadastro de empresas: cadastre nomes, pesquise, desative ou reative empresas. Nomes repetidos (inclusive diferenças de acento, maiúsculas e espaços) são rejeitados.
- Crie uma lista por treinamento e data, escolhendo todas as empresas ativas ou uma empresa específica. Para novas listas criadas no painel, o aluno pesquisa e seleciona obrigatoriamente uma empresa antes de confirmar. A escolha é uma autodeclaração, não comprova vínculo empregatício, e não altera a empresa do perfil.
- Registra o ID e o nome da empresa escolhida no momento da confirmação. A presença continua única por aluno/lista; tentativas posteriores não alteram o registro. Empresas desativadas não podem receber novas confirmações; os nomes já registrados permanecem no histórico, CSV e backup.
- Listas da V36 continuam com a regra original (turma do perfil, quando definida), sem migração retroativa. Novas listas do painel exigem ao menos uma empresa ativa. A opção de empresa específica limita as opções de seleção, não valida o vínculo empregatício do aluno.
- MySQL: nova tabela `gb_attendance_companies`, criada automaticamente com permissão CREATE. O backup JSON inclui o catálogo e as frequências. Preserve o banco e DATA_DIR. Não há novas variáveis de ambiente.

- Validação V37: npm run build e npm test aprovados, incluindo seleção obrigatória, empresas inválidas/inativas, duplicidade, histórico, CSV, backup e armazenamento MySQL simulado. Interface em navegador real e MySQL da Hostinger não testados.

## V38 — Empresa no cadastro público

O cadastro público exige escolher uma situação: trabalha em uma empresa, não possui vínculo ou não sabe informar. Quando há vínculo, a pesquisa filtra somente empresas ativas do cadastro administrativo em Listas de presença > Cadastro de empresas. A seleção é obrigatória e o servidor valida o ID e recupera o nome oficial; texto livre não substitui a seleção. Caso nenhuma empresa esteja disponível, solicite seu cadastro à administração e use Atualizar empresas. A lista de nomes das empresas ativas fica visível no cadastro público, sem outros dados administrativos. As opções sem vínculo ou sem informação não exigem empresa e são identificadas separadamente no painel e no CSV. A seleção não comprova vínculo empregatício.

Contas anteriores, cadastro manual pelo administrador/instrutor e regras de confirmação de frequência da V37 permanecem inalterados. As listas de frequência que exigem uma empresa continuam exigindo escolha de empresa ativa; a declaração no cadastro não confirma presença automaticamente. Os novos dados ficam no registro do usuário no MySQL e no backup JSON, sem nova tabela ou alteração de variáveis. Mantenha SELF_REGISTRATION=true para permitir cadastro público. Faça backup antes da implantação.


## V39 — Impressão e exportação de frequência por empresa e aluno

No painel administrativo, acesse **Listas de presença → Histórico de listas → Ver lista**. A visualização começa com todos os presentes. Marque uma ou várias empresas (pesquisa por nome) e/ou pesquise e selecione um aluno pelo nome e usuário. Os filtros se combinam por interseção. Limpar filtros restaura a lista completa. A opção sem empresa informada preserva os registros antigos. A empresa é a registrada no momento da presença, inclusive se desativada posteriormente.

Clique em **Imprimir / PDF** para imprimir somente a tabela exibida, com cabeçalho, data, filtros e contagem. Selecione Salvar como PDF na janela do navegador. **Exportar CSV** aplica os mesmos filtros aos dados atuais no servidor; uma presença nova pode ser incluída se registrada entre a visualização e a exportação. Os relatórios são por lista/treinamento, não consolidados entre várias datas. Nenhuma presença é alterada pelos filtros.

Sem alteração de variáveis de ambiente ou estrutura do MySQL. Faça backup antes do deploy e mantenha o DATA_DIR. Conferir a impressão no navegador e a conexão real na Hostinger.


## V40 — Seleção direta de empresa no cadastro
- No cadastro público, a opção de vínculo com empresa abre apenas a lista de empresas ativas, em ordem alfabética, sem campo de pesquisa ou botão de atualização.
- A escolha continua obrigatória para quem declara trabalhar em uma empresa; as opções sem vínculo e não sabe informar continuam disponíveis.
- A lista é consultada ao abrir o cadastro, e o servidor valida novamente a empresa ao salvar. Caso uma empresa tenha sido cadastrada após a abertura do formulário, volte ao login e abra o cadastro novamente.
- Nenhuma mudança no banco, nas variáveis de ambiente ou nos filtros de presença.

## V41 — Frequência pública por link e QR Code

- Administração → Listas de presença → Ver lista: cada nova lista criada pelo formulário administrativo gera um link público aleatório e um QR Code. Listas antigas vinculadas a empresas, ainda abertas ou agendadas, podem receber o link pelo botão Gerar link e QR Code. Listas históricas permanecem intactas. A administração pode desativar ou gerar outro link; o anterior deixa de funcionar. A lista só recebe registros na data indicada, no fuso America/Fortaleza, e enquanto não estiver arquivada.
- Compartilhe apenas o link da lista ou o QR Code, não o relatório. O participante externo não precisa criar conta. Informa e-mail, celular brasileiro com DDD, CPF com dígitos verificadores válidos, empresa ativa permitida na lista, assinatura desenhada com dedo/mouse e declaração de presença. Não é exigido nome de quem não possui conta, conforme solicitação. A validação de formato não confirma titularidade ou identidade.
- Para listas novas, alunos autenticados informam e-mail e telefone e confirmam a declaração de presença (sem CPF adicional ou desenho de assinatura). O nome vem do cadastro; a empresa é selecionada. O servidor registra o instante em UTC, e a tela/relatório apresentam data e hora no horário de Brasília. Registros anteriores sem os novos campos ficam preservados e exibem campos vazios.
- Registros da mesma lista são limitados por conta ou, quando informados, CPF, e-mail e telefone. Contatos compartilhados podem ser recusados; a administração deve tratar a situação. O acesso público não exige credenciais e não verifica presença física. A assinatura desenhada não constitui, por si, assinatura digital certificada ICP-Brasil, e a confirmação de conta não prova identidade civil. Avalie a suficiência das evidências para requisitos de cada treinamento.
- Relatório administrativo: empresa(s), participante (inclusive externo), e-mail, telefone, CPF quando coletado, data/hora e assinatura. A impressão/PDF inclui o desenho; CSV inclui dados e tipo de confirmação, não a imagem. Dados e traços de assinatura ficam em `gb_attendance` e no backup JSON. Sem novas tabelas nem variáveis. O link público não expõe o relatório nem os dados de terceiros.
- Proteja o banco e backups, restrinja compartilhamento dos relatórios (contêm CPF, telefone e assinatura), defina retenção e informe os titulares sobre a finalidade. Não utilizar os dados de frequência para publicidade sem fundamento apropriado. Recomenda-se homologar envio por telefone real, assinatura por toque, impressão e MySQL na Hostinger antes de usar em produção. A limitação do tamanho da assinatura é de 1000 pontos; listas muito grandes dependem dos limites de pacote e armazenamento MySQL da hospedagem.


## V42 — Confirmação de presença em um clique
- O formulário público mantém e-mail, telefone, CPF e seleção de empresa, mas elimina o campo de assinatura desenhada e a caixa de declaração. O botão Confirmar presença registra a declaração indicada no texto acima dele. Na área autenticada também basta preencher os dados exigidos e clicar no botão.
- O servidor continua validando dados, empresa, data, disponibilidade do link e duplicidade. Registra o horário em UTC e exibe no fuso America/Fortaleza (Brasília). A nova confirmação pública tem tipo `public-confirmation`, sem traços de assinatura. Relatórios e CSV identificam o tipo de confirmação. Assinaturas antigas da V41 permanecem preservadas no histórico e backup.
- A confirmação é autodeclaratória: não comprova isoladamente identidade, presença física ou assinatura digital certificada. Não altere o banco ou DATA_DIR; faça backup antes da implantação. Sem novas variáveis de ambiente.

Validação V42: npm run build e npm test aprovados. Teste de frequência pública sem desenho nem caixa adicional, horário do servidor, duplicidade, CSV, backup e reinício. MySQL real e interface no navegador não testados.

## V43 — Frequência independente do quiz e da Arena

- A frequência destina-se a treinamentos ao vivo, inclusive pelo Google Meet. O administrador cria a lista em Listas de presença, escolhe a data e o escopo das empresas e recebe o link e QR Code no detalhe da nova lista. O link pode ser compartilhado no chat da reunião ou o QR Code projetado na tela.
- A área geral do aluno não exibe listas, botão de presença ou histórico de frequência. O código de consulta automática foi removido. As antigas rotas autenticadas `/api/attendance` e `/api/attendance/mark` deixam de funcionar para alunos; o servidor exige o token do link público mesmo quando o participante está logado. Não há integração de frequência com o quiz, a Arena ou o QR Code de equipes.
- O formulário isolado não exige conta, solicita e-mail, celular, CPF e empresa cadastrada e mantém apenas o botão Confirmar presença. A confirmação usa o horário do servidor, apresentado no fuso America/Fortaleza. O link continua sujeito à data da lista, encerramento e desativação. O formulário não oferece navegação de volta ao quiz.
- A gestão, relatórios, filtros, exportação, impressão e backup continuam restritos ao administrador. Listas e registros anteriores são preservados, inclusive confirmações por conta e assinaturas antigas. Listas legadas sem vínculo ao cadastro de empresas ficam disponíveis para consulta e arquivamento; crie uma nova lista para distribuir link/QR. Links existentes de listas compatíveis continuam válidos conforme sua situação.
- Nenhuma mudança nas variáveis de ambiente ou estrutura MySQL. Faça backup e preserve o banco e DATA_DIR. A confirmação por link é declaratória: não verifica identidade nem tempo de permanência no Meet, e não há integração automática com a reunião. Quem receber um link repassado poderá utilizá-lo enquanto estiver válido; desative-o ou arquive a lista ao finalizar.

Validação V43: npm run build e suíte npm test concluídos com sucesso. MySQL real e interface gráfica da hospedagem ainda não validados.

## V44 — Nome completo na frequência pública

- O formulário acessível exclusivamente por link ou QR Code solicita agora o nome completo obrigatório, além de e-mail, celular com DDD, CPF e empresa cadastrada. O nome é validado no servidor, preservando acentos, hífens e apóstrofos, e armazenado no campo `name` do registro de frequência.
- O nome consta no relatório administrativo, pesquisa de participantes, impressão/PDF, CSV e backup. Registros anteriores sem nome permanecem intactos; a interface mostra Não informado. Nenhuma integração com quiz ou Arena, assinatura desenhada ou cadastro de conta foi acrescentada.
- Sem novas tabelas ou variáveis de ambiente. Preserve o banco e DATA_DIR e faça backup antes do deploy. Nome e CPF são autodeclarados; não há verificação de identidade.

Validação V44: npm run build e npm test aprovados, incluindo validação do nome obrigatório, CSV, backup, persistência após reinício e preservação das permissões. MySQL real e interface gráfica na hospedagem não testados.

## V45 — Catálogo de treinamentos e frequência múltipla

- Em Administração → Listas de presença → Cadastro de treinamentos, cadastre o nome de cada treinamento uma vez. O catálogo é independente das matérias de Quiz e Arena. É possível pesquisar, desativar e reativar treinamentos; duplicados são rejeitados. O catálogo novo começa vazio, sem importar automaticamente títulos de listas antigas.
- Em Criar lista de presença, selecione de 1 a 20 treinamentos ativos por lista, marque a data e o escopo de empresas e crie a lista. Uma confirmação representa a declaração de presença em todos os treinamentos selecionados; para controles individuais por treinamento, crie listas separadas. O formulário externo mostra todos os treinamentos e explica o alcance da confirmação. Link e QR Code seguem exclusivos por lista e não aparecem no portal do aluno.
- Os IDs e nomes dos treinamentos são gravados como snapshots na lista, e os títulos aparecem juntos no histórico, relatório, impressão e CSV. Desativar um treinamento não altera listas anteriores. Os registros de versões antigas continuam disponíveis com seus títulos originais. A seleção é validada no servidor; catálogo e criação de listas são restritos ao administrador.
- Persistência: nova tabela `gb_attendance_trainings`, criada automaticamente pelo adaptador MySQL (permissão CREATE necessária), catálogo incluído no backup JSON, sem novas variáveis de ambiente. Preserve o banco e DATA_DIR e faça backup antes do deploy.
- Validação: testes automatizados cobrem criação e duplicidade de treinamentos, seleção múltipla, permissões, rejeição de IDs inválidos e inativos, confirmação pública, relatório, CSV, backup, reinício e armazenamento SQL simulado. A interface em navegador real e MySQL da Hostinger não foram validados.

## V46 — Lista nominal e registro automático de ausências

- Em Administração → Listas de presença → Criar lista de presença, selecione os treinamentos, data e escopo de empresas. Escolha a modalidade Lista nominal e cole de 1 a 500 nomes completos, um por linha. Para turmas mistas, pode informar `Nome completo; Empresa cadastrada` em cada linha. Na lista de empresa única, todos os nomes recebem automaticamente aquela empresa. Empresas informadas na lista nominal devem estar ativas e dentro do escopo no momento da criação. Nomes duplicados (inclusive diferenças de caixa e acentuação) são rejeitados; diferencie homônimos pelo nome completo antes de criar. A lista nominal é fixada na criação; confira os nomes antes de compartilhar.
- Compartilhe o link exclusivo ou QR Code no Meet. O participante escolhe o próprio nome e clica em Confirmar presença, sem login, assinatura desenhada, CPF, e-mail ou telefone. Se não houver empresa pré-definida, ele seleciona uma empresa ativa. A empresa pré-definida é um snapshot da criação e permanece válida para aquela lista mesmo que seja desativada posteriormente. O nome gravado é o do cadastro nominal, nunca um nome enviado pelo participante. Um participante só confirma uma vez por lista, com data/hora do servidor. Uma confirmação vale para todos os treinamentos vinculados.
- Na administração, o histórico mostra previstos, presentes, pendentes e ausentes. Enquanto a lista estiver aberta ou agendada, quem não confirmou aparece como Pendente. Ao arquivar ou expirar pela data, fica Ausente automaticamente. Não são criados horários fictícios para ausentes. Relatório, impressão e CSV incluem todos os previstos e sua situação, respeitando os filtros por empresas e participante. Para atribuir a empresa de um ausente nos relatórios de turma mista, informe a empresa antecipadamente; do contrário ficará Sem empresa informada.
- A lista aberta de preenchimento de nome, CPF, e-mail, celular e empresa continua disponível. As frequências anteriores não são modificadas. O modo nominal não se integra ao quiz ou Arena. O catálogo, as listas nominais, as confirmações e o encerramento são armazenados no MySQL existente (coleção `gb_attendance`, sem nova tabela). A situação é derivada dos dados persistidos e da data/encerramento; o backup JSON contém os dados necessários para reproduzir o histórico. Não há novas variáveis de ambiente. Preserve DB_* e DATA_DIR e faça backup antes do deploy.
- Privacidade e integridade: quem tiver o link válido poderá ver os nomes previstos e escolher um deles. Não são exibidos CPF, e-mail, telefone ou registros de confirmação de outras pessoas. Não há autenticação de identidade, verificação automática do Meet ou comprovação de permanência em aula. O registro é declaratório; a prevenção de duplicidade não impede que alguém escolha o nome de outra pessoa. Compartilhe apenas com a turma, encerre ao final e confira com os registros do instrutor. Os nomes não são exibidos no formulário quando a lista está encerrada ou agendada.
- Validação: `npm run build` e `npm test` aprovados, incluindo cenário de 20 previstos, 17 presentes e 3 ausentes, duplicidade simultânea, empresas pré-definidas e seleção condicional, bloqueio após encerramento, expiração, exportação filtrada, backup e reinício. MySQL real e interface gráfica no navegador não testados.

## V47 — Três indicadores e categoria do treinamento

- Em Administração → Listas de presença → Criar lista de presença, selecione obrigatoriamente a categoria do treinamento: Online, EAD ou Presencial. A categoria é aplicada à lista inteira, inclusive quando contém múltiplos treinamentos. A escolha é independente do tipo de lista (aberta ou nominal). O servidor valida as três opções e armazena o valor na lista existente (`gb_attendance`). O histórico permite filtrar por categoria; a categoria também consta no formulário público, detalhe, impressão e CSV, além do backup. Listas antigas sem categoria são exibidas como Não informada, sem classificação retroativa.
- O histórico e resumo do relatório passam a apresentar apenas Previstos, Presentes e Ausentes, respeitando os filtros de empresa e participante no detalhe. Na lista nominal, quem não confirmou permanece com situação individual Não confirmada enquanto a lista está aberta/agendada, sem um quarto indicador. Somente após o encerramento manual ou por data são computadas as ausências. Na lista aberta, sem relação nominal, previstos e ausentes são apresentados como travessão (não calculáveis), não como zero.
- Nenhuma mudança nas variáveis de ambiente ou tabelas MySQL. Preserve o banco, DATA_DIR, históricos e mídias; faça backup antes do deploy. A classificação Online/EAD/Presencial é informativa e não integra sistemas de aulas, verifica identidade ou comprova automaticamente frequência. A presença continua exclusiva por link/QR Code, separada do Quiz e da Arena.
- Validação: teste de integração de frequência e build aprovados, com verificação das três categorias, rejeição de valores inválidos ou ausentes, preservação de listas legadas, exportação, backup, reinício e cenário de 20 previstos, 17 presentes, 3 ausentes. MySQL real e interface no navegador não testados.

Suíte completa `npm test`: aprovada, incluindo o adaptador MySQL simulado com persistência da categoria.

## V48 — Horários e relatório completo de frequência

- No painel administrativo, em Listas de presença → Criar lista de presença, informe a data, o horário de início e o horário de término do treinamento (HH:mm, horário de Brasília, UTC−03:00). Ambos são obrigatórios para novas listas. O término deve ser posterior ao início no mesmo dia. Para treinamentos em dias diferentes, crie listas separadas.
- Os horários são os previstos para os treinamentos selecionados e aparecem no histórico, no formulário público por link/QR e no relatório de frequência. Não alteram a janela de confirmação existente: o link aceita registros na data escolhida até o encerramento manual ou o final do dia, se ativo. A data/hora real de cada confirmação continua registrada pelo servidor.
- Em Histórico de listas → Ver lista → Imprimir / PDF, o relatório inclui todos os treinamentos vinculados, data, categoria, horários previstos, empresa/escopo, situação, encerramento manual quando houver, controle de frequência (previstos, presentes, ausentes), totais dos registros exibidos, filtros aplicados e tabela de participantes com dados e registros. O encerramento manual não é necessariamente o horário de término da aula. Para listas expiradas pela data, é indicado o encerramento ao fim do dia, sem inventar um carimbo de encerramento manual.
- A exportação CSV mantém as colunas anteriores e acrescenta horários previstos, encerramento manual e totais filtrados por registro. Listas antigas sem horários permanecem intactas: a tela/impressão indicam “Não informado”, e o CSV deixa os campos vazios. Nas listas abertas sem relação nominal, previstos e ausentes permanecem não calculáveis. Nas listas nominais ainda abertas, as ausências só são contabilizadas após o encerramento.
- Sem alteração nas variáveis de ambiente nem novas tabelas: os horários são armazenados na estrutura existente de frequência e no backup administrativo. Preserve o banco e o DATA_DIR. Faça backup antes de implantar.
- Validação local: npm run build e npm test concluídos com sucesso (incluindo validação dos horários, exposição dos dados no relatório, CSV, backup, reinício e compatibilidade com listas antigas). MySQL testado por adaptador simulado; impressão visual em navegador real e MySQL da hospedagem ainda não validados.

## V49 — Gestão de frequência em seções independentes

A página administrativa de frequência apresenta blocos separados, sem abas: criar lista, todas as frequências (histórico), empresas cadastradas e treinamentos cadastrados. Os filtros do histórico incluem texto, intervalo de datas, empresa, treinamento, categoria e situação. Em Empresas, **Ver frequências** aplica o filtro correspondente, usando o identificador da empresa quando disponível e o nome histórico para registros antigos. Listas abertas a todas as empresas aparecem na consulta de uma empresa quando houver associação nominal ou confirmação dessa empresa; o relatório individual permite ajustar os filtros.

- **Editar frequência:** listas ainda abertas/agendadas e sem confirmações permitem editar data, horários, categoria, treinamentos, empresa e relação nominal. Depois da primeira confirmação ou do encerramento, apenas categoria e horários podem ser corrigidos; data, participantes, empresa, treinamentos e confirmações são preservados. A versão anterior dos campos editados é registrada no objeto `edits`, incluído no backup.
- **Excluir frequência:** exclusão lógica, encerra a lista e invalida seu link/QR Code. O histórico permanece no armazenamento e no backup. Para recuperar, filtre a situação Excluídas e use Restaurar. A lista retornará arquivada, sem reativar o link.
- **Editar empresas e treinamentos:** permite corrigir o nome no catálogo. Frequências existentes preservam as identificações históricas já gravadas. Excluir retira o cadastro das novas seleções, mas mantém o identificador e os registros anteriores. Use Mostrar empresas/treinamentos excluídos e Restaurar para reativar. Nomes de cadastros excluídos ficam reservados para recuperação, não para duplicação.
- O módulo continua independente do Quiz e da Arena. Não há novas variáveis de ambiente nem migração de tabelas: os campos adicionais são armazenados no JSON das entidades existentes no MySQL.

Antes do deploy, exporte o backup administrativo e, preferencialmente, um backup SQL. Preserve as variáveis DB_* e DATA_DIR. Testes `npm run build` e `npm test` executados com sucesso, incluindo integração em armazenamento JSON de teste e adaptador MySQL simulado. Navegador e conexão MySQL de produção não validados neste ambiente.

## V50 — Central administrativa com menu lateral

Ao acessar Administração → Listas de presença, o menu lateral apresenta cinco opções: Criar frequência, Todas as frequências, Empresas, Colaboradores e Treinamentos. Somente a área escolhida é exibida. Em telas pequenas, o menu se reorganiza acima do conteúdo. O formulário de criação, a edição, os relatórios, os links públicos e o QR Code mantêm as regras da V49.

- Empresas: cadastro, edição de nome, imagem opcional PNG/JPEG/WebP (até 1 MB), substituição ou remoção de imagem, ativação/desativação, exclusão recuperável e restauração. A imagem fica no registro MySQL e no backup JSON; sua leitura é restrita à administração. A seleção pública de empresas não inclui imagens.
- Ao clicar no nome de uma empresa ou em Ver colaboradores, consulte os registros de presença vinculados à empresa. O botão Ver frequências abre o histórico geral filtrado. O vínculo por ID preserva o histórico após renomeações; registros legados sem ID são consultados pelo nome correspondente.
- Colaboradores: consulta administrativa de registros efetivos das listas, por empresa, nome, CPF, e-mail, treinamento, situação e período. Por padrão, apresenta presentes; altere a situação para consultar ausentes ou todos. A consulta apresenta um registro por participante e lista (não é um cadastro mestre de pessoas, e não une homônimos). O botão Ver lista abre o relatório da frequência, com o participante selecionado. Listas excluídas não aparecem nessa consulta até serem restauradas. Não há integração com contas de Quiz/Arena.
- Treinamentos: cadastro e manutenção do catálogo, edição, desativação, exclusão recuperável e restauração, preservando os nomes históricos das frequências.
- Todas as frequências: filtros da V49, edição, arquivamento, exclusão e restauração; impressão/PDF e CSV continuam disponíveis no detalhe. A folha impressa não inclui o menu lateral. Nenhuma nova variável de ambiente nem tabela é necessária. Preserve DB_* e DATA_DIR, e faça backup antes de implantar.

Validação: `npm run build` e `npm test` aprovados, incluindo upload/remoção de imagem, acesso restrito, backup, persistência após reinício e consulta por empresa/situação. Tentativa de teste visual com Chromium bloqueada pelo ambiente (ERR_BLOCKED_BY_ADMINISTRATOR); navegação visual e impressão ainda precisam ser validadas na hospedagem. MySQL real não testado (adaptador simulado nos testes).


## V51 — Correção de cache da interface
A V50 ainda referenciava arquivos estáticos com `?v=48`. A V51 altera todas as referências HTML para `?v=51`, aplica `no-store` ao HTML e identifica a versão no rodapé e no cabeçalho de frequência. Após implantar e reiniciar, abra `/api/health`: deve retornar `version: 51.0.0` e `ready: true`. Limpe o cache do domínio na hospedagem/CDN, se ativo, e abra `/admin` em uma janela anônima. Não altere o banco de dados, as variáveis ou o DATA_DIR.

## V52 — Menu lateral geral da administração

- Os módulos Arena ao vivo, Matérias e questões, Listas de presença, Usuários e perfis, Publicidade e vídeos, Contatos WhatsApp, Carrossel de login, Backup dos dados e Alterar logo ficam no menu administrativo lateral, junto de Gestão de avaliações.
- Atualizar, Exportar CSV e Imprimir ficam no grupo Relatório de avaliações ao abrir a gestão de avaliações, respeitando a matéria selecionada. As outras páginas mantêm suas próprias ações, filtros e relatórios.
- Menu persistente no portal administrativo; Arena abre sua página própria já existente. O submenu de frequência permanece independente. Em telas estreitas o menu geral recolhe em um botão e o submenu de frequência ocupa a largura do conteúdo. Impressões não exibem o menu. Alunos e instrutores conservam sua interface anterior. O editor de questões mantém confirmação de saída sem salvar.
- Deploy sobre V51, sem alteração de variáveis de ambiente ou esquema de dados. Confira `/api/health` (52.0.0) e rodapé V52. Faça backup e mantenha o DATA_DIR e MySQL existentes.

## V53 — correção da impressão de frequência

O botão **Imprimir / PDF** abre um relatório independente, autenticado, em nova aba. O servidor aplica os mesmos filtros de empresa e participante do CSV. O relatório exibe a logomarca institucional, treinamentos, data, categoria, horários previstos, encerramento, totais da seleção e da lista integral (quando filtrada), e todos os registros aplicáveis. A página usa A4 paisagem, cabeçalho repetido da tabela, quebra entre linhas e não contém menus ou QR Code. Clique em **Imprimir** ou **Salvar em PDF** e escolha a impressora ou o destino “Salvar como PDF” do navegador. Não é um PDF gerado pelo servidor. O relatório de avaliações mantém seu fluxo anterior. Sem mudanças de variáveis ou tabelas. O relatório contém dados pessoais e exige sessão administrativa. A versão está identificada como 53.0.0.

## V54 — correção de publicação e impressão
- Acesso exclusivo à versão nova: `/portal-v54`. Diagnóstico: `/api/health-v54` (deve retornar `version: "54.0.0"` e `ready: true`). O cabeçalho HTTP `X-Bioquality-Release` identifica a versão.
- Os recursos do HTML usam caminhos exclusivos `/release-v54/` em vez de apenas parâmetros de consulta. As rotas antigas permanecem disponíveis. HTML não usa resposta 304 e é entregue sem cache.
- A impressão de frequência abre `/api/attendance/print-v54?id=...` com os filtros selecionados; a impressão geral de avaliações abre `/api/report/print-v54?course=...`. Ambas usam páginas independentes, administrativas, com opção de salvar como PDF no navegador.
- Se `/api/health-v54` não existir ou retornar outra versão, confirme o domínio associado, a raiz do aplicativo (`server.js` e `package.json`), a implantação ativa e reinicie o Node.js no hPanel. Limpe eventual cache CDN. Preserve o banco e DATA_DIR.
- Não há alterações nas variáveis de ambiente nem no esquema de banco. A validação local não comprova a implantação no servidor Hostinger.


## V55 — entrada e saída
- O mesmo link e QR Code permite selecionar Assinatura de entrada ou Assinatura de saída e confirmar por botão. Na lista nominal selecione o nome; na lista aberta repita CPF, e-mail e telefone para localizar a entrada (nome continua no formulário). Não é necessário selecionar empresa novamente na saída.
- A saída só é aceita após entrada, uma vez por participante e enquanto a lista estiver aberta na data selecionada. Horários registrados pelo servidor (Brasília). O administrador deve encerrar a lista depois das saídas.
- Indicadores preservados: previsto, presente (entrada confirmada), ausente (sem entrada ao encerrar). Saída não registrada aparece separadamente; não equivale à comprovação de permanência. Registros antigos mantêm entrada histórica e não têm saída retroativa.
- Painel de frequência, consulta de colaboradores, relatório impresso/PDF e CSV mostram entrada e saída; dados armazenados na mesma entrada e incluídos no backup. Sem migração de esquema ou novas variáveis.
- Confira `/api/health-v55` e `/portal-v55`; recursos em `/release-v55/`. A confirmação continua declaratória, sem verificação de identidade ou integração com Meet.

## V56 — liberação administrativa da saída
- Em Listas de presença → Todas as frequências → Ver lista, encontre **Assinatura de saída** e clique em **Liberar assinatura de saída** no fim do treinamento. A confirmação de entrada continua disponível enquanto a lista estiver aberta.
- A saída começa bloqueada em listas novas e antigas sem autorização. A opção só aparece no formulário público após a liberação, pelo mesmo link ou QR Code. A página ativa consulta o status a cada 10 segundos e ao voltar ao foco. Atualizar a página também consulta a autorização. Se a consulta falhar, a saída fica oculta até nova consulta bem-sucedida.
- O servidor exige autorização administrativa, lista aberta e entrada anterior; permite uma única saída por participante. É possível bloquear novas saídas novamente sem apagar registros anteriores. A autorização é individual por lista, persistida junto à frequência e incluída no backup. Encerre a lista após as saídas. Não há mudança de esquema do MySQL ou de variáveis de ambiente.
- Diagnóstico: `/api/health-v56`; portal: `/portal-v56`; arquivos: `/release-v56/`. A frequência continua declaratória e sem verificação de identidade.

## V57 — Quiz individual por QR Code (sem cadastro)

No menu lateral administrativo, abra **Quiz por QR Code** (ou o botão correspondente em Matérias e questões). Selecione uma matéria publicada e informe opcionalmente o nome da turma/convite. O sistema cria um link exclusivo e QR Code que podem ser compartilhados no Meet ou WhatsApp. Não é a Arena ao Vivo nem a frequência: o colaborador informa apenas nome completo, e-mail e empresa (ou sem vínculo/não informada), sem conta, senha, verificação ou cadastro de usuário. Os resultados ficam na página de cada convite, com impressão independente e CSV. A correção é apresentada após entrega; o servidor calcula a nota usando a versão congelada da matéria na criação do convite. As respostas são gravadas a cada seleção. Uma tentativa por e-mail por convite; o e-mail não tem verificação de titularidade. A sessão é guardada na aba do navegador, permitindo recarregar a página, mas não recuperar a tentativa após perder a sessão. Não compartilhe o link fora da turma; encerre o acesso ao término. O administrador pode reabrir o convite para permitir a continuação de tentativas em andamento. Limite de 500 participantes por convite. O link não cadastra contatos de marketing. Mídias didáticas ficam acessíveis pelo convite enquanto aberto. Relatórios de convidados são independentes dos alunos registrados.

A atualização cria as tabelas `gb_quiz_links` e `gb_quiz_guests` automaticamente (a conta MySQL precisa de permissão CREATE TABLE). Não altera as variáveis de ambiente nem os registros existentes. O backup JSON inclui convites e resultados, mas não as credenciais de sessão dos convidados. Preserve o DATA_DIR e faça backup antes de implantar. O diagnóstico `/api/health-v57` e o endereço `/portal-v57` usam a versão 57.0.0, com arquivos `/release-v57/`.

Validação local: `npm run build`, `npm test` (armazenamento JSON de teste e MySQL simulado). O teste `test-public-quiz.js` verifica acesso público, autenticação administrativa, ausência de gabarito antes da entrega, fechamento/reabertura, persistência, relatórios e backup. A produção MySQL e a interface no navegador da hospedagem devem ser verificadas após o deploy.

Teste visual: tentativa no Chromium bloqueada com ERR_BLOCKED_BY_ADMINISTRATOR; não foi possível validar o fluxo visual em navegador real neste ambiente.

## V61 — Modelo institucional do termo de uso de imagem

- Formulário público e impressão A4 no estilo do documento fornecido: duas marcas, título centralizado, dados em linhas, texto justificado, data por extenso, assinatura em azul e rodapé institucional.
- A marca BIOQUALITY usa a imagem institucional configurada em `/logo`. A marca IDH-Bio foi recortada exclusivamente da área da logomarca na foto enviada; substituir `public/idhbio-logo.png` pelo arquivo oficial de alta resolução quando disponível. Nenhum dado pessoal do documento fotografado foi incorporado.
- Rodapé com denominação, endereço e e-mail legíveis na foto; os números não foram transcritos por falta de confirmação. Conferir os dados institucionais antes da utilização.
- Texto legal e versão da declaração da V59 mantidos, inclusive os termos assinados anteriormente. Os documentos continuam com identificador e registro de horário do servidor. Impressão individual ou em lote em folhas separadas.
- Sem alteração de variáveis ou estrutura do banco de dados. Preservar banco MySQL e DATA_DIR. Diagnóstico `/api/health-v61`; portal `/portal-v61`.
- Validação: build e suíte atual passaram; impressão de dois termos fictícios renderizada em duas páginas A4 com WeasyPrint. Validação no Chrome da hospedagem e MySQL real ainda necessárias.
