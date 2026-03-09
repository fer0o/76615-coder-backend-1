const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendResetPasswordEmail = async ({ to, resetLink }) => {
    return transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to,
        subject: "Recuperación de contraseña - FutbolStore",
        html: `
            <h2>Recuperación de contraseña</h2>
            <p>Haz clic en el botón para restablecer tu contraseña.</p>
            <p>Este enlace expira en 1 hora.</p>
            <a
                href="${resetLink}"
                style="display:inline-block;padding:10px 16px;background:#1e3a8a;color:#fff;text-decoration:none;border-radius:6px;"
            >
                Restablecer contraseña
            </a>
        `,
    });
};

module.exports = { sendResetPasswordEmail };
