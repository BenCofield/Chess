"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/Game").build();

connection.on("ReceiveMessage", function (message) {
    var li = document.createElement('li');
    li.textContent = message;
    $("#messagesList").append(li);
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

$("#sendButton").click( function() {
    var message = $("#messageInput").val();

    connection.invoke("SendMessage", message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

$("#messageInput").on("enter", function () {
    var message = $("#messageInput").val();

    connection.invoke("SendMessage", message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});