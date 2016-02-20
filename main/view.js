'use strict';

let tableHtml = (leaguePositions) =>
    `<table>
        <thead>
        <tr>
        <th>Team</th>
        <th>Games</th>
        <th>Won</th>
        <th>Drawn</th>
        <th>Lost</th>
        <th>Goals For</th>
        <th>Goals Against</th>
        <th>Goal Difference</th>
        <th>Points</th>
        </tr>
        </thead>
        <tbody>
        ${leaguePositions.map(function(r) { return rowHtml(r); }).join('')}
        </tbody>
    </table>
    `;


let rowHtml = (ts) =>
       `<tr>
        <td>${ts.name}</td>
        <td>${ts.games}</td>
        <td>${ts.won}</td>
        <td>${ts.drawn}</td>
        <td>${ts.lost}</td>
        <td>${ts.goalsFor}</td>
        <td>${ts.goalsAgainst}</td>
        <td>${ts.goalDifference}</td>
        <td>${ts.points}</td>
        </tr>
        `;



let leagueTable = new LeagueTable();
resultInputSource.addListener( results => leagueTable.resultsInput(results));


let showLeagueTable = () => {
    let positions = document.getElementById('alpha').checked ? leagueTable.teamsByName : leagueTable.leaguePositions;
    document.getElementById('table').innerHTML = tableHtml(positions);
};
leagueTable.addChangeListener(showLeagueTable);


