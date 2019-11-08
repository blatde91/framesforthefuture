const url = "http://wiki.shoryuken.com/Alex_(3S)"
// const url = "https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States"
const $ = require('cheerio');
const rp = require('request-promise');

rp(url)
  .then((html) => {
    console.log(html);
  })
  .catch((err) => {
    console.log(err)
  });