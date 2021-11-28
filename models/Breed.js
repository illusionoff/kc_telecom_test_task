const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const breedScheme = new Schema({
  breed: String
},
  {
    versionKey: false // если критично поле __v в Mongo докумете, то можно убрать  добавив это
  }
);

module.exports = mongoose.model("Breed", breedScheme);
