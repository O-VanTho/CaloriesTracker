const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schema/User');

const SECRET_KEY = 'VanThoSecretKeyHere';

const checkIfUserExist = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            return res.status(200).json({ exists: true, message: 'User already exists' });
        } else {
            return res.status(200).json({ exists: false, message: 'Email available' });
        }
    } catch (error) {
        return res.status(500).json({ error: "Error check user" });
    }
}

const signUp = async (req, res) => {
    const { formData, userInfo } = req.body;
    const { email, password } = formData;
    const { username, gender, age, height, weight, activeLevel, goal } = userInfo;

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, passwordHash, gender, age, height, weight, activeLevel, goal });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }

}

module.exports = { checkIfUserExist, signUp };