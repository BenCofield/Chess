using System;
using System.Security.Claims;
using Chess.Models.Account;
using Microsoft.AspNetCore.SignalR;
using Chess.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Identity.Client;

namespace Chess.Hubs
{
    public class NameBasedUserIdProvider : IUserIdProvider
    {
        public virtual string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.Identity?.Name!;
        }
    }

    public class ConnectionPair
    {
        public string Id1 { get; set; }
        public string? Id2 { get; set; }

        public ConnectionPair(string id)
        {
            Id1 = id;
        }
    }

    public class Lobby
    {
        private static readonly Lobby _lobby = new Lobby();
        private Lobby() { }
        public static Lobby Instance { get { return _lobby; } }

        private List<ConnectionPair> _pairs;
        public List<ConnectionPair> Pairs
        {
            get => _pairs;
            set
            {
                _pairs = value;
            }
        }

        public async Task Add(string id)
        {
            if (Pairs.Count == 0)
            {
                Pairs.Add(new ConnectionPair(id));
            }
            else
            {
                Pairs[0].Id2 = id;
            }
        }
    }

    public static class UserHandler
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();

        public static List<ConnectionPair> ConnectionPairs = new List<ConnectionPair>();

        public static async Task AddToLobby(string senderid)
        {
            var lobby = Lobby.Instance;
            lobby.Add(senderid);
        }

        public static void Send()
        {
            var hub = Lobby.Instance;
        }
    }

    public class MatchHub : Hub
	{
        public async override Task OnConnectedAsync()
        {
            await UserHandler.AddToLobby(Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async void MatchFound(ConnectionPair pair)
        {
            await Clients.Client(pair.Id1).SendAsync("ReceiveResponse");
            await Clients.Client(pair.Id2!).SendAsync("ReceiveResponse");
        }

    }
}

