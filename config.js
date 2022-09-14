const 
    poolDatas = [
        {
            name: 'STETH-ETH',
            lp_address: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
            chain: 'ethereum'
        }
    ],

    chainDatas = [
        {
            chain_name: 'ethereum',
            chain_id: 1,
            rpc: 'https://cloudflare-eth.com/'
        }
    ],

    StableSwapABI = [
        'function A() view returns (uint256 out)',
        'function coins(uint256 arg0) view returns (address out)'
    ]
