import * as signalR from '@microsoft/signalr';
import React, { useState, useEffect } from 'react';

export function Chat({ connection, session }: any) {
    
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState(new Array());

    useEffect(() => {
        connection.on("ReceiveMessage", (message, user) => onReceiveMessage);
    }, []);

    const onMessageChanged = (event) => setMessage(event.target.value);

    const onSendMessage = async (event) => {

        if (message === '') return;
        connection.invoke("SendMessage", message).catch((err) => {
            return console.error(err.toString());
        });
        setMessage('');
        event.preventDefault();
    };

    const onReceiveMessage = (message, user) => {
        let newMessage = {
            user: user,
            message: message
        };
        
        let list = messageList;
        list.push(newMessage);
        setMessageList(messageList);
    };

    const chat = messageList.map(m =>
        <li className={(m.user === session.user) ? "sent-message" : "received-message"}>{m.message}</li>);

    return (
        <div>
            <ul>
                {chat}
            </ul>
            <hr/>
            <form onSubmit={onSendMessage} className="chat-input">
                <input name="message" onChange={onMessageChanged}/>
                <button type="submit"></button>
            </form>
        </div>
    );
}