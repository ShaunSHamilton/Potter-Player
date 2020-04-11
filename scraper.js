const rp = require('request-promise');
const $ = require('cheerio');
const url = "https://potterswheelsd.org/sermons/";

rp(url)
    .then(function (html) {
        //success!
        const pages = [];
        for (let num = 1; num < 13; num++) {
            pages.push(url + String(num) + '/')
        }
        return Promise.all(
            pages.map((url) => pottusParse(url))
        );
    })
    .then(function (sermons) {
        console.log(sermons);
    })
    .catch(function (err) {
        console.log(err);
    });

const pottusParse = async function (url) {
    try {
        const html = await rp(url);
        return {
            titles: $('article > h3 > a', html).text(),
            speakers: $('article > h3 > a', html).attr('href'),
            date: ,
            category: ,
            image: ,
            audio: 
        };
    }
    catch (err) { }
};