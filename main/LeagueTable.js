'use strict';

class LeagueTable {

    constructor() {
        this._results = new CachedSequence();
        this._version = 0;
        this._listeners = [];

        this._cachedJsonData = {};

        _.forIn(this.buildModel(), (propFn, name) => {
            this[name] = propFn;
        })
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

    // model
    buildModel() {
        let homeTeams = this.results.map( r => r.home.team);
        let awayTeams = this.results.map( r => r.away.team);
        let teams = homeTeams.merge(awayTeams).distinct();

        let manager = (teamName) => {
            let teamKey = teamName.toLowerCase().replace(/ /g, '_');
            return this.getJsonData(`/leaguetable/main/data/teams/${teamKey}.json`, 'manager');
        };

        let teamResults = _.memoize((teamName) => {
            return this.results.filter( r => r.home.team == teamName || r.away.team == teamName);
        }, function(tn) { return tn });

        let teamStatsFn = _.memoize( teamName => {
            let ourResults = teamResults(teamName);
            return {
                name: teamName,
                manager: manager(teamName),
                games: ourResults.count(),
                won: ourResults.filter(r => this.won(teamName, r)).count(),
                drawn: ourResults.filter(r => this.drawn(r)).count(),
                lost: ourResults.filter(r => this.lost(teamName, r)).count(),
                goalsFor: ourResults.map(r => this.goalsFor(teamName, r)).sum(),
                goalsAgainst: ourResults.map(r => this.goalsAgainst(teamName, r)).sum(),
                goalDifference: ourResults.map(r => this.goalsFor(teamName, r) - this.goalsAgainst(teamName, r)).sum(),
                points: ourResults.map(r => this.pointsFor(teamName, r)).sum()
            }
        }, function(tn) { return tn });

        //let teamStats = (teamName) => this.resolve(teamStatsFn(teamName));

        let allTeamStats = teams.map( t => teamStatsFn(t));
        let leaguePositions = allTeamStats.sort( t => -t.points.value );
        let teamsByName = allTeamStats.sort( t => t.name );

        return {leaguePositions, teamsByName};
    }

    // business logic
    //get leaguePositions() {
    //    return this.allTeamStats.sort( t => -t.points );
    //}
    //
    //get teamsByName() {
    //    return this.allTeamStats.sort( t => t.name );
    //}
    //
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
        games: ourResults.count(),
        won: ourResults.filter(r => this.won(teamName, r)).count(),
        drawn: ourResults.filter(r => this.drawn(r)).count(),
        lost: ourResults.filter(r => this.lost(teamName, r)).count(),
        goalsFor: ourResults.map(r => this.goalsFor(teamName, r)).sum(),
        goalsAgainst: ourResults.map(r => this.goalsAgainst(teamName, r)).sum(),
        goalDifference: ourResults.map(r => this.goalsFor(teamName, r) - this.goalsAgainst(teamName, r)).sum(),
        points: ourResults.map(r => this.pointsFor(teamName, r)).sum()
    }
},  function(tn) { return tn } );

LeagueTable.prototype.teamStats = function(teamName) {
    return this.resolve(this.teamStatsFn(teamName));
};

LeagueTable.prototype.teamResults = _.memoize(function teamResults(teamName) {
    return this.results.filter( r => r.home.team == teamName || r.away.team == teamName);
}, function (tn) { return tn } );


