import { clog, Ship, createGraphBfs, GameBoard, Player } from "./driver.js"
import { generateBoardUI, generateBoardScales, occupiedSlotsUI, cpuOccupiedSlotsUI, hitSlotsUI, failedHitSlotsUI, gridNum, boardWidth, shipsAllowed } from "./user-interface.js"
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
const p1Notification = document.querySelector(".user-notification")
const p2Notification = document.querySelector(".cpu-notification")
const setupDialog = document.querySelector("#setup-tutorial-dial")
const closeDialogBtn = document.querySelector(".dialog-close-button")
closeDialogBtn.addEventListener("click", () => {
    setupDialog.close()
})


let player1
let player2
let userName = "Guest"
let whosTurnNow = "cpu"
let setupMode = false
let firstTimeUser = 0

function initializeGame(name) {
    const formattedName = name.charAt(0)
    .toUpperCase() + name.slice(1)
    const userNameDiv = document.querySelector(".user-name")
    userNameDiv.textContent = formattedName
    player1 = new Player(formattedName, "human", shipsAllowed)
    player2 = new Player("Alex", "cpu", shipsAllowed)
    player1.gameBoard.op = player2
    player2.gameBoard.op = player1
    for (let x = 0; x < shipsAllowed; x++) {
        cpuPlaceShips()
    }
    /* const ship3 = new Ship(5)
    const ship4 = new Ship(1)
    player2.gameBoard.placeShip(ship3, [9, 9], "v-")
    player2.gameBoard.placeShip(ship4, [4, 4], "h-") */
    renderUI()  
}
initializeGame(userName)

setP1NameDiv.value = userName
setupButton.addEventListener("click", () => {
    const response = confirm(
        "Reset game and enter setup mode?"
    )
    if (!response) {return}
    initializeGame(userName)
    enableSetupMode(true)
    settingContainer.style.display = ""
})

function isDonePlacingShip() {
    let answer = true
    const currLength = player1.gameBoard
    .occupiedPositions
    .length
    const result = shipsAllowed - currLength
    const shipStr = result === 1
    ? "ship" : "ships"
    if (currLength < shipsAllowed) {
        answer = false
        alert(`Please place ${result} more ${shipStr}`)
    }
    return answer
}

closeSetupBtn.addEventListener("click", (e) => {
    e.preventDefault()
    if ( !isDonePlacingShip() ) {return}
    enableSetupMode(false)
    settingContainer.style.display = "none"
    userName = setP1NameDiv.value
    userHeaderTitleDiv.textContent = userName
    player1.name = userName
    clog(player1)
    clog(player2)
    whosTurnNow = "human"
    clog(whosTurnNow)
    
})

function enableSetupMode (trueFalse) {
    setupMode = trueFalse
    if(setupMode) {
        settingContainer.style.display = ""
    }
    p1Notification.textContent = ""
    p2Notification.textContent = ""
    if(firstTimeUser < 1) {
        setupDialog.showModal()
        firstTimeUser = 1
    }
}
enableSetupMode(true)

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
        return true
    }
    else {
        clog("🔔 No winner yet!")
        clog(p1FleetLength)
        clog(p2FleetLength)
        return false
    }
}

// Logic to launch attack using prepared coordinate
function launchAttack(coordinate, player) {
    if(setupMode) {
        alert("🔔 Please finish setting up your battleships")
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
    }, 300);
    if (whosTurnNow === "cpu") {
        clog("📢📢Cpu Attack launching")
        // 1 second timeout before cpu's auto response
        setTimeout( () => {
            cpuPrepareAttack()
        }, 1000 )
    }
}

// Handling cpu automatic interactions

// Generate random cpu arr coordinate
function getRandomCpuMove() {
    const base = Math.pow(gridNum, 2)
    const corrector = base - 1
    clog(corrector)
    
    if (whosTurnNow !== "cpu") {return}
    clog("🚨📢")
    clog(whosTurnNow)
        const rawIndex = Math.random()
        .toFixed(2) * 100
        let fixedIndex = Math.floor(rawIndex)
        fixedIndex = fixedIndex 
        >= base ? corrector : fixedIndex
        //clog(`c${fixedIndex}`)
        const userBoard = document.querySelector(
            `.p1-board-container .gameboard #c${fixedIndex}`
        )
        //clog( userBoard.className )
        const classNameStr = userBoard.className
        const coor = prepareCoordinate(classNameStr)
        clog( coor )
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
        if (cpuShotLog.length < 1) {
            coor = getRandomCpuMove()
            isValidCoor = true
            break
        }
        loopCount += 1
        clog("🔔 getting valid coor")
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
})


// Battleship setup mode
let indexA = undefined
let indexB = undefined
// Handling ship starting index
p1Board.addEventListener("pointerdown", (e) => {
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
p1Board.addEventListener("pointerup", (e) => {
    e.preventDefault()
    if (setupMode && indexA) {
        clog("Setup mode: B")
        const classNameStr = e.target.className
        const coor = prepareCoordinate(classNameStr)
        clog(coor)
        indexB = coor
        placeShipUI(player1)
    }
})

// Handling ending index (case 1: mouse leave grid area)
/* p1Board.addEventListener("pointerout", (e) => {
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
    renderUI()
}

// random cpu ships placement
function cpuPlaceShips() {
    const getRandomCoor = () => {
        const corrector = Math.pow(gridNum, 2)
        const rawIndex = Math.random()
        .toFixed(2) * 100
        let fixedIndex = Math.floor(rawIndex)
        fixedIndex = fixedIndex 
        >= corrector ? corrector - 1 : fixedIndex
        let randomCoor = fixedIndex < 10 ? [0, fixedIndex]
        : Array.from(fixedIndex.toString())
        .map(i => Number(i) )
        clog(randomCoor)
        return randomCoor
    }

    const shipSlots = player2.gameBoard.occupiedPositions
    let isValidCoor = undefined
    let loopCount = 0
    let coor
    let tempCpuPositions
    let orientation
    let integer
    let boardLimit = gridNum - 1
    function getOrientation() {
        integer = Math.random().toFixed(1) * 10
        integer = Math.floor(integer)
        clog(integer)
        orientation = integer <= (gridNum/2)/2 
    ? "v+" : integer <= (gridNum/2) ? "h-"
    : integer >= (gridNum/2)+(gridNum/4) ? "v-"
    : "h+"
    clog("🔔 Orientation")
    clog(orientation)
    return orientation
    }
    const dir = getOrientation()

    function validateRandomCoor() {
        tempCpuPositions = []
        while (!isValidCoor) {
            loopCount += 1
            coor = getRandomCoor()
            if (!shipSlots[0]) {
                break
            }
            for (let i = 0; i < shipSlots.length; i++) {
                const currSlot = shipSlots[i].slice(-1)
            for (let arr in currSlot) {
                    const curr = currSlot[arr]
                    if (coor.toString() === curr.toString() ) {
                        isValidCoor = false
                        break
                    }
                    else { isValidCoor = true }
                }
                if(isValidCoor === false) { break}
            } 
        }
        
        let posX = coor
        clog(posX)
        if(dir === "h-") {
            clog("📢 Case1: h-")
            for (let x = 0; x <= posX[1]; x++) {
                tempCpuPositions.push([posX[0], x])
            }
        }
        else if (dir === "h+") {
            clog("📢 Case2: h+")
            for (let x = posX[1]; x <= boardLimit; x++) {
                tempCpuPositions.push([posX[0], x])
            }
        }
        else if (dir === "v-") {
            clog("📢 Case3: v-")
            for (let x = 0; x <= posX[0]; x++) {
                tempCpuPositions.push([x, posX[1]])
            }
        }
        else if (dir === "v+") {
            clog("📢 Case4: v+")
            for (let x = posX[0]; x <= boardLimit; x++) {
                tempCpuPositions.push([x, posX[1]])
            }
        }
        
    }
    validateRandomCoor()
    
    clog(`🔄 Logger: `)
    clog(tempCpuPositions)
    let validatedPos = []
    let isDoneValidatingPos = false
    let index = 0
    if(!shipSlots[index]) {
        validatedPos = tempCpuPositions
    }
    while (shipSlots[index]) {
        const curr = shipSlots[index].slice(0, -1)
        clog(curr)
        for (let i = 0; i < curr.length; i++) {
            const arr = curr[i]
            for (let x in tempCpuPositions) {
                const temp = tempCpuPositions[x]
                if (temp.toString() === arr.toString()) {
                    isDoneValidatingPos = false
                    break
                }
                else {
                    validatedPos.push(temp)
                    validatedPos = [... new Set(validatedPos)]
                }
            }
            if (isDoneValidatingPos) {break}
        }
        if(isDoneValidatingPos) {break}
        index +=1
        // Restart loop in worse case scenario where 
        // no position might be available
        if(isDoneValidatingPos && !validatedPos[0]) {
            index = 0
            validateRandomCoor()
        }
    } 
    clog(validatedPos)
    // Now ready to define ships
    const shipLength = validatedPos.length - 1
    const newShip = new Ship(shipLength)
    player2.gameBoard.placeShip(newShip, coor, dir)
}
// Next Bug to fix: Ship placement cross over

// Rendering UI

function renderUI() {
    const p1Positions = player1.gameBoard.occupiedPositions
    const p2Positions = player2.gameBoard.occupiedPositions
    // const playersPositions = p1Positions.concat(p2Positions)
    const p1HitPositions = player2.gameBoard.successfulShots
    const p2HitPositions = player1.gameBoard.successfulShots
    // const playersHitPositions = p1HitPositions.concat(p2HitPositions)
    const p1FailedHitPositions = player2.gameBoard.missedShots
    const p2FailedHitPositions = player1.gameBoard.missedShots


    p1Board.textContent = ""
    p2Board.textContent = ""
    generateBoardUI(p1Board, gridNum, boardWidth)
    generateBoardUI(p2Board, gridNum, boardWidth)
    occupiedSlotsUI("p1-board-container", p1Positions)
    cpuOccupiedSlotsUI("p2-board-container", p2Positions)
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
