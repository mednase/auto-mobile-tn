/**
 * Created by medna on 26/01/2017.
 */
var mongoose=require('mongoose');
var fs = require("fs");
var async = require("async");
var Schema=mongoose.Schema;
var car_schema=new Schema({
    marque: String,
    model: String,
    annee: Number,
    prix : Number,
    caracteristique:{
        porte:Number,
        energie:String,
        type_vitesse:String,
        capacite_moteur:Boolean,
        climatisation:Boolean,
        frein_abs:Boolean,
        alarme:Boolean,
        regulateur_vitesse:Boolean,
        toit_ouvrant:Boolean,
        airbag:Boolean,
        EBD:Boolean
    },
    images : [],
});

var Car = mongoose.model("Car",car_schema);
module.exports=Car;