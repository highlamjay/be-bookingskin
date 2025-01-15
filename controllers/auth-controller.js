const User = require("../models/User");
const Image = require('../models/Image');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper')

//register controller
const registerUser = async (req, res, next) => {
    try {
        const {name, username, email, password, confirmPassword, role} = req.body;
        
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
            name,
            username,
            email,
            password: hashPassword,
            role: role || 'user'
        });

        await newlyCreatedUser.save();

        next();
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
        const {email, password} = req.body;
        
        //check user exist
        const user = await User.findOne({email});

        if(!user || !user.isVerified){
            return res.status(400).json({
                success: false,
                message: 'User not found ! Please try again !'
            })
        }

        //check password
        const checkPassword = await bcrypt.compare(password, user.password);

        if(!checkPassword){
            return res.status(400).json({
                success: false,
                message: 'Password is incorrect ! Please try again !'
            })
        }

        //create access token
        const token = jwt.sign({
            id: user._id, 
            username: user.username, 
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: '15m'
        });

        //create refresh token
        const refreshToken = jwt.sign({
            id: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d'
        });

        //sace refresh token in cookie
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully !',
            token: token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
};

//logout controller
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//change password controller
const changePasswordUser = async (req, res) => {
    try {
        const { password, newPassword, confirmPassword} = req.body;
        const userId = req.params.id;

        //check user exist
        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User not found ! Please try again !'
            })
        }

        //check password
        const checkPassword = await bcrypt.compare(password, user.password);

        if(!checkPassword){
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect ! Please try again !'
            })
        }

        //check new password with confirm password
        const checkNewPassword = newPassword === confirmPassword;

        if(!checkNewPassword){
            return res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match ! Please try again !'
            })
        }

        //hash new password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        //update password
        await User.findByIdAndUpdate(
            userId, 
            {password: hashPassword},
            {new: true}
        );

        res.status(200).json({
            success: true,
            message: 'Password changed successfully !'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
};

//forgot password controller
const forgotPasswordUser = async (req, res) => {
    try {
        const { newPassword, confirmPassword} = req.body;
        const email = req.query.email;

        //check user exist
        const user = await User.findById(email);

        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User not found ! Please try again !'
            })
        }

        //check new password with confirm password
        const checkNewPassword = newPassword === confirmPassword;

        if(!checkNewPassword){
            return res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match ! Please try again !'
            })
        }

        //hash new password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        //update password
        await User.findByIdAndUpdate(
            userId, 
            {password: hashPassword},
            {new: true}
        );

        res.status(200).json({
            success: true,
            message: 'Password changed successfully !'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
};

//fetch detail controller
const fetchDetailUser = async (req, res) => {
    try {
        const ussrId = req.params.id;

        //check user exist
        const user = await User.findById(ussrId);

        if(!user){
            return res.status(400).json({
                success: false,
                message: 'User not found ! Please try again !'
            })
        }

        res.status(200).json({
            success: true,
            message: 'User found !',
            data: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
}

//fetch all user 
const fetchAllUser = async (req, res) => {
    try {
        const users = await User.find();
        if(!users){
            return res.status(400).json({
                success: false,
                message: 'Users not found ! Please try again !'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Users found !',
            data: users
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
}

//upload avatar user
const uploadAvatarUser = async (req, res) => {
    try {
        //check if file is missing in req object
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: 'File not found ! Please try again !'
            })
        }

        const {url, publicId}= await uploadToCloudinary(req.file.path)

        //create new image in db
        const newImage = new Image({
            url,
            publicId,
            uploadBy: req.user.id
        })

        await newImage.save();

        //update image in user
        const user = await User.findById(req.user.id);

        user.image = url;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Avatar uploaded successfully !',
            data: user
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error ! Please try again !'
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    changePasswordUser,
    forgotPasswordUser,
    fetchDetailUser,
    fetchAllUser,
    uploadAvatarUser
}