const mongoose = require('mongoose')
const Schema = mongoose.Schema
var ObjectId = mongoose.Schema.Types.ObjectId

const wishList = new Schema({
	title:{type:String,default:'cool wish list'},
	products:[{type:ObjectId,ref:'Product'}]
})

module.exports = mongoose.model('WishList',wishList)