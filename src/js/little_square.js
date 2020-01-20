class LittleSquare {
    constructor() {
        this.guess = "";
        this.clue = false;
        this.ticks = new Array();
        for (var n = 1; n <= 9; n++) {
            this.ticks.push(new Tick(n.toString()));
        }
    }

    setClue ( n ) {
        if ( n == "." ) {
            this.guess = "";
            this.clue = false;
        }
        else {
            this.guess = n.toString();
            this.clue = true;
        }

    }

    getTickByNumber ( n ) {
        return this.ticks[n - 1];
    }

    anyTicked() {
        for (var i = 0; i < this.ticks.length; i++) {
            let tick = this.ticks[ i ];
            if ( tick.ticked ) {
                return true;
            }
        }

        return false;
    }
}
