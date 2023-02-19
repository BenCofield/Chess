/*
    FILE: "AccountController.cs"
    namespace: "Chess.Controllers"
*/

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

using Chess.Models.Account;
using Microsoft.AspNetCore.Identity;

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
		}

        #region Views 
        public IActionResult SignIn()
		{
            return View("SignIn");
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
            await HttpContext.ChallengeAsync("Google", new AuthenticationProperties()
            {
                RedirectUri = Url.Action("GoogleResponse")
            });
        }

        [AllowAnonymous]
        public async Task<IActionResult> GoogleResponse()
        {

            var result = await HttpContext.AuthenticateAsync("Cookies");

            if (result.Succeeded)
            {
                var claimsGoogleID = result.Principal
                                           .Identities
                                           .First()
                                           .Claims
                                           .Select(claim => claim.Value)
                                           .First();

                var acct = _context.Accounts
                                   .SingleOrDefault(u => u.GoogleID == claimsGoogleID);

                if (acct == null)
                {
                    return View("CreateAccount", new Account()
                    {
                        GoogleID = claimsGoogleID,
                    });
                }
                else
                {
                    await Login(acct);
                    return Redirect("/");
                }
            }
            else
            {
                return View("SignIn");
            }
        }

        [AllowAnonymous]
        private async Task Login(Account user)
        {
            var identity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim("GoogleID", user.GoogleID)
            }, "Cookies");

            await HttpContext.SignInAsync(new ClaimsPrincipal(identity));
        }

        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Home");
        }
        #endregion


        #region Database Operations
        [Authorize]
        public async Task<IActionResult> CreateAccount(Account newUser)
        {
            _context.Accounts.Add(newUser);
            _context.SaveChanges();
            await Login(newUser);
            return RedirectToAction("Index", "Home");
        }

        [Authorize]
        public async void UpdateAccount(Account acct)
        {
            _context.Accounts.Update(acct);
            await Login(acct);
        }
        #endregion
    }
}