
//Board object, hold state of chess board
export class Board {
    BoardState: any = [[0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0]];

    IsSpace(space: Space) {
        return (this.BoardState[space.y][space.x] !== undefined);
    }

    IsPiece(space: Space) {
        let temp = this.BoardState[space.y][space.x];

        if (temp !== undefined && temp !== 0) {
            return true;
        }
        else {
            return false;
        }
    }

    MovePiece(piece: Piece, toSpace: Space) {
        if (!(piece as Piece)) return -1;

        this.BoardState[piece.position.y][piece.position.x] = 0;
        this.BoardState[toSpace.y][toSpace.x] = piece;
        piece.position.y = toSpace.y;
        piece.position.x = toSpace.x;
        return 0;
    }

    InitBoard() {

        //Pawns
        for (let x = 0; x < 8; x++) {
            this.BoardState[1][x] = new Pawn("black", x, 1);
            this.BoardState[6][x] = new Pawn("white", x, 6);
        }

        //Rooks
        for (let x = 0; x < 8; x += 7) {
            this.BoardState[0][x] = new Rook("black", x, 0);
            this.BoardState[7][x] = new Rook("white", x, 7);
        }

        //Knights
        for (let x = 1; x < 7; x += 5) {
            this.BoardState[0][x] = new Knight("black", x, 0);
            this.BoardState[7][x] = new Knight("white", x, 7);
        }

        //Bishops
        for (let x = 2; x < 6; x += 3) {
            this.BoardState[0][x] = new Bishop("black", x, 0);
            this.BoardState[7][x] = new Bishop("white", x, 7);
        }

        //Kings and Queens
        this.BoardState[0][4] = new Queen("black", 4, 0);
        this.BoardState[7][3] = new Queen("white", 3, 7);
        this.BoardState[0][3] = new King("black", 3, 0);
        this.BoardState[7][4] = new King("white", 4, 7);
    }


}

//Generic space class
export class Space {
    x;
    y;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

//Base piece class. Abstract class, not to be instantiated, only child classes
export class Piece {
    type: string = "";
    width = 64;
    height = 64;

    color: string;
    position: Space;
    possibleMoves: Space[] = [];

    constructor(color: string, xPos: number, yPos: number) {
        this.color = color;
        this.position = new Space(xPos, yPos);
    }

    get img() {
        return this.type + this.color;
    }
}

//Class: Pawn
export class Pawn extends Piece {
    type: string = "pawn";
    moveCount: number = 0; //Pawn needs move count

    //Pawn can only move in one direction - +1 for black, -1 for white
    direction: number = (this.color === "black") ? 1 : -1;

    //Pawn move rule list
    GetPossibleMoves(board: Board) {

        const tempList = [];

        //First move and regular moves
        let space = new Space(this.position.x, this.position.y + this.direction);
        if (!(board.IsPiece(space)) ) {

            tempList.push(space);
            if (this.moveCount === 0) {

                space = new Space(this.position.x, this.position.y + (2*this.direction));

                if (!(board.IsPiece(space))) {
                    tempList.push(space);
                }
            }
        }

        //To capture pieces
        space = new Space(this.position.x + 1, this.position.y + this.direction);
        if (board.IsSpace(space) && board.IsPiece(space)) {

            let p: Piece = board.BoardState[space.y][space.x];
            if (p.color !== this.color) tempList.push(space);
        }

        space = new Space(this.position.x - 1, this.position.y + this.direction);
        if (board.IsSpace(space) && board.IsPiece(space)) {

            let p: Piece = board.BoardState[space.y][space.x];
            if (p.color !== this.color) tempList.push(space);
        }

        return tempList;
    }
}

//Class: Rook
export class Rook extends Piece {
    type = "rook";

    GetPossibleMoves(board: Board) {

        let moveList = [];

        //forward
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x, this.position.y + i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece: Piece = board.BoardState[s.y][s.x];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //right
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x + i, this.position.y);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece: Piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //back
        for (let i = 1; i < 8; i++) 
        {
            let s = new Space(this.position.x, this.position.y - i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece: Piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //left
        for (let i = 1; i < 8; i++)
        {
            let s = new Space(this.position.x - i, this.position.y);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece: Piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        return moveList;
    }
}

//Class: Knight
export class Knight extends Piece {
    type = "knight";

    GetPossibleMoves(board: Board) {
        let tempList: Space[] = [];

        //forward
        tempList.push(new Space(this.position.x + 1, this.position.y + 2));
        tempList.push(new Space(this.position.x - 1, this.position.y + 2));

        //right
        tempList.push(new Space(this.position.x + 2, this.position.y + 1));
        tempList.push(new Space(this.position.x + 2, this.position.y - 1));

        //back
        tempList.push(new Space(this.position.x + 1, this.position.y - 2));
        tempList.push(new Space(this.position.x - 1, this.position.y - 2));

        //left
        tempList.push(new Space(this.position.x - 2, this.position.y + 1));
        tempList.push(new Space(this.position.x - 2, this.position.y - 1));

        let moveList: Space[] = [];

        tempList.forEach(s => {

            if ((board.IsSpace(s))) {
                if (board.IsPiece(s)) {

                    let piece = board.BoardState[s.x, s.y];

                    if (piece.color !== this.color) {
                        moveList.push(s);
                    };
                }
                else {
                    moveList.push(s);
                }
            }
        });

        return moveList;
    }
}

//Class: Bishop
export class Bishop extends Piece {
    type = "bishop";

    GetPossibleMoves(board: Board) {

        let moveList = [];

        //forward-right
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x + i, this.position.y + i);

            if (!board.IsSpace(s)) break;

            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }

            moveList.push(s);
        }

        //forward-left
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x - i, this.position.y + i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //back-right
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x + i, this.position.y - i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //back-left
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x - i, this.position.y - i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        return moveList;
    }
}

//Class: King
export class King extends Piece {
    type = "king";

    GetPossibleMoves(board: Board) {
        let moveList: Space[] = [];

        let tempList = [
            new Space(this.position.x, this.position.y + 1),
            new Space(this.position.x, this.position.y - 1),
            new Space(this.position.x + 1, this.position.y),
            new Space(this.position.x - 1, this.position.y),
            new Space(this.position.x + 1, this.position.y + 1),
            new Space(this.position.x - 1, this.position.y - 1),
            new Space(this.position.x + 1, this.position.y - 1),
            new Space(this.position.x - 1, this.position.y + 1)];

        tempList.forEach(s => {
            if (board.IsSpace(s)) {
                if (board.IsPiece(s)) {
                    let piece = board.BoardState[s.x, s.y];
                    if (piece.color !== this.color) moveList.push(s);
                }
                else {
                    moveList.push(s);
                }
            }
        });

        return moveList;
    }
}

//Class: Queen
export class Queen extends Piece {
    type = "queen";

    GetPossibleMoves(board: Board) {

        let moveList = [];

        //forward
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x, this.position.y + i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //right
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x + i, this.position.y);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //back
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x, this.position.y - i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //left
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x - i, this.position.y);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x + i, this.position.y + i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //forward-left
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x - i, this.position.y + i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {
                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //back-right
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x + i, this.position.y - i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        //back-left
        for (let i = 1; i < 8; i++) {

            let s = new Space(this.position.x - i, this.position.y - i);
            if (!board.IsSpace(s)) break;
            if (board.IsPiece(s)) {

                let piece = board.BoardState[s.x, s.y];
                if (piece.color !== this.color) moveList.push(s);
                break;
            }
            moveList.push(s);
        }

        return moveList;
    }
}