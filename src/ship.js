export const Ship = class {
    constructor(){
        this.length = Math.floor(Math.random() * 4) + 1;
        this.hits = 0;
        this.sunk = this.isSunk();
        this.shipOrientation = Math.floor(Math.random() * 2) === 0 ? 'Horizontal' : 'Vertical';
        this.shipCoordinates = null;
    }

    hit(){
        return this.hits++;
    }

    isSunk(){
        return this.hits >= this.length ? true : false;
    }      
}