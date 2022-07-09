//Author: Peter Von Lauer
//This document implements functions to handle
//subprojects, each function can be set by a 'comando'
//key in the request json

const express = require('express')
const {Client} = require('pg')
const config = require('../db_config')

const router = express.Router()


router.post('/',async (req,res)=>{

        switch(req.body.comando){
                case 0:
                        ticar(req,res)
                        break;
                case 1:
                        novo(req,res)
                        break;
                case 2:
                        rename(req,res)
                        break;
                case 3:
                        del(req,res)
                        break;
        }
})

const ticar = async (req,res)=>{
        const client = new Client (config.current)
        client.connect()
        query=`Update subprojetos set completo=true where sub_id=${req.body.sub_id}`
        const results = await client.query(query)
        console.log(results)
        res.send(JSON.stringify({sucesso:1}))
        client.end();
}

const novo = async (req,res) => {
        const client = new Client(config.current)

        client.connect()
        let query = 'select sub_id from subprojetos'  

        const response = await client.query(query)
        
        console.log(response)
        const proj_id = response.rows[0].sub_id

        console.log('proj_id---->'+proj_id)
        query = `insert into subprojetos (nome,pai_id,completo,proj_id) values ('${req.body.nome}','${req.body.pai_id}',false,'${proj_id}')`

        console.log(query)

        await client.query(query)
        client.end()
}


const rename= async (req,res) => {
        const client = new Client(config.current)

        client.connect()

        const query = `update subprojetos set nome='${req.body.nome}' where sub_id=${req.body.sub_id}`

        console.log(query)

        await client.query(query)
        client.end()
}

const del = async (req,res) => {
        const client = new Client(config.current)

        client.connect()

        const query = `delete from subprojetos where sub_id=${req.body.sub_id}`

        console.log(query)

        await client.query(query)
        client.end()
}
module.exports = router
