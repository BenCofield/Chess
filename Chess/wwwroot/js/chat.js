"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/Game").build();

connection.start().catch(function (err) {
    return console.error(err.toString());
});

connection.on("ReceiveMessage", function (message) {
    var li = document.createElement('li').setAttribute('class', 'message');
    $('li').addClass('message');
    li.textContent = message;
    $("#messagesList").append(li);
});

$("#sendButton").click( function() {
    var message = $("#messageInput").val();

    connection.invoke("SendMessage", message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});



