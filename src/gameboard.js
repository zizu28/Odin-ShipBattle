const playerGridContainer = document.querySelector('.playerGridContainer');
const computerGridContainer = document.querySelector('.computerGridContainer');

const resultDialog = document.querySelector('.resultDialog');
const result = document.querySelector('.result');
const btn = document.querySelector('button');

import './style.css';
import { Ship } from './ship';

export const GameBoard = class {
    constructor(){
        this.rows = 10;
        this.columns = 10;
        this.player = null;
        this.ships = {
            ship1: new Ship(),
            ship2: new Ship(),
            ship3: new Ship(),
            ship4: new Ship(),
            ship5: new Ship(),
        };
        this.allShipCoordinates = [];
        this.adjustedCoordinates = [];
        this.coordinate = null;
        this.playerAttackCoordinates = 0;
        this.computerAttackCoordinates = 0;
        this.computerAttackedIndices = [];
        this.anotherValue = 0;
    }
    
    populateComputerAttackIndices(){
        for(let i = 0; i < 100; i++){
            this.computerAttackedIndices.push(i);
        }
    }


    createBoard(){
        const divStyle = `border: 1px solid black; text-align: center;`;

        const getGridStyle = (row, col) => `
            grid-row: ${row} / ${row + 1};
            grid-column: ${col} / ${col + 1};
        `;

        for (let i = 1; i <= this.rows; i++) {
            for (let j = 1; j <= this.columns; j++) {
              const div = document.createElement('div');
              div.style = divStyle + getGridStyle(i, j);
              const container = this.player === 'Player' ? playerGridContainer : computerGridContainer;
              container.appendChild(div);
            }
        }
    }

    generateCoordinate(ship){
        const x = Math.floor(Math.random() * (10 - ship.length + 1)) + 1;
        const index = Math.floor(Math.random() * 100);
        const coordinate = {row: [], column: []};
        if(ship.shipOrientation === 'Vertical'){
            coordinate.column.push(index % 10 + 1);
            coordinate.column.push(index % 10 + 2);
            coordinate.row.push(x);
            coordinate.row.push(x + ship.length);
        }
        else{
            coordinate.column.push(x);
            coordinate.column.push(x + ship.length);
            coordinate.row.push(Math.floor(index / 10) + 1);
            coordinate.row.push((Math.floor(index / 10) + 2));
        }
        return coordinate;
    }

    assignCoordinates(ship){
        this.coordinate = null
        const coordinate = this.generateCoordinate(ship);
        ship.shipCoordinates = coordinate;
        this.coordinate = coordinate;
        this.allShipCoordinates.push(coordinate);
    }     

    placeShipAtCoordinates(ship) {
        const coordinates = this.coordinate;
        const container = this.player === 'Player' ? playerGridContainer : computerGridContainer;
      
        let startingRow = coordinates.row[0];
        let endingRow = coordinates.row[1];
        let startingCol = coordinates.column[0];
        let endingCol = coordinates.column[1];
        if(container === playerGridContainer){
            if(ship.shipOrientation === 'Horizontal'){
                for (let row = startingRow; row < endingRow; row++) {
                    for (let col = startingCol; col < endingCol; col++) {
                        const childIndex = (row - 1) * 10 + col - 1;
                        const childElement = container.children[childIndex];
                
                        if (childElement) {        
                            this.playerAttackCoordinates += 1;
                            childElement.style.backgroundColor = "gray";
                            childElement.style.border = "2px solid black"; 
                        } 
                        else {
                            console.error(`Invalid ship placement coordinates: row ${row}, col ${col}`);
                        }
                    }
                }
            }
            else{
                let childIndex = (startingCol - 1) + ((startingRow - 1) * 10);
                for(let row = startingRow; row < endingRow; row++){
                    for (let col = startingCol; col < endingCol; col++){
                        const childElement = container.children[childIndex];
    
                        if (childElement) {   
                            this.playerAttackCoordinates += 1;         
                            childElement.style.backgroundColor = "gray";
                            childElement.style.border = "2px solid black"; 
                            childIndex += 10;
                        } 
                        else {
                            console.error(`Invalid ship placement coordinates: row ${row}, col ${col}`);
                        }
                    }
                }
            }    
        }
        else{
            if(ship.shipOrientation === 'Horizontal'){
                for (let row = startingRow; row < endingRow; row++) {
                    for (let col = startingCol; col < endingCol; col++) {
                        const childIndex = (row - 1) * 10 + col - 1;
                        const childElement = container.children[childIndex];
                
                        if (childElement) {     
                            this.computerAttackCoordinates += 1;       
                            childElement.classList.add('target');
                        } 
                        else {
                            console.error(`Invalid ship placement coordinates: row ${row}, col ${col}`);
                        }
                    }
                }
            }
            else{
                let childIndex = (startingCol - 1) + ((startingRow - 1) * 10);
                for(let row = startingRow; row < endingRow; row++){
                    for (let col = startingCol; col < endingCol; col++){
                        const childElement = container.children[childIndex];
    
                        if (childElement) {     
                            this.computerAttackCoordinates += 1;       
                            childElement.classList.add('target');
                            childIndex += 10;
                        } 
                        else {
                            console.error(`Invalid ship placement coordinates: row ${row}, col ${col}`);
                        }
                    }
                }
            }
        }
    }

    computerAttack(playerAttackCoordinates){
        if(this.anotherValue > 0){
            playerAttackCoordinates = this.anotherValue;
        }
        
        let idx = Math.floor(Math.random() * this.computerAttackedIndices.length);
        const childElement = playerGridContainer.children[this.computerAttackedIndices[idx]];
        this.computerAttackedIndices.splice(idx, 1);
        if (childElement) {
            if (childElement.style.backgroundColor === 'gray') {
                childElement.style = 'background-color: red; border: 1px solid black;';
                if(playerAttackCoordinates !== 0){
                    playerAttackCoordinates -= 1;
                    this.anotherValue = playerAttackCoordinates;
                }
            } 
            else {
                childElement.style = 'background-color: blue; border: 1px solid black;';
            }
        }
    }
    
    playerAttack(computerAttackCoordinates, playerAttackCoordinates){
        computerGridContainer.addEventListener('click', e => {
            const clickedDiv = e.target.closest('div');
            if(computerAttackCoordinates <= 0 || playerAttackCoordinates <= 0){
                const winner = computerAttackCoordinates > playerAttackCoordinates ? 'Computer' : 'Player';
                this.displayWinner(winner);
            }
            else if(clickedDiv.classList.contains('target')){
                clickedDiv.style = 'background-color: red; border: 1px solid black;';
                if(computerAttackCoordinates !== 0){
                    computerAttackCoordinates -= 1;
                }
            }
            else{
                clickedDiv.style = 'background-color: blue; border: 1px solid black;';
            }
            this.computerAttack(playerAttackCoordinates);
        })
    }

    displayWinner(winner){
        resultDialog.showModal();
        result.textContent = `Hurrayyyy!!!!!! ${winner} wins.`;
        btn.addEventListener('click', () => {
            resultDialog.close();
        });
    }
}