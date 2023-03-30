//
//FILE: game.tsx
//
//Game component rendered when match is in progress
//

import * as signalR from '@microsoft/signalr';
import React, { FC, useState, useEffect, createContext } from 'react';
import { Lobby } from './lobby';
import { Chess } from './chess';

export const ConnectionContext = createContext();

export const Game: FC = ({connection}: any) => {

    const [inGame, setInGame] = useState(false);

    const [session, setSession] = useState(null);

    useEffect(() => {  
        connection.on("StartGame", (color, user, opp) => StartGame(color, user, opp));
    }, []);

    const StartGame = (color, user, opp) => {
        let s = {
            color: color,
            user: user,
            opp: opp
        }
        setSession(s);
        setInGame(true);
    };

    return (<ConnectionContext.Provider className="game" value={connection}>
            {(inGame === false) ? <Lobby /> : <Chess session={session}/>}
        </ConnectionContext.Provider>
    );
}

export class Session {
    color: string;
    user: string;
    opp: string;
}