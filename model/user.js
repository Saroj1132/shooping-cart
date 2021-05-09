const mongoose=require('mongoose')
const productschema=mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})


const user=mongoose.model('users', productschema)

module.exports=user