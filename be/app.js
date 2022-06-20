const http = require('http')
const express = require('express')
const test = require('./test')

const app=express()

app.use('/api',test)

app.listen(3001,()=>{
        console.log('Listening...')
})
