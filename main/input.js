'use strict';

let resultInputSource = new InputSource();
let alphaInputSource = new InputSource();

let enterResults = () => {
    let inputArea = document.getElementById('resultInput');
    resultInputSource.add(parseCsvResults(inputArea.value));
    inputArea.value = '';
};

let parseCsvResults = (text) => text.trim().split('\n').filter( (l) => l.trim() ).map(parseCsvLine);

let parseCsvLine = (line) => {
    let tokens = line.trim().split(/ *, */).map( (w) => w.trim() );
    return { home: {team: tokens[0], goals: parseInt(tokens[1])},  away: {team: tokens[2], goals: parseInt(tokens[3])} };
};

let initPage = () => {
    document.getElementById('enter').addEventListener('click', enterResults);
    document.getElementById('alpha').addEventListener('click', e => alphaInputSource.add(e.target.checked));
};

initPage();
