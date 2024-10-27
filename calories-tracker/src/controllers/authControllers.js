const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schema/User');
require('dotenv').config();

const checkIfUserExist = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        console.log(user);

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
 
    let BMR = 0;

    if(gender === 'Male'){
        BMR = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }else {
        BMR = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    if(activeLevel === 1){
        BMR *= 1.2;
    }else if(activeLevel === 2){
        BMR *= 1.55;
    }else if(activeLevel === 3){
        BMR *= 1.725;
    }

    if(goal === "Weight Loss"){
        BMR -= 500;
    }else if(goal === "Weight Gain"){
        BMR += 500;
    }

    BMR = Math.round(BMR);

    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, passwordHash, gender, age, height, weight, activeLevel, goal, BMR});
        await newUser.save();

        return res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error registering user', error });
    }

}

const login = async (req, res) => {
    const { formData } = req.body;
    const {email, password} = formData;

    try {
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({message: 'Email is not existed'});
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if(!isMatch){
            return res.status(500).json({message: 'Incorrect password'});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d', 
        });

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                gender: user.gender,
                age: user.age,
                height: user.height,
                weight: user.weight,
                activeLevel: user.activeLevel,
                goal: user.goal
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Login fail!"});
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token Expired'})
        }

        console.error('Error fetching current user: ', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { checkIfUserExist, signUp, login, getCurrentUser };