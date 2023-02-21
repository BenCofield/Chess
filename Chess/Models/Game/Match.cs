﻿

namespace Chess.Models.Game
{
    public class Player
    {
        private int ConnectionId { get; set; }

        public string UserName { get; set; }    

        public Player(int id, string userName)
        {
            ConnectionId = id;
            UserName = userName;
        }
    }

    public class Match
    {
        public string randomUrl { get; set; }

        public Player PlayerWhite { get; set; }
        public Player PlayerBlack { get; set; }

        public IBoard BoardState { get; set; }


    }
}
