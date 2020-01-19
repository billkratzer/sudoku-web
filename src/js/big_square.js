class BigSquare {

    constructor() {
        this.squares = new Array();
        for (var i = 0; i < 9; i++) {
            var square = new LittleSquare();
            this.squares.push(square);
        }
    }

    buildOneThruNine() {
        var values = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        return values;
    }

    solved() {
        var values = this.buildOneThruNine();
        for (var i = 0; i < 9; i++) {
            var square = this.squares[i];
            values.remove(square.guess);
        }
        return values.length() == 0;
    }

    getRowByIndex( rowIndex ) {
        let row = new Array();

        for (let i = 0; i < 3; i++) {
            row.push( this.squares[ rowIndex * 3 + i].guess );
        }

        return row;
    }

    getColumnByIndex( columnIndex ) {
        let column = new Array();

        for (let i = 0; i < 3; i++) {
            column.push( this.squares[ i * 3 + columnIndex].guess );
        }

        return column;
    }

    canPlayNumber(n, minor) {
        if (!n) {
            return false;
        }

        let zMinor = minor - 1;
        if ( this.squares[ zMinor ].clue ) {
            return false;
        }

        for (var i = 0; i < 9; i++) {
            if (n == this.squares[i].guess) {
                return  false;
            }
        }

        return true;
    }

    playNumber(n, minor) {
        let zMinor = minor - 1;
        this.squares[ zMinor ].guess = n;
    }

    setClue(n, minor) {
        let zMinor = minor - 1;
        this.squares[ zMinor ].setClue( n );
    }

    eraseSquare(minor) {
        let zMinor = minor - 1;
        this.squares[ zMinor ].guess = "";
    }
}
