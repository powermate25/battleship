import { analyzeArray, caesarCipher, calculator, capitalize, reverseString } from "./driver.js";

test("Capitalize string", () => {
    expect(capitalize("testing practice"))
    .toBe("Testing practice")
})

test("Reverse string", () => {
    expect(reverseString("Noir")).toBe("rioN")
})

// Testing calculator class object
const calc = new calculator()
test("calculator add", () => {
    expect(calc.add(8, 2)).toBe(10)
})

test("calculator subtract", () => {
    expect(calc.subtract(30, 2)).toEqual(28)
})

test("calculator divide", () => {
    expect(calc.divide(18, 2)).toEqual(9)
})

test("calculator multiply", () => {
    expect(calc.multiply(81, 2)).toEqual(162)
})

test("Caesar Cypher xyz > abc", () => {
    expect(caesarCipher("xyz", 3)).toBe("abc")
})

test("Caesar Cypher HeLLo > KhOOr", () => {
    expect(caesarCipher("HeLLo", 3)).toBe("KhOOr")
})

test("Caesar Cypher Hello, World! > Khoor, Zruog!", () => {
    expect(caesarCipher("Hello, World!", 3)).toBe("Khoor, Zruog!")
})

test("Analyze array Average", () => {
    const testArr = new analyzeArray([1,8,3,4,2,6])
    expect( testArr.average ).toEqual(4)
})

test("Analyze array min", () => {
    const testArr = new analyzeArray([100, 82, 34, 64, 82, 63])
    expect( testArr.min ).toEqual(34)
})

test("Analyze array max", () => {
    const testArr = new analyzeArray([40, 21, 4, 16, 82, 3])
    expect( testArr.max ).toEqual(82)
})

test("Analyze array length", () => {
    const testArr = new analyzeArray([7, 100, 82, 34, 64, 82, 63, 5, 6])
    expect( testArr.length ).toEqual(9)
})