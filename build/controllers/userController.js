"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.loginUser = exports.registerUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_validator_1 = require("express-validator");
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socket_1 = require("../socket");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const io = yield (0, socket_1.getSocketIO)();
        // Validate request body
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { fullname, email, password } = req.body;
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Check if the email is already registered
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        // Create a new user
        const newUser = new userModel_1.default({ fullname, email, password: hashedPassword });
        const savedUser = yield newUser.save();
        io.emit('userRegistered', { message: 'New user registered', user: savedUser });
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const io = yield (0, socket_1.getSocketIO)();
        // Validate request body
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        // Find the user by email
        const user = yield userModel_1.default.findOne({ email });
        // Check if the user exists
        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        // Compare passwords
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        const secretKey = process.env.SECRET;
        if (!secretKey) {
            throw new Error('SECRET key is not provided');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, secretKey, { expiresIn: '5h' });
        // remove password field from user object 
        const userWithoutPassword = Object.assign(Object.assign({}, user.toObject()), { password: undefined });
        // Emit Socket.IO event to notify cusers about the logged-in user
        io.emit('loggedin', { message: 'This user has logged in', user: userWithoutPassword });
        res.status(200).json({ message: 'Login successful', user: userWithoutPassword, token });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.loginUser = loginUser;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.logout = logout;
