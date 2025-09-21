import { Router } from 'express'
import prisma from '../prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SignupSchema, SigninSchema } from '../types/index.js'

const authRouter = Router()

authRouter.post('/register', async(req, res)=>{
    
    const parsedData = SignupSchema.safeParse(req.body)

    
    if(!parsedData.success){
        console.log("not parsed ");
        
        return res.status(400).json({message: "Validation Failed"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(parsedData.data.password, salt)

    try {
        const user = await prisma.user.create({
            data: {
                email: parsedData.data.email,
                password: hashedPassword,
                name: parsedData.data.name
            }
        })
        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET!, {expiresIn: '8h'})
        
        res.json({token, user})

    } catch (err: any) {
        if(err.code==='P2002'){
            return res.status(400).json({message: "Username Already Exists!"})
        }

        console.error(err);
        
        res.status(500).json({message: "Internal Server Error" });
    }
})

authRouter.post('/login', async(req, res)=>{
    
    const parsedData = SigninSchema.safeParse(req.body)
    
    if(!parsedData.success){
        return res.status(400).json({message: "Validation Failed"})
    }
 
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: parsedData.data.email
            }
        })

        if(!user) return res.status(404).json({message: "User not found"})

        const isValid = bcrypt.compareSync(parsedData.data.password, user?.password)

        if(!isValid) return res.status(401).json({message: "Invalid Password"})

        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET!, {expiresIn: '8h'})

        res.json({token, user})


    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

export default authRouter