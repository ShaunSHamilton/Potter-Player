require('dotenv').config()
const axios = require('axios');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const URL = "https://potterswheelsd.org/sermons/";
// ----------------------------------------------------------------------
// Setup Mongoose Schema connection
// ----------------------------------------------------------------------
try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (error) {
    console.log(error)
}
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
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.js');
});
app.get('/update', (req, res) => {
    res.json({ "message": "Hello json" });
});
app.route('/name').get((req, res, next) => {
    //let first = req.query.first;
    //console.log(req.query);
    //req.query = '?first=firstname&last=lastname';
    res.json({ name: `${req.query.first} ${req.query.last}` });
    next()
}).post((req, res, next) => {
    //console.log(req.body)
    res.json({ name: `${req.body.first} ${req.body.last}` });
    next();
});
// ----------------------------------------------------------------------
// DataBase Querying Functions
// ----------------------------------------------------------------------
function findSermon() {
    let findSermonByTitle = function (sermonTitle, done) {
        console.log(sermonTitle)
        Sermon.find({ title: sermonTitle }, function (err, found) {
            if (err) return console.log(err);
            done(null, found);
        });
    };
}

function CreateSermonDB() {

    let pages = [];
    let sermons = [];
    let titles = [];
    let speakers = [];
    let categories = [];
    let dates = [];
    let audios = [];

    function getPages() {
        axios(URL)
            .then((html) => {
                const $ = cheerio.load(html.data)
                let numberOfPages = $('#cmsmasters_sermons_5e960f113c712 > div > div > ul > li:nth-child(5) > a').text()
                for (let i = 1; i < numberOfPages + 1; i++) {
                    pages.push(URL + 'page/' + String(i));
                }
                getAllData()
            })
            .catch(console.error);
    }

    function getAllData() {
        pages.forEach(page => {
            axios(page)
                .then(html => {
                    const $ = cheerio.load(html.data);
                    let refs = $('article > h3 > a');
                    let tempDates = $('article > abbr');
                    let tempAudios = $('a.cmsmasters_sermon_media_item.cmsmasters_theme_icon_sermon_download');
                    let tempSpeakers = $('div.cmsmasters_sermon_author > a > span');
                    let tempCategories = $('div.cmsmasters_sermon_cat > a');
                    for (let ref in refs) {
                        if (!isNaN(ref)) {
                            sermons.push(refs[ref].attribs.href)
                            titles.push(refs[ref].children[0].data)
                            audios.push(tempAudios[ref].attribs.href)
                            dates.push(tempDates[ref].attribs.title)
                            speakers.push(tempSpeakers[ref].children.data)
                            categories.push(tempCategories[ref].children.data)
                        }
                    }
                }).then(createMany())
                .catch(console.error)
        })
    }

    const createMany = () => {
        let sermonData = [];
        for (let i = 0; i < sermons.length; i++) {
            sermonData.push({
                title: titles[i],
                speaker: speakers[i],
                date: dates[i],
                category: categories[i],
                audio: audios[i]
            });
        }
        let arrayOfSermons = sermonData.map((sermon) => {
            return { title: sermon.title, speaker: sermon.speaker, date: sermon.date, category: sermon.category, audio: sermon.audio, seen: false }
        });
        createManySermons(arrayOfSermons, finishedFunc)
        function finishedFunc(nil, data) { console.log("FINISHED CALLED") }

        const createManySermons = (arrayOfSermons, done) => {
            Sermon.create(arrayOfSermons, function (err, sermon) {
                if (err) return console.error(err);
                done(null, sermon);
            });
        };
    }

}

//----------------------------------------------------------------------------------
// Functions to export
//----------------------------------------------------------------------------------
async function getAllSermons() {
    return await Sermon.find();
}

async function updateDB() {
    let pages = [];
    let sermons = [];
    let titles = [];
    let speakers = [];
    let categories = [];
    let dates = [];
    let audios = [];
    // Find last added sermon (findbyDate)
    let mostRecent;
    Sermon.findOne().sort({ created_at: -1 }).exec(function (err, data) {
        if (err) return console.log(err);
        mostRecent = data;
    });
    // Check for more sermons, and save new sermons
    const findSermonsAfterDate = (mostRecent) => {
        axios(URL)
            .then(html => {
                const $ = cheerio.load(html.data);
                let refs = $('article > h3 > a');
                let tempDates = $('article > abbr');
                let tempAudios = $('a.cmsmasters_sermon_media_item.cmsmasters_theme_icon_sermon_download');
                let tempSpeakers = $('div.cmsmasters_sermon_author > a > span');
                let tempCategories = $('div.cmsmasters_sermon_cat > a');
                for (let ref in refs) {
                    if (!isNaN(ref)) {
                        sermons.push(refs[ref].attribs.href)
                        titles.push(refs[ref].children[0].data)
                        audios.push(tempAudios[ref].attribs.href)
                        dates.push(tempDates[ref].attribs.title)
                        speakers.push(tempSpeakers[ref].children.data)
                        categories.push(tempCategories[ref].children.data)
                    }
                }
            }).then(createMany())
            .catch(console.error)
    }
    const createManySermons = function (arrayOfSermons, done) {
        Sermon.create(arrayOfSermons, function (err, sermon) {
            if (err) return console.error("4 ", err);
            done(null, sermon);
        });
    };
}

//----------------------------------------------------------------------------------
// Exports
//----------------------------------------------------------------------------------

// getAllSermons
export default getAllSermons;
// updateSermons
export default updateDB;
//