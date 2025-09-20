import { Router } from "express";
import { userAuthenticate } from "../middleware/user.js";
import { adminAuthenticate } from "../middleware/admin.js";
import prisma from "../prisma.js";
import { SearchSchema, SweetSchema } from "../types/index.js";

const sweetRouter = Router() 

sweetRouter.get('/', userAuthenticate, async(req, res)=>{

    try {
        const sweets = await prisma.sweet.findMany()
        res.json(sweets)
    } catch (error) {
        res.send("Error")
    }


})
sweetRouter.get('/search', userAuthenticate, async(req, res)=>{
    const parsedData = SearchSchema.safeParse(req.query)
    if(!parsedData.success){
        return res.status(400).json({message: "Validation Failed"})
    }
    try {
        const {name, category, startPrice, endPrice} = parsedData.data

        // use filters dynamically only when provided
        const where: any = {}
        if (name && name.trim() !== '') {
            where.name = { contains: name, mode: 'insensitive' }
        }
        if (category && category.trim() !== '') {
            where.category = { contains: category, mode: 'insensitive' }
        }
        if (startPrice != null || endPrice != null) {
            where.price = {
                ...(startPrice != null ? { gte: startPrice } : {}),
                ...(endPrice != null ? { lte: endPrice } : {}),
            }
        }

        const sweets = await prisma.sweet.findMany({ where })
        res.json(sweets)
    } catch (error) {
        console.error("Failed to search sweets:", error)
        res.status(500).json({ message: "Failed to search sweets"})
    }
})

//admin
sweetRouter.post('/', adminAuthenticate, async(req, res)=>{
    const parsedData = SweetSchema.safeParse(req.body)

    if(!parsedData.success){
        return res.status(400).json({message: "Validation Failed"})
    }
    try {
        const {name, price, quantity, category} = parsedData.data
        const sweet = await prisma.sweet.create({
            data: {
                name,
                price: Number(price),
                quantity: Number(quantity),
                category
            }
        })
        res.json({message: `Sweet created successfully`})
    } catch (error) {
        console.error("Failed to create sweet:", error)
        res.status(500).json({ message: "Failed to create sweet"})
    }
}) 
sweetRouter.put('/:id', adminAuthenticate, async(req, res)=>{
    const parsedData = SweetSchema.safeParse(req.body)

    if(!parsedData.success){
        return res.status(400).json({message: "Validation Failed"})
    }
    try {
        const {name, price, quantity, category} = parsedData.data
        const sweet = await prisma.sweet.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name,
                price: Number(price),
                quantity: Number(quantity),
                category
            }
        })
        res.json({message: `Sweet updated successfully`})
    } catch (error) {
        console.error("Failed to update sweet:", error)
        res.status(500).json({ message: "Failed to update sweet"})
    }

})
sweetRouter.delete('/:id', adminAuthenticate, async(req, res)=>{
    try {
        const sweet = await prisma.sweet.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        res.json({message: `Sweet deleted successfully`})
    } catch (error) {
        console.error("Failed to delete sweet:", error)
        res.status(500).json({ message: "Failed to delete sweet"})
    }
})

export default sweetRouter