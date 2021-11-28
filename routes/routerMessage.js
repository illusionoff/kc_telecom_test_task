const { Router } = require('express');
const router = Router();
// const { check, validationResult, body } = require('express-validator'); // body дополнительно взял
const fetch = require('node-fetch');
// import fetch from 'node-fetch';
const config = require('config');
const Breed = require("../models/Breed");
const Dog = require("../models/Dog");
const mongoose = require("mongoose");

const URL_Dog_API_GET = config.get('URL_Dog_API_GET');
const COUNT_DOGS = config.get('COUNT_DOGS');

function splitParams(url) {// парсим из URL breed, title
  let res = url.split('/');
  let title = res[res.length - 1].slice(0, -4);
  let breed = res[res.length - 2];
  return [breed, title]
}
// заполняем arrParseUrl распарсенными данными
function parseURL(reqArrDogsURL, arrParseUrl) {
  reqArrDogsURL.forEach((item, index) => {
    console.log(index, item);
    let params = splitParams(item.message);
    arrParseUrl.arrBreeds.push({ breed: params[0] });
    arrParseUrl.arrTitles.push({ title: params[1] });
    arrParseUrl.arrImages.push({ image: item.message });
  })
  console.log('arrParseUrl.arrBreeds=', arrParseUrl.arrBreeds);
  console.log('arrParseUrl.arrTitles=', arrParseUrl.arrTitles);
  console.log('arrParseUrl.arrImages=', arrParseUrl.arrImages);
}
//создаем массив данных для записис в коллекцию Mongo breeds
function dataDog(BreedInsertMany, arrBreedsId, arrParseUrl) {
  console.log('BreedInsertMany=', BreedInsertMany);
  BreedInsertMany.forEach((item) => {
    arrBreedsId.push(item.id);
  });
  console.log('arrBreedsId=', arrBreedsId);
  const arrDogsDocs = arrBreedsId.map((idBreed, index) => {
    return {
      // breed: Schema.Types.ObjectId(idBreed), //mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
      breed: mongoose.Types.ObjectId(idBreed), //mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
      image: arrParseUrl.arrImages[index].image,
      title: arrParseUrl.arrTitles[index].title
    }
  })
  console.log('arrDogsDocs result=', arrDogsDocs);
  return arrDogsDocs
}
// Записываем в  коллекцию Mongo dogs все документы одним запросом
async function forArrDogsDocs(resultDataDog, Dog) {
  await Dog.insertMany(
    resultDataDog
  ).then(function () {
    console.log("Data inserted Dogs")  // Success
  }).catch(function (error) {
    console.log('Data inserted Dogs ERROR', error)      // Failure
  });

  console.log("Data inserted")  // Success
}
// '/api/message'
console.log('routerMessage');
// Создаем документы в коллекциях Dog и Breed
router.get('/start', async function (req, res) {
  try {
    console.log('запрос на сервер')
    // создаем массив промисов для параллельного выполнения
    const promiseArr = [];
    let i = 0;
    while (i < COUNT_DOGS) {
      promiseArr.push(
        fetch(URL_Dog_API_GET).then(res => res.json())
      );
      i++;
    }
    // создаем объект с массивами распасенных данных
    let arrParseUrl = {
      arrBreeds: [],
      arrTitles: [],
      arrImages: []
    }
    let arrBreedsId = []; // для сохранения Id документов Breeds
    // получаем результат выполненных промисов всех запросов
    let reqArrDogsURL = await Promise.all(promiseArr)
      .catch(err => { console.error('wait! oh shh...') });

    console.log('reqArrDogsURL111111111=', reqArrDogsURL);
    // заполняем arrParseUrl распарсенными данными
    parseURL(reqArrDogsURL, arrParseUrl);

    // Записываем в  коллекцию breeds все документы одним запросом
    let BreedInsertMany = await Breed.insertMany(
      arrParseUrl.arrBreeds
    ).catch(function (error) {
      console.log(error)      // Failure
    });

    console.log('BreedInsertMany 11111111111111=', BreedInsertMany);
    let resultDataDog = dataDog(BreedInsertMany, arrBreedsId, arrParseUrl);
    //Записываем в  коллекцию Mongo dogs все документы одним запросом
    await forArrDogsDocs(resultDataDog, Dog);

    console.log('reqArrDogsURL=', reqArrDogsURL);//someResult

    res.status(201).json({ message: 'обработка на сервере' });
  } catch (err) {
    console.error('Что-то пошло не так', err.message);
    console.error('Что-то пошло не так ERR', err);
    // res.status(err.statusCode || 500).json({ 'message': err.message || 'Что-то пошло не так, попробуйте снова' });
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});
// Запрашиваем данные коллекций
router.get('/dogs', async function (req, res) {
  try {
    console.log('запрос на сервер')
    await Dog.find({})
      .populate('breed')
      .exec(function (err, posts) {
        if (err) { return (err); }
        // редактирование дынных для вывода на frontend  если потребуется чистые данные без id
        let resultPosts = posts.map((post) => {
          return {
            breed: post.breed.breed,
            image: post.image,
            title: post.title
          }
        })
        console.log('resultPosts=', resultPosts);
        res.status(201).json(resultPosts);// отправляем 'очищенные - без полей _id' данные коллекции breeds и dogs на frontend
      });
  } catch (err) {
    console.error('Что-то пошло не так', err.message);
    console.error('Что-то пошло не так ERR', err);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});
// Удаляем коллекции  Dog и Breed
router.get('/del', async function (req, res) {
  try {
    console.log('запрос на сервер')
    await Dog.deleteMany({}).then(result2 => {
      console.log(result2);
    });
    await Breed.deleteMany({}).then(result2 => {
      console.log(result2);
    });

    res.status(201).json({ message: 'Все документы в коллекии Dog и Breed удалены' });
  } catch (err) {
    console.error('Что-то пошло не так', err.message);
    console.error('Что-то пошло не так ERR', err);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
});

module.exports = { router }
