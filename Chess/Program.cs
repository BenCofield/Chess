using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Google;
using Chess.Models.Account;
using Chess.Hubs;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Diagnostics;
using Azure.Core;
using Microsoft.AspNetCore.ResponseCompression;
using Chess.Models.Game;
using Microsoft.Extensions.Logging;

#region Builder Services
var builder = WebApplication.CreateBuilder(args);

//Entity Framework DbContext + SQL connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("LocalMySQL")));

builder.Services.AddAuthentication(opts => {
    opts.DefaultScheme = "Cookies";
    opts.RequireAuthenticatedSignIn = false;
    })
    .AddGoogle("Google", googleOptions =>
    {
        googleOptions.ClientId = builder.Configuration.GetValue<string>("GoogleSettings:ClientId");
        googleOptions.ClientSecret = builder.Configuration.GetValue<string>("GoogleSettings:ClientSecret");
    })
    .AddCookie("Cookies", options =>
    {
        options.ExpireTimeSpan = TimeSpan.FromMinutes(5);
        options.SlidingExpiration = true;
    });

builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

builder.Services.AddSignalR();
builder.Services.AddControllersWithViews();
builder.Services.AddSingleton<IGameRepository>(new GameRepository());
builder.Services.AddSingleton(new Random());
builder.Services.AddResponseCompression(opts =>
{
    opts.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
        new[] { "application/octet-stream" });
});
var app = builder.Build();
#endregion

// Configure the HTTP request pipeline.
app.UseResponseCompression();
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//Database Services
using (var scope = app.Services.CreateScope())
    using (var context = scope.ServiceProvider.GetService<ApplicationDbContext>())
        context.Database.EnsureCreated();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapHub<GameHub>(GameHub.HubUrl);
app.Run();