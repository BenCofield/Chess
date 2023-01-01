using Microsoft.AspNetCore.Identity;

namespace Chess.Models.Account
{
	public class User : IdentityUser
	{
        public string Name { get; set; }

		public string GoogleID { get; set; }
	}
}

