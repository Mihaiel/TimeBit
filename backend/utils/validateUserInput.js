export const validateUserInput = (data, checkPasswordConfirmation = false) => {
    const { first_name, last_name, email, password, confirm_password } = data;

    if (!first_name || !last_name || !email || !password || (checkPasswordConfirmation && !confirm_password)) {
        return 'All fields are required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Invalid email format.';
    }

    if (checkPasswordConfirmation && password !== confirm_password) {
        return 'The passwords need to match.';
    }

    for (const key in data) {
        if (data[key] && data[key].length > 255) {
            return `${key} must be 255 characters or fewer.`;
        }
    }

    return null;
};
