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
        this.boardLimit = gridNum - 1
    }

    placeShip(ship, dir, posX ) {
        const limit = this.boardLimit
        let posY
    
        function checkPosition(posY) {
            posY[0] = posY[0] > limit 
            ? false : posY[0] < 0 ? false
            : posY[0]

            posY[1] = posY[1] > limit
            ? false : posY[1] < 0 ? false
            : posY[1]
            
        }

        const length = ship.length
        clog(length)
        if(length > limit || length < 0) {
            throw new Error(`Maximum ship size is ${limit}`)
        }
        // dir = dir === "v" ? "v" : "h"
        posY = dir === "v-"
        ? [posX[0] - (length-1), posX]
        : dir === "v+"
        ? [posX[0] + (length-1), posX[1] ]
        : dir === "h-"
        ? [posX[0], posX[1] - (length-1) ]
        : dir === "h+"
        ? [posX[0], posX[1] + (length-1) ]
        : false
        
        //
        if (dir === "v-") {
            posY = [posX[0] - (length-1), posX[1] ]
            clog( checkPosition(posY) )
            clog(posY)
        }
        else if (dir === "v+") {
            posY = [posX[0] + (length-1), posX[1] ]
            clog( checkPosition(posY) )
            clog(posY)
        }
        else if (dir === "h-") {
            posY = [posX[0], posX[1] - (length-1) ]
            clog( checkPosition(posY) )
            clog(posY)
        }
        else if (dir === "h+") {
            posY = [posX[0], posX[1] + (length-1) ]
            clog( checkPosition(posY) )
            clog(posY)
        }
        
        
        this.occupiedPositions.push([])
    }
}






// Logs
const demoShip = new Ship(4)
const gameBoard = new GameBoard(10)
clog(demoShip)
clog(gameBoard)
clog( gameBoard.placeShip(demoShip, "h+", [6, 1] ) )