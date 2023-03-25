import React, { FC, useState, useEffect } from 'react';

export const Lobby: FC = () => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval = setInterval(async () => {
            setSeconds(seconds => seconds + 1);
        }, 1000);
    }, []);

    return (
        <div className="timer">
            <p>Currently in lobby. Time elapsed:</p>
            <p>{seconds}</p>
        </div>
    );
}