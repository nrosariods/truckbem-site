# Site TruckBem + Formulário com envio direto (SMTP)

Este projeto é um site estático (`truckbem.html`) servido por um backend Node.js (Express) para permitir que o formulário envie e-mails **automaticamente**, sem abrir o provedor do usuário.

## Configuração

1. Copie o arquivo `.env.example` para `.env`
2. Preencha as credenciais SMTP no `.env`

Exemplo (valores ilustrativos):

```
SMTP_HOST=smtp.seuprovedor.com
SMTP_PORT=587
SMTP_USER=usuario
SMTP_PASS=senha
MAIL_FROM=TruckBem Site <site@truckbem.com>
MAIL_TO=administrativo@truckbem.com.br,herik@truckbem.com.br
PORT=3000
```

## Rodar localmente

No terminal, na pasta do projeto:

```
npm install
npm run dev
```

Abra no navegador:

- `http://localhost:3000`

O formulário irá enviar para:

- `herik@truckbem.com.br`
- `administrativo@truckbem.com.br`

com assunto fixo **"Orçamento de Frete - Site"**.

## Hospedagem

Para funcionar em produção, hospede como **app Node.js** (não apenas “site estático”), pois o endpoint `/api/contact` precisa estar online.

