require('dotenv').config()

const express = require("express")
const PORT = process.env.PORT || 3500
const app = express()
const path = require("path")
const { logger } = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const logEvents = require("./middleware/logger")
const mongoose = require('mongoose')

// console.log(`mongoURI: ${process.env.DATABASE_URI}`)

connectDB()

app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/admins', require('./routes/adminRoutes'))
app.use('/products', require('./routes/productRoutes'));
app.use('/cart', require('./routes/cartRoutes'));


app.all('*', (req, res) => {
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`)
    logEvents(`${err.no}: ${err.code}: ${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
