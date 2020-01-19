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
        $( id ).addClass( "guess" );

        // Hide the tick marks
        let tickSelector = "#square_" + major + "_" + minor + " .tick";
        $( tickSelector ).hide();

    }
    else {
        console.log("Can NOT Play " + n.toString() + "!");
    }

    if ( board.solved() ) {
        alert("solved!");
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

    // Empty the square
    $( id ).html( "" );
    $( id ).removeClass( "guess" );

    // Show the tick marks
    let tickSelector = "#square_" + major + "_" + minor + " .tick";
    $( tickSelector ).show();
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

