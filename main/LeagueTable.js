'use strict';

class LeagueTable {

    constructor() {
        this._results = new CachedSequence();
        this._version = 0;
        this._listeners = [];

        this._cachedJsonData = {};
    }

    // implementation
    addChangeListener(listenerFn) {
        this._listeners.push(listenerFn);
        listenerFn()
    }

    _notifyChange() {
        this._listeners.forEach( l => l() );
    }

    _inputReceived() {
        this._version++;
        this._notifyChange();
    }

    resolve(fnObj) {
        return _.mapValues(fnObj, function(v) {
            return _.hasIn(v, 'value') ? v.value : v;
        });
    }

    get results() { return this._results }
    resultsInput(r) { this._results.add(r); this._inputReceived(); }

    // helpers
    getJsonData(url, propertyPath) {
        function getValue(url, callback, errorCallback) {
            $.getJSON(url).done(callback).fail(errorCallback);
        }

        if (this._cachedJsonData[url] === undefined) {
            getValue( url, function(data) {
                this._cachedJsonData[url] = data; this._inputReceived()
            }.bind(this));
            this._cachedJsonData[url] = {};
        }

        let self = this;
        return {
            get value() {
                return _.get(self._cachedJsonData[url], propertyPath) || "";
            }
        };

    }

    // business logic
    get leaguePositions() {
        return this.allTeamStats.sort( t => -t.points );
    }

    get teamsByName() {
        return this.allTeamStats.sort( t => t.name );
    }

    get allTeamStats() {
        return this.teams().map( t => this.teamStats(t));
    }

    manager(teamName) {
        let teamKey = teamName.toLowerCase().replace(/ /g, '_');
        return this.getJsonData(`/leaguetable/main/data/teams/${teamKey}.json`, 'manager');
    }

    goalsFor (teamName, result) { return teamName == result.home.team ? result.home.goals : result.away.goals; }
    goalsAgainst(teamName, result) { return teamName == result.home.team ? result.away.goals : result.home.goals; }
    drawn(result) { return result.home.goals == result.away.goals; }
    won(teamName, result) { return this.goalsFor(teamName, result) > this.goalsAgainst(teamName, result); }
    lost(teamName, result) { return this.goalsFor(teamName, result) < this.goalsAgainst(teamName, result);}
    pointsFor(teamName, result) { return this.won(teamName, result) ? 3 : this.drawn(result) ? 1 : 0; }
}

LeagueTable.prototype.teams = _.memoize(function teams() {
    let homeTeams = this.results.map( r => r.home.team);
    let awayTeams = this.results.map( r => r.away.team);
    return homeTeams.merge(awayTeams).distinct();
});

LeagueTable.prototype.teamStatsFn = _.memoize(function teamStats(teamName) {
    let ourResults = this.teamResults(teamName);
    return {
        name: teamName,
        manager: this.manager(teamName),
        games: ourResults.countFn(),
        won: ourResults.filter(r => this.won(teamName, r)).countFn(),
        drawn: ourResults.filter(r => this.drawn(r)).countFn(),
        lost: ourResults.filter(r => this.lost(teamName, r)).countFn(),
        goalsFor: ourResults.map(r => this.goalsFor(teamName, r)).sumFn(),
        goalsAgainst: ourResults.map(r => this.goalsAgainst(teamName, r)).sumFn(),
        goalDifference: ourResults.map(r => this.goalsFor(teamName, r) - this.goalsAgainst(teamName, r)).sumFn(),
        points: ourResults.map(r => this.pointsFor(teamName, r)).sumFn()
    }
},  function(tn) { return tn } );

LeagueTable.prototype.teamStats = function(teamName) {
    return this.resolve(this.teamStatsFn(teamName));
};

LeagueTable.prototype.teamResults = _.memoize(function teamResults(teamName) {
    return this.results.filter( r => r.home.team == teamName || r.away.team == teamName);
}, function (tn) { return tn } );


