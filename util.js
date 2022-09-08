// Derivative Equation
// (A * (n ** n) * (t + 1)) y_2 
// ((D ** (n + 1)) / ((n ** n) * (x ** 2))) y_1 
// (((D ** (n + 1)) * t) / ((n ** n) * x)) y_0

// StableSwap Equation
// (A * (n ** n)) y_2
// ((A * (n ** n)) * x + D - ((A * (n ** n)) * D)) y_1
// -((D ** (n + 1)) / ((n ** n) * x)) y_0

function solvePolynomial(a, b, c) {
    let delta = (b ** 2) - (4 * a * c)
    return (Math.sqrt (delta) - b) / (2 * a)
}

function find_x_y(A, D, t, n) {
    let x = 1.5
    let precision = 0.75
    for (let i = 0; i < 15; i++) {
        // Solve Derivative Equation
        let y1 = solvePolynomial(
            (A * (n ** n) * (t + 1)), 
            ((D ** (n + 1)) / ((n ** n) * (x ** 2))), 
            (((D ** (n + 1)) * t) / ((n ** n) * x)));
        
        // Solve StableSwap Equation
        let y2 = solvePolynomial(
            (A * (n ** n)), 
            ((A * (n ** n)) * x + D - ((A * (n ** n)) * D)), 
            -((D ** (n + 1)) / ((n ** n) * x)));

        if ( y1 > y2 ) {
            x -= precision
        }
        else if ( y2 > y1 ) {
            x += precision
        }
        precision /= 2
    }
    let y = solvePolynomial(
        (A * (n ** n) * (t + 1)), 
        ((D ** (n + 1)) / ((n ** n) * (x ** 2))), 
        (((D ** (n + 1)) * t) / ((n ** n) * x)));

    return [x, y];
}

function calculateIL (A, D, t, n) {
    // Value if not in the liquidity pool
    let value_1 = (D/2) * (1 - t)
    console.log (value_1)

    let x_y = find_x_y(A, D, t, n)
    // Value if in the liquidity pool
    let value_2 = (x_y[0] * (-t)) + (x_y[1])
    console.log (value_2)

    return (1 - (value_2 / value_1)) * 100
}

/*
let A = 25
let D = 1
let t = -0.96
let n = 2

console.log(calculateIL(A, D, t, n))
*/