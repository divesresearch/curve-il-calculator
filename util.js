function solvePolynomial(a, b, c) {
    if ( a != 0 ) {
        let delta = (b ** 2) - (4 * a * c)
        return (Math.sqrt (delta) - b) / (2 * a)
    }
    return (- c / b)
 }

function findAmounts({
    A, // Amplification Coefficient
    D = 1, // Total amount of coins when they have an equal price
    prices,
    n, // Number of tokens in the pool
}) {
    if ( n == 2 ) return find_x_y({A, D, price: prices, n})
    if ( n == 3 ) return find_x_y_z({A, D, prices, n})
}

/*
 * StableSwap Equation
 * (A * (n ** n)) y^2 +
 * ((A * (n ** n)) * x + D - ((A * (n ** n)) * D)) y +
 * -((D ** (n + 1)) / ((n ** n) * x))
 *
 * Derivative Equation
 * (A * (n ** n) * (1 - price)) y^2 +
 * ((D ** (n + 1)) / ((n ** n) * (x ** 2))) y +
 * (((D ** (n + 1)) * -price) / ((n ** n) * x)) 
*/

function find_x_y({
    A, // Amplification Coefficient
    D, // Total amount of coins when they have an equal price
    price,
    n, // Number of tokens in the pool
    x = 16,
    iteration = 30 
}) {
    let y, precision = x / 2
    for (let i = 0; i < iteration; i++) {
        // Solve Derivative Equation
        y = solvePolynomial(
                (A * (n ** n) * (1 - price)), 
                ((D ** (n + 1)) / ((n ** n) * (x ** 2))), 
                (((D ** (n + 1)) * (-1 * price)) / ((n ** n) * x))
            )
        
        // Solve StableSwap Equation
        const y2 = solvePolynomial(
                (A * (n ** n)), 
                ((A * (n ** n)) * x + D - ((A * (n ** n)) * D)), 
                -((D ** (n + 1)) / ((n ** n) * x))
            )
        
        if ( y != y2 )
            x = y < y2 
                ? x + precision 
                : x - precision

        precision /= 2
    }

    return [x, y]
}

function find_x_y_z({
    A, // Amplification Coefficient
    D, // Total amount of coins when they have an equal price
    z = 0.5, 
    prices,
    n, // Number of tokens in the pool
    x = 16,
    iteration = 30 
}) {
    let y, y2, x1, precision_x, precision_z = z / 2
    for (let i = 0; i < iteration; i++) {
        x1 = x
        precision_x = x / 2
        for (let j = 0; j < iteration; j++) {
            // Solve Derivative Equation
            y = solvePolynomial(
                    (A * (n ** n) * (1 - prices[0])), 
                    (D ** (n + 1)) / (z * ((n ** n) * (x1 ** 2))), 
                    ((D ** (n + 1)) * (-1 * prices[0])) / (z * ((n ** n) * x1))
                )
            
            // Solve StableSwap Equation
            y2 = solvePolynomial(
                    (A * (n ** n)), 
                    ((A * (n ** n)) * (x1 + z) + D - ((A * (n ** n)) * D)), 
                    -((D ** (n + 1)) / ((n ** n) * x1 * z))
                )
            
            if ( y != y2 )
                x1 = y < y2 
                    ? x1 + precision_x
                    : x1 - precision_x

            precision_x /= 2
        }

        const y3 =  -((1 / ((x1 ** 2) * z)) 
                    + ((-1 * prices[1]) / ((z ** 2) * x1))) * (D ** (n + 1)) 
                    / (A * (n ** (2 * n)) * (1 - prices[1]))
        if ( y2 != y3 )
            z = y2 < y3
                ? z + precision_z
                : z - precision_z

        precision_z /= 2
    }
    return [x1, y, z]
}

function calculateIL(A, initialPrices, finalPrices, n) {
    if ( n == 2 ) return calculateILFor2(A, initialPrices, finalPrices, n)
    if ( n == 3 ) return calculateILFor3(A, initialPrices, finalPrices, n)
}

function calculateILFor2(A, initialPrice, finalPrice, n) {
    let value_1, value_2, initialAmounts, finalAmounts

    // Value if not in the liquidity pool
    if (initialPrice <= 1) {
        initialAmounts = findAmounts({A, prices: initialPrice, n})
        value_1 = initialAmounts[0] * finalPrice + initialAmounts[1]
    }
    else {
        initialAmounts = findAmounts({A, prices: 1 / initialPrice, n})
        value_1 = initialAmounts[1] * finalPrice + initialAmounts[0]
    }

    // Value if in the liquidity pool
    if (finalPrice <= 1) {
        finalAmounts = findAmounts({A, prices: finalPrice, n})
        value_2 = finalAmounts[0] * finalPrice + finalAmounts[1]
    }
    else {
        finalAmounts = findAmounts({A, prices: 1 / finalPrice, n})
        value_2 = finalAmounts[1] * finalPrice + finalAmounts[0]
    }
    // Impermanent loss
    return {
        impermanentLoss: (1 - (value_2 / value_1)) * 100,
        initialAmounts,
        finalAmounts
    }
}

function calculateILFor3(A, initialPrices, finalPrices, n){
    let 
        value_1 = 0, 
        value_2 = 0, 
        initialAmounts,
        finalAmounts
        
    initialPrices.sort((a, b) => a - b).reverse()
    finalPrices.sort((a, b) => a - b).reverse()

    const 
        initial_relative_prices =   [initialPrices[1] / initialPrices[0], 
                                    initialPrices[2] / initialPrices[0]],
        final_relative_prices =     [finalPrices[1] / finalPrices[0], 
                                    finalPrices[2] / finalPrices[0]]

    initialAmounts = findAmounts({A, prices: initial_relative_prices, n})
    initialAmounts.sort((a, b) => a - b)
    finalAmounts = findAmounts({A, prices: final_relative_prices, n})
    finalAmounts.sort((a, b) => a - b)

    
    for (i = 0; i < initialAmounts.length; i++) {
        // Value if not in the liquidity pool
        value_1 += initialAmounts[i] * finalPrices[i]
        // Value if in the liquidity pool
        value_2 += finalAmounts[i] * finalPrices[i]
    }
    
    // Impermanent loss
    return {
        impermanentLoss: (1 - (value_2 / value_1)) * 100,
        initialAmounts,
        finalAmounts
    }
}


/*
 * returns { name, addres, chain, rpc, A, n } 
 */
async function fetchPoolDatas(chainName, poolName){
    const 
        poolData = poolDatas.filter(poolData => poolData.chain == chainName)
                            .find(poolData => poolData.name == poolName),
        address = poolData.lp_address,
        chainData = chainDatas.find(chainData => chainData.chain_name == chainName),
        rpc = chainData.rpc,
        chainID = chainData.chain_id,
        provider = new ethers.providers.JsonRpcProvider(rpc),
        lpContract = new ethers.Contract(address, poolData.abi, provider),
        A_contract = await lpContract.A()

    let A, n = 0, condition = true
    
    for (let i = 0; condition; i++) {
        try {
            if ( await lpContract.coins(ethers.BigNumber.from(i)) != null ) n += 1
            else condition = false
        }
        catch (error) {
            condition = false

            A = A_contract.toNumber() / (n ** (n - 1))
        }
    }
    return {
        poolName,
        address,
        chainID,
        rpc,
        A,
        n
    }
}
