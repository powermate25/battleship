const clog = console.log
clog("Battleship")

// Code
function createGraphBfs(x = 5) {
    x = x - 1
    const cells = []
    for (let i = 0; i <= x; i++) {
        function buildCells(num) {
            for(let id = 0; id <= num; id++) {
                cells.push([i, id])
            }
        }
        buildCells(x)
    }
    return cells
}

class Ship {
    constructor(shipLength) {
        this.ship = new Array(shipLength)
        this.length = this.ship.length
        this.hits = 0
        this.sunken = this.isSunk()
    }
    
    hit() {
        this.hits += 1
        this.sunken = this.hits >= this.length
        ? true : false
    }

    isSunk() {
        return this.hits >= this.length
        ? true : false
    }
}

class GameBoard {
    constructor(gridNum) {
        this.board = createGraphBfs(gridNum)
        this.boardLimit = gridNum - 1
        this.occupiedPositions = []
        this.missedShots = []
        this.successfulShots = []
        this.alertMessage = undefined
        this.fleetLength = 0
        // this.fleetLength = this.getFleetLength()
        
    }
    
    getFleetLength() {
        const fleet = this.occupiedPositions
        const result = fleet
        .reduce( (acc, curr) => {
            return acc + curr.length-1
        }, 0)
        clog(result)
        return result
    }

    placeShip(ship, posX, dir ) {
        const limit = this.boardLimit

        function checkPosition(posY) {
            posY[0] = posY[0] > limit 
            ? false : posY[0] < 0 ? false
            : posY[0]

            posY[1] = posY[1] > limit
            ? false : posY[1] < 0 ? false
            : posY[1]

            posY.forEach(i => {
                if(i === false) {
                    confirm("🚨 Dev alert: PositionY out of range! \nContinue?")
                }
            })
            return posY
        }

        const length = ship.length
        if(length > limit || length < 0) {
            throw new Error(`Ship too large. Max length is ${limit}`)
        }

        function defaultShipDir() {
            clog("Ship direction invalid!")
            return [posX[0], posX[1]]
        }
        const posY = dir === "v-"
        ? [posX[0] - (length-1), posX[1]]
        : dir === "v+"
        ? [posX[0] + (length-1), posX[1] ]
        : dir === "h-"
        ? [posX[0], posX[1] - (length-1) ]
        : dir === "h+"
        ? [posX[0], posX[1] + (length-1) ]
        : new Error("Forgot ship direction parameter?")
        clog(posX)
        clog( checkPosition(posY) )

        //Assuming good (in range) position provided
        const temp = []
        function SetOccupiedPositions() {
            if (posY[1] < posX[1]) {
                clog("Case1")
                for (let i = posX[1]; i >= posY[1] ; i-- ) {
                    temp.push([posX[0], i])
                }
            }
            else if (posY[1] > posX[1]) {
                for (let i = posX[1]; i <= posY[1]; i++ ) {
                    temp.push([posX[0], i])
                }
            }
            else if (posY[0] < posX[0]) {
                for (let i = posX[0]; i >= posY[0] ; i-- ) {
                    temp.push([i, posX[1]])
                }
            }
            else if (posY[0] > posX[0]) {
                for (let i = posX[0]; i <= posY[0] ; i++ ) {
                    temp.push([i, posX[1]])
                }
            }
            else if (posY[0] === posX[0] || posY[1] === posX[1]) {
                    temp.push(posX)
            }
            temp.push(ship)
        }
        SetOccupiedPositions()
        this.occupiedPositions.push(temp)
        this.fleetLength += ship.length
        // this.fleetLength = this.getFleetLength()
    }

    receiveAttack(coordinate) {
        const occupations = this.occupiedPositions
        let weBeenHit = false
        let shipId = undefined
        for (let index in occupations) {
            const curr = occupations[index]
            for (let i = 0; i <= curr.length-2; i++) {
                const currI = curr[i].toString()
                const target = coordinate.toString()
                if(currI === target) {
                    weBeenHit = true
                    shipId = curr[curr.length-1]
                    clog("🔔")
                    clog(shipId)
                    break
                }
            }
        }
        this.attackReport(coordinate, weBeenHit, shipId)
    }

    sendAttack(coordinate) {
        const isDuplicate = this.missedShots
        .concat(this.successfulShots)
        .some(i => {
            return i.toString() === coordinate.toString()
        })
        clog(isDuplicate)
        if (isDuplicate) {
            confirm("Dev info: can't shot same area twice!")
            return
        }

        //if two players P1 & P2: 
        // P1.op should be P2 and vice versa
        this.op.gameBoard.receiveAttack(coordinate)
        const successAlert = "Nice shot! they're hit and struggling! 🎉"
        const failureAlert = "Missed! We're going to sink first at this rate! 😭" 
        const attackResult = this.alertMessage
        if ( attackResult ) { clog(successAlert) }
        else { clog(failureAlert) }
    }
    // Next step: 
    // sendAttack method. constructor(coor, ship) 
    // or also make sense integrating board into each player

    attackReport(coordinate, report, shipId) {
            if (report) {
                shipId.hit()
                clog("🚨 Too bad, we've been hit!")
                // Report to attack result to attacker
                this.op.gameBoard.successfulShots.push(coordinate)
                this.op.gameBoard.alertMessage = true
            }
            if ( this.hits >= this.fleetLength ) {
                clog("🤕 Hell, we lost! Our last ship just gone!")
                confirm("🔔 Dev info: Game should be over now.")
            }
            else if (!report) {
                clog("📢 They're blind! Now our chance!")
                // Report to attack result to attacker
                this.op.gameBoard.missedShots.push(coordinate)
                this.op.gameBoard.alertMessage = false
            }
            
            clog("🔔 Board summary below: ")
            clog(this)
        }
}

class Player {
    constructor(name, playerType, shipNumber = 5) {
        this.name = name
        this.type = playerType
        this.gameBoard = new GameBoard(10)
        this.battleShips = new Array(shipNumber)
    }
}


// Logs
const player1 = new Player("Jack", "human")
const player2 = new Player("Rose", "cpu")

const demoShip = new Ship(4)
const gameBoard = new GameBoard(10)

gameBoard.placeShip(demoShip, [5, 3], "h+")
gameBoard.placeShip(demoShip, [3, 4], "h-")
clog(demoShip)
clog(gameBoard)
// clog(opShip)
//clog(opGameBoard)

// Exports
export { clog, Ship, createGraphBfs, GameBoard, Player }