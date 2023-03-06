using System.Collections.ObjectModel;

namespace Chess.Models.Game
{
    public class Game
    {
        public const string Black = "black";
        public const string White = "white";

        public string Id { get; set; }
        public Player Player1 { get; private set; } = new Player();
        public Player Player2 { get; private set; } = new Player();
        public Player CurrentPlayer { get; set; } = new Player();

        public IDictionary<object, object> MovesList = new Dictionary<object, object>();
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