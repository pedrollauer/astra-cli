const express = require('express')
const {Client}= require('pg')
const config = require('../db_config')

const router = express.Router();

router.post('/',async(req,res)=>{

        console.log(req.body)
        const client = new Client(config.current)
        await client.connect()

        let query={
                text:`with recursive arbore as (
        select sub_id, pai_id,nome,completo,1 as lvl  from subprojetos where nome='${req.body.root}' 
        union
        select subprojetos.sub_id,subprojetos.pai_id,subprojetos.nome,subprojetos.completo, arbore.lvl+1 as lvl from arbore
        join subprojetos on subprojetos.pai_id=arbore.sub_id
        )
        select * from arbore;`,
        
        }

        const all= (await client.query(query)).rows

        


        query={
                text:`with recursive arbore as (
        select sub_id, pai_id,nome,completo,1 as lvl  from subprojetos where nome='${req.body.root}' 
        union
        select subprojetos.sub_id,subprojetos.pai_id,subprojetos.nome,subprojetos.completo, arbore.lvl+1 as lvl from arbore
        join subprojetos on subprojetos.pai_id=arbore.sub_id
        )
        select * from arbore where completo=true;`,
        
        }

        const done = (await client.query(query)).rows

        console.log(done)
        await client.end()

        const total = all.length-1
        const complete = done.length
        const notDone = total-complete
        console.log(typeof(complete))
        const percentDone = (100*(complete/total)).toFixed(2)
        console.log(percentDone)
        const retorneMe = {
                total:total,
                concluidos:complete,
                abertas:notDone,
                percentagem:percentDone
        }

        res.setHeader('Content-Type','application/json')
        res.send(JSON.stringify(retorneMe))
})

module.exports = router
