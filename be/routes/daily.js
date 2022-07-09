const express = require('express')
const {Client} = require('pg')
const config = require('../db_config.js')
const router = express.Router()


//TODO
//Dailies can only be checked if they exist
//Add option to rename dailies
router.post('/',(req,res)=>{
        switch(req.body.comando){
                case 0:
                        showDailies(req,res)
                        break
                case 1:
                        checkDaily(req,res)
                        break;
                case 2:
                        addDaily(req,res)
                        break;
                case 3:
                        removeDaily(req,res)
                        break
        }
})

const showDailies = async(req,res)=>{

        const client = new Client(config.current)
        client.connect()
        let query

        console.log(req.body)
        switch(req.body.mode){
                case 0:
                query = `with done as 
                        (select daily.daily_id,dailies.nome,true as complete from daily left join dailies on dailies.daily_id=daily.daily_id
                        where daily.data::date=now()::date)
                        select daily_id,nome,false as complete from dailies where dailies.daily_id not in (select done.daily_id from done)
                        union
                        select daily_id, nome, complete from done;`
                        break

                case 1:
                query = `with done as 
                        (select monthly.moth_id,monthlies.nome,true as complete from monthly left join monthlies on monthlies.moth_id=monthly.moth_id
                        where extract(month from monthly.data)=extract(month from now()))
                        select moth_id as daily_id,nome,false as complete from monthlies where monthlies.moth_id not in (select done.moth_id from done)
                        union
                        select moth_id as daily_id, nome, complete from done;`
                        break
        }

        const results = await client.query(query)

        client.end()
        
        console.log(results.rows)
        res.send(JSON.stringify(results.rows))

}

const addDaily = async(req,res) =>{

        let table

        switch(req.body.mode){
                case 0:
                        table='dailies'
                        break
                case 1:
                        table='monthlies'
                        break
        }

        const client = new Client(config.current)
        client.connect()
        console.log(req)
        const query = `insert into ${table} (nome, descricao) values ('${req.body.nome}','${req.body.descricao}')`
        await client.query(query)
        client.end()
}

const removeDaily= async(req,res) =>{
        const client = new Client(config.current)
        client.connect()
        console.log(req)
        const query = `delete from dailies where daily_id=${req.body.daily_id}`
        await client.query(query)
        client.end()
}

const checkDaily = async(req,res) => {
        const client = new Client(config.current)

        switch(req.body.mode){
                case 0:
                client.connect()

                        for(let i=0;i<req.body.daily_id.length;i++){
                                const results = await client.query(`select * from daily where data::date=now()::date and daily_id=${req.body.daily_id[i]}`)
                                console.log(results.rows.length)
                                if(results.rows.length==0){
                                const query = `insert into daily (daily_id,data) values (${req.body.daily_id[i]},now())`
                                await client.query(query)
                        }
                }

                client.end()
                        break
                case 1:
                client.connect()
                console.log(req.body)
                        for(let i=0;i<req.body.daily_id.length;i++){
                                const results = await client.query(`select * from monthly where extract(month from data::date)=extract(month from CURRENT_DATE) and moth_id= ${req.body.daily_id[i]}`)
                                console.log(results.rows.length)
                                if(results.rows.length==0){
                                const query = `insert into monthly (moth_id,data) values (${req.body.daily_id[i]},now())`
                                await client.query(query)
                        }
                }

                client.end()
                        break
        }

        res.send(JSON.stringify({success:true}))
}

module.exports =router 
