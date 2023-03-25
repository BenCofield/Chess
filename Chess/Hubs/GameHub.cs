using Microsoft.AspNetCore.SignalR;
using Chess.Models.Game;
using System;

namespace Chess.Hubs
{
    public interface IGameClient
    {
        Task JoinedLobby();
        Task RollCall(Player player1, Player player2);
        Task Concede(string player);
        Task Victory(string player);

        Task StartGame(string color, string player, string opponent);
        Task ReceiveMove(object fromSpace, object toSpace);
    }

    public class GameHub : Hub<IGameClient>
	{
        public const string HubUrl = "/game";

        private IGameRepository _repo;
        private Random _rand;
        private ILogger<GameHub> _logger;

        public GameHub(IGameRepository repo, Random rand, ILogger<GameHub> logger)
        {
            _logger = logger;
            _repo = repo;
            _rand = rand;
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();

            _logger.LogInformation($"User {Context.User.Identity.Name} has joined the lobby");
            _repo.UserKey[Context.User.Identity.Name] = Context.ConnectionId;
            await Clients.Client(Context.ConnectionId).JoinedLobby();
            var game = _repo.Games.FirstOrDefault(g => !g.InProgress);
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

            if (game.InProgress)
            {
                BeginGame(game);
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var name = Context.User.Identity.Name;
            _repo.UserKey.Remove(name);

            var game = _repo.Games.FirstOrDefault(g => g.Player1.Name == name || g.Player2.Name == name);
            _repo.Games.Remove(game);

            return base.OnDisconnectedAsync(exception);
        }

        private void BeginGame(Game game)
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

            Clients.User(game.Player1.Name).StartGame(game.Player1.Color,
                                                      game.Player1.Name,
                                                      game.Player2.Name);
            Clients.User(game.Player2.Name).StartGame(game.Player2.Color,
                                                      game.Player2.Name,
                                                      game.Player1.Name);
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

