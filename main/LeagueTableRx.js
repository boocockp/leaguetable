'use strict';

function all(s) {
    return s.scan( (acc, x) => acc.concat(x), []);
}

class LeagueTable {

    constructor() {
        this._results = new Rx.Subject();
        this.buildModel();
    }

    buildModel() {
        let teams = this.teams = (() => {
            let homeTeams = this._results.map( r => r.home.team);
            let awayTeams = this._results.map( r => r.away.team);
            return all(homeTeams.merge(awayTeams).distinct());
        })();

        let teamResults = this.teamResults = (teamName) => all(this._results.filter( r => r.home.team == teamName || r.away.team == teamName));

        let teamStats = this.teamStats = (teamName) => {
            return teamResults(teamName).map ( (ourResults) => ({
                name: teamName,
                games: ourResults.length,
                won: ourResults.filter(r => this.won(teamName, r)).length,
                drawn: ourResults.filter(r => this.drawn).length,
                lost: ourResults.filter(r => this.lost(teamName, r)).length,
                goalsFor: _.sum(ourResults.map(r => this.goalsFor(teamName, r))),
                goalsAgainst: _.sum(ourResults.map(r => this.goalsAgainst(teamName, r))),
                goalDifference: _.sum(ourResults.map(r => this.goalsFor(teamName, r) - this.goalsAgainst(teamName, r))),
                points: _.sum(ourResults.map(r => this.pointsFor(teamName, r)))
            }) );
        };

        let allTeamStats = this.allTeamStats = teams.map( ts => )

    }

    addChangeListener(listenerFn) {
        //this._listeners.push(listenerFn);
        //listenerFn()
    }

    //get results() { return this._results }
    resultsInput(r) {
        console.log('resultsInput', r);
        r && r.forEach( it => this._results.onNext(it) );
    }

    get leaguePositions() {
        return _.sortBy(this.allTeamStats, t => -t.points );
    }

    get teamsByName() {
        return _.sortBy(this.allTeamStats, t => t.name );
    }

    //get allTeamStats() {
    //    return (() => this.teams.map( (t) => this.teamStats(t))).time('allTeamStats')();
    //}

    goalsFor (teamName, result) { return teamName == result.home.team ? result.home.goals : result.away.goals; }
    goalsAgainst(teamName, result) { return teamName == result.home.team ? result.away.goals : result.home.goals; }
    drawn(result) { return result.home.goals == result.away.goals; }
    won(teamName, result) { return this.goalsFor(teamName, result) > this.goalsAgainst(teamName, result); }
    lost(teamName, result) { return this.goalsFor(teamName, result) < this.goalsAgainst(teamName, result);}
    pointsFor(teamName, result) { return this.won(teamName, result) ? 3 : this.drawn(result) ? 1 : 0; }
}


