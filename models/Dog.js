const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const Breed = require("./Breed");


const dogScheme = new Schema({
  // breed: { type: Schema.Types.ObjectId, ref: 'Breed' },
  breed: { type: Schema.Types.ObjectId, ref: 'Breed' },
  image: String,
  title: String
},
  {
    versionKey: false // если критично поле __v в Mongo докумете, то можно убрать  добавив это
  }
);

module.exports = mongoose.model("Dog", dogScheme);
