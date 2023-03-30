import React, { FC, useState, useEffect, useContext, createContext} from 'react';
import { BoardView } from './views';
import { Board, Space } from './models';
import { Session, ConnectionContext } from './game';
import { Chat } from './chat';

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
    session: Session;
}

export const SessionContext = createContext();

export const Chess: FC<ChessProps> = ({ session }) => {

    const connection = useContext(ConnectionContext);
    const [vm, set] = useState(() => new ChessVM(session.color));
    
    useEffect(() => {
        set((vm) => {vm.Start(); return vm;});
        connection.on("ReceiveMove",
            (fromSpace, toSpace) => onReceiveMove(fromSpace, toSpace));
    }, []);

    const onReceiveMove = (fromSpace, toSpace) => {
        vm.ReceiveMove(fromSpace, toSpace);
    };

    const onClientClick = (square) => {
        vm.SquareClick(square);
    };

    return (
        <SessionContext.Provider className="chess" value={session}>
            <BoardView className="board" binding={vm} command={onClientClick}/>
            <Chat className="chat"/>
        </SessionContext.Provider>
    );
}