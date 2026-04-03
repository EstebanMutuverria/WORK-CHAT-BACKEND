/**
 * @fileoverview Helper para generar las plantillas HTML de correos electrónicos y páginas de estado.
 * Proporciona un diseño cohesivo y profesional alineado con la estética de WorkChat.
 */

/**
 * Genera el HTML para un correo electrónico con diseño responsivo.
 * @param {string} title - El título principal del cuerpo del correo.
 * @param {string} message - El mensaje descriptivo.
 * @param {string} buttonText - Texto que aparecerá dentro del botón de acción.
 * @param {string} buttonLink - URL a la que redirigirá el botón.
 * @returns {string} HTML completo del correo.
 */
export const getEmailTemplate = (title, message, buttonText, buttonLink) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e1e4e8; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
        .header { background-color: #4A154B; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 40px; color: #1d1c1d; line-height: 1.6; }
        .content h2 { margin-top: 0; color: #1d1c1d; font-size: 22px; font-weight: 700; }
        .content p { margin-bottom: 24px; color: #454245; font-size: 16px; }
        .btn-container { text-align: center; margin-top: 32px; }
        .btn { display: inline-block; background-color: #4A154B !important; color: #ffffff !important; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; transition: background-color 0.2s; }
        .btn:hover { background-color: #611f69 !important; }
        .footer { padding: 20px 40px; background-color: #f8f9fa; border-top: 1px solid #e1e4e8; text-align: center; font-size: 12px; color: #7d7d7d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>WorkChat</h1>
        </div>
        <div class="content">
            <h2>${title}</h2>
            <p>${message}</p>
            <div class="btn-container">
                <a href="${buttonLink}" class="btn">${buttonText}</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 WorkChat. Todos los derechos reservados.</p>
            <p>Si no reconoces esta acción, puedes ignorar este correo de forma segura.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Genera el HTML para una página de estado (éxito o error).
 * @param {boolean} isSuccess - Define si es una página de éxito (true) o error (false).
 * @param {string} title - Título de la página.
 * @param {string} message - Mensaje informativo.
 * @param {string} buttonText - Texto del botón.
 * @param {string} buttonLink - Enlace del botón.
 * @returns {string} HTML completo de la página.
 */
export const getStatusPage = (isSuccess, title, message, buttonText, buttonLink) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WorkChat - ${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #4A154B 0%, #2D0E2E 100%); color: white; padding: 20px; }
        .card { background: white; padding: 48px; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center; color: #1d1c1d; max-width: 440px; width: 100%; box-sizing: border-box; }
        .icon { width: 80px; height: 80px; background: ${isSuccess ? '#2bac76' : '#e01e5a'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 32px; box-shadow: 0 8px 16px ${isSuccess ? 'rgba(43, 172, 118, 0.2)' : 'rgba(224, 30, 90, 0.2)'}; }
        .icon svg { width: 40px; height: 40px; fill: white; }
        h1 { font-size: 28px; margin-bottom: 16px; font-weight: 800; color: #1d1c1d; letter-spacing: -0.5px; }
        p { color: #616061; line-height: 1.6; margin-bottom: 32px; font-size: 16px; }
        .btn { background: #4A154B; color: white !important; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: inline-block; transition: all 0.2s; cursor: pointer; width: 100%; box-sizing: border-box; font-size: 16px; }
        .btn:hover { background: #611f69; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(74, 21, 75, 0.3); }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">
            ${isSuccess
        ? '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'}
        </div>
        <h1>${title}</h1>
        <p>${message}</p>
        <a href="${buttonLink}" class="btn">${buttonText}</a>
    </div>
</body>
</html>
`;

/**
 * Genera el HTML para la página de restablecimiento de contraseña.
 * @param {string} token - Token de validación para el cambio de contraseña.
 * @param {string} [errorMsg=''] - Mensaje de error opcional a mostrar.
 * @returns {string} HTML completo del formulario.
 */
export const getResetPasswordPage = (token, errorMsg = '') => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WorkChat - Restablecer Contraseña</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #4A154B 0%, #2D0E2E 100%); color: white; padding: 20px; }
        .card { background: white; padding: 48px; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); color: #1d1c1d; max-width: 440px; width: 100%; box-sizing: border-box; }
        h1 { font-size: 28px; margin-bottom: 8px; font-weight: 800; color: #1d1c1d; letter-spacing: -0.5px; text-align: center; }
        p { color: #616061; line-height: 1.6; margin-bottom: 32px; font-size: 15px; text-align: center; }
        .form-group { margin-bottom: 20px; text-align: left; }
        label { display: block; margin-bottom: 8px; font-weight: 600; color: #1d1c1d; font-size: 14px; }
        input { width: 100%; padding: 14px; border: 2px solid #e1e4e8; border-radius: 8px; font-size: 16px; box-sizing: border-box; transition: border-color 0.2s; font-family: inherit; }
        input:focus { outline: none; border-color: #4A154B; }
        .btn { background: #4A154B; color: white !important; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: block; transition: all 0.2s; cursor: pointer; width: 100%; box-sizing: border-box; font-size: 16px; margin-top: 32px; }
        .btn:hover { background: #611f69; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(74, 21, 75, 0.3); }
        .error { color: #e01e5a; font-size: 14px; margin-top: 12px; text-align: center; font-weight: 600; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Restablecer contraseña</h1>
        <p>Escribe tu nueva contraseña a continuación.</p>
        <form action="/api/auth/reset-password/${token}" method="POST" id="reset-form">
            <div class="form-group">
                <label for="password">Nueva contraseña</label>
                <input type="password" id="password" name="password" required placeholder="Mínimo 6 caracteres" minlength="6">
            </div>
            <div class="form-group">
                <label for="confirm_password">Confirmar contraseña</label>
                <input type="password" id="confirm_password" required placeholder="Repite tu contraseña">
            </div>
            ${errorMsg ? `<div class="error">${errorMsg}</div>` : ''}
            <button type="submit" class="btn">Cambiar contraseña</button>
        </form>
        <script>
            document.getElementById('reset-form').addEventListener('submit', function(e) {
                const p1 = document.getElementById('password').value;
                const p2 = document.getElementById('confirm_password').value;
                if (p1 !== p2) {
                    e.preventDefault();
                    alert('Las contraseñas no coinciden');
                }
            });
        </script>
    </div>
</body>
</html>
`;
