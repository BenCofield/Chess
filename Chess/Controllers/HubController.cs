
using Microsoft.AspNetCore.Mvc;
using Chess.Models.Account;
using Microsoft.AspNetCore.SignalR;
using Chess.Hubs;

namespace Chess.Controllers
{
	public class LobbyController : Controller
	{
		private readonly IHubContext<LobbyHub> _hubContext;

		public LobbyController(IHubContext<LobbyHub> hubContext)
		{
			_hubContext = hubContext;
		}

		public IActionResult Lobby()
		{
			return View();
		}
	}
}

