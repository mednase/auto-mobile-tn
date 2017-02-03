/**
 * Created by medna on 26/01/2017.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var message_schema=new Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    city:String,
    date: {type:Date , default:Date.now},
    seen:Boolean
});

var Message = mongoose.model("Message",message_schema);
module.exports=Message;