using System;
using System.ComponentModel;
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
			return (uint)BitConverter.ToUInt64(bytes);
        }

		public static string GetRandomString()
		{
			var rng = RandomNumberGenerator.Create();
			var bytes = new byte[100];
			rng.GetBytes(bytes);
			return Convert.ToBase64String(bytes);
		}
	}
}

