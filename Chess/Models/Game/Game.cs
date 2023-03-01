
namespace Chess.Models.Game
{
    public class Game
    {
        public const string Black = "black";
        public const string White = "white";

        public string Id { get; set; }
        public Player Player1 { get; private set; }
        public Player Player2 { get; private set; }
        public Player CurrentPlayer { get; set; }

        public Piece[][] board { get; private set; }
        public bool InProgress { get; set; }

        public bool IsCheck { get; set; }
        public bool IsCheckmate { get; set; }
    }

    public class Player
    {
        public string ConnID { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
    }
}