const clog = console.log
clog("Battleship")

// Code
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

class GameBoard {
    constructor(gridNum) {
        this.board = createGraphBfs(gridNum)
        this.occupiedPositions = []
        this.missedShots = []
        this.successfulShots = []
        this.boardLimit = gridNum - 1
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
                    confirm("🚨 PositionY out of range! \nContinue?")
                }
            })
            return posY
        }

        const length = ship.length
        if(length > limit || length < 0) {
            throw new Error(`Maximum ship size is ${limit}`)
        }

        function defaultShipDir() {
            clog("PosY set to default horizontal+")
            return [posX[0], posX[1] + (length-1) ]
        }
        const posY = dir === "v-"
        ? [posX[0] - (length-1), posX]
        : dir === "v+"
        ? [posX[0] + (length-1), posX[1] ]
        : dir === "h-"
        ? [posX[0], posX[1] - (length-1) ]
        : dir === "h+"
        ? [posX[0], posX[1] + (length-1) ]
        : !dir? defaultShipDir()
        : new Error("Forgot ship direction parameter?")
        clog(posX)
        clog( checkPosition(posY) )

        //Assuming good position provided
        const temp = []
        function SetOccupiedPositions() {
            if (posY[1] < posX[1]) {
                for (let i = posX[1]; i >= posY[1] ; i-- ) {
                    temp.push([posX[0], i])
                }
            }
            else if (posY[1] > posX[1]) {
                for (let i = posX[1]; i <= posY[1]; i++ ) {
                    temp.push([posX[0], i])
                }
            }
            temp.push(ship)
        }
        SetOccupiedPositions()
        this.occupiedPositions.push(temp)
        // clog(this.occupiedPositions)
    }

    receiveAttack(coordinate) {
        const occupations = this.occupiedPositions
        clog(occupations[0].length)
        let weBeenHit = false
        for (let index in occupations) {
            const curr = occupations[index]
            for (let i = 0; i <= curr.length-2; i++) {
                const currI = curr[i].toString()
                const target = coordinate.toString()
                if(currI === target) {
                    weBeenHit = true
                    playerShip.hit(currI)
                    break
                }
            }
        }
        this.attackReport(coordinate, weBeenHit)
    
    }

    // Next step: 
    // sendAttack method. constructor(coor, ship) 
    // or also make sense integrating board into each player

    attackReport(coordinate, report) {
            if (report) {
                clog("🚨 Too bad, we've been hit!")
                this.successfulShots.push(coordinate)
            }
            else if (!report) {
                clog("📢 They're blind! Now our chance!")
                this.missedShots.push(coordinate)
            }
            clog("🔔 Board summary below: ")
            clog(this)
        }
}


/* for (let index in occupations) {
            const curr = occupations[index]
            for (let i = 0; i < curr.length; i++) {
                
            }
        } */



// Logs
const playerShip = new Ship(4)
const gameBoard = new GameBoard(10)
clog(playerShip)
clog(gameBoard)
clog( gameBoard.placeShip(playerShip, [5, 3], "h+") )
clog( gameBoard.placeShip(playerShip, [3, 4], "h-") )
clog(gameBoard.receiveAttack([0, 3]))
clog(gameBoard.receiveAttack([5, 3]))
clog(playerShip)
// Exports
export { Ship, createGraphBfs, GameBoard }