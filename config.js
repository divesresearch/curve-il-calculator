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
        },
        {
            name: 'FRAX-USDC',
            lp_address: '0xDcEF968d416a41Cdac0ED8702fAC8128A64241A2',
            chain: 'Ethereum',
            abi: stableSwapABI1
        },
        {
            name: 'alETH-ETH',
            lp_address: '0xC4C319E2D4d66CcA4464C0c2B32c9Bd23ebe784e',
            chain: 'Ethereum',
            abi: stableSwapABI1
        },
        {
            name: 'cDAI-cUSDC-USDT',
            lp_address: '0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C',
            chain: 'Ethereum',
            abi: stableSwapABI2
        },
        {
            name: 'DAI-USDC-USDT',
            lp_address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
            chain: 'Ethereum',
            abi: stableSwapABI1
        },
        {
            name: 'agEUR-EURT-EURS',
            lp_address: '0xb9446c4ef5ebe66268da6700d26f96273de3d571',
            chain: 'Ethereum',
            abi: stableSwapABI1
        },
        {
            name: 'renBTC-wBTC-sBTC',
            lp_address: '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714',
            chain: 'Ethereum',
            abi: stableSwapABI2
        },
        {
            name: 'cyDAI-cyUSDT-cyUSDC',
            lp_address: '0x2dded6Da1BF5DBdF597C45fcFaa3194e53EcfeAF',
            chain: 'Ethereum',
            abi: stableSwapABI1
        }
    ],

    chainDatas = [
        {
            chain_name: 'Ethereum',
            chain_id: 1,
            rpc: 'https://cloudflare-eth.com/'
        },
    ]

    
