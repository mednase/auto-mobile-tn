/**
 * Created by medna on 01/03/2017.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var parameters_schema=new Schema({
    facebookUrl:String,
    twitterUrl:String,
    instagramUrl:String,
    youtubeUrl:String,
    email:String,
});

var Parameters = mongoose.model("Parameters",parameters_schema);
module.exports=Parameters;