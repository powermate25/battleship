import { format } from "date-fns"
import { clog, Ship, createGraphBfs, GameBoard, Player } from "./driver.js"
clog("UI")
// Code

// UI game board
const boardContainer = document.querySelector(".main-container")
const p1boardContainer = document.querySelector(".p1-board-container")
const p2boardContainer = document.querySelector(".p2-board-container")
const p1GameBoardUi = document.querySelector(".p1-board-container")
const p2GameBoardUi = document.querySelector(".p2-board-container")
const gridNum = 10
const boardWidth = 30
const shipsAllowed = 5


// Function to handle true visual BFS graph squared game-board
// Pre-required declarations: 
// 1. Game board container element. (1st parameter)
// 2. Grid cells number per line. (2nd parameter)
// 3. Board width (vw units). (3rd parameter)
function generateBoardUI(boardContainer, gridNum, viewWidth) {
    const mainContainer = boardContainer
    const uiGameBoard = document.createElement("div")
    uiGameBoard.classList.add("gameboard")
    const scalePanel = document.createElement("div")
    scalePanel.classList.add("scale-panel")
    const xScale = document.createElement("div")
    xScale.classList.add("x-scale")
    const yScale = document.createElement("div")
    yScale.classList.add("y-scale")

    scalePanel.style.cssText = `
    display: flex;
    justify-content: start;
    align-items: start;
    `
    uiGameBoard.style.cssText = `
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
            uiGameBoard.append(newDiv)
        }
        acc -= gridNum
    }
    mainContainer.append(scalePanel)
    scalePanel.append(xScale)
    scalePanel.append(uiGameBoard)
    mainContainer.append(yScale)
    generateBoardScales(xScale, yScale)
}

// function to generate scales based on gameBoard specs
function generateBoardScales(xScaleDiv, yScaleDiv) {
    const gridTemplateCols = `
    display: grid;
    grid-template-columns: repeat(${gridNum}, ${boardWidth/gridNum}vw)
    `
    const gridTemplateRows = `
    display: grid;
    grid-template-rows: repeat(${gridNum}, ${boardWidth/gridNum}vw)
    `
    xScaleDiv.style.cssText = gridTemplateRows
    yScaleDiv.style.cssText = gridTemplateCols

    for (let i = 0; i < gridNum; i++) {
        const newDiv = document.createElement("div")
        newDiv.textContent = `${gridNum - i-1}`
        newDiv.id = `x${i}`
        xScaleDiv.append(newDiv)
        
        const newDiv2 = document.createElement("div")
        newDiv2.textContent = `${i}`
        newDiv2.id = `y${i}`
        yScaleDiv.append(newDiv2)
    }
}

// Prepare to start game
// Getting human player info


// Handling GameBoard (ships) occupied slots
function occupiedSlotsUI(containerClassName, occupiedPositions) {
    for (let pos in occupiedPositions) {
        const slots = occupiedPositions[pos].slice(0, -1)
        slots.forEach(x => {
            const occupiedSlot = document.querySelector(
                `.${containerClassName} .arr${x.join("-")}`
            )
            occupiedSlot.classList.add("occupied-slots")
        })
    }
}

function cpuOccupiedSlotsUI(containerClassName, occupiedPositions) {
    for (let pos in occupiedPositions) {
        const slots = occupiedPositions[pos].slice(0, -1)
        slots.forEach(x => {
            const occupiedSlot = document.querySelector(
                `.${containerClassName} .arr${x.join("-")}`
            )
            occupiedSlot.classList.add("cpu-occupied-slots")
        })
    }
}

// Handling GameBoard hit slots
function hitSlotsUI(containerClassName, hitPositions) {
    for (let hit in hitPositions) {
        const hitSlot = hitPositions[hit]
        const hitDiv = document.querySelector(
            `.${containerClassName} .arr${hitSlot.join("-")}`
        )
        hitDiv.classList.add("hit-slots")
        // clog(hitDiv)
    }
}

// Handling GameBoard failed hit slots
function failedHitSlotsUI(containerClassName, failedHitPositions) {
    for (let hit in failedHitPositions) {
        const missedHitSlot = failedHitPositions[hit]
        const missedHitDiv = document.querySelector(
            `.${containerClassName} .arr${missedHitSlot.join("-")}`
        )
        missedHitDiv.classList.add("missed-hit-slots")
    }
}

// Rendering UI

// Exports
export { 
    generateBoardUI, generateBoardScales, occupiedSlotsUI, cpuOccupiedSlotsUI, 
    hitSlotsUI, failedHitSlotsUI, gridNum, boardWidth, shipsAllowed
}