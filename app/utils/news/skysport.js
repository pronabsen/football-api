const axios = require("axios");
const cheerio = require("cheerio");

const articles =[];

const response = axios
    .get("https://www.skysports.com/football")
    .then((result) => {
        const html = result.data;
        const $ = cheerio.load(html);
        $(".news-list__item").each((i, el) => {
            const url = $(el).find("a").attr("href");
            const title = $(el).find("a").text();
            const subtitle = $(el).find("p").text();
            articles.push({
                url,
                title,
                subtitle,
            });
        });
    })

module.exports = articles;