const express = require('express')
const {Client} = require('pg')
const config = require('../db_config.js')

const router = express.Router()

router.post('/',async(req,res)=>{
        const client = new Client(config.current)
        
        client.connect()
       

        let query,result

        query=`with done as 
                        (select daily.daily_id,dailies.nome,true as complete from daily left join dailies on dailies.daily_id=daily.daily_id
                        where daily.data::date=now()::date)
                        select daily_id,nome,false as complete from dailies where dailies.daily_id not in (select done.daily_id from done);`

        result = await client.query(query)
        const day = result.rows

        query =`with done as 
                        (select monthly.moth_id,monthlies.nome,true as complete from monthly left join monthlies on monthlies.moth_id=monthly.moth_id
                        where extract(month from monthly.data)=extract(month from now()))
                        select moth_id as daily_id,nome,false as complete from monthlies where monthlies.moth_id not in (select done.moth_id from done)`
        results = await client.query(query)

        const month = results.rows
        client.end()

        const returnMe = {
                month:month,
                day:day
        }
        res.send(JSON.stringify(returnMe))
})

module.exports = router
