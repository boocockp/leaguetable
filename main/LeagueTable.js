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

        let goalsFor = (teamName, result) => teamName == result.home.team ? result.home.goals : result.away.goals;
        let goalsAgainst = (teamName, result) => teamName == result.home.team ? result.away.goals : result.home.goals;
        let drawn = (result) => result.home.goals == result.away.goals;
        let won = (teamName, result) => goalsFor(teamName, result) > goalsAgainst(teamName, result);
        let lost = (teamName, result) => goalsFor(teamName, result) < goalsAgainst(teamName, result);
        let pointsFor = (teamName, result) => won(teamName, result) ? 3 : drawn(result) ? 1 : 0;

        let teamStats = _.memoize( teamName => {
            let ourResults = teamResults(teamName);
            return {
                name: teamName,
                manager: manager(teamName),
                games: ourResults.count(),
                won: ourResults.filter(r => won(teamName, r)).count(),
                drawn: ourResults.filter(r => drawn(r)).count(),
                lost: ourResults.filter(r => lost(teamName, r)).count(),
                goalsFor: ourResults.map(r => goalsFor(teamName, r)).sum(),
                goalsAgainst: ourResults.map(r => goalsAgainst(teamName, r)).sum(),
                goalDifference: ourResults.map(r => goalsFor(teamName, r) - goalsAgainst(teamName, r)).sum(),
                points: ourResults.map(r => pointsFor(teamName, r)).sum()
            }
        }, function(tn) { return tn });

        let allTeamStats = teams.map( t => teamStats(t));
        let leaguePositions = allTeamStats.sort( t => -t.points.value );
        let teamsByName = allTeamStats.sort( t => t.name );

        return {leaguePositions, teamsByName};
    }

}


