// routes/register.js
import db from '../config/db.js';
import bcrypt from 'bcrypt';

// Register route
export const register = async (req, res) => {
    const { first_name, last_name, email, password, confirm_password } = req.body;
    const data = { first_name, last_name, email, password, confirm_password };

    // Check if any of the fields are empty
    if (!first_name || !last_name || !email || !password || !confirm_password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if the passwords are the same
    if(password !== confirm_password){
        return res.status(400).json({ success: false, message: 'The passwords need to match.' });
    }

    // Check if the values are below 255 (the maximum allowed in the database)
    for (const key in data) {
        if (data[key].length > 255) {
            return res.status(400).json({ success: false, message: `${key} must be 255 characters or fewer.` });
        }
    }

    try {
    // Check if the email already exists
    const [existingUser] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    // If there's already a registered E-Mail
    if (existingUser.length > 0) {
      return res.status(400).json({ success: false, message: 'E-Mail already taken.' });
    }

    // 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into database
    await db.execute(
        'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword]
      );
    res.status(201).json({ success: true, message: 'User registered successfully!' });

    } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

export default register;