using System;
using System.Security.Cryptography;

namespace Chess.Models
{
	public static class RNG
	{
		public static uint GetRandomNumber()
		{
			var rng = RandomNumberGenerator.Create();
			var bytes = new byte[100];
			rng.GetBytes(bytes);
			return Convert.ToUInt32(bytes);
        }
	}
}

