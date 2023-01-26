using Microsoft.AspNetCore.SignalR;

namespace Chess.Hubs
{

    public class GameHub : Hub
	{

        public async Task SendMessage(string user, string message)
        {
            await Clients.User(user).SendAsync("ReceiveMessage", user, message);
        }

        public async Task SendMove(string user, object piece, object space)
        {
            await Clients.User(user).SendAsync("ReceiveMove", piece, space);
        }

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
    }
}

