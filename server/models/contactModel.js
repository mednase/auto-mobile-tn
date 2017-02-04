/**
 * Created by medna on 26/01/2017.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var contact_schema=new Schema({
    name: String,
    email: String,
    phone: String,
    governorate:String,
    message: String,
    date: {type:Date , default:Date.now},
    seen:{type:Boolean , default:false},
    respond:{type:Boolean , default:false}
});

var Contact = mongoose.model("Contact",contact_schema);
module.exports=Contact;