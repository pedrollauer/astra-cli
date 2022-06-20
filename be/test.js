const express=require('express')
const cors = require('cors')
const router = express.Router();

const corsOptions={
        origin:'*'
}

router.get('/',cors(corsOptions),(req,res)=>{
        res.send('Mucho Gusto!')
})

module.exports=router
