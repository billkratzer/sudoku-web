var board;

var selectedId;

var guessMode = true;

var defaultGuessMode = true;

function blinkScreen() {
    $("#blink_screen").fadeIn(30).fadeOut(30);
}

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
        x = 8;
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
        x = 0;
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
        y = 8;
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
        y = 0;
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
        blinkScreen();
        // console.log("Can NOT Play " + n.toString() + "!");
    }

    if ( board.solved() ) {
        showSolved();
    }
}

function buildTickSelector( major, minor, n ) {
    return "#tick_" + major + "_" + minor + "_" + n;
}

function toggleTick( n ) {
    let major = getSelectedMajor();
    if ( !major ) {
        return;
    }

    let minor = getSelectedMinor();
    if ( !minor ) {
        return;
    }

    let ls = board.getLittleSquareAtMajorMinor( major, minor );
    if (!ls) {
        console.log("Warning: Little Square not found at: " + major + ", " + minor);
        return;
    }

    let tick = ls.getTickByNumber( n );
    if (!tick) {
        console.log("Warning: Tick  not found at: " + major + ", " + minor + ", " + n);
        return;
    }

    tick.toggle();
    let selector = buildTickSelector( major, minor, n );
    if ( tick.ticked ) {
        $( selector ).addClass( "ticked" );
    }
    else {
        $( selector ).removeClass( "ticked" );
    }
}

function toggleAllTicks() {
    let major = getSelectedMajor();
    if ( !major ) {
        return;
    }

    let minor = getSelectedMinor();
    if ( !minor ) {
        return;
    }

    let ls = board.getLittleSquareAtMajorMinor( major, minor );
    if (!ls) {
        console.log("Warning: Little Square not found at: " + major + ", " + minor);
        return;
    }

    if ( ls.anyTicked() ) {
        // untick them all!
        for ( var n = 1; n <= 9; n++ ) {
            let tick = ls.getTickByNumber( n );
            tick.ticked = false;
            let selector = buildTickSelector( major, minor, n );
            $( selector ).removeClass( "ticked" );
        }
    }
    else {
        // tick them all!
        for ( var n = 1; n <= 9; n++ ) {
            let tick = ls.getTickByNumber( n );
            tick.ticked = true;
            let selector = buildTickSelector( major, minor, n );
            $( selector ).addClass( "ticked" );
        }

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

    if ( board.canEraseSquare( major, minor ) ) {
        board.eraseSquare(major, minor);
        let id = '#guess_' + major.toString() + "_" + minor.toString();

        // Empty the square
        $( id ).html( "" );
        $( id ).removeClass( "guess" );

        // Show the tick marks
        let tickSelector = "#square_" + major + "_" + minor + " .tick";
        $( tickSelector ).show();
    }
    else {
        blinkScreen();
    }
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
                let tickSelector = "#square_" + major + "_" + minor + " .tick";
                $( tickSelector ).show();
            }
            let ticks = littleSquare.ticks;
            for ( var i = 0; i < ticks.length; i++ ) {
                var tickIdSelector = "#tick_" + major + "_" + minor + "_" + ticks[i].number;
                if ( ticks[i].ticked ) {
                    $( tickIdSelector ).addClass( "ticked" );
                }
                else {
                    $( tickIdSelector ).removeClass( "ticked" );
                }
            }
            $( selector ).html( littleSquare.guess );

        }
    }
}

function handleKeyUp( event ) {

    // Shift Key
    if ( event.keyCode == 16 ) {
        guessMode = defaultGuessMode;
        updateGuessMode();
    }

}

function toggleInputMode() {
    defaultGuessMode = !defaultGuessMode;
    guessMode = defaultGuessMode;
    updateGuessMode();
}

function handleKeyDown( event ) {
    console.log(event.which + ":" + event.key + ":" + event.keyCode);

    // Shift Key
    if ( event.keyCode == 16 ) {
        guessMode = !defaultGuessMode;
        updateGuessMode();
        return;
    }

    // Arrow Keys
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

    // T
    if ( event.keyCode == 84 ) {
        toggleInputMode();
    }

    // Numbers
    if ( ( event.keyCode >= 49 ) && ( event.keyCode <= 57 ) ) {
        if ( guessMode ) {
            playNumber( event.keyCode - 48);
        }
        else {
            toggleTick( event.keyCode - 48 );
        }
    }

    // Space
    if ( event.keyCode == 32 ) {
        if ( event.shiftKey ) {
            toggleAllTicks();
        }
        else {
            eraseSquare();
        }
    }

    // Backspace
    if ( event.keyCode == 8 ) {
        eraseSquare();
    }

    // Delete
    if ( event.keyCode == 46 ) {
        eraseSquare();
    }
}

function init( difficulty ) {
    //let  puzzle = "5...8..49...5...3..673....115..........2.8..........187....415..3...2...49..5...3";
    //let puzzle = "5.3.87249849521637267349581158463972974218365326795418782934156635172894491856723";
    //let puzzle = "2...7......95.186...6..4..2.4..89.23.6.....4...5.3.91.3...186.4.57..3...1.42.5.7.";

    let puzzle = getPuzzle( difficulty );
    // puzzle = "5.3.8724984952163726734958
    // 1158463972974218365326795418782934156635172894491856723";
    guessMode = true;
    board = new Board(puzzle);

    drawBoard();

    document.getElementById('board').focus();
    setSelectedId( "square_1_1" );

}

