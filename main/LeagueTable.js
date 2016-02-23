'use strict';

class LeagueTable {

    constructor() {
        this._results = new CachedSequence();
        this._listeners = [];
    }

    addChangeListener(listenerFn) {
        this._listeners.push(listenerFn);
        listenerFn()
    }

    _notifyChange() {
        this._listeners.forEach( l => l() );
    }

    _inputReceived() {
        //setTimeout( () => this._notifyChange(), 0);
        this._notifyChange();
    }

    get results() { return this._results }
    resultsInput(r) { this._results.add(r); this._inputReceived(); }

    get leaguePositions() {
        return this.allTeamStats.sort( t => -t.points );
    }

    get teamsByName() {
        return this.allTeamStats.sort( t => t.name );
    }

    get allTeamStats() {
        return (() => this.teams.map( (t) => this.teamStats(t))).time('allTeamStats')();
    }

    get teams() {
        let homeTeams = this.results.map( r => r.home.team);
        let awayTeams = this.results.map( r => r.away.team);
        return homeTeams.withAdded(awayTeams).distinct();
    }

    teamStats(teamName) {
        let ourResults = this.teamResults(teamName);
        return {
            name: teamName,
            games: ourResults.length,
            won: ourResults.filter(r => this.won(teamName, r)).length,
            drawn: ourResults.filter(r => this.drawn(r)).length,
            lost: ourResults.filter(r => this.lost(teamName, r)).length,
            goalsFor: ourResults.map(r => this.goalsFor(teamName, r)).sum(),
            goalsAgainst: ourResults.map(r => this.goalsAgainst(teamName, r)).sum(),
            goalDifference: ourResults.map(r => this.goalsFor(teamName, r) - this.goalsAgainst(teamName, r)).sum(),
            points: ourResults.map(r => this.pointsFor(teamName, r)).sum()
        }
    }

    teamResults(teamName) {
        return this.results.filter( r => r.home.team == teamName || r.away.team == teamName);
    }

    goalsFor (teamName, result) { return teamName == result.home.team ? result.home.goals : result.away.goals; }
    goalsAgainst(teamName, result) { return teamName == result.home.team ? result.away.goals : result.home.goals; }
    drawn(result) { return result.home.goals == result.away.goals; }
    won(teamName, result) { return this.goalsFor(teamName, result) > this.goalsAgainst(teamName, result); }
    lost(teamName, result) { return this.goalsFor(teamName, result) < this.goalsAgainst(teamName, result);}
    pointsFor(teamName, result) { return this.won(teamName, result) ? 3 : this.drawn(result) ? 1 : 0; }
}


