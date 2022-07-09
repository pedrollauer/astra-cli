//Author: Peter Von Lauer
//This file gets a request containing the root for a tree of tasks that have to be accomplished and returns the tree itself
//Expected request json: {"root":"someRoot"}
//The returned hierarchy is in json as well

const express = require('express')
const config = require('../db_config')

const {Client} = require('pg')

const router = express.Router()


router.post('/',async(req,res)=>{
        //Setup the postgre sql server connection
        const client = new Client(config.current)
        await client.connect()

        const query={
                text:`with recursive arbore as (
        select sub_id, pai_id,nome,completo,1 as lvl  from subprojetos where nome='${req.body.root}' 
        union
        select subprojetos.sub_id,subprojetos.pai_id,subprojetos.nome,subprojetos.completo, arbore.lvl+1 as lvl from arbore
        join subprojetos on subprojetos.pai_id=arbore.sub_id
        )
        select * from arbore;`,
        
        }

        const results = await client.query(query) 
        await client.end()

        //Treat the results
        const rows = results.rows
        

        //Initialize the variables with the contents of the end of the tree
        let currentLevel=[]
        let lvl=rows[rows.length-1].lvl
        currentLevel.push({[rows[rows.length-1].sub_id+'-'+rows[rows.length-1].nome]:rows[rows.length-1].completo})
        let parents = [rows[rows.length-1].pai_id]
        let initial;

        initial=rows.length-1

        let posArr=initial-1

        //Add the others elements that are at the end of the tree
        for(let i=rows.length-2;i>-1;i--){
                if(rows[i].lvl!=lvl){
                        posArr=i
                        break;
                } else
                        currentLevel.push({[rows[i].sub_id+'-'+rows[i].nome]:rows[i].completo})
                        parents.push(rows[i].pai_id)
        }
        


        let nextLevel=[]
        let nextParents=[]


                lvl--
        //Add the remaining elements
        while(lvl>1){

                for(let i=posArr;i>-1;i--){

                        if(rows[i].lvl!=lvl){
                                posArr=i;
                                break;
                        } else{

                        let obj=[]

                        for(let k=0;k<parents.length;k++){
                                if(parents[k]==rows[i].sub_id){
                                        obj.push(currentLevel[k])
                                }
                        }
                                 
                                if(obj.length>0){
                                        nextLevel.push({[rows[i].sub_id+'-'+rows[i].nome]:obj})
                                }else{
                                        nextLevel.push({[rows[i].sub_id+'-'+rows[i].nome]:rows[i].completo})
                                }

                                nextParents.push(rows[i].pai_id)
                
               
              
                        }
                }
               
             
                parents=nextParents
                nextParents=[]

           
          
                currentLevel=nextLevel
                nextLevel=[]
            
                lvl--
        }
        
        const returnMe = {[rows[0].sub_id+'-'+rows[0].nome]:currentLevel}
        console.log(JSON.stringify(currentLevel,null,4))

        res.setHeader('Content-Type','application/json')
        res.send(JSON.stringify(returnMe))
})

module.exports = router
