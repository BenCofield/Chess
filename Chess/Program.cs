using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Google;
using Chess.Models.Account;
using Chess.Hubs;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Diagnostics;
using Azure.Core;

#region Builder Services
var builder = WebApplication.CreateBuilder(args);

//Entity Framework DbContext + SQL connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DockerMSSQL")));

builder.Services.AddAuthentication("Cookies")
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
builder.Services.AddHttpContextAccessor();
builder.Services.AddSignalR();
builder.Services.AddControllersWithViews();
var app = builder.Build();
#endregion

// Configure the HTTP request pipeline.
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
app.MapHub<GameHub>("/Game");
app.MapHub<LobbyHub>("/Lobby");
app.Run();