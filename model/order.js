const mongoose=require('mongoose')
const schema=mongoose.Schema

const Orderschema=mongoose.Schema({
    UserId:{
        type:schema.Types.ObjectId,
        ref:'users'
    },
    Cart:{
        type:Object,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    PaymentId:{
        type:String,
        require:true
    }
})


const order=mongoose.model('orders', Orderschema)

module.exports=order
