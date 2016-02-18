'use strict';
function tableHtml(leaguePositions) {
    return '<table>' +
        '<thead>' +
        '<tr>' +
        '<th>Team</th>' +
        '<th>Games</th>' +
        '<th>Won</th>' +
        '<th>Drawn</th>' +
        '<th>Lost</th>' +
        '<th>Goals For</th>' +
        '<th>Goals Against</th>' +
        '<th>Goal Difference</th>' +
        '<th>Points</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        leaguePositions.map(function(r) { return rowHtml(r); }).join('') +
        '</tbody>' +
        '</table>'
}

function rowHtml(teamPosition) {
    return '<tr>' +
        '<td>' + teamPosition.name + '</td>' +
        '<td>' + teamPosition.games + '</td>' +
        '<td>' + teamPosition.won + '</td>' +
        '<td>' + teamPosition.drawn + '</td>' +
        '<td>' + teamPosition.lost + '</td>' +
        '<td>' + teamPosition.goalsFor + '</td>' +
        '<td>' + teamPosition.goalsAgainst + '</td>' +
        '<td>' + teamPosition.goalDifference + '</td>' +
        '<td>' + teamPosition.points + '</td>' +
        '</tr>'
}

function showLeagueTable(results) {
    let positions = document.getElementById('alpha').checked ? teamsByName(results) : leaguePositions(results);
    document.getElementById('table').innerHTML = tableHtml(positions);
}


