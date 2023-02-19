var connection = new signalR.HubConnectionBuilder().withUrl("/Lobby").build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

connection.on()

$(document).ready( () => {

})