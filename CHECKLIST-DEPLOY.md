# Checklist: colocar o site no ar (truckbem.com)

Use este checklist para garantir que tudo funciona antes e depois de publicar.

---

## ✅ O que já está pronto no projeto

| Item | Status |
|------|--------|
| Página principal (`truckbem.html`) | ✅ Servida em `/` pelo Node |
| Formulário de contato (nome, email, telefone, empresa, mensagem) | ✅ Envia via POST para `/api/contact` |
| Validação (campos obrigatórios) | ✅ No front e no backend |
| Máscara de telefone (XX) XXXXX-XXXX | ✅ Aplicada no input |
| Pop-up "Mensagem enviada" | ✅ Abre quando o backend retorna sucesso |
| Backend POST `/api/contact` | ✅ Recebe dados e envia e-mail com Nodemailer |
| SMTP Hostinger (variáveis no `.env`) | ✅ Configurado (host, porta 465, MAIL_TO, etc.) |
| CORS | ✅ Habilitado para o front chamar a API |
| Destinatários do e-mail | ✅ `administrativo@truckbem.com.br` e `herik@truckbem.com.br` |
| Assunto do e-mail | ✅ "Orçamento de Frete - Site" |

Ou seja: **sim, você pode colocar o site no ar** e o formulário está preparado para funcionar em produção, desde que a hospedagem rode Node e as variáveis de ambiente estejam configuradas.

---

## Antes de publicar

1. **Testar localmente**
   - No terminal: `npm start`
   - Abrir: http://localhost:3000
   - Preencher e enviar o formulário
   - Verificar se o pop-up de sucesso aparece e se o e-mail chega nas caixas (herik e administrativo)

2. **Escolher hospedagem Node**
   - Ex.: Render, Railway, Fly.io ou Hostinger com Node
   - O serviço precisa rodar `npm install` e `npm start` (ou `node server/server.js`)

3. **Variáveis de ambiente na hospedagem**
   - O arquivo `.env` **não** vai para o repositório (está no `.gitignore`).
   - No painel da hospedagem, cadastre as mesmas variáveis que estão no seu `.env`:
     - `SMTP_HOST`
     - `SMTP_PORT`
     - `SMTP_SECURE`
     - `SMTP_USER`
     - `SMTP_PASS`
     - `MAIL_FROM`
     - `MAIL_TO`
   - Assim o formulário em produção conseguirá enviar e-mail.

4. **Domínio truckbem.com**
   - Na hospedagem: adicionar domínio personalizado (truckbem.com e/ou www.truckbem.com).
   - No painel de DNS do domínio: apontar A e CNAME conforme a hospedagem indicar.
   - Detalhes no `DEPLOY.md`.

---

## Depois de publicar

1. Abrir **https://truckbem.com** (ou a URL que a hospedagem der).
2. Testar o formulário de novo: preencher e enviar.
3. Verificar se o e-mail chegou em **administrativo@truckbem.com.br** e **herik@truckbem.com.br**.
4. Se algo falhar: conferir variáveis de ambiente, logs do servidor e (se usar) painel SMTP da Hostinger.

---

## Resumo

- **Pode colocar o site no ar:** sim.
- **Formulário:** está implementado e funcionando no fluxo local; em produção funciona igual desde que o backend Node esteja no ar e as variáveis SMTP estejam configuradas na hospedagem.
- **Documentação:** use o `DEPLOY.md` para o passo a passo de deploy e DNS.
