const Joi = require('joi');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//to register a user
//to login a user
// logout

const registerSchema = Joi.object({
    name : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required()
})

const loginSchema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(6).required(),
})

const generateToken = (getId) => {
    return jwt.sign({getId}, 'DEFAULT_SECRET_KEY', {
        expiresIn : 3*24*60*60,
    })
}

const registerUser = async(req,res,next) => {
    const { name,email,password } = await req.body;
    const { error } = registerSchema.validate({ name, email, password });

    if(error) {
        return res.status(400).json({
            success : false, message : error.details[0].message
        })
    }

    try {
        const isUserEmailAlreadyExists = await User.findOne({email});
        if(isUserEmailAlreadyExists){
            return res.status(400).json({
                success : false, 
                message : 'User email already exists! Please try with different email' 
            })
        } else {
            const hashPassword = await bcrypt.hash(password, 12);
            const newlyCreateduser = await User.create({
                name, 
                email, 
                password : hashPassword,
            });

            if(newlyCreateduser) {
                const token = generateToken(newlyCreateduser?._id)
              
                res.cookie('token', token, {
                    withCredentials : true,
                    httpOnly: false
                }) 
                res.status(201).json({
                    success : true,
                    message : 'User registration successful',
                    userData : {
                        name: newlyCreateduser.name,
                        email: newlyCreateduser.email,
                        _id : newlyCreateduser._id,
                    }
                });
                next();
            }
        }
    } catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Please try again',
        });
    }
}

const loginUser = async(req,res,next)=>{
    const { email,password } = await req.body;
    const { error } = loginSchema.validate({ email, password });

    if(error) {
        return res.status(400).json({
            success : false, message : error.details[0].message
        })
    }

    try {
        const getUser = await User.findOne({email});
        if(!getUser) {
            return res.json({
                message : 'Incorrect Email',
                success : false,
            })
        }
    
        const checkAuth = await bcrypt.compare(password, getUser.password)
        if(!checkAuth) {
            return res.json({
                message : 'Incorrect Password',
                success : false,
            })
        }
    
        const token = generateToken(getUser?._id);
    
        res.cookie('token', token, {
            withCredentials : true,
            httpOnly: false
        });
    
        res.status(201).json({
            success : true,
            message : 'User logged in',
        })
        next();
    } catch(e) {
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Something went wrong! Please try again',
        });
    }
}

const logout = async (req,res) => {
    res.cookie('token', "", {
        withCredentials : true,
        httpOnly : false,
    });
    return res.status(200).json({
        success : true,
        message : 'Logout successfully',
    });
}

module.exports = { registerUser, loginUser, logout } 