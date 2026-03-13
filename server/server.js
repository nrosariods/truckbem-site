const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: ['https://truckbem.com', 'https://www.truckbem.com', 'http://localhost:3000', 'http://127.0.0.1:3000'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '250kb' }));

// Serve site estático (truckbem.html, imagens, etc.)
app.use(express.static(path.resolve(__dirname, '..')));

// Rate limit: 5 envios por IP a cada 24h (apenas para /api/contact)
const contactRateLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  handler: (req, res) => {
    res.status(429).json({ ok: false, error: 'Muitos envios. Tente novamente em 24 horas.' });
  }
});

function requireEnv(name) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

function normalize(value) {
  return String(value ?? '').trim();
}

function sanitizeMultiline(value) {
  return normalize(value).replace(/\r\n/g, '\n');
}

app.post('/api/contact', contactRateLimit, async (req, res) => {
  try {
    const name = normalize(req.body?.name);
    const email = normalize(req.body?.email);
    const phone = normalize(req.body?.phone);
    const company = normalize(req.body?.company);
    const message = sanitizeMultiline(req.body?.message);

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ ok: false, error: 'Campos obrigatórios ausentes.' });
    }

    const mailToRaw = requireEnv('MAIL_TO');
    const to = mailToRaw.split(',').map((e) => e.trim()).filter(Boolean);
    if (to.length === 0) {
      return res.status(500).json({ ok: false, error: 'MAIL_TO não configurado.' });
    }

    const subject = 'Novo contato recebido pelo site TruckBem';

    const dataAtual = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    const companyDisplay = company || '-';

    const text = [
      'Novo contato recebido pelo site TruckBem',
      '',
      `Nome: ${name}`,
      `Email: ${email}`,
      `Telefone: ${phone}`,
      `Empresa: ${companyDisplay}`,
      '',
      'Mensagem:',
      message,
      '',
      '---',
      '',
      'Este e-mail foi enviado automaticamente pelo formulário do site:',
      'https://truckbem.com.br',
      '',
      `Data: ${dataAtual}`
    ].join('\n');

    const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const html = [
      '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>',
      '<table style="font-family:sans-serif;max-width:600px;"><tr><td>',
      '<h2>Novo contato recebido pelo site TruckBem</h2>',
      `<p><strong>Nome:</strong> ${escapeHtml(name)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      `<p><strong>Telefone:</strong> ${escapeHtml(phone)}</p>`,
      `<p><strong>Empresa:</strong> ${escapeHtml(companyDisplay)}</p>`,
      '<p><strong>Mensagem:</strong></p>',
      `<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      '<hr>',
      '<p>Mensagem enviada pelo formulário do site<br>https://truckbem.com.br</p>',
      '</td></tr></table>',
      '</body></html>'
    ].join('');

    const host = requireEnv('SMTP_HOST');
    const port = Number(requireEnv('SMTP_PORT'));
    const user = requireEnv('SMTP_USER');
    const pass = requireEnv('SMTP_PASS');
    const from = requireEnv('MAIL_FROM');
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      replyTo: email
    });

    console.log('E-mail enviado:', { messageId: info.messageId, to });
    return res.json({ ok: true });
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err.message || err);
    return res.status(500).json({ ok: false, error: 'Falha ao enviar e-mail.' });
  }
});

// Entrada padrão (para hospedagem simples)
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'truckbem.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

