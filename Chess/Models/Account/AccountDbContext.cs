using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Chess.Models.Account
{
	public class AccountDbContext : IdentityDbContext<Account>
	{
		public DbSet<Account> Accounts { get; set; }

		public AccountDbContext(DbContextOptionsBuilder opts) : base()
		{
			opts.UseMySQL("ChessDb");
		}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
			builder.Entity<Account>(entity =>
			{
				entity.HasKey(e => e.Id);
				entity.Property(e => e.UserName).IsRequired();
			});
        }

		public void CreateAccount(Account account)
		{

		}

		
    }
}

