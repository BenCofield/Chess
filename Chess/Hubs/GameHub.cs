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
    }

    public class NameBasedUserIdProvider : IUserIdProvider
    {
        public virtual string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.Identity?.Name!;
        }
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

            await Groups.AddToGroupAsync(Context.ConnectionId, game.Id);
            await base.OnConnectedAsync();

            if (game.InProgress)
            {
                RandomAssignColors(game);
                //Todo: invoke begin
            }
        }

        private async void RandomAssignColors(Game game)
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

            await Clients.Client(game.Player1.ConnID).Color(game.Player1.Color);
            await Clients.Client(game.Player2.ConnID).Color(game.Player2.Color);
            await Clients.Group(game.Id).Turn(Game.White);
        }
    }
}

