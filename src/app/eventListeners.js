import { clog, Ship, createGraphBfs, GameBoard, Player } from "./driver.js"
import { generateBoardUI, generateBoardScales, occupiedSlotsUI, hitSlotsUI, failedHitSlotsUI, gridNum, boardWidth, shipsAllowed, player1, player2, initializeGame } from "./user-interface.js"
clog("Events")

// Code
/* const grid = document.querySelector(".board-wrapper")
grid.addEventListener("click", (e) => {
    clog(e.target.className)
}) */

const p1Board = document.querySelector(".p1-board-container")
const p2Board = document.querySelector(".p2-board-container")
const setP1NameDiv = document.querySelector("form input[id=username]")
const userHeaderTitleDiv = document.querySelector(".user-name")
const setupButton = document.querySelector(".setup-button")
const closeSetupBtn = document.querySelector(".finish-setup-button")
const settingContainer = document.querySelector(".setting-container")

let userName = "Guest"
let whosTurnNow = "cpu"
let setupMode = false
if(!setupMode) {clog("false")}
settingContainer.style.display = "none"

//setP1NameDiv.textContent = "test"

// Logic to prepare coordinate from className
function prepareCoordinate(targetClassName) {
    const targetId = targetClassName.slice(3, 6).split("-")
    const x = Number( targetId[0] )
    const y = Number( targetId[1] )
    const coor = [x, y]
    return coor
}

// Logic to detect winner
function weGotWinner() {
    if(setupMode) {
        clog("⚙ currently in setup")
        return
    }
    const p1GoodShots = player1.gameBoard.successfulShots
    const p1FleetLength = player1.gameBoard.fleetLength
    const p2GoodShots = player2.gameBoard.successfulShots
    const p2FleetLength = player2.gameBoard.fleetLength
    if (p1GoodShots.length >= p2FleetLength) {
        whosTurnNow = "game-over"
        alert(`${player1.name} is the winner ! 🎉`)
        return true
    }
    else if (p2GoodShots.length >= p1FleetLength) {
        whosTurnNow = "game-over"
        alert(`You're defeated! 😭${player2.name} (CPU) won. 🎉`
        )
        return false
    }
    else {clog("🔔 No winner yet!")}
}

// Logic to launch attack using prepared coordinate
function launchAttack(coordinate, player) {
    if(setupMode) {
        clog("⚙ currently in setup")
        return
    }
    if( weGotWinner() ) {return}
    if(whosTurnNow !== player.type) {
        clog("⛔ Not you turn!")
        return
    }
    
    const divClass = player.type
    === "human" ? ".user-notification"
    : player.type === "cpu" ? ".cpu-notification"
    : undefined

    const attackerBoard = player.gameBoard
    attackerBoard.sendAttack(coordinate)
    const attackerNotifDiv = document.querySelector(
        `${divClass}`
    )
    if (attackerBoard.notification) {
        attackerNotifDiv.textContent = attackerBoard.notification 
    }
    whosTurnNow = whosTurnNow 
    === "human" ? "cpu" : "human"
    clog(whosTurnNow)
    clog("changed turn")
    p1Board.textContent = ""
    p2Board.textContent = ""
    renderUI()
    setTimeout(() => {
        weGotWinner()
    }, 500);
    if (whosTurnNow === "cpu") {
        // 1 seconde timeout before cpu's auto response
        setTimeout( () => {
            cpuPrepareAttack()
        }, 1000 )
    }
}

// Handling cpu automatic interactions
// Generate random cpu arr coordinate
function getRandomCpuMove() {
    if (whosTurnNow !== "cpu") {return}
        const rawIndex = Math.random()
        .toFixed(2) * 100
        let fixedIndex = Math.floor(rawIndex)
        fixedIndex = fixedIndex 
        === 100 ? 99 : fixedIndex
        //clog(`c${fixedIndex}`)
        const userBoard = document.querySelector(
            `.p1-board-container .gameboard #c${fixedIndex}`
        )
        //clog( userBoard.className )
        const classNameStr = userBoard.className
        const coor = prepareCoordinate(classNameStr)
        //clog( coor )
        return coor
}


// Check generated cpu arr until correct arr generated
function validCpuMove() {
    if (whosTurnNow !== "cpu") {return}
    const cpuFailedShots = player2.gameBoard.missedShots
    const cpuSuccessfulShots = player2.gameBoard.successfulShots
    const cpuShotLog = cpuFailedShots.concat(cpuSuccessfulShots)
    let isValidCoor = undefined
    let coor
    let loopCount = 0
    while (!isValidCoor) {
        loopCount += 1
        coor = getRandomCpuMove()
        for (let arr in cpuShotLog) {
            const curr = cpuShotLog[arr]
            if (coor.toString() === curr.toString() ) {
                isValidCoor = false
                break
            }
            else { isValidCoor = true }
        }
    }
    clog(`🔄 Loop count: ${loopCount}`)
    return coor
}

// Launch cpu attack with valid arr from above
function cpuPrepareAttack() {
    if (whosTurnNow !== "cpu") {return}
    const coor = validCpuMove()
    launchAttack(coor, player2)
    // weGotWinner()
}

// Player1 event listeners.
// Each player1 move will trigger cpu move and vice-versa
function isDuplicatedClickUI(coor) {
    const userFailedShots = player1.gameBoard.missedShots
    const userSuccessfulShots = player1.gameBoard.successfulShots
    const userShotLog = userFailedShots.concat(userSuccessfulShots)
    clog(userShotLog)
    let isDuplicatedClick = false
    for (let arr in userShotLog) {
        const curr = userShotLog[arr]
        if (curr.toString() === coor.toString()) {
            return isDuplicatedClick = true
        }
    }
    return isDuplicatedClick
}
p2Board.addEventListener("click", (e) => {
    const classNameStr = e.target.className
    const correctClick = 
    classNameStr.slice(0, 3) === "arr"
    const coor = prepareCoordinate(classNameStr)
    const invalidUserMove = isDuplicatedClickUI(coor)
    const notifDiv = document.querySelector(
        ".user-notification"
    )
    if(!correctClick || invalidUserMove) {
        clog("🚨🚨🚨")
        clog("incorrect or duplicated click")
        notifDiv.textContent = 
        "🔔 More focus! incorrect or duplicated click."
        return
    }
    clog(classNameStr)
    clog(coor)
    launchAttack(coor, player1)
})

// Useful for test or Human player2 interaction events
p1Board.addEventListener("click", (e) => {
    const classNameStr = e.target.className
    const coor = prepareCoordinate(classNameStr)
    launchAttack(coor, player2)
    /* p1Board.textContent = ""
    p2Board.textContent = ""
    renderUI() */
})


// Battleship setup mode
let indexA = undefined
let indexB = undefined
setP1NameDiv.value = userName
setupButton.addEventListener("click", () => {
    enableSetupMode(true)
    settingContainer.style.display = ""
})

closeSetupBtn.addEventListener("click", () => {
    enableSetupMode(false)
    settingContainer.style.display = "none"
    userName = setP1NameDiv.value
    userHeaderTitleDiv.textContent = userName
})

function enableSetupMode (trueFalse) {
    setupMode = trueFalse
    if(setupMode) {
        settingContainer.style.display = ""
    }
}


enableSetupMode(true)

// Handling ship starting index
p1Board.addEventListener("mousedown", (e) => {
    if (setupMode && !indexA && !indexB) {
        e.preventDefault()
        clog("Setup mode: A")
        const classNameStr = e.target.className
        const coor = prepareCoordinate(classNameStr)
        clog(coor)
        indexA = coor
    }
})

// Handling ending index (case 1: mouse leave grid area)
p1Board.addEventListener("mouseup", (e) => {
    if (setupMode && indexA) {
        e.preventDefault()
        clog("Setup mode: B")
        const classNameStr = e.target.className
        const coor = prepareCoordinate(classNameStr)
        clog(coor)
        indexB = coor
        /* p1Board.textContent = ""
        p2Board.textContent = ""
        renderUI() */ 
        placeShipUI(player1)
    }
})

// Handling ending index (case 1: mouse leave grid area)
/* p1Board.addEventListener("mouseout", (e) => {
    if (whosTurnNow === "setup" && indexA) {
        e.preventDefault()
        clog("Setup mode: B")
        const classNameStr = e.target.className
        const coor = prepareCoordinate(classNameStr)
        clog(coor)
        indexB = coor
        //placeShipUI(player1)
        
    }
}) */

function placeShipUI(player) {
    const boardLimit = gridNum-1
    const shipLimit = player.gameBoard.occupiedPositions.length
    if(shipLimit >= shipsAllowed) {
        clog(player)
        clog("Max ship limit reached!")
        return
    }
    
    let newLength = 1
    let dir
    if (indexA && indexB) {
        if (indexA[0] !== indexB[0]) {
            clog("Vertical")
            const tempLength = indexA[0] - indexB[0]
            newLength += Math.abs(tempLength)
            clog(newLength)
            const newShip = new Ship(newLength)
            dir = indexA[0] > indexB[0] ? "v-"
            : indexA[0] < indexB[0] ? "v+"
            : "v+"
            player.gameBoard.placeShip(newShip, indexA, dir)
        }
        else if (indexA[0] === indexB[0]) {
            clog("Horizontal")
            const tempLength = indexA[1] - indexB[1]
            newLength += Math.abs(tempLength)
            clog(newLength)
            const newShip = new Ship(newLength)
            dir = indexA[1] > indexB[1] ? "h-"
            : indexA[1] < indexB[1] ? "h+"
            : "h+"
            player.gameBoard.placeShip(newShip, indexA, dir)
        }
    }
    indexA = undefined
    indexB = undefined
    p1Board.textContent = ""
    p2Board.textContent = ""
    renderUI()
    clog(player1)
}

// Rendering UI
initializeGame(userName)
function startGame() {

}
const p1Positions = player1.gameBoard.occupiedPositions
const p2Positions = player2.gameBoard.occupiedPositions
// const playersPositions = p1Positions.concat(p2Positions)
const p1HitPositions = player2.gameBoard.successfulShots
const p2HitPositions = player1.gameBoard.successfulShots
// const playersHitPositions = p1HitPositions.concat(p2HitPositions)
const p1FailedHitPositions = player2.gameBoard.missedShots
const p2FailedHitPositions = player1.gameBoard.missedShots

/* const ship1 = new Ship(4)
const ship2 = new Ship(3) */
const ship3 = new Ship(5)
const ship4 = new Ship(1)

const tempShip = new Ship(2)
/* player1.gameBoard.placeShip(tempShip, [9, 0], "h+") */

player2.gameBoard.placeShip(ship3, [9, 9], "v-")
player2.gameBoard.placeShip(ship4, [4, 4], "h-")

function renderUI() {
    generateBoardUI(p1Board, gridNum, boardWidth)
    generateBoardUI(p2Board, gridNum, boardWidth)
    occupiedSlotsUI("p1-board-container", p1Positions)
    occupiedSlotsUI("p2-board-container", p2Positions)
    hitSlotsUI("p1-board-container", p1HitPositions)
    hitSlotsUI("p2-board-container", p2HitPositions)
    failedHitSlotsUI("p1-board-container", p1FailedHitPositions)
    failedHitSlotsUI("p2-board-container", p2FailedHitPositions)
    
}
renderUI()

//
clog(player1)
clog(player2)
//clog( placeShipUI(player1, 4, [9, 0], "v+") )
