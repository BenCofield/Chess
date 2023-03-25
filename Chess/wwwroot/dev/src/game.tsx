
import './sass/game.scss';
import * as signalR from '@microsoft/signalr';
import React, { FC, useState, useEffect, createContext } from 'react';
import { Lobby } from './lobby';
import { Chat } from './chat';
import { Chess } from './chess';

export const Game: FC = () => {
    const connection = new signalR.HubConnectionBuilder().withUrl("/game").build();

    const [inGame, setInGame] = useState(false);

    const [session, setSession] = useState(null);

    useEffect(() => {
        connection.start().catch((err) => console.error(err.toString()));  
        connection.on("StartGame", (color, user, opp) => StartGame(color, user, opp));
    }, [connection]);

    const StartGame = (color, user, opp) => {
        let s = {
            color: color,
            user: user,
            opp: opp
        }
        setSession(s);
        setInGame(true);
    };

    const view = (inGame === false) ? <div><Lobby /></div> : <div><Chess connection={connection} session={session}/><Chat connection={connection} session={session}/></div>;
    return (<>
            {view}
        </>
    );
}

export class Session {
    color: string;
    user: string;
    opp: string;
}