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
    if ( n == 2 ) return find_x_y({A, D, prices: prices, n})
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
    prices,
    n, // Number of tokens in the pool
    x = 16,
    iteration = 30 
}) {
    let y, precision = x / 2, relativePrice, switched

    if (prices[0] == prices[1])
        return [D/2, D/2]
    if (prices[0] > prices[1]) {
        relativePrice = prices[1] / prices [0]
        switched = true
    }
    else {
        relativePrice = prices[0] / prices [1]
        switched = false
    } 
    for (let i = 0; i < iteration; i++) {
        // Solve Derivative Equation
        y = solvePolynomial(
                (A * (n ** n) * (1 - relativePrice)), 
                ((D ** (n + 1)) / ((n ** n) * (x ** 2))), 
                (((D ** (n + 1)) * (-1 * relativePrice)) / ((n ** n) * x))
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
    
    if (switched)
        return [y, x]
    return [x, y]
}

function find_x_y_z({
    A, // Amplification Coefficient
    D, // Total amount of coins when they have an equal price
    z = 1.6, 
    prices,
    n, // Number of tokens in the pool
    x = 16,
    iteration = 50 
}) {
    let y1, y2, y3, x1, precision_x, precision_z = z / 2, 
        relativePrices = [prices[0] / prices[1], prices[0] / prices[2], prices[2] / prices[1]],
        price1, price2, switched

    // If the prices are equal to 1, no need to calculate
    if (relativePrices[0] == 1 && relativePrices[1] == 1)
        return [D/3, D/3, D/3]

    // If the price of x in terms of y is greater than
    // the price of x in terms of z, switch
    if (relativePrices[1] >= relativePrices[0]) {
        price1 = relativePrices[1]
        price2 = relativePrices[2]
        switched = false
    }
    else {
        price1 = relativePrices[0]
        price2 = 1 /  relativePrices[2]
        switched = true
    }
    
    for (let i = 0; i < iteration; i++) {
        // When price = 1, x1 = z, and y2 is undefined.
        if (price1 == 1) {
            x1 = z

            // Solve StableSwap Equation
            y1 = solvePolynomial(
                (A * (n ** n)), 
                ((A * (n ** n)) * (x1 + z) + D - ((A * (n ** n)) * D)), 
                -((D ** (n + 1)) / ((n ** n) * x1 * z))
            )
        }
        else {
            x1 = x
            precision_x = x / 2
            for (let j = 0; j < iteration; j++) {
                if (price1 > 1) {
                    // Solve dy/dz Equation
                    y1 = solvePolynomial(
                        (A * (n ** n) * (1 - price2)), 
                        (D ** (n + 1)) / (x1 * ((n ** n) * (z ** 2))), 
                        ((D ** (n + 1)) * (-1 * price2)) / (z * ((n ** n) * x1))
                    )

                    // Solve dz/dx Equation
                    y2 =  -((1 / ((x1 ** 2) * z)) 
                            + ((-1 * price1) / ((z ** 2) * x1))) * (D ** (n + 1)) 
                            / (A * (n ** (2 * n)) * (1 - price1))
                    
                    if ( y2 != y1 ) 
                        x1 = y2 < y1 
                            ? x1 - precision_x
                            : x1 + precision_x
                }
                else {
                    // Solve StableSwap Equation
                    y1 = solvePolynomial(
                        (A * (n ** n)), 
                        ((A * (n ** n)) * (x1 + z) + D - ((A * (n ** n)) * D)), 
                        -((D ** (n + 1)) / ((n ** n) * x1 * z))
                    )

                    // Solve dz/dx Equation
                    y2 =  -((1 / ((x1 ** 2) * z)) 
                            + ((-1 * price1) / ((z ** 2) * x1))) * (D ** (n + 1)) 
                            / (A * (n ** (2 * n)) * (1 - price1))
                    
                    if ( y2 != y1 )
                        x1 = y2 < y1 
                            ? x1 + precision_x
                            : x1 - precision_x
                }

                precision_x /= 2
            }
        }
        if (price1 > 1) {
            // Solve StableSwap Equation
            y3 = solvePolynomial(
                (A * (n ** n)), 
                ((A * (n ** n)) * (x1 + z) + D - ((A * (n ** n)) * D)), 
                -((D ** (n + 1)) / ((n ** n) * x1 * z))
            )
            
            if ( y3 != y1 )
                z = y3 < y1
                    ? z - precision_z
                    : z + precision_z
        }
        else {
            // Solve dy/dz Equation
            y3 = solvePolynomial(
                (A * (n ** n) * (1 - price2)), 
                (D ** (n + 1)) / (x1 * ((n ** n) * (z ** 2))), 
                ((D ** (n + 1)) * (-1 * price2)) / (z * ((n ** n) * x1))
            )
            
            if ( y3 != y1 )
            z = y3 < y1
                ? z + precision_z
                : z - precision_z
        }
        
        precision_z /= 2
    }
    
    if (!switched)
        return [x1, y1, z]
    return [x1, z, y1]
}

function calculateIL(A, initialPrices, finalPrices, n) {
    let 
        value_1 = 0, 
        value_2 = 0, 
        initialAmounts = findAmounts({A, prices: initialPrices, n}),
        finalAmounts = findAmounts({A, prices: finalPrices, n})
    
    
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
        finalAmounts,
        value_1,
        value_2,
        initialPrices,
        finalPrices
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
