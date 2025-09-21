import { Router } from "express";
import { userAuthenticate } from "../middleware/user.js";
import { adminAuthenticate } from "../middleware/admin.js";
import prisma from "../prisma.js";
import { SearchSchema, SweetSchema, PurchaseSchema } from "../types/index.js";

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
        const {name, price, quantity, category, imageUrl} = parsedData.data
        const sweet = await prisma.sweet.create({
            data: {
                name,
                price: Number(price),
                quantity: Number(quantity),
                category,
                imageUrl
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
        const {name, price, quantity, category, imageUrl} = parsedData.data
        const sweet = await prisma.sweet.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name,
                price: Number(price),
                quantity: Number(quantity),
                category,
                imageUrl
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

// user purchase
sweetRouter.post('/purchase', userAuthenticate, async (req, res) => {
    const parsed = PurchaseSchema.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({ message: 'Validation Failed' })
    }
    const { sweetId, quantity } = parsed.data
    try {
        const result = await prisma.$transaction(async (tx) => {
            const sweet = await tx.sweet.findUnique({ where: { id: Number(sweetId) } })
            if (!sweet) {
                throw new Error('Sweet not found')
            }
            if (sweet.quantity < quantity) {
                throw new Error(`Not enough stock. Available: ${sweet.quantity}`)
            }
            await tx.sweet.update({
                where: { id: Number(sweetId) },
                data: { quantity: sweet.quantity - quantity },
            })
            return { remaining: sweet.quantity - quantity }
        })
        return res.json({ message: 'Purchase successful', remaining: result.remaining })
    } catch (err: any) {
        const msg = err?.message || 'Failed to complete purchase'
        const status = msg.includes('not found') ? 404 : msg.includes('Not enough stock') ? 400 : 500
        return res.status(status).json({ message: msg })
    }
})

export default sweetRouter