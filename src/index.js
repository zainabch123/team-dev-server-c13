import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    data: {
      resource: 'Not found'
    }
  })
})

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`\n Server is running on port ${port}\n`)
})
