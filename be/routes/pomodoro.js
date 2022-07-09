const express = require('express')
const {Client} = require('pg')
const config = require('../db_config')

const router = express.Router()

router.use('/',async (req,res)=>{
        const client = new Client(config.current)
        client.connect()

        const query = `insert into pomodoro (sub_id,tempo,data) values (${req.body.sub_id},${req.body.time},now())`
        console.log(query)
        await client.query(query)
        client.end()

        res.send({success:1})
})

module.exports = router
