import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const userAuthenticate = ((req: Request, res: Response, next: NextFunction)=>{
    const token = req.headers.authorization?.split(" ")[1]
    console.log("token", token);
    
    if(!token){
        return res.status(401).json({message: "Missing token"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id: string}
        req.userId = decoded.id
        next()
    }
    catch(e){
        return res.status(403).json({message: "Unauthorized"})
    }


})
