const fs = require("fs");
const chess = require("./chess_model.js");
const lodash = require("lodash");
const prompt = require('prompt-sync')();
const http = require('http');
const HOST = "127.0.0.1";
const PORT = 3000;
const options = {
  hostname: host,
  port: PORT,
  method: 'POST',
  path: '/api/courses',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  },
}
class Game {
  constructor(name1, name2) {
    this.p1 = {name: name1, color: "white"};
    this.p2 = {name: name2, color: "black"};
    this.board = chess.initBoard();
    chess.addPieces(this.board);
    const data = new TextEncoder().encode(JSON.stringify(this.board))
    const req = http.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      res.on('data', d => {
        process.stdout.write(d)
      })
    })
    req.on('error', error => {
      console.error(error)
    })
    req.write(data)
    req.end()
    console.log("hello")
    this.turn = this.p1;
    var whowon = ""
    while (whowon === "") {
      this.playTurn();
      whowon = chess.whoWon(this.board)
    }
    console.log(whowon+" won!")
  }

  createGame(id) {

  }
  joinGame(id) {

  }

  option(nmethod, npath) {
    return {
      hostname: HOST,
      port: PORT,
      method: nmethod,
      path: npath,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };
  }

  playTurn() {
    console.log(this.board)
    if (lodash.isEqual(this.turn, this.p1)) {
      var nBoard = ""
      while (nBoard === "") {
        const hor1 = prompt("White, which letter?");
        const ver1 = prompt("White, which number?");
        const hor2 = prompt("White, to which letter?");
        const ver2 = prompt("White, to which number?");
        nBoard = chess.playerMove(this.board, "white", {h: hor1, v: ver1}, {h: hor2, v: ver2});
      }
      this.turn = this.p2;
    } else {
      var nBoard = ""
      while (nBoard === "") {
        const hor1 = prompt("Black, which letter?");
        const ver1 = prompt("Black, which number?");
        const hor2 = prompt("Black, to which letter?");
        const ver2 = prompt("Black, to which number?");
        nBoard = chess.playerMove(this.board, "black", {h: hor1, v: ver1}, {h: hor2, v: ver2});
      }
      this.turn = this.p1;
    }
  };
}

new Game("drene1", "drene2")
