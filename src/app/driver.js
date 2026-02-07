
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function reverseString(str) {
    return str.split("").toReversed().join("")
}

class calculator {
    constructor(a, b) {
        this.a = a
        this.b = b
    }
    add(a, b) {
        return a + b
    }

    subtract(a, b) {
        return a - b
    }

    divide(a, b) {
        return a / b
    }

    multiply(a, b) {
        return a * b
    }
}

function caesarCipher(str, shiftNum) {
    const base = Array.from(str)
    .map(i => {
        // Checking if char is case sensitive (letter) or not (symbol)
        // Used lower and upper case combo as trick.
        // Opposed to letters, symbols to lower or upper case won't change. 
        if ( i.toLowerCase().toUpperCase() 
        === i.toLowerCase()
        ) {i}
        else {
            const init = i
            function revertChar(char) {
                if(init.toUpperCase() === init ) {return char.toUpperCase()}
                else { return char.toLowerCase()}

            // detecting if char code will be above 122 ("z") 
            // if so simply loop to "a" and add remaining shifting number
            // subtracting -1 at the end because "a" is the +1 added (loop) char
            }
            function detectCharLoop(i) {
                const tempBase = i.toLowerCase().charCodeAt()
                if (tempBase + shiftNum > 122) {
                    const tempShift = (tempBase + shiftNum) - 122
                    const loopedChar = ("a".charCodeAt() + tempShift) - 1
                    return i = String.fromCharCode(loopedChar)
                }
                else {
                    const temp = i.charCodeAt() + shiftNum
                    i = String.fromCharCode(temp)
                    // console.log(i)
                    return i
                }
            }
            i = detectCharLoop(i)
            // revert shifted char to match initial character case 
            i = revertChar(i)
        }
        return i
    })

    return base.join("")
}

class analyzeArray {
    constructor (arr) {
        // this.arr = arr
        this.average = this.avg(arr)
        this.min = this.min(arr)
        this.max = this.max(arr)
        this.length = arr.length
        
    }

    avg(arr) {
        const result = arr.reduce( (acc, curr) => {
            return (acc + curr)
        }, 0 )
        return Math.floor( (result / arr.length) )
    }

    min(arr) {
        const result = arr.reduce( (acc, curr) => {
            return ( acc = acc < curr ? acc : curr )
        })
        return result
    }

    max(arr) {
        const result = arr.reduce( (acc, curr) => {
            return ( acc = acc > curr ? acc : curr )
        })
        return result
    }
    
}
export { capitalize, reverseString, calculator, caesarCipher, analyzeArray  }