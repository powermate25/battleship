import { clog, Ship, createGraphBfs, GameBoard, Player } from "./driver"

// Code
const uiGameBoard = document.querySelector(".gameboard")
const gridNum = 10
function generateUIBoard(gridNum) {
    const cellsNum = Math.pow(gridNum, 2) - 1

    let acc = 0
    let acc2 = 90
    //

    for (let i = gridNum-1; i >= 0; i-- ) {
        
        for(let x = 0; x < gridNum; x++) {
            const newDiv = document.createElement("div")
            const arrId = "arr" + [i, x].join("-").toString()
            // newDiv.id = `c${acc}`
            newDiv.id = `c${acc2 + x}`
            newDiv.classList.add(`${arrId}`)
            uiGameBoard.append(newDiv)
            //acc += 1
        }
        acc2 -= 10
        
    }

    /*
    for (let i = 0; i < gridNum; i++ ) {
        
        for(let x = 0; x < gridNum; x++) {
            const newDiv = document.createElement("div")
            const arrId = "arr" + [i, x].join("-").toString()
            // newDiv.id = `c${acc}`
            newDiv.id = `c${acc2 + x}`
            newDiv.classList.add(`${arrId}`)
            uiGameBoard.append(newDiv)
            //acc += 1
        }
        acc2 -= 10
    } */
}
generateUIBoard(gridNum)
clog(uiGameBoard)