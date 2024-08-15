const User = require("../models/user.model")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")

// Get all users
// route GET /users
// @access private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

// Create new user
// route POST /users
// @access private
const createNewUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body

    // Confirm data
    if (!userName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate userName and email
    const duplicateUserName = await User.findOne({ userName }).lean().exec()
    if (duplicateUserName) {
        return res.status(400).json({ message: 'userName already exists' })
    }

    const duplicateEmail = await User.findOne({ email }).lean().exec()
    if (duplicateEmail) {
        return res.status(400).json({ message: 'Email already exists' })
    }

    const userRecord = await Admin.auth().createUser({
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled: false
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10) //10 salts
    const userObject = { userName, "password": hashedPassword, email, firebase: userRecord.uid };

    // Create and store new user
    const user = await User.create(userObject)
    if (user) {
        res.status(201).json({ message: `New user ${userName} has been created` })
    } else {
        res.status(400).json({ message: 'Invalid user data was received' })
    }
})

// Update user
// route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
    const { id, userName, email, password } = req.body

    // Confirm data
    if (!id || !userName || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User Not Found' })
    }

    // Check for duplicates
    const duplicate = await User.findOne({ userName }).lean().exec()
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate userName' })
    }

    user.userName = userName
    user.email = email

    if (password) {
        // Hash password again
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.userName} updated` })
})

// Delete user
// route DELETE /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User Not Found' })
    }
    const username = user.userName
    const Id = user._id

    const result = await user.deleteOne()
    const reply = `Username ${username} with id ${Id} was deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}
