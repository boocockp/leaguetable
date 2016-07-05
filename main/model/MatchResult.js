const MatchResult = /*memoizeProps*/(class MatchResult {
    constructor(homeTeam, homeGoals, awayTeam, awayGoals) {
        this.home = {teamName: homeTeam, goals: homeGoals};
        this.away = {teamName: awayTeam, goals: awayGoals};
        // this.homeWin = homeGoals > awayGoals;
        // this.awayWin = homeGoals < awayGoals;
        // this.draw = !this.homeWin && !this.awayWin;
    }
    
    get homeWin() {
        return this.home.goals > this.away.goals;
    }

    get awayWin() {
        return this.home.goals < this.away.goals;
    }
    
    get draw() {
        return !this.homeWin && !this.awayWin;
    }

    involved(team) {
        return team.name == this.home.teamName || team.name == this.away.teamName;
    }

});