require('dotenv').config()
const rp = require('request-promise');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const endpoint = "https://raw.githubusercontent.com/Sky020/Potter-Player/master/src/data/sermon_data.json";

/**Create a 'Person' Model */
var sermonSchema = new mongoose.Schema({
    title: String,
    _id: Number,
    speaker: String,
    date: String,
    category: String,
    audio: String,
    image: String,
    seen: { type: Boolean, default: false }
});

/**Create and Save a Sermon */
var Sermon = mongoose.model('Sermon', sermonSchema);

const getAPI = async () => {
    let options = {
        uri: endpoint,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
    const res = await rp(`${endpoint}`)
    let data;
    rp(options)
        .then(function (sermons) {
            console.log(sermons[0])
            let arrayOfSermons = sermons.map((sermon) => {
                return { title: sermon.title, _id: sermon.id, speaker: sermon.speaker, date: sermon.date, category: sermon.category, audio: sermon.audio, image: sermon.img, seen: false }
            });
            createManySermons(arrayOfSermons)
        })
        .catch(function (err) {
            console.log(err)
        });
    const createManySermons = function (arrayOfSermons, done) {
        Sermon.create(arrayOfSermons, function (err, sermon) {
            if (err) return console.error("4 ", err);
            done(null, sermon);
        });
    };
}
getAPI();
// var createAndSavePerson = function (done) {
//     var janeFonda = new Person({ name: "Jane Fonda", age: 84, favoriteFoods: ["vodka", "air"] });

//     janeFonda.save(function (err, data) {
//         if (err) return console.error("3 ", err);
//         done(null, data)
//     });
// };
// let createAndSaveSermon = (done) => {
// }

/**Create many Sermons with `Model.create()` */


/**Use `Model.find()` */
// var findPeopleByName = function(personName, done) {
//   console.log(personName)
//   Person.find({name: personName}, function(err, found) {
//     if (err) return console.log("5 ",err);
//     done(null, found);
//   });
// };
