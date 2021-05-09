var express = require('express');
var router = express.Router();
var Product=require('./../model/product')
var User=require('./../model/user')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const user = require('./../model/user');
const auth=require('../config/auth')
const Cart=require('./../model/cart')
const order=require('./../model/order')

/* GET home page. */
router.get('/', function(req, res) {
  Product.find()
  .exec()
  .then(doc=>{
    res.render('shop/index', {products:doc, user:req.user});

  })
});

router.get('/user/signup',(req, res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/signup', {user:req.user})
  }
})

router.post('/user/signup',(req, res)=>{
  const {email, password}=req.body

  bcrypt.hash(password, 10, (err, hash)=>{
    const user=new User({
      email, 
      password:hash
    })
    user.save()
    .then(useradd=>{
      var token=jwt.sign({
        _id:useradd._id
      }, "mykey124")
  
      req.session.user=token
      console.log(token)
      res.redirect('/user/profile')
    })
  })
  
})

router.get('/user/profile',auth, (req, res)=>{
  order.find({UserId:req.user._id})
  .exec()
  .then(doc=>{
    var cart;
    doc.forEach((order)=>{
      cart=new Cart(order.Cart)
      order.item=cart.generateArray();
    })
    res.render('user/profile', {user:req.user, orders:doc})

  })
})

router.get('/user/signin',(req, res)=>{
  if(req.session.user){
    res.redirect('/')
  }else{
    res.render('user/signin', {user:req.user})
  }
})

router.get('/user/logout', (req, res)=>{
  delete req.session.user
  res.redirect('/user/signin')
})

router.get('/add-to-cart/:id',auth, (req, res)=>{
  var Productid=req.params.id
  var cart=new Cart(req.session.cart  ? req.session.cart : {})
  Product.findById(Productid, (err, doc)=>{
    if(err){
      res.redirect('/')
    }
    cart.add(doc, doc.id)
    req.session.cart=cart
    console.log(req.session.cart)
    res.redirect('/')
  })
})

router.post('/user/signin',(req, res)=>{
  const {email, password}=req.body 
  user.findOne({email})
  .exec()
  .then(doc=>{
    if(bcrypt.compareSync(password, doc.password)){
      const token=jwt.sign({
        _id:doc._id,
        email:doc.email
      
      }, "mykey12345")
      req.session.user=token
      console.log(token)
      res.redirect('/')
    }
  })
})

router.get('/shooping-cart', auth,(req, res)=>{
  if(!req.session.cart){
    return res.render("shop/shooping-cart", {products:null})
  }

  var cart=new Cart(req.session.cart)
  res.render("shop/shooping-cart", {products:cart.generateArray(), totalPrice: cart.totalPrice})
})

router.get('/checkout', auth,(req, res)=>{
  if(!req.session.cart){
    return res.redirect("/shooping-cart")
  }

  var cart=new Cart(req.session.cart)
  res.render("shop/Checkout", {totalPrice: cart.totalPrice})
})

router.post('/checkout', auth, (req, res)=>{
  var cart=new Cart(req.session.cart)

  const {name, address}=req.body

  var Order=new order({
    UserId:req.user._id,
    name,
    address,
    Cart:cart,
    PaymentId:"2222"

  })
  Order.save()
  .then(orderadded=>{
    req.session.cart=null

    res.redirect('/')
  })
  
})

module.exports = router;
