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

		public AccountController(ApplicationDbContext context)
		{
            _context = context;
            _context.Database.EnsureCreated();
		}

        #region Views 
        public IActionResult SignIn()
		{
			return View("SignIn");
		}
        
        [AllowAnonymous]
        public async Task<IActionResult> GoogleResponse()
        {

            var result = await this.HttpContext.AuthenticateAsync("Google");

            if (result.Succeeded)
            {
                var claimsGoogleID = result.Principal.Identities.First().Claims.Select(claim => claim.Value).First();

                var acct = _context.Accounts.SingleOrDefault(u => u.GoogleID == claimsGoogleID);

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


        #region User login and logout
        [AllowAnonymous]
        public async Task GoogleLogin()
        {
            await this.HttpContext.ChallengeAsync("Google", new AuthenticationProperties()
            {
                RedirectUri = Url.Action("GoogleResponse")
            });
        }

        [Authorize]
		private async Task LoginAsync(Account user)
		{
            var identity = new ClaimsIdentity(new[]
            {
                new Claim("UserName", user.UserName),
                new Claim("GoogleID", user.GoogleID)
            }, "Google");

            var principal = new ClaimsPrincipal(identity);

            HttpContext.User = principal;
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToPage("Index");
        }
        #endregion


        #region Database Operations
        [Authorize]
        public async Task CreateAccount(Account newUser)
        {
            _context.Accounts.Add(newUser);
            _context.SaveChanges();
        }

        [Authorize]
        public async Task UpdateAccount(Account acct)
        {
            _context.Accounts.Update(acct);
            await LoginAsync(acct);
        }
        #endregion
    }
}