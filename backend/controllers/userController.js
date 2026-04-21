import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "../utils/statusCodes.js";

export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Fill all the fields");
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
        
    const user = await User.create({
        name,
        email, 
        password: hashedPassword
    })

    const token = generateToken(user._id);

    res.json({
        id: user._id,
        name,
        email,
        role: user.role,
        token
    })
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Fill all the fields");
    }

    const user = await User.findOne({email});
    if(!user){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("User doesn't exists");
    }

    if(!(await bcrypt.compare(password, user.password))){
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("Incorrect Credenitials");
    }

    const token = generateToken(user._id);

    res.json({
        id: user._id,
        name: user.name,
        email,
        role: user.role,
        token
    })
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
};
