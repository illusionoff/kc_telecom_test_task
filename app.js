console.log('App');
const path = require('path');
const express = require('express');
const config = require('config');
const app = express();
const { router } = require('./routes/routerMessage');
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const breedScheme = new Schema({
//   breed: String
// });

// const Breed = mongoose.model("breed", breedScheme);

// const breed = new Breed({
//   name: "Bill",
//   age: 41
// });

const PORT = config.get('PORT') || 5000;
const MONGODB_URI = config.get('MONGODB_URI');
// app.use(express.json({ extended: true }));
// app.use(express.urlencoded({ extended: false }));

app.use('/api/message', router);
// app.get('/', (req, res) => {
//   res.send({ message: 'Hello WWW!' });
// });
// app.use('/', require('./routes/routerIndex'));
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

  console.log("production mode");
} else {
  console.log("development mode");
}

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
