# Bioquality | Quiz de vulcanização

Aplicação web multiusuário com as 40 questões e seis fundamentos teóricos do documento Word original. Correção e armazenamento de resultados no servidor. Não requer dependências externas nem MySQL.

## Executar localmente

1. Instale Node.js 22.13 ou superior (recomendado 22.x atualizado).
2. Extraia o ZIP e abra a pasta no VS Code/terminal.
3. Copie `.env.example` para `.env` e troque `ADMIN_PASSWORD` por uma senha forte, única, de pelo menos 12 caracteres. Deixe `COOKIE_SECURE=false` apenas para HTTP local.
4. Execute `npm start` (não é necessário instalar bibliotecas).
5. Abra http://localhost:3000. Entre com `ADMIN_LOGIN` e `ADMIN_PASSWORD` definidos no primeiro início.

## Publicar em hospedagem Node.js (ex.: Hostinger)

- Extraia o ZIP e configure como raiz da aplicação a pasta onde estão `package.json` e `server.js`. Não publique somente `public`.
- Selecione runtime Node.js 22.13+ com suporte a `node:sqlite`. Comando de início `npm start`, arquivo de entrada `server.js`. A aplicação escuta `0.0.0.0` e a variável `PORT` da hospedagem (3000 localmente).
- Configure `ADMIN_LOGIN=admin`, `ADMIN_PASSWORD` com senha forte escolhida por você e `COOKIE_SECURE=true` quando o domínio usar HTTPS. Não exponha `.env`. Não use a senha de exemplo.
- Configure `DATA_DIR` como diretório gravável e persistente fora de arquivos substituídos pelo deploy. Caso omitido, o banco fica em `data/` na raiz do projeto. Garanta que reinícios e novos deploys não apaguem esse diretório. Use instância única com armazenamento local persistente; não é indicado para serverless sem volume nem réplicas independentes.
- Acesse seu domínio para login. Não há URL de produção até publicar. O suporte do seu plano precisa ser verificado na hospedagem.

## Fluxo de uso

Admin: cadastrar nome, usuário, senha inicial e empresa/turma opcional. Entregar as credenciais e link do site ao aluno. Visualizar status, respostas registradas, acertos, erros, percentual, média e data. Exportar CSV (UTF-8, separado por ponto e vírgula, compatível com Excel), imprimir relatórios e visualizar desempenho por tema e gabarito comentado individual. Pode redefinir senha do aluno.

Aluno: fazer login, revisar fundamentos, iniciar avaliação, responder 40 itens, navegar e retomar progresso em outro dispositivo, entregar e conferir relatório final. Uma tentativa definitiva por conta. Cada acerto vale 1 ponto (40 pontos possíveis); não foi definido corte de aprovação. Gabarito somente após entrega. Alunos podem compartilhar respostas após a entrega; adote supervisão adequada para avaliações formais.

## Dados e segurança

SQLite com senhas derivadas via scrypt, sessões opacas HttpOnly/SameSite, validação de entradas, autorização de rotas e limitação de tentativas de login. As respostas corretas não estão na pasta pública. Não compartilhe o ZIP completo com alunos, apenas o endereço da aplicação. O primeiro administrador é criado uma única vez; mudar a variável posteriormente não altera a senha já armazenada. Não há recuperação automática da senha administrativa. Mantenha cópias protegidas e planeje recuperação administrativa.

Para backup consistente, pare o processo e copie o diretório de dados (incluindo eventuais arquivos WAL/SHM), ou use um procedimento de backup online de SQLite. Proteja o acesso ao banco e mantenha uma política de retenção e privacidade adequada à LGPD. Para produção, confirme HTTPS, backup e testes na hospedagem; não foi feita auditoria independente de segurança. Não inclui e-mail automático, recuperação por e-mail, cadastro aberto nem integração LMS.

## Edição

`questions.json`: perguntas, alternativas, índices de resposta correta (0=A, 1=B, 2=C, 3=D) e justificativas. `public/theory.json`: estudo. Não altere as perguntas depois de alunos iniciarem a avaliação; preserve a versão para manter comparabilidade das notas. `public/`: interface responsiva verde/branca. `server.js`: API e banco.

Base: documento Avaliacao_Tecnica_Vulcanizacao_40_Questoes.docx, NR-12, ISO 31000, ISO 9001, 5S, planos de inspeção, manutenção e operação, referências técnicas Continental e Flexco. Avaliação não substitui capacitação prática nem procedimentos internos ou especificações do fabricante.
