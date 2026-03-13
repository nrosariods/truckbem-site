# O que fazer agora para publicar o site

Siga estes passos em ordem. O projeto está pronto; falta só hospedar e apontar o domínio.

---

## 1. Colocar o código na nuvem (Git)

Para a maioria das hospedagens você precisa de um repositório Git (GitHub ou GitLab).

- Se ainda não tiver:
  - Crie uma conta em [github.com](https://github.com).
  - Instale o [Git](https://git-scm.com) no PC.
- Na pasta do projeto (`Site_Truckbem`), abra o terminal e rode:

```bash
git init
git add .
git commit -m "Site TruckBem pronto para produção"
```

- Crie um repositório novo no GitHub (sem README, vazio).
- Conecte e envie:

```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git branch -M main
git push -u origin main
```

(O `.env` não será enviado porque está no `.gitignore`.)

---

## 2. Escolher hospedagem Node e fazer o deploy

Recomendação: **Render** (tem plano gratuito).

1. Acesse [render.com](https://render.com) e crie uma conta.
2. **New** → **Web Service**.
3. Conecte seu repositório do GitHub (autorize o Render a acessar o repo).
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Clique em **Advanced** e em **Environment** adicione estas variáveis (use os mesmos valores do seu `.env`):

| Nome | Valor |
|------|--------|
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `site@truckbem.com` |
| `SMTP_PASS` | *(a senha do e-mail site@truckbem.com)* |
| `MAIL_FROM` | `Site TruckBem <site@truckbem.com>` |
| `MAIL_TO` | `administrativo@truckbem.com.br,herik@truckbem.com.br` |

6. Clique em **Create Web Service**. O Render vai buildar e subir o site. Anote a URL que ele der (ex.: `https://site-truckbem.onrender.com`).

---

## 3. Apontar o domínio truckbem.com

1. No Render, no seu Web Service: **Settings** → **Custom Domain**.
2. Adicione **truckbem.com** e, se quiser, **www.truckbem.com**.
3. O Render vai mostrar o que colocar no DNS (geralmente um registro **A** com um IP e/ou **CNAME** para o www).
4. Onde você gerencia o domínio truckbem.com (Registro.br, Hostinger, GoDaddy, etc.):
   - Abra a área de **DNS** / **Gerenciar DNS**.
   - Crie ou edite os registros **exatamente** como o Render indicar.
   - Salve e aguarde a propagação (alguns minutos até 48 horas).

Depois disso, o Render costuma ativar **HTTPS** automaticamente para truckbem.com.

---

## 4. Conferir que está tudo certo

1. Abra **https://truckbem.com** (ou a URL do Render enquanto o DNS não propaga).
2. Navegue pelo site (hero, serviços, frota, contato).
3. Preencha o formulário de contato e envie.
4. Verifique se o pop-up “Mensagem enviada” aparece e se o e-mail chegou em **administrativo@truckbem.com.br** e **herik@truckbem.com.br**.

Se tudo isso funcionar, o site está publicado e o formulário enviando corretamente.

---

## Resumo em 4 passos

| # | Ação |
|---|------|
| 1 | Subir o código para o GitHub (git init, add, commit, remote, push). |
| 2 | Criar um Web Service no Render (ou outra hospedagem Node), conectar o repo e configurar as variáveis de ambiente (SMTP e MAIL_*). |
| 3 | No Render, adicionar o domínio truckbem.com e, no painel do domínio, configurar o DNS como o Render pedir. |
| 4 | Abrir https://truckbem.com e testar o site e o formulário. |

Documentação mais detalhada: **DEPLOY.md** e **CHECKLIST-DEPLOY.md**.
