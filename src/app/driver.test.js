import {clog, Ship, createGraphBfs, GameBoard, Player } from "./driver.js"

// Code
let shipNum = 3
const demoShip = new Ship(shipNum)
demoShip.hit() // first hit
demoShip.hit() // second hit
demoShip.hit() // first hit
demoShip.hit() // second hit

test("Ship methods", () => {
    expect( demoShip.length ).toEqual(shipNum)
    expect( demoShip.hits ).toEqual(4)
    // Expect tru if hits total is equal or sup to ship length
    expect( demoShip.isSunk() ).toEqual(true)
})

let gridNum = 10
const graph = createGraphBfs(gridNum)

test("Breadth first graph generation", () => {
    expect(graph.length).toEqual(gridNum * gridNum)
})

const demoBoard = new GameBoard(gridNum)

test("Gameboard class object", () => {
    expect( demoBoard.board.length ).toBe( gridNum * gridNum )
    expect( demoBoard.boardLimit ).toBe( gridNum - 1 )
})

const battleShipsNum = 5
const userType = "human"
const demoPlayer = new Player("Bobby K.", userType, battleShipsNum)

test("Player class object", () => {
    // Type should equal second function parameter
    expect( demoPlayer.type ).toBe( userType) 
    // BattleShip number should equal third function parameter
    expect( demoPlayer.battleShips.length ).toBe( battleShipsNum )
})