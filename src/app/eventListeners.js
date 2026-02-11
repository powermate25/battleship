import { clog, Ship, createGraphBfs, GameBoard, Player } from "./driver.js"
import { generateBoardUI, generateBoardScales, gridNum, boardWidth, shipsAllowed, player1, player2, startGame, renderUI } from "./user-interface.js"
clog("Events")

// Code
/* const grid = document.querySelector(".board-wrapper")
grid.addEventListener("click", (e) => {
    clog(e.target.className)
}) */

const p1Board = document.querySelector(".p1-board-container")
const p2Board = document.querySelector(".p2-board-container")

p2Board.addEventListener("click", (e) => {
    const targetName = e.target.className
    const targetId = targetName.slice(3, 6).split("-")
    const x = Number( targetId[0] )
    const y = Number( targetId[1] )
    const coor = [x, y]
    clog(coor)
    launchAttack(coor, player1)
    p1Board.textContent = ""
    p2Board.textContent = ""
    renderUI()
    clog(player1)
    clog(player2)
    
})

p1Board.addEventListener("click", (e) => {
    const targetName = e.target.className
    const targetId = targetName.slice(3, 6).split("-")
    const x = Number( targetId[0] )
    const y = Number( targetId[1] )
    const coor = [x, y]
    clog(coor)
    launchAttack(coor, player2)
    p1Board.textContent = ""
    p2Board.textContent = ""
    renderUI()
    clog(player1)
    clog(player2)
    
})

function launchAttack(coordinate, player) {
    const attackerBoard = player.gameBoard
    attackerBoard.sendAttack(coordinate)
    const notifDiv = document.querySelector(
        ".user-notification"
    )
    clog(attackerBoard.notification)
    if (attackerBoard.notification) {
        notifDiv.textContent = attackerBoard.notification 
    }
}

