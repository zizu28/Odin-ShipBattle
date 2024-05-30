import { Player } from './player.js';
import './style.css';

const computer = new Player('Computer');
const player = new Player('Player');

computer.gameBoard.createBoard();
player.gameBoard.createBoard();

for(const ship of Object.values(computer.gameBoard.ships)){
    computer.gameBoard.assignCoordinates(ship);
    computer.gameBoard.placeShipAtCoordinates(ship);
}

for(const ship of Object.values(player.gameBoard.ships)){
    player.gameBoard.assignCoordinates(ship);
    player.gameBoard.placeShipAtCoordinates(ship);
}

computer.gameBoard.populateComputerAttackIndices();
computer.gameBoard.playerAttack(computer.gameBoard.computerAttackCoordinates, player.gameBoard.playerAttackCoordinates);
