/**
 * Created by medna on 26/01/2017.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var marque_schema=new Schema({
    nom: String,
    models:[]
});

var Marque = mongoose.model("Marque",marque_schema);
module.exports=Marque;