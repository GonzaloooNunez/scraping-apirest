const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://elpais.com/ultimas-noticias/";

let noticias = [];

function scraping(req, res, next) {
  const url = "https://elpais.com/ultimas-noticias/";
  axios.get(url).then((response) => {
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const titles = [];
      const imgs = [];
      const descs = [];
      const links = [];

      $("main .z-fe h2 > a").each((index, element) => {
        const title = $(element).text();
        titles.push(title);
      });
      $("main .z-fe figure > a").each((index, element) => {
        const link = $(element).attr("href");
        links.push(link);
      });
      $("main .z-fe a > img").each((index, element) => {
        const img = $(element).attr("src");
        imgs.push(img);
      });

      $("main .z-fe article > p").each((index, element) => {
        const desc = $(element).text();
        descs.push(desc);
      });

      noticias = titles.map((title, index) => ({
        id: index,
        titulo: title,
        imagen: imgs[index],
        descripcion: descs[index],
        enlace: links[index],
      }));
    }
  });
  req.noticias = noticias;
  fs.writeFileSync("noticias.json", JSON.stringify(noticias, null, 2));
  next();
}

module.exports = scraping;
