using Microsoft.AspNetCore.SignalR;

namespace Chess.Hubs
{
    public class Move
    {
        public struct Piece
        {
            public int x { get; set; }
            public int y { get; set; }
        }
        
        public struct Space
        {
            public int x { get; set; }
            public int y { get; set; }
        }
    }

    public class GameHub : Hub
	{
        public async Task SendMessage(string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }

        public async Task SendMove(Move move)
        {
            await Clients.All.SendAsync("ReceiveMove", move);
        }
    }
}

