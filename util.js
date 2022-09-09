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

function calculateIL (A, D, t1, t2, n) {
    let value_1, value_2;
    
    if ( t1 > t2 ) {
        let dummy = t1;
        t1 = t2;
        t2 = dummy;
    }
    
    if ( t1 != -1 ) {
        let x_y_1 = find_x_y(A, D, t1, n)
        // Value if not in the liquidity pool
        value_1 = x_y_1[0] * (- t2) + x_y_1[1] 
        console.log (value_1)
    }
    else {
        value_1 = D/2 * (1 - t2)
        console.log (value_1)
    }

    if ( t2 != -1 ) {
        let x_y_2 = find_x_y(A, D, t2, n)
        // Value if in the liquidity pool
        value_2 = (x_y_2[0] * (-t2)) + (x_y_2[1])
        console.log (value_2)
    }
    else {
        value_2 = D/2 * (1 - t2)
        console.log (value_2)
    }

    return (1 - (value_2 / value_1)) * 100
}


let A = 25
let D = 1
let t1 = -0.96
let t2 = -1
let n = 2

console.log(calculateIL(A, D, t1, t2, n))
