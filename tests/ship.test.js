import { Ship } from "../src/ship";



test('Is ship sunk', () => {
    const ship = new Ship();
    expect(ship.isSunk()).toBeFalsy();
    for(let i = 0; i < ship.length; i++){
        ship.hit();
    }
    expect(ship.hits).toBeGreaterThanOrEqual(ship.length);
    expect(ship.isSunk()).toBeTruthy();
})

test('Find coordinates', () => {
    const ship = new Ship();
    expect(ship.shipCoordinates).toBe(null);
})