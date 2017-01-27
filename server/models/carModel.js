/**
 * Created by medna on 26/01/2017.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var car_schema=new Schema({
    marque: String,
    model: String,
    annee: Number,
    prix : Number,
    couleur:String,
    porte:{type:Number,default:4},
    energie:String,
    type_vitesse:String,
    capacite_moteur:Number,
    caracteristique:{
        climatisation:{type: Boolean,default:false},
        frein_abs:{type: Boolean,default:false},
        alarm:{type: Boolean,default:false},
        regulateur_vitesse:{type: Boolean,default:false},
        toit_ouvrant:{type: Boolean,default:false},
        airbag:{type: Boolean,default:false},
        EBD:{type: Boolean,default:false}
    },
    images : [],
    date_publication:{type:Date, default:Date.now}
});

var Car = mongoose.model("Car",car_schema);
module.exports=Car;