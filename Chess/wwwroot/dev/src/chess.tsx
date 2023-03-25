import React, { FC, useState, useEffect} from 'react';
import { BoardView } from './views';
import { Board, Space } from './models';
import { Session } from './game';

export class ChessVM {
    color: string;
    board = new Board();
    selectedPiece: any = 0;
    possibleMoveList = new Array();
    turn: string = 'white';

    constructor(color) {
        this.color = color;
    }

    Start() {
        this.board.InitBoard();
        this.SquareClick.bind(this);
    }

    SquareClick(space: Space) {
        if (this.selectedPiece === 0) {
            let p = this.board.BoardState[space.y][space.x];
            if (p === 0) return;

            this.selectedPiece = p;
            this.possibleMoveList = p.GetPossibleMoves(this.board);
        }
        else {
            this.board.MovePiece(this.selectedPiece, space);
            this.selectedPiece = 0;
            this.ChangeTurn();
        }
    }

    ReceiveMove(fromSpace: Space, toSpace: Space) {
        let p = this.board.BoardState[fromSpace.y][fromSpace.x];
        this.board.MovePiece(p, toSpace);
        this.ChangeTurn();
    }

    ChangeTurn() {
        this.turn = (this.turn === 'white') ? 'black' : 'white';
    }
}

interface ChessProps {
    connnection: signalR.HubConnection;
    session: Session;
}

export const Chess: FC<ChessProps> = ({ connection, session }) => {

    const [vm, setVm] = useState(() => new ChessVM(session.color));
    
    useEffect(() => {
        vm.Start();
        connection.on("ReceiveMove",
            (fromSpace, toSpace) => ReceiveMove(fromSpace, toSpace));
    }, []);

    const ReceiveMove = (fromSpace, toSpace) => {
        vm.ReceiveMove(fromSpace, toSpace);
        setVm(vm);
    };

    const ClientClick = (square) => {
        vm.SquareClick(square);
        setVm(vm);
    };

    return (
        <BoardView binding={vm} command={ClientClick}/>
    );
}