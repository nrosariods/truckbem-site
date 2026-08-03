const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

// Criar transportador SMTP
const transporter = nodemailer.createTransport({
  host: requireEnv('SMTP_HOST'),
  port: Number(requireEnv('SMTP_PORT')),
  secure: process.env.SMTP_SECURE === 'true' || Number(requireEnv('SMTP_PORT')) === 465,
  auth: {
    user: requireEnv('SMTP_USER'),
    pass: requireEnv('SMTP_PASS')
  },
  logger: true,
  debug: true
});

// Testar conexão
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ ERRO NA CONEXÃO:');
    console.log(error);
  } else {
    console.log('✅ Conexão bem-sucedida!');
    console.log('Servidor pronto para enviar emails');
    
    // Se a conexão funcionou, enviar email de teste
    enviarEmailTeste();
  }
});

async function enviarEmailTeste() {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM || requireEnv('SMTP_USER'),
      to: requireEnv('MAIL_TO').split(',').map((v) => v.trim()).filter(Boolean),
      subject: 'Teste SMTP - Diagnóstico TruckBem',
      html: `
        <h2>Email de Teste</h2>
        <p>Este é um email de teste direto do servidor SMTP.</p>
        <p>Se você recebeu este email, a conexão SMTP está funcionando!</p>
        <p><strong>Horário:</strong> ${new Date().toLocaleString('pt-BR')}</p>
      `,
      text: 'Email de teste'
    };

    console.log('\n📧 Tentando enviar email...\n');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ EMAIL ENVIADO COM SUCESSO!');
    console.log('Response ID:', info.response);
    process.exit(0);
  } catch (error) {
    console.log('❌ ERRO AO ENVIAR EMAIL:');
    console.log(error.message);
    console.log('\nDetalhes completos:');
    console.log(error);
    process.exit(1);
  }
}