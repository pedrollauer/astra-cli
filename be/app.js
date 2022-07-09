const express = require('express')
const cors = require('cors')

const arvore = require('./routes/arvore')
const colheita = require('./routes/colheita')
const subprojs = require('./routes/subprojs.js')
const daily = require('./routes/daily.js')
const duty = require('./routes/duty.js')
const pomodoro = require('./routes/pomodoro')

const app = express()

const corsOptions = {
        origin:'*'
}

app.use(express.json())

app.use('/arvore',cors(corsOptions),arvore)
app.use('/colheita',cors(corsOptions),colheita)
app.use('/subprojs',cors(corsOptions),subprojs)
app.use('/daily',cors(corsOptions),daily)
app.use('/duty',cors(corsOptions),duty)
app.use('/pomodoro',cors(corsOptions),pomodoro)

app.listen(3002,()=>{
        console.log('Aguardando na porta 3002.')
})
