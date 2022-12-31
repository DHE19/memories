import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'


export const logIn = async (req,res) =>{
    const {email,password} = req.body;
    try {
        const existingUser = await User.findOne({email});
        
        if(!existingUser) return res.status(404).json({message:'User doesnt exist'})

        console.log('estos son los datos del posible usuario',existingUser);

        const isPasswordTrue = await bcrypt.compare(password,existingUser.password);

        if(!isPasswordTrue) return res.status(400).json({message:'invalid credentials'});

         const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SCRET, { expiresIn: "1h" });

        res.status(200).json({result:existingUser, token});


    } catch (error) {
        res.status(500).json(error);
    }
}
export const signUp = async (req,res) =>{
    const {email,password,name} = req.body;

    try {
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(404).json({message:'this account already was created'})

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await User.create({email,name,password:hashedPassword});

        const token = jwt.sign({email:result.email, id:result._id}, process.env.JWT_SCRET,{expiresIn:'1h'});

        res.status(200).json({result, token});

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}