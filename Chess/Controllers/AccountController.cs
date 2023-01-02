using Microsoft.AspNetCore.Mvc;
using Chess.Models.Account;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;

namespace Chess.Controllers
{
	public class AccountController : Controller
	{
		private readonly ApplicationDbContext _context;


		public AccountController(ApplicationDbContext context)
		{
			_context = context;
		}

		public IActionResult SignIn()
		{
			return View("SignIn");
		}

		[AllowAnonymous]
		public async Task GoogleLogin()
		{

            await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme, new AuthenticationProperties()
            {
                RedirectUri = Url.Action("GoogleResponse")
            });
        }

		[AllowAnonymous]
		public async Task<IActionResult> GoogleResponse()
		{

            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

			if (result.Succeeded)
			{
				var claimsGoogID = result.Principal.Identities.First().Claims.Select(claim => claim.Value).First();

				var user = new User()
				{
					GoogleID = claimsGoogID
				};

				return View("CreateAccount", user);
			}
			else
			{
				return View("SignIn");
			}
		}


		public IActionResult CreateAccount(User newUser)
		{
				
			_context.Database.EnsureCreated();

            var acct = new Account()
            {
				GoogleID = newUser.GoogleID,
                UserName = newUser.Name
            };

            _context.Accounts.Add(acct);
			_context.SaveChanges();
			return RedirectToAction("Index", "Home");
        }

		public async Task Login(User user)
		{

        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }

		public IActionResult Rankings()
		{
			var acctList = _context.Accounts.OrderBy(x => x.Id).ToList();

			return View("Rankings", acctList);
		}
    }
}

