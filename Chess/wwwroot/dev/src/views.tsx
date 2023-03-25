import React, { FC } from 'react';
import { Board, Space } from './models';
import { ChessVM } from './chess';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
        let key = item.replace('./', '').replace('.png', '').replace('_', '');
        images[key] = r(item);
    });
    return images;
}

const images = importAll(require.context('../../lib/img', false, /\.png$/));

//React component: PieceImg
//Render piece image
//--Parameters--
// imgPath: path to image
// returns: Image element of piece
const PieceImg = ({img}: any) => {
    return (
        <img src={images[img]}/>
    );
}

//React component: Square
//render individual square on chess board
//--Parameters--
//  piece: 2d array of spaces from chessboard model, either a piece or 0
//  returns: Button element with either nothing or the piece image
const Square = ({space, piece, command}: any) => {

    const content = (piece === 0) ? undefined : <PieceImg img={piece.img}/>;

    return (
        <button onClick={()=> command(space)}>
            {content}
        </button>
    );
}

//React component: BoardView
//render view using chess board model as argument
//--Parameters--
//  board: Chessboard model, 2d array of 8 rows by 8 rows
//  returns: View of board
export const BoardView: FC = ({binding}: any) => {
    const rows = [];
    for (var y = 0; y < 8; y++) {

        const row = [];
        for (var x = 0; x < 8; x++) {

            const thisSpace = new Space(x, y);
            var classes = "space";
            if (binding.selectedPiece !== 0) {

                if (binding.highlightList !== undefined) 
                {
                    for (let i = 0; i < binding.highlightList.length; i++) 
                    {
                        const space = binding.highlightList[i];
                        if (space.x === thisSpace.x && space.y === thisSpace.y)
                            classes = "space-highlighted";
                    }
                }

                if (binding.selectedPiece.position.x === thisSpace.x && binding.selectedPiece.position.y === thisSpace.y) {
                    classes = "space-highlighted";
                }
            }

            row.push(<td className={classes}><Square command={binding.SquareClick} space={thisSpace} piece={binding.board[y][x]}/></td>);
        }
        rows.push(<tr>{row}</tr>);
    }

    return (
        <div>
            <h1>Board</h1>

            <table id="board-view">
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
}