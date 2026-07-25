const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const AppError = require('../utils/AppError')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

// User SignUp

userSchema.statics.signup = async function(username, email, password) {
    // validation
    if(!username || !email || !password) {
        throw new AppError('All fields must be filled', 400)
    }

    if (username.length < 3) {
        throw new AppError('Username must be at least 3 character long', 400)
    }

    if (!validator.isEmail(email)) {
        throw new AppError('Invalid Email', 400)
    }

    if (!validator.isStrongPassword(password)) {
        throw new AppError('Password not strong enough', 400)
    }

    const existingUser = await this.findOne({ $or: [{email}, {username}] })

    if (existingUser) {
        if (existingUser.email == email) {
            throw new AppError("Email already in use", 409)
        }

        if (existingUser.username == username) {
            throw new AppError("Username Already Taken", 409)
        }
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ username, email, password: hash })

    return user
}

userSchema.statics.login = async function (identifier, password) {
    if (!identifier || !password) {
        throw new AppError("All fields must be filled", 400)
    }

    const user = await this.findOne({
        $or: [ { email: identifier }, { username: identifier }]
    })

    if (!user) {
        throw new AppError('Invalid Username or email', 401)
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match) {
        throw new AppError('Incorrect Password', 401)
    }

    return user
}

module.exports = mongoose.model('User', userSchema)
