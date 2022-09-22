// Derivative Equation
// (A * (n ** n) * (price + 1)) y_2 
// ((D ** (n + 1)) / ((n ** n) * (x ** 2))) y_1 
// (((D ** (n + 1)) * price) / ((n ** n) * x)) y_0

// StableSwap Equation
// (A * (n ** n)) y_2
// ((A * (n ** n)) * x + D - ((A * (n ** n)) * D)) y_1
// -((D ** (n + 1)) / ((n ** n) * x)) y_0

function solvePolynomial(a, b, c) { 
    let delta = (b ** 2) - (4 * a * c)
    return (Math.sqrt (delta) - b) / (2 * a)
}

function find_x_y({
    A, // Amplification Coefficient
    D, // Total amount of coins when they have an equal price
    price,
    n, // Number of tokens in the pool
    x = 16,
    precision = x/2,
    iteration = 20 
}) {
    let y
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

function calculateIL (A, D, initial_price, final_price, n) {
    let value_1, value_2, x, y;

    // Value if not in the liquidity pool
    if ( initial_price < 1 ) {
        [x, y] = find_x_y({A, D, price: initial_price, n})
        value_1 = x * final_price + y
    }
    else if ( initial_price > 1 ) {
        [y, x] = find_x_y({A, D, price: (1 / initial_price), n})
        value_1 = x * final_price + y
    }
    else {
        value_1 = D/2 * (1 + final_price)
    }

    // Value if in the liquidity pool
    if ( final_price < 1 ) {
        [x, y] = find_x_y({A, D, price: final_price, n})
        value_2 = x * final_price + y
    }
    else if ( final_price > 1 ) {
        [y, x] = find_x_y({A, D, price: (1 / final_price), n})
        value_2 = x * final_price + y
    }
    else {
        value_2 = D/2 * (1 + final_price)
    }

    // Impermanent loss
    return (1 - (value_2 / value_1)) * 100
}


/*
 * returns { name, addres, chain, rpc, A, n } 
 */
async function fetchPoolDatas(chainName, poolName){
    const 
        poolData = poolDatas.filter(poolData => poolData.chain == chainName).find(poolData => poolData.name == poolName),
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
