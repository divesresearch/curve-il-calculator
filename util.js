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

function find_x_y({
    A, D, t, n,
    x = 1.5,
    precision = 0.75,
    iteration = 15 
}) {
    let y
    for (let i = 0; i < iteration; i++) {
        // Solve Derivative Equation
        y = solvePolynomial(
                (A * (n ** n) * (t + 1)), 
                ((D ** (n + 1)) / ((n ** n) * (x ** 2))), 
                (((D ** (n + 1)) * t) / ((n ** n) * x))
            )
        
        // Solve StableSwap Equation
        const y2 = solvePolynomial(
                (A * (n ** n)), 
                ((A * (n ** n)) * x + D - ((A * (n ** n)) * D)), 
                -((D ** (n + 1)) / ((n ** n) * x))
            )

        if( y != y2 )
            x = y < y2 
                ? x + precision 
                : x - precision

        precision /= 2
    }

    return [x, y]
}

function calculateIL (A, D, t1, t2, n) {
    let value_1, value_2
    
        if ( t1 > t2 ) 
        [t1, t2] = [t2, t1]

    if ( t1 != -1 ) {
        const [x, y] = find_x_y({A, D, t: t1, n})
        // Value if not in the liquidity pool
        value_1 = x * (- t2) + y 
    }
    else {
        value_1 = D/2 * (1 - t2)
    }

    
    if ( t2 != -1 ) {
                let [x, y] = find_x_y({A, D, t: t2, n})
        // Value if in the liquidity pool
        value_2 = (x * (-t2)) + y
    }
    else {
        value_2 = D/2 * (1 - t2)
    }

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
        lpContract = new ethers.Contract(address, StableSwapABI, provider),
        A_contract = await lpContract.A()

    let n = 0, condition = true
    
    for (let i = 0; condition; i++) {
        try {
            if ( await lpContract.coins(ethers.BigNumber.from(i)) != null ) n += 1
            else condition = false
        }
        catch (error) {
            condition = false

            const A = A_contract.toNumber() / (n ** (n - 1))
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
