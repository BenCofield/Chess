"use strict";

console.log("Script Loaded");

//unused atm
const WhitePieces = [];
const BlackPieces = [];

const BlackCaptured = [];
const WhiteCaptured = [];

function StartGame() {

    InitBoard();
    chessBoardView.begin();
    console.log("Started Game");
    chessBoardView.UpdateView();

}

function InitBoard() {

    let color = "black";

    //Pawns
    for (let i = 0; i < 8; i++) {
        BoardState[i][1] = new Pawn("black", i, 1);
        BoardState[i][6] = new Pawn("white", i, 6);
    }

    //Rooks
    for (let i = 0; i < 8; i = i + 7) {
        BoardState[i][0] = new Rook("black", i, 0);
        BoardState[i][7] = new Rook("white", i, 7);
    };

    //Knights
    for (let i = 1; i < 7; i = i + 5) {
        BoardState[i][0] = new Knight("black", i, 0);
        BoardState[i][7] = new Knight("white", i, 7);
    }

    //Bishops
    for (let i = 2; i < 6; i = i + 3) {
        BoardState[i][0] = new Bishop("black", i, 0);
        BoardState[i][7] = new Bishop("white", i, 7);
    }


    BoardState[4][0] = new Queen("black", 4, 0);
    BoardState[3][7] = new Queen("white", 3, 7);
    BoardState[3][0] = new King("black", 3, 0);
    BoardState[4][7] = new King("white", 4, 7);
}

const BoardState = [[0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0]];

const chessBoardView = {

    canvas: document.createElement("canvas"),
    begin: function () {
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.canvas.style.backgroundImage = "url('/lib/img/board.png')";
        this.canvas.style.backgroundSize = "512px 512px";

        this.context = this.canvas.getContext("2d");
        document.getElementById("gameArea").appendChild(this.canvas);

        this.canvas.addEventListener("click", (event) => clickAction(event), true);
    },
    //end begin function

    Clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    UpdateView: function () {
        this.Clear();

        BoardState.forEach(row => row.forEach(piece => this.DrawPiece(piece)));

        console.log("Updated View");
    },

    DrawPiece: function (piece) {
        if (piece === 0) return;

        this.context.drawImage(piece.img, (piece.x * 64), (piece.y * 64), 64, 64);
    },

    DrawRectButton: function (boardSpace) {
        this.context.fillStyle = "rgba(255, 255, 0, 0.5)";

        this.context.fillRect((boardSpace.x * 64), (boardSpace.y * 64), 64, 64);
    }
}

class Piece {

    width = 64;
    height = 64;

    possibleMoves = [];

    constructor(color, xPos, yPos) {
        this.color = color;
        this.x = xPos;
        this.y = yPos;
    }

    get img() {
        let image = document.createElement('img');
        let src = `/lib/img/${this.type}_${this.color}.png`;
        image.setAttribute('src', src);
        return image;
    }

    MoveSpace(space) {
        this.x = space.x;
        this.y = space.y;
    }
}

class Pawn extends Piece {
    type = "pawn";
    
    moveCount = 0;

    getPossibleMoves() {
        const list = [];

        let s = {
            x: this.x,
            y: this.y + 1
        };

        list.push(s);

        if (this.moveCount === 0) {

            let s = {
                x: this.x,
                y: this.y + 2,
            };

            list.push(s);
        }

        list.forEach(s => console.log(s.x, s.y));

        this.possibleMoves = list;
    }
}

class Rook extends Piece {
    type = "rook";
}

class Knight extends Piece {
    type = "knight";
}

class Bishop extends Piece {
    type = "bishop";
}

class King extends Piece {
    type = "king";
    
}

class Queen extends Piece {
    type = "queen";
}


function getSpaceClicked(canvas, event) {
    let rect = {
        left: canvas.offsetLeft,
        top: canvas.offsetTop,
    };

    return {
        x: ((event.clientX - rect.left) / 64) | 0,
        y: ((event.clientY - rect.top) / 64) | 0
    };
}

function SelectPiece(space) {

    if (BoardState[space.x][space.y] === 0) return;

    else {
        selectedPiece = BoardState[space.x][space.y];
        chessBoardView.DrawRectButton(space);

        selectedPiece.getPossibleMoves();
        selectedPiece.possibleMoves.forEach(sp => chessBoardView.DrawRectButton(sp));
    }
}

function MovePiece(piece, space) {

    BoardState[piece.x][piece.y] = 0;
    piece.MoveSpace(space);
    BoardState[space.x][space.y] = piece;
    selectedPiece = 0;

}

function clickAction(event) {

    var space = getSpaceClicked(chessBoardView.canvas, event);
    console.log(space.x, space.y);

    if (selectedPiece === 0) {
        SelectPiece(space);
    }

    else {
        MovePiece(selectedPiece, space);
        chessBoardView.UpdateView();
    }
}

var selectedPiece = 0;

StartGame();