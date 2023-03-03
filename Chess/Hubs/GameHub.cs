using Microsoft.AspNetCore.SignalR;
using Chess.Models.Game;
using System;

namespace Chess.Hubs
{
    public interface IGameClient
    {
        Task RenderBoard(Board board);
        Task Color(string color);
        Task Turn(string player);
        Task RollCall(Player player1, Player player2);
        Task Concede();
        Task Victory(string player, Board board);

        Task StartGame();
        Task ReceiveMove(object fromSpace, object toSpace);
    }

    public class GameHub : Hub<IGameClient>
	{
        public const string HubUrl = "/game";

        private IGameRepository _repo;
        private Random _rand;

        public GameHub(IGameRepository repo, Random rand)
        {
            _repo = repo;
            _rand = rand;
        }

        public override async Task OnConnectedAsync()
        {
            

            var game = _repo.Games.FirstOrDefault(g => !g.InProgress);
            _repo.UserKey[Context.User.Identity.Name] = Context.ConnectionId;
            if (game is null)
            {
                game = new Game();
                game.Id = Guid.NewGuid().ToString();
                game.Player1.ConnID = Context.ConnectionId;
                _repo.Games.Add(game);
            }
            else
            {
                game.Player2.ConnID = Context.ConnectionId;
                game.InProgress = true;
            }

            Console.WriteLine($"Connected: {Context.ConnectionId}/{Context.User.Identity.Name}");
            await base.OnConnectedAsync();

            if (game.InProgress)
            {
                RandomAssignColors(game);
            }
        }

        private void RandomAssignColors(Game game)
        {
            var result = _rand.Next(2);
            if (result == 1)
            {
                game.Player1.Color = Game.White;
                game.Player2.Color = Game.Black;
                game.CurrentPlayer = game.Player1;
            }
            else
            {
                game.Player1.Color = Game.Black;
                game.Player2.Color = Game.White;
                game.CurrentPlayer = game.Player2;
            }
        }
        
        private void SendMove(string user, object fromSpace,  object toSpace)
        {
            var game = _repo.Games.FirstOrDefault(g => g.CurrentPlayer.Name == user);
            if (game == null) return;

            if (game.Player1.Name == user)
            {
                game.CurrentPlayer = game.Player2;
            }
            else
            {
                game.CurrentPlayer = game.Player1;
            }
            Clients.User(game.CurrentPlayer.Name).ReceiveMove(fromSpace, toSpace);
        }
    }
}

