import React from 'react';
import { Game } from './game';
import ReactDOM from 'react-dom/client';

$(document).ready(async () => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<Game/>);
});