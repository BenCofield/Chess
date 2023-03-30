import React, { FC } from 'react';
import { Board, Space } from './models';
import { ChessVM } from './chess';


//Map image paths
//Ex. Key: 'pawnwhite' returns 'pawn_white.png'
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
        let key = item.replace('./', '').replace('.png', '').replace('_', '');
        images[key] = r(item);
    });
    return images;
}

//Import image paths into 'images'
const images = importAll(require.context('~lib/img', false, /\.png$/));

//React component: PieceImg
//Render piece image
//--Parameters--
// imgPath: path to image
// returns: Image element of piece
const PieceImg: FC = ({img}: any) => {
    return (
        <img src={images[img]}/>
    );
}

//React component: Square
//render individual square on chess board
//--Parameters--
//  piece: 2d array of spaces from chessboard model, either a piece or 0
//  returns: Button element with either nothing or the piece image
const Square: FC = ({space, piece, command}: any) => {

    const content = (piece === 0) ? undefined : <PieceImg img={piece.img}/>;

    return (
        <td className="square" onClick={()=> command(space)}>
            {content}
        </td>
    );
}

//React component: BoardView
//render view using chess board model as argument
//--Parameters--
//  board: Chessboard model, 2d array of 8 rows by 8 rows
//  returns: View of board
export const BoardView: FC = ({binding}: any) => {

    //--All Render Logic--
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

                if (binding.selectedPiece.position == thisSpace) {
                    classes = "space-highlighted";
                }
            }

            row.push(<Square className={classes} space={thisSpace} piece={binding.board.BoardState[y][x]} command={binding.SquareClick}/>);
        }
        rows.push(<tr>{row}</tr>);
    }

    return (
        <div>
            <h1>Board</h1>

            <table className="board-view">
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    );
}