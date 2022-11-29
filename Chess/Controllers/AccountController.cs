using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Chess.Models.Account;

namespace Chess.Controllers
{
	public class AccountController : Controller
	{
		//private UserManager<Account> _userManager;

		//public AccountController(UserManager<Account> usrMngr)
		//{
		//	_userManager = usrMngr;
		//}

		public IActionResult SignIn()
		{
			return View("SignIn");
		}

		public void GoogleLogin()
		{

		}

		public ViewResult CreateAccount()
		{

			return View();
		}

		
		//public async Task<IActionResult> CreateAccount(User newAccount)
		//{
		//	if (ModelState.IsValid)
		//	{
		//		var acct = new Account()
		//		{
		//			UserName = newAccount.Name
		//		};

		//		var result = await _userManager.CreateAsync(acct);

		//		if (result.Succeeded)
		//		{
		//			return RedirectToAction("Index");
		//		}

		//		else
		//		{
  //                  foreach (IdentityError error in result.Errors)
  //                      ModelState.AddModelError("", error.Description);
  //              }
		//	}

		//	return View(newAccount);
		//}
	}
}

