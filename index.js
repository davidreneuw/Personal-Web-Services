const express = require("express");
const Joi = require("joi");
const lodash = require("lodash");
const os = require("os");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

idList = []

function getGame(id) {
  let data = fs.readFile("./chess/games/"+id.toString()+".json", (err, data) => {
    if (err) throw err;
    return game = unprocessGame(JSON.parse(data));
  });
};

function setGame(id, game) {
  if (!(id in idList)) idList.push(id)
  let data = JSON.stringify(processGame(game), null, 2);
  fs.writeFile("./chess/games/"+id.toString()+".json", data, (err) => {
    if (err) throw err;
  })
}

function delGame(id) {
  const index = idList.indexOf(id);
  if (id in idList && index > -1) idList.splice(index, 1);
  fs.unlink("./chess/games/"+id.toString()+".json", (err)=> {
    if (err) throw err;
  })
}

app.get('/api/chess', (req, res) => {
  res.send(idList);
});

app.get('/api/chess/:id', (req, res) => {
  res.send(getGame(req.params.id));
});

app.post('/api/chess', (req, res) => {
  id = Math.floor(Math.random * 10000);
  var g = setGame(id, req.params.body);
  res.send(g);
});

app.put('/api/chess/:id', (req, res) => {
  var g = setGame(req.params.id, req.params.body);
  res.send(g);
});

app.delete('/api/chess/:id', (req, res) => {
  delGame(req.params.id);
  res.send(idList);
});

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

function processGame(game) {
  return Object.assign({}, ...game.map((x) => ({[game.findIndex(g => lodash.isEqual(x, g) )]: x})))
};

function unprocessGame(game) {
  var arr = [];
  for (var tile in game) {
    if (dict.hasOwnProperty(tile)) {
      arr.push(game[tile]);
    }
  }
  return arr;
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
