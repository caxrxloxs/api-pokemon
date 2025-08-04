import { authConfig } from '../config/auth.js';
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';


export const AuthService = {

    async register({ username, email, password }) {
        try {
            // Verificar si usuario ya existe
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                throw new Error('Usuario o email ya registrado');
            }

            const hashedPassword = await bcrypt.hash(password, authConfig.saltRounds);
            await User.create({ username, email, password: hashedPassword });
            return { success: true };
        } catch (error) {
            throw error;
        }
    },

    async login({ email, password }) {
        try {
            const user = await User.findOne({ email });
            if (!user) return null;

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return null;

            const token = jwt.sign(
                {
                    sub: user._id,
                    username: user.username
                },
                authConfig.jwtSecret,
                {
                    expiresIn: authConfig.expiresIn
                }
            );

            return {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            };
        } catch (error) {
            throw error;
        }
    }
};