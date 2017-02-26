/**
 * Created by medna on 26/01/2017.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var car_schema=new Schema({
    condition:{type:String,default:"new"},
    titre:String,
    titre_ar:String,
    description:String,
    description_ar:String,
    kilometrage:{type:Number,default:0},
    marque: String,
    model: String,
    annee: Number,
    prix : {type:Number,default:0},
    couleur:String,
    place:{type:Number,default:5},
    porte:{type:Number,default:4},
    energie:String,
    transmission:String,
    cylindre:Number,
    security:{
        frein_abs:{type: Boolean,default:false},
        alarm:{type: Boolean,default:false},
        airbag:{type: Boolean,default:false},
        frein_ebd:{type: Boolean,default:false}
    },
    fonctional:{
        climatisation:{type: Boolean,default:false},
        fermuture_centralise:{type: Boolean,default:false},
        toit_ouvrant:{type: Boolean,default:false},
        regulateur_vitesse:{type: Boolean,default:false},
        vitre_electrique:{type: Boolean,default:false},
    },
    images : [],
    date_publication:{type:Date, default:Date.now}
});

var Car = mongoose.model("Car",car_schema);
module.exports=Car;