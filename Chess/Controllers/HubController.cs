using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Razor;

namespace Chess.Controllers
{
	public class HubController : Controller
	{
		public IActionResult Game()
		{
			return View();
		}
	}
}

