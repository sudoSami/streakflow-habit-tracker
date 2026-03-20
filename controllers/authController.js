const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

const signup = async (req,res) => {
    const {name, email, password} = req.body;

    const existingUser = await User.findOne({email});
    if (existingUser){
        throw new AppError('Email already in use', 400)
    }

    const user = await User.create({name, email, password})
    const token = generateToken(user._id);

    res.status(201).json({
        status: 'success',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })

}

const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if (!user) throw new AppError('User not found', 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('Invalid Credentials', 400);

    const token = generateToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    })
}

const getMe = async (req, res) => {
    const user = await User.findById(req.user).select('-password');

    res.status(200).json({
        status: 'success',
        user
    })
}

module.exports = {signup, login, getMe}