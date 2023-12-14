const mongoose = require('mongoose');
const uuid = require('uuid');

const { Schema } = mongoose;
const userSchema = new Schema(
{
    username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
},
    email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
},
    password: {
    type: String,
    required: true,
    min: 8,
    max: 64,
},
    role: {
    type: String,
    default: "Subscriber",
},
    image: {
    //public_id: "",
    //url: "",
},
    userId: {
        type: String,
        unique: true,
    }
},
    { timestamps: true }    //aggiungo automaticamente due nuovi campi, createdAt e updatedAt
);

//middleware pre-salvataggio per salvare un ID se non presente
userSchema.pre('save', function(next){

    if(!this.userId){
        this.userId=uuid.v4();
    }
    next();

});

module.exports = mongoose.model("User", userSchema);