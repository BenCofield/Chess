"use strict";

console.log("Script Loaded");

connection.on("Start", game.StartGame(userName, oppName));

connection.on("ReceiveMove", game.ReceiveMove(piece, space));

const game = {

    user,
    opponent,

    ReceiveMove(piece, space) {

        User.MovePiece(piece, space);
    },

    SendMove(piece, space) {

        connection.invoke("SendMove", this.opponent, piece, space).catch((err) => {

            return console.error(err.toString());
        });
    },

    StartGame(userName, oppName) {

        this.user = userName;
        this.opponent = oppName;

        Board.InitBoard();
        chessBoardView.begin();
        console.log("Started Game");
        chessBoardView.UpdateView();
    },

    InvokeAction(space) {
        if (User.selectedPiece === 0) {
            User.SelectPiece(space);
        }

        else {
            MovePiece(selectedPiece, space);
            chessBoardView.UpdateView();
        }
    }

};

const User = {

    selectedPiece = 0,

    SelectPiece(space) {

        if (Board.BoardState[space.x][space.y] === 0) return;

        else {
        selectedPiece = Board.BoardState[space.x][space.y];
        chessBoardView.DrawRectButton(space);

        selectedPiece.getPossibleMoves();
        selectedPiece.possibleMoves.forEach(sp => chessBoardView.DrawRectButton(sp));
        }
    },

    MovePiece(piece, space) {

        Board.BoardState[piece.x][piece.y] = 0;
        piece.MoveSpace(space);
        Board.BoardState[space.x][space.y] = piece;
        this.selectedPiece = 0;
    },
}


//chess board object
const Board = {

    BlackCaptured = [],
    WhiteCaptured = [],

    BoardState:[[0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]],

    IsSpace(space) {
        return (BoardState[space.x][space.y] !== undefined);
    },

    IsPiece(space) {
        let temp = BoardState[space.x][space.y];

        if (temp !== undefined && temp !== 0) {
            return true;
        }
        else {
            return false;
        }
    },

    InitBoard() {

        //Pawns
        for (let i = 0; i < 8; i++) {
            this.BoardState[i][1] = new Pawn("black", i, 1);
            this.BoardState[i][6] = new Pawn("white", i, 6);
        }

        //Rooks
        for (let i = 0; i < 8; i = i + 7) {
            this.BoardState[i][0] = new Rook("black", i, 0);
            this.BoardState[i][7] = new Rook("white", i, 7);
        }

        //Knights
        for (let i = 1; i < 7; i = i + 5) {
            this.BoardState[i][0] = new Knight("black", i, 0);
            this.BoardState[i][7] = new Knight("white", i, 7);
        }

        //Bishops
        for (let i = 2; i < 6; i = i + 3) {
            this.BoardState[i][0] = new Bishop("black", i, 0);
            this.BoardState[i][7] = new Bishop("white", i, 7);
        }


        this.BoardState[4][0] = new Queen("black", 4, 0);
        this.BoardState[3][7] = new Queen("white", 3, 7);
        this.BoardState[3][0] = new King("black", 3, 0);
        this.BoardState[4][7] = new King("white", 4, 7);
    }
}

//chess board view model
const chessBoardView = {

    canvas: document.createElement("canvas"),

    begin() {
        this.canvas.width = 512;
        this.canvas.height = 512;
        this.canvas.style.backgroundImage = "url('/lib/img/board.png')";
        this.canvas.style.backgroundSize = "512px 512px";

        this.context = this.canvas.getContext("2d");
        document.getElementById("gameArea").appendChild(this.canvas);

        this.canvas.addEventListener("click", (event) => getSpaceClicked(event), true);
    },

    getSpaceClicked(event) {
        let rect = {
            left: this.canvas.offsetLeft,
            top: this.canvas.offsetTop,
        };

        let space = {
            x: ((event.clientX - rect.left) / 64) | 0,
            y: ((event.clientY - rect.top) / 64) | 0
        };

        game.InvokeAction(space);
    },

    Clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    UpdateView() {
        this.Clear();

        BoardState.forEach(row => row.forEach(piece => this.DrawPiece(piece)));

        console.log("Updated View");
    },

    DrawPiece(piece) {
        if (piece === 0) return;

        this.context.drawImage(piece.img, (piece.x * 64), (piece.y * 64), 64, 64);
    },

    DrawRectButton(boardSpace) {
        this.context.fillStyle = "rgba(255, 255, 0, 0.5)";

        this.context.fillRect((boardSpace.x * 64), (boardSpace.y * 64), 64, 64);
    }
    
}


//Base piece class
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

//Class: Pawn
class Pawn extends Piece {
    type = "pawn";
    
    moveCount = 0;

    //Pawn can only move in one direction - +1 for black, -1 for white
    direction = (this.color === "black") ? 1 : -1;

    //Pawn move rule list
    get possibleMoves() {

        const tempList = [];

        //First move and regular moves
        let space = {
            x: this.x,
            y: this.y + this.direction
        };

        if ( Board.IsSpace(space) && !(Board.IsPiece(space)) ) {

            tempList.push(space);

            if (this.moveCount === 0) {

                space = {
                    x: this.x,
                    y: this.y + (2 * this.direction)
                };

                if (!(Board.IsPiece(space))) {
                    tempList.push(space);
                }
            }
        }

        //To capture pieces
        space = {
            x: this.x + 1,
            y: this.y + this.direction
        };

        if (Board.IsSpace(space) && (Board.IsPiece(space))) {
            tempList.push(space);
        }

        space = {
            x: this.x - 1,
            y: this.y + this.direction
        };

        if (Board.IsSpace(space) && (Board.IsPiece(space))) {
            tempList.push(space);
        }

        return tempList;
    }
}

class Space {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//Class: Rook
class Rook extends Piece {
    type = "rook";

    get possibleMoves() {

        let moveList = [];

        //forward
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x, this.y + i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //right
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x + i, this.y);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //back
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x, this.y - i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //left
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x - i, this.y);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        return moveList;
    }
}


//Class: Knight
class Knight extends Piece {
    type = "knight";

    get possibleMoves() {
        let tempList = [];

        //forward
        tempList.push(new Space(this.x + 1, this.y + 2));
        tempList.push(new Space(this.x - 1, this.y + 2));

        //right
        tempList.push(new Space(this.x + 2, this.y + 1));
        tempList.push(new Space(this.x + 2, this.y - 1));

        //back
        tempList.push(new Space(this.x + 1, this.y - 2));
        tempList.push(new Space(this.x - 1, this.y - 2));

        //left
        tempList.push(new Space(this.x - 2, this.y + 1));
        tempList.push(new Space(this.x - 2, this.y - 1));

        let moveList = [];

        tempList.forEach(s => {

            if (Board.IsSpace(s)) {

                if (Board.IsPiece(s)) {

                    let piece = Board.BoardState[s.x, s.y];

                    if (piece.color !== this.color) {
                        moveList.push(s);
                    };
                };
            }
        });

        return moveList;
    }
}


//Class: Bishop
class Bishop extends Piece {
    type = "bishop";

    get possibleMoves() {

        let moveList = [];

        //forward-right
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x + i, this.y + i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //forward-left
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x - i, this.y + i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //back-right
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x + i, this.y - i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //back-left
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x - i, this.y - i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        return moveList;
    }
}

class King extends Piece {
    type = "king";

    get possibleMoves() {
        let moveList = [];

        let tempList = [
            new Space(this.x, this.y),
            new Space(this.x, this.y),
            new Space(this.x, this.y),
            new Space(this.x, this.y),
            new Space(this.x, this.y),
            new Space(this.x, this.y),
            new Space(this.x, this.y),
            new Space(this.x, this.y)];

        tempList.forEach(s => {
            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);
            }
        });

        return moveList;
    }
}

class Queen extends Piece {
    type = "queen";

    get possibleMoves() {

        let moveList = [];

        //forward
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x, this.y + i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //right
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x + i, this.y);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //back
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x, this.y - i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //left
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x - i, this.y);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x + i, this.y + i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //forward-left
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x - i, this.y + i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //back-right
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x + i, this.y - i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        //back-left
        for (let i = 1; i < 8; i++) {
            let s = new Space(this.x - i, this.y - i);

            if (!Board.IsSpace(s)) break;

            if (Board.IsPiece(s)) {

                let piece = Board.BoardState[s.x, s.y];

                if (piece.color !== this.color) moveList.push(s);

                break;
            }
        }

        return moveList;
    }
}