import * as signalR from '@microsoft/signalr';
import React, { FC, useState, useEffect, useContext } from 'react';
import { SessionContext } from './chess';
import { ConnectionContext } from './game';

export const Chat: FC = () => {

    const connection = useContext(ConnectionContext);
    const session = useContext(SessionContext);
    
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState(new Array());

    useEffect(() => {
        connection.on("ReceiveMessage", (message, user) => onReceiveMessage);
    });

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

    return (
        <div className="chat-window">
            <ul className="message-list">
                {
                messageList.map(m => <li className={
                    (m.user === session.user) ? "sent-message" : "received-message"}>{m.message}</li>)
                }
            </ul>
            <hr/>
            <div className="chat-input">
                <input className="message-input" name="message" onChange={onMessageChanged}/>
                <button onClick={onSendMessage} className="submit-button" type="submit"></button>
            </div>
        </div>
    );
}