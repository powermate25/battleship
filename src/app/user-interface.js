import { format } from "date-fns"
import { clog, Ship, createGraphBfs, GameBoard, Player } from "./driver"

// Code

// UI game board
const uiGameBoard = document.querySelector(".gameboard")
const gridNum = 10
const boardWidth = 50
let player1
let player2
let shipsAllowed = 5

// Function to handle true visual BFS graph squared game-board
// 1st parameter: cells number per line.
// 2nd parameter: div element that will contain the new game-board
// 3rd parameter: desired game-board width (vw units)
function generateBoardUI(boardContainer, gridNum, viewWidth) {
    boardContainer.style.cssText = `
    width: ${viewWidth}vw;
    height: ${viewWidth}vw;
    display: grid;
    grid-template-columns: repeat(${gridNum}, ${viewWidth / gridNum}vw );
    grid-template-rows: repeat(${gridNum}, ${viewWidth / gridNum}vw );
    `
    const corrector = Math.pow(gridNum, 2) - gridNum
    clog(corrector)
    let acc = corrector
    for (let i = gridNum-1; i >= 0; i-- ) {
        
        for(let x = 0; x < gridNum; x++) {
            const newDiv = document.createElement("div")
            const arrId = "arr" + [i, x].join("-").toString()
            newDiv.id = `c${acc + x}`
            newDiv.classList.add(`${arrId}`)
            boardContainer.append(newDiv)
        }
        acc -= gridNum
    }
}
generateBoardUI(uiGameBoard, gridNum, boardWidth)
clog(uiGameBoard)
// Prepare to start game
// Getting human player info
function startGame(name) {
    const formattedName = name.charAt(0)
    .toUpperCase() + name.slice(1)
    player1 = new Player(formattedName, "human", shipsAllowed)
    player2 = new Player("Alex", "cpu", shipsAllowed)
    player1.gameBoard.op = player2
    player2.gameBoard.op = player1
}

startGame("james")
clog(player1)
clog(player2)
player1.gameBoard.sendAttack([0, 3])
clog(player1)