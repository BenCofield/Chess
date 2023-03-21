
var connection = new signalR.HubConnectionBuilder().withUrl("/Lobby").build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

$(document).ready(() => {
    connection.invoke("RequestMatch", message).catch((err) => {
        return console.error(err.toString());
    });
});

connection.on("ReceiveResponse", (response) => {
    if (response === null) {
        return;
    }

    

});

connection.on("MatchFound", () => {
    connection.invoke("AcceptMatch").catch((err) => {
        return console.error(err.toString());
    })
})