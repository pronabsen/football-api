const axios = require("axios");
const cheerio = require("cheerio");

const articles = [];

const response = axios.get("https://www.espn.in/football/").then((result) => {
    const html = result.data;
    const $ = cheerio.load(html);
    $(".contentItem__content--story").each((i, el) => {
        const url = $(el).find("a").attr("href");
        const title = $(el).find("a").text()
        const subtitle = $(el).find('h1').text();
        articles.push({
            url:`https://www.espn.in/football${url}` ,
            title,
            subtitle
        });
    });
});

module.exports = articles;