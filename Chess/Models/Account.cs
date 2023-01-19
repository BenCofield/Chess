using Microsoft.EntityFrameworkCore;

namespace Chess.Models.Account
{

    /*
     * Class: Account
     */
    public class Account
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string GoogleID { get; set; }
    }


    /*
     * Class: ApplicationDbContext
     */
    public class ApplicationDbContext : DbContext
	{
		public DbSet<Account> Accounts { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Account>().ToTable("accounts");
            builder.Entity<Account>(entity =>
            {
                entity.HasKey(x => x.Id);
                entity.Property(x => x.UserName).IsRequired();
                entity.Property(x => x.GoogleID).IsRequired(); 
            });
        }

        
    }
}

