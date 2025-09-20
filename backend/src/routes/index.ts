import { Router } from 'express'
import authRouter from './authRoutes.js'
import sweetRouter from './sweetRoutes.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/sweets', sweetRouter)

export default router