import React from 'react';
import { Game } from './game';
import ReactDOM from 'react-dom/client';
import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder().withUrl("/game").withAutomaticReconnect().build();
connection.start().catch((err) => console.error(err.toString()));

$(document).ready(async () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<Game connection={connection}/>);
});