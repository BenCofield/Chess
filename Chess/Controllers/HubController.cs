
using Microsoft.AspNetCore.Mvc;
using Chess.Models.Account;
using Microsoft.AspNetCore.SignalR;
using Chess.Hubs;
using System.Security.Claims;
using Chess.Models;

namespace Chess.Controllers
{
	public class HubController : Controller
	{
        public IActionResult Lobby()
		{
			if (!HttpContext.User.Identity.IsAuthenticated)
			{
                var identity = new ClaimsIdentity(new[]
				{
					new Claim(ClaimTypes.Name, $"guest{RNG.GetRandomNumber()}")
				});
                HttpContext.User = new ClaimsPrincipal(identity);
				Console.WriteLine(HttpContext.User.Identity.Name);
            }
			return View("Lobby");
		}
	}
}

