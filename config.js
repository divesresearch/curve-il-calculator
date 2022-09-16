const 
    stableSwapABI1 = [
        'function A() view returns (uint256 out)',
        'function coins(uint256 arg0) view returns (address out)'
    ],

    stableSwapABI2 = [
        'function A() view returns (uint256 out)',
        'function coins(int128 arg0) view returns (address out)'
    ],
    
    poolDatas = [
        {
            name: 'stETH-ETH',
            lp_address: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
            chain: 'Ethereum',
            abi: stableSwapABI1
        },
        {
            name: 'renBTC-wBTC',
            lp_address: '0x93054188d876f558f4a66B2EF1d97d16eDf0895B',
            chain: 'Ethereum',
            abi: stableSwapABI2
        },
        {
            name: 'hBTC-wBTC',
            lp_address: '0x4CA9b3063Ec5866A4B82E437059D2C43d1be596F',
            chain: 'Ethereum',
            abi: stableSwapABI1
        },
        {
            name: 'cDAI-cUSDC',
            lp_address: '0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56',
            chain: 'Ethereum',
            abi: stableSwapABI2
        }
        
    ],

    chainDatas = [
        {
            chain_name: 'Ethereum',
            chain_id: 1,
            rpc: 'https://cloudflare-eth.com/'
        },
    ]

    
