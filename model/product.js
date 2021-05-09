const mongoose=require('mongoose')
const productschema=mongoose.Schema({
    Imagepath:{
        type:String,
        require:true
    },
    Title:{
        type:String,
        require:true
    },
    Description:{
        type:String,
        require:true
    },
    Price:{
        type:Number,
        require:true
    }
})


const product=mongoose.model('products', productschema)

module.exports=product
