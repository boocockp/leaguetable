'use strict';

let tableHtml = (leaguePositions) =>
    `<table>
        <thead>
        <tr>
        <th>Team</th>
        <th>Manager</th>
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
        <td>${ts.manager}</td>
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

var getLeagueTable = function(sortAlpha) {
    return sortAlpha ? leagueTable.teamsByName : leagueTable.leaguePositions;
}.time('getLeagueTable');

let showLeagueTable = (sortAlpha) => {
    var positions = getLeagueTable(sortAlpha);
    document.getElementById('table').innerHTML = tableHtml(positions);
};

let leagueTable = new LeagueTable();
resultInputSource.addListener( results => leagueTable.resultsInput(results));
alphaInputSource.addListener( showLeagueTable );

leagueTable.addChangeListener( () => showLeagueTable(alphaInputSource.latest));


