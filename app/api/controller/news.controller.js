
const axios = require('axios');
const cheerio = require("cheerio");
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const news_array = [];
const news_array_fourfourtwo = [];
const encrypt = (text) => {
    return Buffer.from(text).toString('hex');
};
const decrypt = (hexEncoded) => {
    return Buffer.from(hexEncoded, 'hex').toString('utf8');
};

function encodeStringWithKey(inputString) {
    return inputString.split('').map(char => {
        const charCode = char.charCodeAt(0);
        const encodedCharCode = (charCode + 5) % 256; // Keeping within byte range
        return String.fromCharCode(encodedCharCode);
    }).join('');
}
// Function to decode a string with a custom key
function decodeStringWithKey(encodedString) {
    return encodedString.split('').map(char => {
        const charCode = char.charCodeAt(0);
        const decodedCharCode = (charCode - 5 + 256) % 256; // Keeping within byte range
        return String.fromCharCode(decodedCharCode);
    }).join('');
}

exports.getNews = async (req, res) => {

  //  var parseString = req.parseString;
    axios
        .get("https://www.goal.com/en-in/news")
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("li", html).each(function () {
                const wordsToRemove = ["Getty", "Images", "/Goal"];
                const pattern = new RegExp(
                    `^\\s+|(${wordsToRemove.join("|")}|[^a-zA-Z0-9\\s\\-.])`,
                    "gi"
                );
                const url = $(this).find("div.poster-wrapper").find("a").attr("href");
                const title = $(this).find("h3.title").text();
                const shortDescription = $(this).find("p.teaser").text();
                const published = $(this).find("time").attr("datetime");
                const image = $(this).find("img").attr("src");

                if (!url || !title || url.includes("betting")) {
                    return;
                }
                let id = encodeStringWithKey(url);
               // let urlHashDe = decodeStringWithKey(id);
                news_array.push({
                    id,
                   // urlHashDe,
                    published,
                    title,
                    shortDescription,
                    image,
                })

            });

            res.json(news_array);
        })
        .catch((err) => console.log(err));
    /*
    axios
        .get("https://www.fourfourtwo.com/news")
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $(".listingResult", html).each(function (index, element) {
                const url = $(element).find("a").attr("href");
                const title = $(element).find("h3.article-name").text();
                const published = $(element).find("time").attr("datetime");
                const image = $(element).find("div.image-remove-reflow-container").attr("data-original");
             //   const img = imgSplitted ? imgSplitted.split(" ") : null;
            //    const news_img = img ? img[0] : null;
                const shortDesc = $(element).find("p.synopsis").text()?.trim();
                if (!url || !title || !url.startsWith("https://www.fourfourtwo.com/news/")) {
                    return;
                }
                let newID = encodeStringWithKey(url).replaceAll("myyux?44|||3ktzwktzwy|t3htr4sj|", "" );
                let urlHashDe = decodeStringWithKey(newID);
                news_array_fourfourtwo.push({
                    newID,
                    title,
                    image,
                    published,
                    shortDesc,
                });
            });

            res.json(news_array_fourfourtwo);
        })
        .catch((err) => console.log(err));*/
};

exports.getNewsDetails = async (req, res) => {

  //  var parseString = req.parseString;

    if (req.query.id == null ){
        return res.status(204).json({status: false, message: "Id field is required", response: []});
    }

    const id = req.query.id;
    const decodeId = decodeStringWithKey(id);

    axios
        .get("https://www.goal.com/en-in/lists/revealed-the-insane-offer-lionel-messi-received-join-al-hilal-before-argentina-hero-joined-inter-miami/blt425d28a1db5057df#cs3deed6b464bd2db5")
        .then((response) => {
            const html = response.data;

            const $ = cheerio.load(html);

           // return res.json($.html());
            const article = $(html).find("article");

            const title = $(article).find('header').find("h1").text();
            const published = $(article).find("time").attr("datetime");
            const shortDescription = $(article).find("p.article_teaser__rjxUK").text();
            const image = $(article).find("div.hero-image-padding").find("picture").find("img").attr("data-original-mos");
            let content = "";

            const des = $(html).find("body").find("script").attr("id", "__NEXT_DATA__").val();

            $("li",$(html)).each(function () {
               /* const wordsToRemove = ["Getty", "Images", "/Goal"];
                const pattern = new RegExp(
                    `^\\s+|(${wordsToRemove.join("|")}|[^a-zA-Z0-9\\s\\-.])`,
                    "gi"
                );*/

                const contentFind = $(this).html();

                if (!contentFind){
                    return;
                }
                content += contentFind;
              //  content.push(contentFind);
            });

          //  return res.json(content);

            let result = {
                title,
                published,
                shortDescription,
                image,
                des
            };


        /*    $(".listingResult", html).each(function (index, element) {
                const url = $(element).find("a").attr("href");
                const title = $(element).find("h3.article-name").text();
                const published = $(element).find("time").attr("datetime");
                const image = $(element).find("div.image-remove-reflow-container").attr("data-original");
             //   const img = imgSplitted ? imgSplitted.split(" ") : null;
            //    const news_img = img ? img[0] : null;
                const shortDesc = $(element).find("p.synopsis").text()?.trim();
                if (!url || !title || !url.startsWith("https://www.fourfourtwo.com/news/")) {
                    return;
                }
                let newID = encodeStringWithKey(url);
                let urlHashDe = decodeStringWithKey(newID);
                news_array_fourfourtwo_epl.push({
                    newID,
                    title,
                    image,
                    published,
                    shortDesc,
                });
            });
*/
            res.json(result);
        })
        .catch((err) => console.log(err));
};