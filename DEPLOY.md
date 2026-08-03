# Configurar domínio e fazer o formulário funcionar em produção

**Domínio do site:** **truckbem.com** (e opcionalmente www.truckbem.com)

Este guia explica como colocar o site no ar com esse domínio e fazer o envio de e-mail do formulário funcionar **sem abrir o cliente de e-mail do usuário**.

---

## Visão geral

1. **Hospedar** o projeto em um serviço que rode Node.js (o backend que envia o e-mail).
2. **Apontar o domínio** (DNS) para esse serviço.
3. **Configurar variáveis de ambiente** (SMTP, etc.) no painel da hospedagem.
4. **Ativar HTTPS** (a maioria dos serviços faz isso ao adicionar domínio próprio).

---

## Passo 1 — Escolher onde hospedar (Node.js)

O site precisa de um servidor Node.js para a rota `/api/contact`. Algumas opções:

| Serviço | Vantagem | Observação |
|--------|----------|------------|
| **Render** | Plano gratuito, fácil | Após inatividade o app “dorme”; primeiro acesso pode demorar |
| **Railway** | Simples, bom free tier | Pago após certo uso |
| **Fly.io** | Gratuito para apps pequenos | Um pouco mais técnico |
| **Hostinger / outro com Node** | Se já tem hospedagem | Verifique se suporta Node e porta customizada |

Recomendação para começar: **Render** (grátis e rápido de configurar).

---

## Passo 2 — Deploy no Render (exemplo)

1. Crie uma conta em [render.com](https://render.com).
2. **New → Web Service**.
3. Conecte o repositório Git do projeto (GitHub/GitLab) **ou** faça upload do projeto (se Render permitir).
   - Se usar Git: faça push do seu projeto (incluindo `server/`, `package.json`, `truckbem.html`, `images/`, etc.).
4. Configure o serviço:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** (deixe em branco se a raiz do repo for o projeto)
5. Em **Environment** (Variáveis de ambiente), adicione:

   | Nome | Valor (exemplo) |
   |------|------------------|
   | `SMTP_HOST` | `smtp.hostinger.com` (ou o do seu provedor) |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | seu e-mail completo (ex: `site@truckbem.com`) |
   | `SMTP_PASS` | senha do e-mail |
   | `MAIL_FROM` | `TruckBem Site <site@truckbem.com>` |
   | `NODE_ENV` | `production` |

6. Crie o Web Service. O Render vai dar uma URL tipo: `https://site-truckbem.onrender.com`.

---

## Passo 3 — Apontar seu domínio (DNS)

Onde você comprou o domínio (Registro.br, GoDaddy, Hostinger, etc.) existe uma área de **DNS** ou **Gerenciar DNS**.

### Se estiver usando Render

1. No painel do seu Web Service no Render: **Settings → Custom Domain**.
2. Adicione o domínio: **`truckbem.com`** e/ou **`www.truckbem.com`**.
3. O Render vai mostrar o que configurar no DNS, em geral:
   - Para **apex** (truckbem.com):
     - Tipo: **A**
     - Nome: `@` (ou deixar em branco)
     - Valor: IP que o Render informar (ex: `216.24.57.1`)
   - Para **www** (www.truckbem.com):
     - Tipo: **CNAME**
     - Nome: `www`
     - Valor: algo como `seu-app.onrender.com`

4. No painel **onde você comprou o domínio truckbem.com**, edite os registros DNS conforme o Render pediu (substitua os que forem necessários e salve).

A propagação pode levar de alguns minutos a 48 horas. Depois disso, o Render costuma ativar **HTTPS** automaticamente para esse domínio.

---

## Passo 4 — Garantir que o formulário use o mesmo domínio

O formulário já envia para **`/api/contact`** (caminho relativo). Isso significa:

- Se o usuário abre **`https://truckbem.com`**, o `fetch` vai para **`https://truckbem.com/api/contact`**.
- Não é necessário mudar nada no HTML para “trocar” de ambiente: o mesmo código funciona em desenvolvimento e em produção, desde que o site seja acessado pela URL do servidor Node (no caso, seu domínio após configurado).

Ou seja: **não precisa alterar o domínio no código**. Basta o DNS apontar para o serviço que está rodando o Node.

---

## Passo 5 — E-mail (SMTP) em produção

O backend usa **Nodemailer** com SMTP. Para funcionar em produção:

1. Use um e-mail do **próprio domínio** (ex: `site@truckbem.com`) no `SMTP_USER` e no `MAIL_FROM`.
2. Pegue no painel da sua hospedagem de e-mail (ou onde está o MX do domínio):
   - **Servidor SMTP** → `SMTP_HOST`
   - **Porta** (geralmente 587 ou 465) → `SMTP_PORT`
   - **Usuário** (e-mail completo) → `SMTP_USER`
   - **Senha** do e-mail → `SMTP_PASS`

Exemplos por provedor:

- **Hostinger:** `smtp.hostinger.com`, porta `587`, usuário = e-mail completo.
- **Google Workspace:** `smtp.gmail.com`, porta `587`, ativar “Acesso a app menos seguro” ou usar Senha de app.
- **Outlook/Office 365:** `smtp.office365.com`, porta `587`.

O e-mail de destino do formulário (herik@truckbem.com.br e administrativo@truckbem.com.br) já está definido no código do backend; não precisa configurar isso no DNS.

---

## Resumo rápido

| O que | Onde / Como |
|-------|-------------|
| Código do site + backend | Hospedagem Node (ex: Render) |
| Domínio | DNS do registro (A ou CNAME) apontando para essa hospedagem |
| HTTPS | Habilitado ao adicionar domínio no Render (ou equivalente) |
| Envio de e-mail | Variáveis `SMTP_*` e `MAIL_FROM` no painel da hospedagem |
| Formulário “enviar direto” | Funciona ao acessar o site pela URL do domínio (mesmo código, sem mailto) |

Se você disser **onde comprou o domínio** e **qual provedor de e-mail** vai usar (Hostinger, Google, etc.), dá para detalhar os valores exatos de DNS e do `.env` para o seu caso.
