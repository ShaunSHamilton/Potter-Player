require('dotenv').config();
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const URL = "https://potterswheelsd.org/sermon-series/";
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(express.static("../client/index.js"));

// ----------------------------------------------------------------------
// Setup Mongoose Schema connection
// ----------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection successful");
});

app.listen(port, () => {
    console.log(`Server on port: ${port}`)
})

let sermonSchema = new mongoose.Schema({
    title: String,
    speaker: String,
    date: String,
    category: String,
    audio: String,
    seen: { type: Boolean, default: false }
});
let Sermon = mongoose.model('Sermon', sermonSchema);
// ----------------------------------------------------------------------
// Create Routes for Express and Axios
// ----------------------------------------------------------------------
const router = require('express').Router();
// router.route('/').get(async (req, res) => {
//     try {
//         const sermons = await getAllSermons();
//         return res.json(sermons);
//     } catch (err) {
//         return res.status(400).json('Error: ' + err);
//     }
// });
// router.route('/updateDB').get((req, res) => {
//     try {
//         console.log("ROUTE")
//         getPages();
//         return "UPDATING DATABASE";
//     } catch (err) {
//         return res.status(400).json('Error: ' + err);
//     }
// });
app.get('/', async (req, res) => {
    try {
        const sermons = await getAllSermons();
        return res.send(JSON(sermons));
    } catch (err) {
        return res.send(400).json('Error: ' + err);
    }
})
// app.use('/updateDB', router);
// // ----------------------------------------------------------------------
// // DataBase Querying Functions
// // ----------------------------------------------------------------------

//----------------------------------------------------------------------------------
// Functions to export
//----------------------------------------------------------------------------------
async function getAllSermons() {
    return await Sermon.find();
}

// getPages();

// async function updateDB(lastAdded) {
//     let pages = [];
//     let sermons = [];
//     let titles = [];
//     let speakers = [];
//     let categories = [];
//     let dates = [];
//     let audios = [];
//     // Find last added sermon (findbyDate)
//     findSermonsAfterDate(lastAdded)
//     // Check for more sermons, and save new sermons
//     function findSermonsAfterDate(mostRecent) {
//         // mostRecent: Month DD, YYYY
//         axios(URL)
//             .then(html => {
//                 const $ = cheerio.load(html.data);
//                 let refs = $('article > h3 > a');
//                 let tempDates = $('article > abbr');
//                 let tempAudios = $('a.cmsmasters_sermon_media_item.cmsmasters_theme_icon_sermon_download');
//                 let tempSpeakers = $('div.cmsmasters_sermon_author > a > span');
//                 let tempCategories = $('div.cmsmasters_sermon_cat > a');
//                 for (let ref in refs) {
//                     if (!isNaN(ref) && Date.parse(tempDates[ref].attribs.title) > Date.parse(mostRecent)) {
//                         sermons.push(refs[ref].attribs.href)
//                         titles.push(refs[ref].children[0].data)
//                         audios.push(tempAudios[ref].attribs.href)
//                         dates.push(tempDates[ref].attribs.title)
//                         speakers.push(tempSpeakers[ref].children.data)
//                         categories.push(tempCategories[ref].children.data)
//                     }
//                 }
//             }).then(createManySermons([]))
//             .catch(console.error)
//     }

//     function createManySermons(arrayOfSermons, done) {
//         Sermon.create(arrayOfSermons, function (err, sermon) {
//             if (err) return console.error("4 ", err);
//             done(null, sermon);
//         });
//     };
// }

// let series = [];
// let sermons = [];
// let titles = [];
// let speakers = [];
// let categories = [];
// let dates = [];
// let audios = [];

// let manySermons = [];

// function getPages() {
//     axios(URL)
//         .then((html) => {
//             const $ = cheerio.load(html.data)
//             let serm = $('div.elementor-image > a')
//             for (let s in serm) {
//                 if (!isNaN(s)) {
//                     series.push(serm[s].attribs.href);
//                 }
//             }
//             setTimeout(getAllData, 5000);
//         })
//         .catch(console.error("ERROR"));
// }
// async function getAllData() {
//     series.forEach(page => {
//         axios(page)
//             .then(html => {
//                 console.log('PAGE STARTED')
//                 const $ = cheerio.load(html.data);
//                 let refs = $('article > h3 > a');
//                 let tempDates = $('article > abbr');
//                 let tempAudios = $('a.cmsmasters_sermon_media_item.cmsmasters_theme_icon_sermon_download');
//                 let tempSpeakers = $('div.cmsmasters_sermon_author > a > span');
//                 let tempCategories = $('div.cmsmasters_sermon_cat > a');
//                 for (let ref in refs) {
//                     if (!isNaN(ref)) {
//                         titles.push(refs[ref].children[0].data)
//                         audios.push(tempAudios[ref].attribs.href)
//                         dates.push(tempDates[ref].attribs.title)
//                         speakers.push(tempSpeakers[ref].children[0].data)
//                         categories.push(tempCategories[ref].children[0].data)
//                     }
//                 }
//             })
//             .catch(console.error("ERROR"))
//     })
//     setTimeout(myArr, 40000);
//     //.then(() => createManySermons(manySermons, done))
// }
// function myArr() {
//     console.log("CREATING ARRAY");
//     for (let i in titles) {
//         manySermons.push({ title: titles[i], speaker: speakers[i], date: dates[i], category: categories[i], audio: audios[i] })
//     }
//     setTimeout(() => createManySermons(manySermons, done), 5000);
// }
// function done(a, b) {
//     console.log("FINSIHED")
// }
// function createManySermons(arrayOfSermons, done) {
//     console.log("SAVING SERMONS")
//     Sermon.create(arrayOfSermons, function (err, sermon) {
//         if (err) return console.error("4 ", err);
//         done(null, sermon);
//     });
// };
//----------------------------------------------------------------------------------
// Exports
//----------------------------------------------------------------------------------

// getAllSermons
//export default getAllSermons;
// updateSermons
//export default updateDB;
//