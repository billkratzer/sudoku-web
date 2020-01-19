class Tick {
    constructor(number) {
        this.number = number;
        this.ticked = false;
    }

}

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
}

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
        for (var i = 0; i < 9; i++) {
            var square = this.squares[0];
            if (!square.solved()) {
                return false;
            }
        }
        return true;
    }

    getRowForMajorAndMinor(major, minor) {
        let values = new Array();
        let rowIndex = Math.floor(minor / 3);
        if ( ( major >= 1 ) && ( major <=3 ) ) {
            values.push( this.squares[0].getRowByIndex( rowIndex ) );
            values.push( this.squares[1].getRowByIndex( rowIndex ) );
            values.push( this.squares[2].getRowByIndex( rowIndex ) );
        }
        else if ( ( major >= 4 ) && ( major <=6 ) ) {
            values.push( this.squares[3].getRowByIndex( rowIndex ) );
            values.push( this.squares[4].getRowByIndex( rowIndex ) );
            values.push( this.squares[5].getRowByIndex( rowIndex ) );
        }
        else if ( ( major >= 7 ) && ( major <= 9 ) ) {
            values.push( this.squares[6].getRowByIndex( rowIndex ) );
            values.push( this.squares[7].getRowByIndex( rowIndex ) );
            values.push( this.squares[8].getRowByIndex( rowIndex ) );
        }
        else {
            return [];
        }

        return values.flat();
    }

    getColumnForMajorAndMinor(major, minor) {
        let values = new Array();
        let columnIndex = minor % 3;
        if ( ( major == 1 ) || ( major == 4 ) || ( major == 7 ) ) {
            values.push( this.squares[0].getColumnByIndex( columnIndex ) );
            values.push( this.squares[1].getColumnByIndex( columnIndex ) );
            values.push( this.squares[2].getColumnByIndex( columnIndex ) );
        }
        else if ( ( major == 2 ) || ( major == 5 ) || ( major == 8 ) ) {
            values.push( this.squares[3].getColumnByIndex( columnIndex ) );
            values.push( this.squares[4].getColumnByIndex( columnIndex ) );
            values.push( this.squares[5].getColumnByIndex( columnIndex ) );
        }
        else if ( ( major == 3 ) || ( major == 6 ) || ( major == 9 ) ) {
            values.push( this.squares[6].getColumnByIndex( columnIndex ) );
            values.push( this.squares[7].getColumnByIndex( columnIndex ) );
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

    eraseSquare(major, minor) {
        let zMajor = major - 1;
        this.squares[ zMajor ].eraseSquare( minor );
    }
}

var board;

var selectedId;

function setSelectedId(id) {
    selectedId = id;
    $( ".little_square" ).removeClass( "selected_square" );
    $( "#" + id ).addClass("selected_square");
}

function getSelectedMajor() {
    if ( !selectedId ) {
        return 0;
    }
    if (selectedId.startsWith("square_")) {
        return selectedId.charAt(7);
    }
    else {
        return 0;
    }
}

function getSelectedMinor() {
    if ( !selectedId ) {
        return 0;
    }
    if (selectedId.startsWith("square_")) {
        return selectedId.charAt(9);
    }
    else {
        return 0;
    }
}

function fromSquareToCartesian(major, minor) {
    let zMajor = major - 1;
    let zMinor = minor - 1;

    let zMajorRow = Math.floor( zMajor / 3 );
    let zMinorRow = Math.floor( zMinor / 3 );

    let zMajorColumn = zMajor % 3;
    let zMinorColumn = zMinor % 3;

    let cX = zMajorColumn * 3 + zMinorColumn;
    let cY = zMajorRow * 3 + zMinorRow;

    return  { x: cX, y: cY };
}

function fromCartesianToSquare(x, y) {
    let zMajor = Math.floor(y / 3) * 3 + Math.floor(x / 3);
    let major = zMajor + 1;

    let zMinor = (y % 3) * 3 + x % 3;
    let minor = zMinor + 1;

    return { major: major, minor: minor };
}

function moveLeft() {
    let major = getSelectedMajor();
    let minor = getSelectedMinor();
    let c = fromSquareToCartesian(major, minor);

    let x = c.x;
    let y = c.y;
    if (x < 1) {
        return;
    }
    else {
        x = x - 1;
    }
    let mm = fromCartesianToSquare(x, y);
    setSelectedId("square_" + mm.major.toString() + "_" + mm.minor.toString());
}

function moveRight() {
    let major = getSelectedMajor();
    let minor = getSelectedMinor();
    let c = fromSquareToCartesian(major, minor);

    let x = c.x;
    let y = c.y;
    if (x > 7) {
        return;
    }
    else {
        x = x + 1;
    }
    let mm = fromCartesianToSquare(x, y);
    setSelectedId("square_" + mm.major.toString() + "_" + mm.minor.toString());
}

function moveUp() {
    let major = getSelectedMajor();
    let minor = getSelectedMinor();
    let c = fromSquareToCartesian(major, minor);

    let x = c.x;
    let y = c.y;
    if (y < 1) {
        return;
    }
    else {
        y = y - 1;
    }
    let mm = fromCartesianToSquare(x, y);
    setSelectedId("square_" + mm.major.toString() + "_" + mm.minor.toString());

}

function moveDown() {
    let major = getSelectedMajor();
    let minor = getSelectedMinor();
    let c = fromSquareToCartesian(major, minor);

    let x = c.x;
    let y = c.y;
    if (y > 7) {
        return;
    }
    else {
        y = y + 1;
    }
    let mm = fromCartesianToSquare(x, y);
    setSelectedId("square_" + mm.major.toString() + "_" + mm.minor.toString());
    $( id ).html( "" );

}

function playNumber( n ) {
    let major = getSelectedMajor();
    if ( !major ) {
        return;
    }

    let minor = getSelectedMinor();
    if ( !minor ) {
        return;
    }

    if (board.canPlayNumber( n.toString(), major, minor )) {
        board.playNumber( n.toString(), major, minor );
        let id = '#guess_' + major.toString() + "_" + minor.toString();
        $( id ).html( n.toString() );
    }
    else {
        console.log("Can NOT Play " + n.toString() + "!");
    }
}

function eraseSquare() {
    let major = getSelectedMajor();
    if ( !major ) {
        return;
    }

    let minor = getSelectedMinor();
    if ( !minor ) {
        return;
    }

    board.eraseSquare(major, minor);
    let id = '#guess_' + major.toString() + "_" + minor.toString();
    $( id ).html( "" );
}

function drawBoard() {
    for ( var major = 1; major <= 9; major++ ) {
        for ( var minor = 1; minor <= 9; minor++ ) {
            let littleSquare = this.board.getLittleSquareAtMajorMinor( major, minor );
            let selector = "#guess_" + major + "_" + minor;
            if ( littleSquare.clue ) {
                $( selector ).addClass( "clue" );
                let tickSelector = "#square_" + major + "_" + minor + " .tick";
                $( tickSelector ).hide();

            }
            else {
                $( selector ).removeClass( "clue" );
            }
            $( selector ).html( littleSquare.guess );

        }
    }
}

function init() {
    var puzzle = "5...8..49...5...3..673....115..........2.8..........187....415..3...2...49..5...3";
    board = new Board(puzzle);

    drawBoard();

    $( "#board" ).focus();

    $( ".little_square" ).click( function(event) {
        console.log("id: " + this.id);
        setSelectedId( this.id );
    });

    $( "#board ").keydown( function(event) {
       console.log(event.which + ":" + event.key + ":" + event.keyCode);
       if ( event.keyCode == 37) {
           moveLeft();
       }
        if ( event.keyCode == 38) {
            moveUp();
        }
        if ( event.keyCode == 39) {
            moveRight();
        }
        if ( event.keyCode == 40) {
            moveDown();
        }
        if ( ( event.keyCode >= 49 ) && ( event.keyCode <= 57 ) ) {
            playNumber( event.keyCode - 48);
        }
        if ( event.keyCode == 32 ) {
            eraseSquare();
        }
    });
}

