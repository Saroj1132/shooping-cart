const tbluser=require('../model/user')
const jwt=require('jsonwebtoken')

var auth=async(req, res, next)=>{
    try{
        if(req.session.user){
            const token=req.session.user
            const decode=jwt.verify(token, "mykey12345")
            const User=await tbluser.findOne({
                _id:decode._id,
                email:decode.email
            })

            req.user=User

            next()
        }else{
            res.redirect('/user/signin')    
        }
    }catch(error){
        res.redirect('/user/signin')
    }
}

module.exports=auth