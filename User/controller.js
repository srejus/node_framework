require('dotenv').config();

const User = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUserData = async (req, res) => {
    try {
        const users = await User.findOne({_id:req.user.id});
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const createUser = async (req, res) => {
        try{
        const { username, password, email,phone,fullname } = req.body;
        if (!username || !email || !password || !phone) {
            return res.status(400).json({ error: "All fields are required!" });
        }
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ error: "Email already exists" })
        }

        const userPhoneExists = await User.findOne({phone:phone});
        if(userPhoneExists) {
            return res.status(400).json({error:"User with this phone already exists!"});
        }

        // hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            phone,
            fullname,
            password: hashedPassword
        })
        if (user) {
            return res.status(201).json(user);
        }
    }catch(err){
        res.status(400).json({ message: err.message});
    }


}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await User.findOne({ username: username })
        // compare password with hassed password
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    fullname:user.fullname,
                    phone:user.phone,
                    id: user.id,
                },

            },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            )
            return res.status(200).json({ accessToken: accessToken })
        }
        return res.status(400).json({error:"Incorrect password!"});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    getUserData,
    createUser,
    loginUser
}