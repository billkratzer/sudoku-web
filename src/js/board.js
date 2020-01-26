class Board {
    constructor(puzzle) {
        this.squares = new Array();
        for (var i = 0; i < 9; i++) {
            var square = new BigSquare();
            this.squares.push(square);
        }

        for (var i = 0; i < puzzle.length; i++) {
            let y = Math.floor(i / 9);
            let x = i - y * 9;

            let cart = fromCartesianToSquare(x, y);
            this.setClue( puzzle[i], cart.major, cart.minor);
        }
    }

    solved() {
        for ( let i = 0; i < 9; i++ ) {
            let square = this.squares[ i ];
            if ( !square.solved() ) {
                return false;
            }
        }
        return true;
    }

    getRowForMajorAndMinor(major, minor) {
        let values = new Array();
        let rowIndex = Math.floor( ( minor - 1 ) / 3);
        if ( ( major >= 1 ) && ( major <=3 ) ) {
            values.push( this.squares[ 0 ].getRowByIndex( rowIndex ) );
            values.push( this.squares[ 1 ].getRowByIndex( rowIndex ) );
            values.push( this.squares[ 2 ].getRowByIndex( rowIndex ) );
        }
        else if ( ( major >= 4 ) && ( major <=6 ) ) {
            values.push( this.squares[ 3 ].getRowByIndex( rowIndex ) );
            values.push( this.squares[ 4 ].getRowByIndex( rowIndex ) );
            values.push( this.squares[ 5 ].getRowByIndex( rowIndex ) );
        }
        else if ( ( major >= 7 ) && ( major <= 9 ) ) {
            values.push( this.squares[ 6 ].getRowByIndex( rowIndex ) );
            values.push( this.squares[ 7 ].getRowByIndex( rowIndex ) );
            values.push( this.squares[ 8 ].getRowByIndex( rowIndex ) );
        }
        else {
            return [];
        }

        return values.flat();
    }

    getColumnForMajorAndMinor(major, minor) {
        let values = new Array();
        let columnIndex = ( minor - 1 ) % 3;
        if ( ( major == 1 ) || ( major == 4 ) || ( major == 7 ) ) {
            values.push( this.squares[0].getColumnByIndex( columnIndex ) );
            values.push( this.squares[3].getColumnByIndex( columnIndex ) );
            values.push( this.squares[6].getColumnByIndex( columnIndex ) );
        }
        else if ( ( major == 2 ) || ( major == 5 ) || ( major == 8 ) ) {
            values.push( this.squares[1].getColumnByIndex( columnIndex ) );
            values.push( this.squares[4].getColumnByIndex( columnIndex ) );
            values.push( this.squares[7].getColumnByIndex( columnIndex ) );
        }
        else if ( ( major == 3 ) || ( major == 6 ) || ( major == 9 ) ) {
            values.push( this.squares[2].getColumnByIndex( columnIndex ) );
            values.push( this.squares[5].getColumnByIndex( columnIndex ) );
            values.push( this.squares[8].getColumnByIndex( columnIndex ) );
        }
        else {
            return [];
        }

        return values.flat();
    }

    canPlayNumber(n, major, minor) {
        let zMajor = major - 1;

        let canPlayWithInSquare = this.squares[ zMajor ].canPlayNumber( n, minor );
        if ( !canPlayWithInSquare ) {
            return false;
        }

        var row = this.getRowForMajorAndMinor(major, minor);
        if ( row.indexOf( n.toString() ) >= 0 ) {
            return false;
        }

        var column = this.getColumnForMajorAndMinor(major, minor);
        if ( column.indexOf( n.toString() ) >= 0 ) {
            return  false;
        }

        return true;
    }

    getLittleSquareAtMajorMinor(major, minor) {
        return this.squares[ major - 1 ].squares[ minor - 1];
    }

    playNumber(n, major, minor) {
        let zMajor = major - 1;
        this.squares[ zMajor ].playNumber( n, minor );
    }

    setClue(n, major, minor) {
        let zMajor = major - 1;
        this.squares[ zMajor ].setClue( n, minor );
    }

    canEraseSquare(major, minor) {
        let zMajor = major - 1;
        let zMinor = minor - 1;
        return !this.squares[ zMajor ].squares[ zMinor ].clue;
    }

    eraseSquare(major, minor) {
        let zMajor = major - 1;
        if ( this.canEraseSquare( major, minor ) ) {
            this.squares[ zMajor ].eraseSquare( minor );
        }
    }
}
