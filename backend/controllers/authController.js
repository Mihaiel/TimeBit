import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { validateUserInput } from '../utils/validateUserInput.js';
import { config } from '../config/env.js';
import { OAuth2Client } from 'google-auth-library';

const normalizeEmail = (email) => email.trim().toLowerCase();

// REGISTER
export const register = async (req, res) => {
    const { first_name, last_name, email, password, confirm_password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const validationError = validateUserInput({ first_name, last_name, email: normalizedEmail, password, confirm_password }, true);
    if (validationError) {
        return res.status(400).json({ success: false, message: validationError });
    }

    try {
        const existingUser = await User.findOne({ where: { email: normalizedEmail } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'E-Mail already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ first_name, last_name, email: normalizedEmail, password: hashedPassword });

        return res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate access token
        const token = jwt.sign(
            { userId: user.id },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            { userId: user.id },
            config.jwtSecret,
            { expiresIn: '7d' }
        );

        return res.json({ 
            success: true, 
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    
    try {
        const decoded = jwt.verify(refreshToken, config.jwtSecret);
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Generate new access token
        const newToken = jwt.sign(
            { userId: user.id },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        return res.json({ 
            success: true, 
            token: newToken 
        });
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid refresh token' 
        });
    }
};

// LOGOUT
export const logout = async (req, res) => {
    try {
        return res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error during logout' 
        });
    }
};

// GET GOOGLE CLIENT ID
export const getGoogleClientId = (req, res) => {
    res.json({ clientId: config.googleClientId });
};

// GOOGLE AUTH
export const googleAuth = async (req, res) => {
    const { token } = req.body;
    const client = new OAuth2Client(config.googleClientId);

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: config.googleClientId
        });

        const payload = ticket.getPayload();
        const { email, given_name: first_name, family_name: last_name, picture } = payload;
        const normalizedEmail = normalizeEmail(email);

        // Check if user exists
        let user = await User.findOne({ where: { email: normalizedEmail } });

        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                email: normalizedEmail,
                first_name,
                last_name,
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for Google users
                profile_picture: picture
            });
        }

        // Generate access token
        const accessToken = jwt.sign(
            { userId: user.id },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        // Generate refresh token
        const refreshToken = jwt.sign(
            { userId: user.id },
            config.jwtSecret,
            { expiresIn: '7d' }
        );

        return res.json({
            success: true,
            token: accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                profilePicture: user.profile_picture
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        return res.status(401).json({
            success: false,
            message: 'Google authentication failed'
        });
    }
};