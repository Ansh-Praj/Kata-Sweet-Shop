import Express from 'express'
import router from './routes/index.js'
import cors from 'cors'

const app = Express()
const port = 3000

app.use(cors())

app.use(Express.json())
app.use(Express.urlencoded({extended: true}))
app.use('/api', router)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


