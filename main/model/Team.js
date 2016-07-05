const Team = memoizeProps(class Team {
    constructor(leagueTable, name) {
        this.leagueTable = leagueTable;
        this.name = name;
    }

    get results() {
        return this.leagueTable.resultsByTeam[this.name].map( r => new TeamResult(this, r) );
    }

    get games() {
        return this.results.length;
    }

    get won() {
        return this.results.filter( it => it.won ).length;
    }

    get lost() {
        return this.results.filter( it => it.lost ).length;
    }

    get drawn() {
        return this.results.filter( it => it.drawn ).length;
    }

    get goalsFor() {
        return _.sum(this.results.map( it => it.goalsFor ));
    }

    get goalsAgainst() {
        return _.sum(this.results.map( it => it.goalsAgainst ));
    }
    
    get goalDifference() {
        return this.goalsFor - this.goalsAgainst;
    }

    get points() {
        return _.sum(this.results.map( it => it.points ));
    }

});