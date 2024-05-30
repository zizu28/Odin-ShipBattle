import { GameBoard } from './gameboard';

export const Player = class {
    constructor(player){
        this.player = player;
        this.gameBoard = new GameBoard();
        this.gameBoard.player = this.player;
    }
}
