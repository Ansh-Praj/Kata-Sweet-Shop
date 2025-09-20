import type { Request, Response, NextFunction } from "express"
import type { UserRole } from "@prisma/client"
import  jwt  from "jsonwebtoken"

export const adminAuthenticate = ((req: Request, res: Response, next: NextFunction)=>{
    const token = req.headers.authorization?.split(" ")[1]

    if(!token) return res.status(401).json({message: "Missing token"})

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id: string, role: UserRole}
        req.userId = decoded.id
        req.role = decoded.role
        if(decoded.role !== "ADMIN") return res.status(403).json({message: "You are not authorized"})
            
        next()
    }
    catch(e){
        res.status(403).json({message: "Unauthorized"})
        return
    }
})



// As normal request object doesn't have userId or role property we tell TS that it has this property
declare global {
    namespace Express {
      export interface Request {
        userId: string;
        role: UserRole;
      }
    }
}