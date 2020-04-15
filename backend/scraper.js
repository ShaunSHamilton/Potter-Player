const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://potterswheelsd.org/sermons/";

let pages = [];
let sermons = [];
let titles = [];
let speakers = [];
let categories = [];
let dates = [];
let audios = [];

function getPages() {
    axios(url)
        .then((html) => {
            const $ = cheerio.load(html.data)
            let numberOfPages = $('#cmsmasters_sermons_5e960f113c712 > div > div > ul > li:nth-child(5) > a').text()
            for (let i = 1; i < numberOfPages + 1; i++) {
                pages.push(url + 'page/' + String(i));
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
            })
            .catch(console.error)
    })
}