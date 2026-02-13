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
let whosTurnNow = "cpu"

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
    const p1GoodShots = player1.gameBoard.successfulShots
    const p1FleetLength = player1.gameBoard.fleetLength
    const p2GoodShots = player2.gameBoard.successfulShots
    const p2FleetLength = player2.gameBoard.fleetLength
    if (p1GoodShots.length >= p2FleetLength) {
        whosTurnNow = ""
        alert(`${player1.name} is the winner ! 🎉`)
        return true
    }
    else if (p2GoodShots.length >= p1FleetLength) {
        whosTurnNow = ""
        alert(`You're defeated! 😭${player2.name} (CPU) won. 🎉`
        )
        return false
    }
    else {clog("🔔 No winner yet!")}
}

// Logic to launch attack using prepared coordinate
function launchAttack(coordinate, player) {
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


clog(player1)
clog(player2)