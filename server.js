const express = require('express')
const app = express()
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');
const port = 3001
var Product = require('./model/product')
var WishList = require('./model/wish-list')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.static(path.join(__dirname, 'public')))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/product',function(req,res){
	var product = new Product()
	product.title=req.body.title
	product.price=req.body.price
	product.save(function(err,savedProduct){
		if(err){
			res.status(500).send({error:"could not save product"})
		}else{
			res.send(savedProduct)
		}
	})
})

app.get('/product',function(req,res){
	Product.find({},function(err,products){
		if(err){
			res.status(500).send({error:"could not fetch products"})
		}else{
			products=[
				{
					title:"a",
					price:1,
					likes:1,
					_id:"11111111"
				},
				{
					title:"b",
					price:2,
					likes:2,
					_id:"22222222"
				},
				{
					title:"cccc",
					price:3,
					likes:3,
					_id:"33333333"
				}
			]
			res.send(products)
		}
	})
})

app.get('wishlist',function(req,res){
	// WishList.find({},function(err,wishLists){
	// 	res.send(wishLists)
	// })
	WishList.find({}).populate({path:'products',model:'Product'}).exec(function(err,wishLists){
		if(err){
			res.status(500).send({error:'could not fetch wish list'})
		}else{
			res.send(wishLists)
		}
	})
})

app.post('wishlist',function(req,res){
	var wishList=new WishList()
	wishList.title=req.body.title
	wishList.save(function(err,newWishList){
		if(err){
			res.status(500).send({error:"could not save wish list"})
		}else{
			res.send(newWishList)
		}
	})
})

app.put('/wishlist/product/add',function(req,res){
	Product.findOne({_id:req.body.productId},function(err,product){
		if(err){
			res.status(500).send({error:"could not find product"})
		}else{
			WishList.update({_id:req.body.wishListId},{$addToSet:{products:product._id}},
				function(err,wishList){
					if(err){
						res.status(500).send({error:'could not add item to wish list'})
					}else{
						res.send('success')
					}
			})
		}
	})
})

app.listen(port)
console.log('Server running on http://localhost:'+port)