class Tick {
    constructor(number) {
        this.number = number;
        this.ticked = false;
    }

    toggle() {
        this.ticked = !this.ticked;
    }

}
