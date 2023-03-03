
namespace Chess.Models.Game
{
    public interface IGameRepository
    {
        List<Game> Games { get; }

        //Store usernames + temporary users in game with connection ID
        public Dictionary<string, string> UserKey { get; } 
    }

    public class GameRepository : IGameRepository
    {
        public List<Game> Games { get; } = new List<Game>();

        public Dictionary<string, string> UserKey { get; } = new Dictionary<string, string>();
    }
}