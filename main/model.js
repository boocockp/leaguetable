'use strict';
Function.prototype.memoize = function(resolverFn) {
    return _.memoize(this, resolverFn);
};

Function.prototype.time = function(name) {
    let fn = this;
    return function() {
        let startTime = Date.now();
        let result = fn.apply(this, arguments);
        let endTime = Date.now();
        console.log(name, (endTime - startTime) + 'ms' );
        return result;
    }
};

let leaguePositions = (results) =>_.sortBy(allTeamStats(results), (t) => -t.points );
let teamsByName = (results) => _.sortBy(allTeamStats(results), (t) => t.name );

let allTeamStats = ((results) =>  teams(results).map( (t) => teamStats(results, t))).time('allTeamStats');

let teams = ((results) => {
    let homeTeams = results.map( (r) => r.home.team);
    let awayTeams = results.map( (r) => r.away.team);
    return _.uniq(homeTeams.concat(awayTeams));
}).memoize((r) => r.length);


let teamResults = ((results, teamName) => results.filter( (r) => r.home.team == teamName || r.away.team == teamName) ).memoize((r, tn) => tn + r.length);

let teamStats = ((results, teamName) => {
    let ourResults = teamResults(results, teamName);
    return {
        name: teamName,
        games: ourResults.length,
        won:   ourResults.filter((r) => won(teamName, r)).length,
        drawn:   ourResults.filter((r) => drawn(r)).length,
        lost:   ourResults.filter((r) => lost(teamName, r)).length,
        goalsFor:_.sum(ourResults.map((r) => goalsFor(teamName, r))),
        goalsAgainst:_.sum(ourResults.map((r) => goalsAgainst(teamName, r))),
        goalDifference:_.sum(ourResults.map((r) => goalsFor(teamName, r) - goalsAgainst(teamName, r))),
        points: _.sum(ourResults.map( (r) => pointsFor(teamName, r)))
    }
}).memoize((r, tn) => tn + r.length);


let goalsFor = (teamName, result) => teamName == result.home.team ? result.home.goals : result.away.goals;
let goalsAgainst = (teamName, result) => teamName == result.home.team ? result.away.goals : result.home.goals;
let drawn = (result) => result.home.goals == result.away.goals;
let won = (teamName, result) => goalsFor(teamName, result) > goalsAgainst(teamName, result);
let lost = (teamName, result) => goalsFor(teamName, result) < goalsAgainst(teamName, result);
let pointsFor = (teamName, result) => won(teamName, result) ? 3 : drawn(result) ? 1 : 0;


