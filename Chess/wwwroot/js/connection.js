
var connection = new signalR.HubConnectionBuilder().withUrl("/Game").build();

connection.start().catch((err) => {
    return console.error(err.toString());
});

connection.on("ReceiveMove", ReceiveMove(fromSpace, toSpace));

function ReceiveMove(from, to) {

};