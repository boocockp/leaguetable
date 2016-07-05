const LeagueTable = memoizeProps(class LeagueTable {
    
    constructor() {
        this.teams = [];
        this.matchResults = [];
        this._listeners = [];
    }

    get leaguePositions() {
        return _.sortBy(this.teams, 'points');
    }

    get teamsByName() {
        return _.sortBy(this.teams, 'name');
    }

    resultsInput(r) {
        const newResults = r.map( it => new MatchResult(it.home.team, it.home.goals, it.away.team, it.away.goals));
        this._addNewTeams(newResults);
        this.matchResults = this.matchResults.concat(newResults);
        PropertyCacheController.version++;
        this._notifyChange(); 
    }

    addChangeListener(listenerFn) {
        this._listeners.push(listenerFn);
        listenerFn()
    }

    _notifyChange() {
        this._listeners.forEach( l => l() );
    }

    _addNewTeams(results) {
        const teamNames = new Set(results.map( it => it.away.teamName ).concat(results.map( it => it.home.teamName )));
        const existingTeamNames = new Set( this.teams.map( it => it.name ));
        existingTeamNames.forEach( it => teamNames.delete(it) );
        teamNames.forEach( n => this.teams.push(new Team(this, n)) );
    }
});