const express=require('express')
const cors = require('cors')
const router = express.Router();
const {Client} =require('pg')


const corsOptions={
        origin:'*'
}

const config={
        user:'postastra',
        password:'E2,71828e',
        host:'astra.postgres.uhserver.com',
        database:'astra',
        port:5432
}

router.get('/',cors(corsOptions),async(req,res)=>{
        
        const client=new Client(config)
        await client.connect()
        const query={
                text:'Select * from subprojetos',
                rowMode:'array'
        }
        const results = await client.query(query)

        console.log(results)
        await client.end()
        res.send('Mucho Gusto!')
})

module.exports=router
