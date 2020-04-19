require('dotenv').config()
// const axios = require('axios');
const mongoose = require('mongoose');
// const cheerio = require('cheerio');
//const express = require('express');
//const app = express();

const URL = "https://potterswheelsd.org/sermons/";
// ----------------------------------------------------------------------
// Setup Mongoose Schema connection
// ----------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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

// // ----------------------------------------------------------------------
// // DataBase Querying Functions
// // ----------------------------------------------------------------------

//----------------------------------------------------------------------------------
// Functions to export
//----------------------------------------------------------------------------------
export async function getAllSermons() {
    return await Sermon.find();
}

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
//     const findSermonsAfterDate = (mostRecent) => {
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
//             }).then(createMany())
//             .catch(console.error)
//     }
//     const createManySermons = function (arrayOfSermons, done) {
//         Sermon.create(arrayOfSermons, function (err, sermon) {
//             if (err) return console.error("4 ", err);
//             done(null, sermon);
//         });
//     };
// }

//----------------------------------------------------------------------------------
// Exports
//----------------------------------------------------------------------------------

// getAllSermons
//export default getAllSermons;
// updateSermons
//export default updateDB;
//