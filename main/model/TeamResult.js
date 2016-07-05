const TeamResult = /*memoizeProps*/(class TeamResult {
    constructor(team, matchResult) {
        this.team = team;
        this.matchResult = matchResult;
        // this.isHome = this.matchResult.home.teamName == this.team.name;
        // this.won = this.isHome ? this.matchResult.homeWin : this.matchResult.awayWin;
        // this.lost = this.isHome ? this.matchResult.awayWin : this.matchResult.homeWin;
        // this.drawn = this.matchResult.draw;
        // this.goalsFor = this.isHome ? this.matchResult.home.goals : this.matchResult.away.goals;
        // this.goalsAgainst = this.isHome ? this.matchResult.away.goals : this.matchResult.home.goals;
        // this.points = this.won ? 3 : this.lost ? 0 : 1;
    }

    get isHome() {
        return this.matchResult.home.teamName == this.team.name;
    }

    get won() {
        return this.isHome ? this.matchResult.homeWin : this.matchResult.awayWin;
    }

    get lost() {
        return this.isHome ? this.matchResult.awayWin : this.matchResult.homeWin;
    }

    get drawn() {
        return this.matchResult.draw;
    }

    get goalsFor() {
        return this.isHome ? this.matchResult.home.goals : this.matchResult.away.goals;
    }

    get goalsAgainst() {
        return this.isHome ? this.matchResult.away.goals : this.matchResult.home.goals;
    }

    get points() {
        return this.won ? 3 : this.lost ? 0 : 1;
    }

});