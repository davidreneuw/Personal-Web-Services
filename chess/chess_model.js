const horizontal = ["a", "b", "c", "d", "e", "f", "g", "h"];
const vertical = ["1", "2", "3", "4", "5", "6", "7", "8"];
const lodash = require("lodash");

module.exports = {
  initBoard: function() {
    var board = []
    for (let i = 0; i<horizontal.length; i++) {
      for (let j = 0; j<vertical.length; j++) {
        const template = {
          pos: {h: "", v: ""},
          piece: {role: "", color: "", has_moved: false},
          playable: false
        };
        template.pos = {h: horizontal[i], v: vertical[j]};
        board.push(template);
      }
    }
    return board;
  },
  addPieces: function(board) {
    board.forEach(function(tile) {
      if (tile.pos.v === "2") tile.piece = {role: "pawn", color: "white", has_moved: false};
      if (tile.pos.v === "7") tile.piece = {role: "pawn", color: "black", has_moved: false};

      if (tile.pos.v === "1" && (tile.pos.h === "a" || tile.pos.h === "h")) tile.piece = {role: "rook", color: "white", has_moved: false};
      if (tile.pos.v === "8" && (tile.pos.h === "a" || tile.pos.h === "h")) tile.piece = {role: "rook", color: "black", has_moved: false};

      if (tile.pos.v === "1" && (tile.pos.h === "b" || tile.pos.h === "g")) tile.piece = {role: "knight", color: "white", has_moved: false};
      if (tile.pos.v === "8" && (tile.pos.h === "b" || tile.pos.h === "g")) tile.piece = {role: "knight", color: "black", has_moved: false};

      if (tile.pos.v === "1" && (tile.pos.h === "c" || tile.pos.h === "f")) tile.piece = {role: "bishop", color: "white", has_moved: false};
      if (tile.pos.v === "8" && (tile.pos.h === "c" || tile.pos.h === "f")) tile.piece = {role: "bishop", color: "black", has_moved: false};

      if (tile.pos.v === "1" && (tile.pos.h === "d" )) tile.piece = {role: "queen", color: "white", has_moved: false};
      if (tile.pos.v === "8" && (tile.pos.h === "d" )) tile.piece = {role: "queen", color: "black", has_moved: false};

      if (tile.pos.v === "1" && (tile.pos.h === "e" )) tile.piece = {role: "king", color: "white", has_moved: false};
      if (tile.pos.v === "8" && (tile.pos.h === "e" )) tile.piece = {role: "king", color: "black", has_moved: false};
    });
  },

  playerMove: function(board, color, pos1, pos2) {
    const x1 = horizontal.findIndex(item => item === pos1.h);
    const y1 = vertical.findIndex(item => item === pos1.v);
    const pcolor = getTileXY(board, x1, y1).piece.color;
    if (pcolor === color) {
      console.log("hello")
      return move(board, pos1, pos2);
    } else {
      return ""
    }
  },


  whoWon: function(board) {
    var bKing = false;
    var wKing = false;
    for (let i = 0; i < board.length; i++) {
      if (board[i].piece.role === "king" && board[i].piece.color === "white") wKing = true;
      if (board[i].piece.role === "king" && board[i].piece.color === "black") bKing = true;
    }

    if (bKing && wKing) {
      return "";
    } else {
      if (bKing) return "black";
      if (wKing) return "white";
    }
  }
}

function move(board, pos1, pos2) {
  console.log(pos1)
  console.log(pos2)
  if (validateMove(board, pos1, pos2)) {
    console.log("hello again!")
    const x1 = horizontal.findIndex(item => item === pos1.h);
    const y1 = vertical.findIndex(item => item === pos1.v);
    const x2 = horizontal.findIndex(item => item === pos2.h);
    const y2 = vertical.findIndex(item => item === pos2.v);
    const piece1 = getTileXY(board, x1, y1).piece;
    const tile2 = getTileXY(board, x2, y2);
    board[x1*8+y1].piece = {role: "", color: "", has_moved: false}
    board[x2*8+y2].piece = piece1;
    board[x2*8+y2].piece.has_moved = true;
    return board
  }
  return ""
};

function checkCells(board, tile) {
  if (tile.piece.role === "") {
    for (let i = 0; i < board.length; i++) {
      board[i].playable = false;
    }
  } else {
    for (let i = 0; i < board.length; i++) {
      board[i].playable = validateMove(board, tile, board[i]);
    }
  }
};

function validateMove(board, pos1, pos2) {
  if (!(horizontal.includes(pos1.h) && vertical.includes(pos1.v) && horizontal.includes(pos2.h) && vertical.includes(pos2.v))) {
    return false;
  };
  const x1 = horizontal.findIndex(item => item === pos1.h);
  const y1 = vertical.findIndex(item => item === pos1.v);
  const x2 = horizontal.findIndex(item => item === pos2.h);
  const y2 = vertical.findIndex(item => item === pos2.v);
  const hdiff = x2-x1;
  const vdiff = y2-y1;
  const tile1 = getTileXY(board, x1, y1);
  const tile2 = getTileXY(board, x2, y2);
  const piece = tile1.piece;

  if (piece.role === "pawn") {
    if (piece.color === "white"){
      if (vdiff === 2 && hdiff === 0 && !piece.has_moved && tile2.piece.role === "" && tilesAround(board, tile1, "v", 1, 0).piece.role==="") return true;
      if (vdiff === 1 && hdiff === 0 && tile2.piece.role === "") return true;
      if (vdiff === 1 && (hdiff === 1 || hdiff === -1) && tile2.piece.color === "black") return true;
    };
    if (piece.color === "black"){
      if (vdiff === 2 && hdiff === 0 && !piece.has_moved && tile2.piece.role === "" && tilesAround(board, tile1, "v", -1, 0).piece.role==="") return true;
      if (vdiff === -1 && hdiff === 0 && tile2.piece.role === "") return true;
      if (vdiff === -1 && (hdiff === 1 || hdiff === -1) && tile2.piece.color === "white") return true;
    };
  };

  if (piece.role === "rook") {
    const p = path(board, tile1, "c");
    for (let i = 0; i<p.length; i++) {
      if (lodash.isEqual(p[i], tile2)) {
        return true;
        break;
      };
    }
  }

  if (piece.role === "bishop") {
    const p = path(board, tile1, "d");
    for (let i = 0; i<p.length; i++) {
      if (lodash.isEqual(p[i], tile2)) {
        return true;
        break;
      };
    }
  }

  if (piece.role === "knight") {
    const p = [
      getTileXY(board, x1+1, y1+2),
      getTileXY(board, x1-1, y1+2),
      getTileXY(board, x1+2, y1+1),
      getTileXY(board, x1+2, y1-1),
      getTileXY(board, x1-2, y1+1),
      getTileXY(board, x1-2, y1-1),
      getTileXY(board, x1+1, y1-2),
      getTileXY(board, x1-1, y1-2)
    ]
    if (!(tile2.piece.color === tile1.piece.color)) {
      for (let i = 0; i<p.length; i++) {
        if (lodash.isEqual(p[i], tile2)) {
          return true;
          break;
        };
      }
    }
  }

  if (piece.role === "queen") {
    const p1 = path(board, tile1, "d");
    const p2 = path(board, tile1, "c");
    for (let i = 0; i<p1.length; i++) {
      if (lodash.isEqual(p1[i], tile2)) {
        return true;
        break;
      };
    }
    for (let i = 0; i<p2.length; i++) {
      if (lodash.isEqual(p2[i], tile2)) {
        return true;
        break;
      };
    }
  }

  if (piece.role === "king") {
    const p = [
      getTileXY(board, x1+1, y1),
      getTileXY(board, x1-1, y1),
      getTileXY(board, x1+1, y1+1),
      getTileXY(board, x1+1, y1-1),
      getTileXY(board, x1-1, y1+1),
      getTileXY(board, x1-1, y1-1),
      getTileXY(board, x1, y1-1),
      getTileXY(board, x1, y1-1)
    ]
    if (!(tile2.piece.color === tile1.piece.color)) {
      for (let i = 0; i<p.length; i++) {
        if (lodash.isEqual(p[i], tile2)) {
          return true;
          break;
        };
      }
    }
  }
  return false
};

function tilesAround(board, tile, dir, dist, dist2) {
  const x = horizontal.findIndex(item => item === tile.pos.h);
  const y = vertical.findIndex(item => item === tile.pos.v);
  if (dir==="h") {
    return getTileXY(board, x+dist, y);
  };
  if (dir==="v") {
    return getTileXY(board, x, y+dist);
  };
  if (dir==="d") {
    return getTileXY(board, x+dist, y+dist2);
  };
};

function path(board, tile, dir) {
  var path = [];
  if (dir==="d") {
    var blocked = false;
    var i = 0;
    while (!blocked) {
      i++
      const pos = getXY(board,tile)
      if (!(pos.x+i >=0 && pos.x+i < 8 && pos.y+i >=0 && pos.y+i < 8)) break;
      if (tile.piece.color === tilesAround(board, tile, dir, dist=i, dist2=i).piece.color) blocked=true;
      if (!blocked) {
        if (tile.piece.color != tilesAround(board, tile, dir, dist=i, dist2=i).piece.color && tilesAround(board, tile, dir, dist=i, dist2=i).piece.color != "") {blocked=true;};
        path.push(tilesAround(board, tile, dir, dist=i, dist2=i));
      };
    }
    var blocked = false;
    var i = 0;
    while (!blocked) {
      i++
      const pos = getXY(board,tile)
      if (!(pos.x+i >=0 && pos.x+i < 8 && pos.y-i >=0 && pos.y-i < 8)) break;
      if (tile.piece.color === tilesAround(board, tile, dir, dist=i, dist2=-i).piece.color) blocked=true;
      if (!blocked) {
        if (tile.piece.color != tilesAround(board, tile, dir, dist=i, dist2=-i).piece.color && tilesAround(board, tile, dir, dist=i, dist2=-i).piece.color != "") {blocked=true;};
        path.push(tilesAround(board, tile, dir, dist=i, dist2=-i));
      };
    }
    var blocked = false;
    var i = 0;
    while (!blocked) {
      i++
      const pos = getXY(board,tile)
      if (!(pos.x-i >=0 && pos.x-i < 8 && pos.y+i >=0 && pos.y+i < 8)) break;
      if (tile.piece.color === tilesAround(board, tile, dir, dist=-i, dist2=i).piece.color) blocked=true;
      if (!blocked) {
        if (tile.piece.color != tilesAround(board, tile, dir, dist=-i, dist2=i).piece.color && tilesAround(board, tile, dir, dist=-i, dist2=i).piece.color != "") {blocked=true;};
        path.push(tilesAround(board, tile, dir, dist=-i, dist2=i));
      };
    }
    var blocked = false;
    var i = 0;
    while (!blocked) {
      i++
      const pos = getXY(board,tile)
      if (!(pos.x-i >=0 && pos.x-i < 8 && pos.y-i >=0 && pos.y-i < 8)) break;
      if (tile.piece.color === tilesAround(board, tile, dir, dist=-i, dist2=-i).piece.color) blocked=true;
      if (!blocked) {
        if (tile.piece.color != tilesAround(board, tile, dir, dist=-i, dist2=-i).piece.color && tilesAround(board, tile, dir, dist=-i, dist2=-i).piece.color != "") {blocked=true;};
        path.push(tilesAround(board, tile, dir, dist=-i, dist2=-i));
      };
    };
  };
  if (dir==="c") {
    var blocked = false;
    var i = 0;
    while (!blocked) {
      i++
      const pos = getXY(board,tile)
      if (!(pos.x+i >=0 && pos.x+i < 8)) break;
      if (tile.piece.color === tilesAround(board, tile, "h", i, 0).piece.color) blocked=true;
      if (!blocked) {
        if (tile.piece.color != tilesAround(board, tile, "h", i, 0).piece.color && tilesAround(board, tile, "h", i, 0).piece.color != "") {blocked=true;};
        path.push(tilesAround(board, tile, "h", i, 0));
      };
    }
    var blocked = false;
    var i = 0;
    while (!blocked) {
      i++
      const pos = getXY(board,tile)
      if (!(pos.x-i >=0 && pos.x-i < 8)) break;
      if (tile.piece.color === tilesAround(board, tile, "h", -i, 0).piece.color) blocked=true;
      if (!blocked) {
        if (tile.piece.color != tilesAround(board, tile, "h", -i, 0).piece.color && tilesAround(board, tile, "h", -i, 0).piece.color != "") {blocked=true;};
        path.push(tilesAround(board, tile, "h", -i, 0));
      };
    }
    var blocked = false;
    var i = 0;
    while (!blocked) {
      i++
      const pos = getXY(board,tile)
      if (!(pos.y+i >=0 && pos.y+i < 8)) break;
      if (tile.piece.color === tilesAround(board, tile, "v", i, 0).piece.color) blocked=true;
      if (!blocked) {
        if (tile.piece.color != tilesAround(board, tile, "v", i, 0).piece.color && tilesAround(board, tile, "v", i, 0).piece.color != "") {blocked=true;};
        path.push(tilesAround(board, tile, "v", i, 0));
      };
    }
    var blocked = false;
    var i = 0;
    while (!blocked) {
      i++
      const pos = getXY(board,tile)
      if (!(pos.y-i >=0 && pos.y-i < 8)) break;
      if (tile.piece.color === tilesAround(board, tile, "v", -i, 0).piece.color) blocked=true;
      if (!blocked) {
        if (tile.piece.color != tilesAround(board, tile, "v", -i, 0).piece.color && tilesAround(board, tile, "v", -i, 0).piece.color != "") {blocked=true;};
        path.push(tilesAround(board, tile, "v", -i, 0));
      };
    };
  };
  return path;
};

function getTileXY(board, x, y) {
  if (x<horizontal.length && y<vertical.length && x>=0 && y>=0) {
    return board[x*8+y]
  }
};

function getXY(board, tile) {
  return {x: horizontal.findIndex(t => t === tile.pos.h), y: vertical.findIndex(t => t === tile.pos.v)};
}
