using System;
using System.ComponentModel.DataAnnotations;

namespace Chess.Models.Account
{
	public class User
	{
		[Required]
		public string Name { get; set; }

	}
}

