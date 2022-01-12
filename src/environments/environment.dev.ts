// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  pool: '0xca6e28684f12d6f8829cd22643b68e704d8beada',
  mainGraphQLUrl: 'https://api.thegraph.com/subgraphs/name/rostyslavbortman/aave-fork-2',
  graphQLWebsocketUrl: 'wss://api.thegraph.com/subgraphs/name/rostyslavbortman/aave-fork-2',
  lendingPoolAddress: '0xC7aa02A3982f40da9001AE1063720fc323258E6e',
  WETHGateway: '0xFdF9FC2122F9201848c7788cddE7Be5A98183860',
  liquidationApiUrl: 'https://testnet.aave.com/api-kovan/',
  etherscanUrl: 'https://kovan.etherscan.io',
  uniswapRepayAdapter: '0x2B3E738636BFD32aDE6ae1db5E583C4BD4935F2c',
  uniswapLiquiditySwapAdapter: '0xd4e90D77DB31d1e7fFC32c76FCf26Ef176db3E6c',
  uniswapRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  WethAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
  network: 'kovan'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
