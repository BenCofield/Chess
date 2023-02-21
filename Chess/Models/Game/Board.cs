using System.Drawing;

namespace Chess.Models.Game
{

    public struct Space
    {
        public Space()
        {
        }

        public Piece piece { get; set; } = null;
    }

    public interface IBoard
    {
        public IBoard MovePiece();
    }

    public class Board : IBoard
    {
        public IBoard MovePiece()
        {

        }
    }
}
