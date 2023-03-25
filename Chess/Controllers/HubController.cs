
using Microsoft.AspNetCore.Mvc;
using Chess.Models.Account;
using Microsoft.AspNetCore.SignalR;
using Chess.Hubs;
using System.Security.Claims;
using Chess.Models;
using Microsoft.AspNetCore.Authentication;

namespace Chess.Controllers
{
	public class HubController : Controller
	{
        public async Task<IActionResult> Lobby()
		{
			if (!HttpContext.User.Identity.IsAuthenticated)
			{
				var identity = new ClaimsIdentity(new[]
				{
					new Claim(ClaimTypes.Name, $"guest{RNG.GetRandomNumber()}")
				});
				var user = new ClaimsPrincipal(identity);
				var property = new AuthenticationProperties { IsPersistent = true };

                await HttpContext.SignInAsync(user, property);
            }
			return View("Game");
		}
	}
}

