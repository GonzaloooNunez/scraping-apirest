const express = require("express");
const app = express();
const scraping = require("./scraping.js");
const fs = require("fs");

let noticias = [];

function leerDatos() {
  try {
    const data = fs.readFileSync("noticias.json", "utf-8");
    noticias = JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo noticias.json:", error.message);
  }
}

function guardarDatos(req, res, next) {
  fs.writeFileSync("noticias.json", JSON.stringify(req.noticias, null, 2));
  next();
}
app.use("/", scraping, guardarDatos);
app.get("/", (req, res) => {
  res.send(``);
});
app.get("/scraping", (req, res) => {
  res.json(req.noticias);
});
app.get("/:id", (req, res) => {
  const { id } = req.params;
  let noticia = [];
  for (let i = 0; i < req.noticias.length; i++) {
    if (req.noticias[i].id == id) {
      noticia = req.noticias[i];
    }
  }
  if (noticia) res.json(noticia);
});
app.post("/", (req, res) => {});
app.listen(3000, () => {
  console.log(`Servidor escuchando en el puerto 3000`);
});
