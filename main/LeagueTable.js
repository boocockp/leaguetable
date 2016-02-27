'use strict';

class LeagueTable {

    constructor() {
        this._inputs = {};
        this._listeners = [];
        this.jsonData = new JsonData(this._inputReceived.bind(this));

        _.forIn(this.buildModel(), (propFn, name) => {
            this[name] = propFn;
        })
    }

    // implementation
    input(name) {
        return this._inputs[name] || (this._inputs[name] = new CachedSequence());
    }

    addInputs(name, inputs) {
        if (!this._inputs[name]) throw new Error(`Unknown input: ${name}`)
        this._inputs[name].add(inputs);
    }

    addChangeListener(listenerFn) {
        this._listeners.push(listenerFn);
        listenerFn()
    }

    _notifyChange() {
        this._listeners.forEach( l => l() );
    }

    _inputReceived() {
        this._notifyChange();
    }

    aggregate(obj) {
        let result = {};
        _.forOwn(obj, (v, name) => {
            if (_.hasIn(v, 'value')) {
                Object.defineProperty(result, name, { get: function () { return v.value; } });
            } else {
                result[name] = v;
            }
        });

        return result;
    }

    // model
    buildModel() {
        let aggregate = this.aggregate, input = this.input.bind(this), jsonData = this.jsonData;

        let homeTeams = input('results').map( r => r.home.team);
        let awayTeams = input('results').map( r => r.away.team);
        let teams = homeTeams.merge(awayTeams).distinct();

        let manager = (teamName) => {
            let teamKey = teamName.toLowerCase().replace(/ /g, '_');
            return jsonData.get(`/leaguetable/main/data/teams/${teamKey}.json`, 'manager');
        };

        let goalsFor = (teamName, result) => teamName == result.home.team ? result.home.goals : result.away.goals;
        let goalsAgainst = (teamName, result) => teamName == result.home.team ? result.away.goals : result.home.goals;
        let drawn = (result) => result.home.goals == result.away.goals;
        let won = (teamName, result) => goalsFor(teamName, result) > goalsAgainst(teamName, result);
        let lost = (teamName, result) => goalsFor(teamName, result) < goalsAgainst(teamName, result);
        let pointsFor = (teamName, result) => won(teamName, result) ? 3 : drawn(result) ? 1 : 0;

        let teamStats = teamName => {
            let teamResults = input('results').filter( r => r.home.team == teamName || r.away.team == teamName);
            return aggregate({
                name: teamName,
                manager: manager(teamName),
                games: teamResults.count(),
                won: teamResults.filter(r => won(teamName, r)).count(),
                drawn: teamResults.filter(r => drawn(r)).count(),
                lost: teamResults.filter(r => lost(teamName, r)).count(),
                goalsFor: teamResults.map(r => goalsFor(teamName, r)).sum(),
                goalsAgainst: teamResults.map(r => goalsAgainst(teamName, r)).sum(),
                goalDifference: teamResults.map(r => goalsFor(teamName, r) - goalsAgainst(teamName, r)).sum(),
                points: teamResults.map(r => pointsFor(teamName, r)).sum()
            })
        };

        let allTeamStats = teams.map( t => teamStats(t));
        let leaguePositions = allTeamStats.sort( t => -t.points );
        let teamsByName = allTeamStats.sort( t => t.name );

        return {leaguePositions, teamsByName};
    }

}


