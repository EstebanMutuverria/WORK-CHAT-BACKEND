//Valida que el email tenga formato de email

function valid_email_format(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export default valid_email_format


