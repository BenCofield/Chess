"use strict";

console.log("Script Loaded");

const BoardState = [[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0]];

const WhitePieces = [];
const BlackPieces = [];

const BlackCaptured = [];
const WhiteCaptured = [];

class Pawn {
    constructor(color, xPos, yPos) {
        this.width = 64;
        this.height = 64;

        this.color = color;
        this.x = xPos;
        this.y = yPos;

        this.img = document.createElement('img');
        let src = (color === "black") ? "~/lib/img/rook_black.png" : "~/lib/img/rook_white.png";
        this.img.setAttribute('src', src);
    }

    MoveSpace(xNew, yNew) {
        this.x = xNew;
        this.y = yNew;
    }
}

function InitBoard() {
    for (let i = 0; i < 8; i++) {
        BlackPieces.push(new Pawn("black", i, 1));
        BoardState[i][1] = BlackPieces[i];
        WhitePieces.push(new Pawn("white", i, 6));
        BoardState[i][6] = WhitePieces[i];
    };
}

function StartGame() {
    InitBoard();
    chessBoardView.begin();
    console.log("Started Game");
    chessBoardView.UpdateView();
}

var chessBoardView = {

    canvas: document.createElement("canvas"),
    begin: function () {
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.canvas.style.backgroundImage = "url('/lib/img/board.png')";
        this.canvas.style.backgroundSize = "512px 512px";

        this.context = this.canvas.getContext("2d");
        document.getElementById("gameArea").appendChild(this.canvas);

        this.canvas.addEventListener('click', function (event) {
            var space = getSpaceClicked(chessBoardView.canvas, event);
            console.log(space.x, space.y);

            ClickAction(space);
        }, false);
    },
    //end begin function

    Clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    UpdateView: function () {
        this.Clear();

        WhitePieces.forEach(piece => DrawPiece(this.context, piece));

        BlackPieces.forEach(piece => DrawPiece(this.context, piece));

        console.log("Updated View");
    }
}

function DrawPiece(ctx, p) {
    ctx.drawImage(p.img, (p.x * 64), (p.y * 64), 64, 64);
}

function DrawRectButton(ctx, boardSpace) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
    ctx.fillRect((boardSpace.x * 64), (boardSpace.y * 64), 64, 64);
}

//return an object representing board space in format (x, y)
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

function ClickAction(spaceClick) {
    const clicked = BoardState[spaceClick.x][spaceClick.y];
    if (clicked === 0) return;

    else DrawRectButton(chessBoardView.context, spaceClick);
}

