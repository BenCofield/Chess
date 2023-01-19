/*
    FILE: "AccountController.cs"
    namespace: "Chess.Controllers"
*/

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using System.Security;
using System.Security.Claims;
using System.Web;

using Chess.Models.Account;
using Chess.Models;


//Class: "AccountController"
//Return account related views and execute account, authentication, and database functions

namespace Chess.Controllers
{
	public class AccountController : Controller
	{
		private readonly ApplicationDbContext _context;

        public ClaimsPrincipal User { get { return HttpContext.User; } }

		public AccountController(ApplicationDbContext context)
		{
            _context = context;
		}


        #region Views 
        public IActionResult SignIn()
		{
			return View("SignIn");
		}

        [AllowAnonymous]
        public async Task GoogleLogin()
        {
            await HttpContext.ChallengeAsync("Google", new AuthenticationProperties()
            {
                RedirectUri = Url.Action("GoogleResponse")
            });
        }

        [AllowAnonymous]
        public async Task<IActionResult> GoogleResponse()
        {

            var result = await HttpContext.AuthenticateAsync("Google");

            if (result.Succeeded)
            {
                var claimsGoogleID = result.Principal.Identities.First().Claims.Select(claim => claim.Value).First();

                var acct = _context.Accounts.First(u => u.GoogleID == claimsGoogleID);

                if (acct == null)
                {
                    return View("CreateAccount", new Account()
                    {
                        GoogleID = claimsGoogleID,
                    });
                }
                else
                {
                    await LoginAsync(acct);
                    return RedirectToAction("Index", "Home");
                }

            }
            else
            {
                return View("SignIn");
            }
        }

        public IActionResult Rankings()
        {
            var acctList = _context.Accounts.OrderBy(x => x.Id).ToList();

            return View("Rankings", acctList);
        }

        public IActionResult Settings()
        {
            return View("Settings");
        }
        #endregion


        #region HttpContext User
        [Authorize]
		private async Task LoginAsync(Account user)
		{
            var claims = new ClaimsIdentity(new[]
            {
                new Claim("UserName", user.UserName),
                new Claim("GoogleId", user.GoogleID)
            }, "Custom");

            var princpal = new ClaimsPrincipal(claims);
            HttpContext.User = princpal;

            var u = Request.HttpContext.User;
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
        #endregion


        #region Chess Database Operations
        [Authorize]
        public async Task<IActionResult> CreateAccount(Account newUser)
        {
            
            await LoginAsync(newUser);
            _context.Database.EnsureCreated();
            _context.Accounts.Add(newUser);
            _context.SaveChanges();

            return RedirectToAction("Index", "Home");
        }

        [Authorize]
        public async void UpdateAccount(Account acct)
        {
            _context.Accounts.Update(acct);
            await LoginAsync(acct);
        }
        #endregion
    }
}