using System;

namespace Chess.Models.Account
{
	public class User
	{
        private static HttpContext _httpContext => new HttpContextAccessor().HttpContext;

        public string? UserName => _httpContext.User.Claims.Where(c => c.Type == "UserName")
                                        .Select(c => c.Value)
                                        .SingleOrDefault();
    }
}

