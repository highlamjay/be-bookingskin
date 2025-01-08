const User = require("../models/user");
const bcrypt = require("bcryptjs");


//register controller
const registerUser = async (req, res) => {
    try {
        const {username, email, password, confirmPassword, role} = req.body;
        
        //check user exist
        const checkExistingUser = await User.findOne({$or: [{username}, {email}]});

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists !'
            })
        }

        //check password with confirm password
        const checkPassword = password === confirmPassword;

        if (!checkPassword){
            return res.status(400).json({
                success: false,
                message: 'Password and confirm password do not match !'
            })
        }

        //hash passowrd
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //create new user
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashPassword,
            role: role || 'user'
        });

        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            return res.status(200).json({
                success: true,
                message: 'User created successfully !',
                data: newlyCreatedUser
            })
        } else {
            return res.status(400).json({
                success: false,
                message: 'Unable to register user ! Please try again !',
                data: newlyCreatedUser
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
};

//login controller
const loginUser = async (req, res) => {
    try {
        con
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
};

module.exports = {
    registerUser,
    loginUser
}