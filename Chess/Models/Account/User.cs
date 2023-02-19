using System;
using Microsoft.AspNetCore.Mvc;

namespace Chess.Models.Account
{
	public class User
	{
        private readonly HttpContext HttpContext;

        public string? UserName => HttpContext.User.Claims.Where(c => c.Type == "UserName")
                                        .Select(c => c.Value)
                                        .SingleOrDefault();
        public User()
        {
            HttpContext = new HttpContextAccessor().HttpContext;
        }
    }
}

