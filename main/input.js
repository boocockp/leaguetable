'use strict';

let resultData = [];

let showLeagueTableFromResults = () => showLeagueTable(resultData);

let enterResults = () => {
    let inputArea = document.getElementById('resultInput');
    resultData = resultData.concat(parseCsvResults(inputArea.value));
    inputArea.value = '';
    showLeagueTableFromResults();
};

let parseCsvResults = (text) => text.trim().split('\n').filter( (l) => l.trim() ).map(parseCsvLine);


let parseCsvLine = (line) => {
    let tokens = line.trim().split(/ *, */).map( (w) => w.trim() );
    return { home: {team: tokens[0], goals: parseInt(tokens[1])},  away: {team: tokens[2], goals: parseInt(tokens[3])} };
};

let initPage = () => {
    document.getElementById('enter').addEventListener('click', enterResults);
    document.getElementById('alpha').addEventListener('click', showLeagueTableFromResults);
    showLeagueTableFromResults();
};

initPage();
