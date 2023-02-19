using System;
using System.Security.Claims;
using Chess.Models.Account;
using Microsoft.AspNetCore.SignalR;
using Chess.Models;

namespace Chess.Hubs
{
    public static class UserHandler
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();

        public static string? RequestUser(string senderid)
        {
            if (ConnectedIds.Count() == 1)
            {
                return null;
            }

            else
            {
                var rand = new Random();
                while (true)
                {
                    var randIndex = rand.Next(ConnectedIds.Count());
                    var id = ConnectedIds.ElementAt(randIndex);
                    if (id != senderid)
                    {
                        return id;
                    }
                }
            }
        }
    }

    public class LobbyHub : Hub
	{
        public string name = "";

        public async override Task OnConnectedAsync()
        {
            UserHandler.ConnectedIds.Add(Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}

