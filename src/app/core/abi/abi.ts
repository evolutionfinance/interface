import {AbiItem} from 'web3-utils';

export const balanceAbi: any[] = [
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "balance",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
];

export const minABI: any[] = [
	// balanceOf
	{
		'constant': true,
		'inputs': [{'name': '_owner', 'type': 'address'}],
		'name': 'balanceOf',
		'outputs': [{'name': 'balance', 'type': 'uint256'}],
		'type': 'function'
	},
	// decimals
	{
		'constant': true,
		'inputs': [],
		'name': 'decimals',
		'outputs': [{'name': '', 'type': 'uint8'}],
		'type': 'function'
	}
];

export const SWAP_ABI: any[] = [{
	'inputs': [{
		'internalType': 'address[]',
		'name': 'assetToSwapFromList',
		'type': 'address[]'
	}, {'internalType': 'address[]', 'name': 'assetToSwapToList', 'type': 'address[]'}, {
		'internalType': 'uint256[]',
		'name': 'amountToSwapList',
		'type': 'uint256[]'
	}, {
		'internalType': 'uint256[]',
		'name': 'minAmountsToReceive',
		'type': 'uint256[]'
	}, {
		'components': [{'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}, {
			'internalType': 'uint256',
			'name': 'deadline',
			'type': 'uint256'
		}, {'internalType': 'uint8', 'name': 'v', 'type': 'uint8'}, {
			'internalType': 'bytes32',
			'name': 'r',
			'type': 'bytes32'
		}, {'internalType': 'bytes32', 'name': 's', 'type': 'bytes32'}],
		'internalType': 'struct IBaseUniswapAdapter.PermitSignature[]',
		'name': 'permitParams',
		'type': 'tuple[]'
	}, {'internalType': 'bool[]', 'name': 'useEthPath', 'type': 'bool[]'}],
	'name': 'swapAndDeposit',
	'outputs': [],
	'stateMutability': 'nonpayable',
	'type': 'function'
}];
// export const SWAP_ABI: any[]

export const SWAP_AMOUNT_OUT_ABI: any[] = [{
	'inputs': [{
		'internalType': 'uint256',
		'name': 'amountIn',
		'type': 'uint256'
	}, {'internalType': 'address', 'name': 'reserveIn', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'reserveOut',
		'type': 'address'
	}],
	'name': 'getAmountsOut',
	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': '',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': '',
		'type': 'uint256'
	}, {'internalType': 'address[]', 'name': '', 'type': 'address[]'}],
	'stateMutability': 'view',
	'type': 'function'
}];

// export const TEST_ABI: any[] = [{
// 	'inputs': [{
// 		'internalType': 'uint256',
// 		'name': 'amountOut',
// 		'type': 'uint256'
// 	}, {'internalType': 'address', 'name': 'reserveIn', 'type': 'address'}, {
// 		'internalType': 'address',
// 		'name': 'reserveOut',
// 		'type': 'address'
// 	}],
// 	'name': 'getAmountsIn',
// 	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {
// 		'internalType': 'uint256',
// 		'name': '',
// 		'type': 'uint256'
// 	}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {
// 		'internalType': 'uint256',
// 		'name': '',
// 		'type': 'uint256'
// 	}, {'internalType': 'address[]', 'name': '', 'type': 'address[]'}],
// 	'stateMutability': 'view',
// 	'type': 'function'
// }];

export const WETH_GATEWAY_ABI: any[] = [{
	'inputs': [{'internalType': 'address', 'name': 'weth', 'type': 'address'}],
	'stateMutability': 'nonpayable',
	'type': 'constructor'
}, {
	'anonymous': false,
	'inputs': [{
		'indexed': true,
		'internalType': 'address',
		'name': 'previousOwner',
		'type': 'address'
	}, {'indexed': true, 'internalType': 'address', 'name': 'newOwner', 'type': 'address'}],
	'name': 'OwnershipTransferred',
	'type': 'event'
}, {'stateMutability': 'payable', 'type': 'fallback'}, {
	'inputs': [{
		'internalType': 'address',
		'name': 'lendingPool',
		'type': 'address'
	}], 'name': 'authorizeLendingPool', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'lendingPool', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'interesRateMode', 'type': 'uint256'}, {
		'internalType': 'uint16',
		'name': 'referralCode',
		'type': 'uint16'
	}], 'name': 'borrowETH', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'lendingPool', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'onBehalfOf',
		'type': 'address'
	}, {'internalType': 'uint16', 'name': 'referralCode', 'type': 'uint16'}],
	'name': 'depositETH',
	'outputs': [],
	'stateMutability': 'payable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}], 'name': 'emergencyEtherTransfer', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'token', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}],
	'name': 'emergencyTokenTransfer',
	'outputs': [],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'getWETHAddress',
	'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'owner',
	'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'renounceOwnership',
	'outputs': [],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'lendingPool', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'rateMode', 'type': 'uint256'}, {
		'internalType': 'address',
		'name': 'onBehalfOf',
		'type': 'address'
	}], 'name': 'repayETH', 'outputs': [], 'stateMutability': 'payable', 'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'newOwner', 'type': 'address'}],
	'name': 'transferOwnership',
	'outputs': [],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'lendingPool', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}],
	'name': 'withdrawETH',
	'outputs': [],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {'stateMutability': 'payable', 'type': 'receive'}];

export const REPAY_ABI: any[] = [
	{
		'inputs': [{
			'internalType': 'uint256',
			'name': 'amountOut',
			'type': 'uint256'
		}, {'internalType': 'address', 'name': 'reserveIn', 'type': 'address'}, {
			'internalType': 'address',
			'name': 'reserveOut',
			'type': 'address'
		}],
		'name': 'getAmountsIn',
		'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {
			'internalType': 'uint256',
			'name': '',
			'type': 'uint256'
		}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {
			'internalType': 'uint256',
			'name': '',
			'type': 'uint256'
		}, {'internalType': 'address[]', 'name': '', 'type': 'address[]'}],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [{'internalType': 'uint256', 'name': 'amountOut', 'type': 'uint256'}, {
			'internalType': 'address',
			'name': 'reserveIn',
			'type': 'address'
		}, {'internalType': 'address', 'name': 'reserveOut', 'type': 'address'}],
		'name': 'getAmountsIn',
		'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {
			'internalType': 'uint256',
			'name': '',
			'type': 'uint256'
		}, {'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {
			'internalType': 'uint256',
			'name': '',
			'type': 'uint256'
		}, {'internalType': 'address[]', 'name': '', 'type': 'address[]'}],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [{
			'internalType': 'address',
			'name': 'collateralAsset',
			'type': 'address'
		}, {'internalType': 'address', 'name': 'debtAsset', 'type': 'address'}, {
			'internalType': 'uint256',
			'name': 'collateralAmount',
			'type': 'uint256'
		}, {'internalType': 'uint256', 'name': 'debtRepayAmount', 'type': 'uint256'}, {
			'internalType': 'uint256',
			'name': 'debtRateMode',
			'type': 'uint256'
		}, {
			'components': [{'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}, {
				'internalType': 'uint256',
				'name': 'deadline',
				'type': 'uint256'
			}, {'internalType': 'uint8', 'name': 'v', 'type': 'uint8'}, {
				'internalType': 'bytes32',
				'name': 'r',
				'type': 'bytes32'
			}, {'internalType': 'bytes32', 'name': 's', 'type': 'bytes32'}],
			'internalType': 'struct IBaseUniswapAdapter.PermitSignature',
			'name': 'permitSignature',
			'type': 'tuple'
		}, {'internalType': 'bool', 'name': 'useEthPath', 'type': 'bool'}],
		'name': 'swapAndRepay',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	}];

export const BORROW_ABI: any[] = [
	{
		'inputs': [{
			'internalType': 'address',
			'name': 'asset',
			'type': 'address'
		}, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}, {
			'internalType': 'uint256',
			'name': 'interestRateMode',
			'type': 'uint256'
		}, {'internalType': 'uint16', 'name': 'referralCode', 'type': 'uint16'}, {
			'internalType': 'address',
			'name': 'onBehalfOf',
			'type': 'address'
		}], 'name': 'borrow', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
	}
];

export const APPROVE_ABI: any[] = [
	{
		'constant': false,
		'inputs': [{'internalType': 'address', 'name': '_spender', 'type': 'address'}, {
			'internalType': 'uint256',
			'name': '_value',
			'type': 'uint256'
		}],
		'name': 'approve',
		'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'function'
	}];

export const ALLOWANCE_ABI: any[] = [
	{
		'constant': true,
		'inputs': [{'internalType': 'address', 'name': '_owner', 'type': 'address'}, {
			'internalType': 'address',
			'name': '_spender',
			'type': 'address'
		}],
		'name': 'allowance',
		'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function'
	}];

export const LENDING_POOL_ABI: any[] = [
	{
		'inputs': [
			{'internalType': 'address', 'name': 'collateralAsset', 'type': 'address'},
			{'internalType': 'address',
			'name': 'debtAsset',
			'type': 'address'
		},
			{'internalType': 'address', 'name': 'user', 'type': 'address'},
			{
			'internalType': 'uint256',
			'name': 'debtToCover',
			'type': 'uint256'
		},
			{'internalType': 'bool', 'name': 'receiveAToken', 'type': 'bool'}],
		'name': 'liquidationCall',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'reserve',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'onBehalfOf',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'borrowRateMode',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'borrowRate',
				'type': 'uint256'
			},
			{
				'indexed': true,
				'internalType': 'uint16',
				'name': 'referral',
				'type': 'uint16'
			}
		],
		'name': 'Borrow',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'reserve',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'onBehalfOf',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			},
			{
				'indexed': true,
				'internalType': 'uint16',
				'name': 'referral',
				'type': 'uint16'
			}
		],
		'name': 'Deposit',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'target',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'initiator',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'premium',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'uint16',
				'name': 'referralCode',
				'type': 'uint16'
			}
		],
		'name': 'FlashLoan',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'collateralAsset',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'debtToCover',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'liquidatedCollateralAmount',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'address',
				'name': 'liquidator',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'bool',
				'name': 'receiveAToken',
				'type': 'bool'
			}
		],
		'name': 'LiquidationCall',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [],
		'name': 'Paused',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'reserve',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			}
		],
		'name': 'RebalanceStableBorrowRate',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'reserve',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'repayer',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			}
		],
		'name': 'Repay',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'reserve',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'liquidityRate',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'stableBorrowRate',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'variableBorrowRate',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'liquidityIndex',
				'type': 'uint256'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'variableBorrowIndex',
				'type': 'uint256'
			}
		],
		'name': 'ReserveDataUpdated',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'reserve',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			}
		],
		'name': 'ReserveUsedAsCollateralDisabled',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'reserve',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			}
		],
		'name': 'ReserveUsedAsCollateralEnabled',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'reserve',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'rateMode',
				'type': 'uint256'
			}
		],
		'name': 'Swap',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [],
		'name': 'Unpaused',
		'type': 'event'
	},
	{
		'anonymous': false,
		'inputs': [
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'reserve',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			},
			{
				'indexed': true,
				'internalType': 'address',
				'name': 'to',
				'type': 'address'
			},
			{
				'indexed': false,
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			}
		],
		'name': 'Withdraw',
		'type': 'event'
	},
	{
		'inputs': [],
		'name': 'FLASHLOAN_PREMIUM_TOTAL',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [],
		'name': 'LENDINGPOOL_REVISION',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [],
		'name': 'MAX_NUMBER_RESERVES',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [],
		'name': 'MAX_STABLE_RATE_BORROW_SIZE_PERCENT',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			},
			{
				'internalType': 'uint256',
				'name': 'interestRateMode',
				'type': 'uint256'
			},
			{
				'internalType': 'uint16',
				'name': 'referralCode',
				'type': 'uint16'
			},
			{
				'internalType': 'address',
				'name': 'onBehalfOf',
				'type': 'address'
			}
		],
		'name': 'borrow',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			},
			{
				'internalType': 'address',
				'name': 'onBehalfOf',
				'type': 'address'
			},
			{
				'internalType': 'uint16',
				'name': 'referralCode',
				'type': 'uint16'
			}
		],
		'name': 'deposit',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'from',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'to',
				'type': 'address'
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			},
			{
				'internalType': 'uint256',
				'name': 'balanceFromBefore',
				'type': 'uint256'
			},
			{
				'internalType': 'uint256',
				'name': 'balanceToBefore',
				'type': 'uint256'
			}
		],
		'name': 'finalizeTransfer',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'receiverAddress',
				'type': 'address'
			},
			{
				'internalType': 'address[]',
				'name': 'assets',
				'type': 'address[]'
			},
			{
				'internalType': 'uint256[]',
				'name': 'amounts',
				'type': 'uint256[]'
			},
			{
				'internalType': 'uint256[]',
				'name': 'modes',
				'type': 'uint256[]'
			},
			{
				'internalType': 'address',
				'name': 'onBehalfOf',
				'type': 'address'
			},
			{
				'internalType': 'bytes',
				'name': 'params',
				'type': 'bytes'
			},
			{
				'internalType': 'uint16',
				'name': 'referralCode',
				'type': 'uint16'
			}
		],
		'name': 'flashLoan',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [],
		'name': 'getAddressesProvider',
		'outputs': [
			{
				'internalType': 'contract ILendingPoolAddressesProvider',
				'name': '',
				'type': 'address'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			}
		],
		'name': 'getConfiguration',
		'outputs': [
			{
				'components': [
					{
						'internalType': 'uint256',
						'name': 'data',
						'type': 'uint256'
					}
				],
				'internalType': 'struct DataTypes.ReserveConfigurationMap',
				'name': '',
				'type': 'tuple'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			}
		],
		'name': 'getReserveData',
		'outputs': [
			{
				'components': [
					{
						'components': [
							{
								'internalType': 'uint256',
								'name': 'data',
								'type': 'uint256'
							}
						],
						'internalType': 'struct DataTypes.ReserveConfigurationMap',
						'name': 'configuration',
						'type': 'tuple'
					},
					{
						'internalType': 'uint128',
						'name': 'liquidityIndex',
						'type': 'uint128'
					},
					{
						'internalType': 'uint128',
						'name': 'variableBorrowIndex',
						'type': 'uint128'
					},
					{
						'internalType': 'uint128',
						'name': 'currentLiquidityRate',
						'type': 'uint128'
					},
					{
						'internalType': 'uint128',
						'name': 'currentVariableBorrowRate',
						'type': 'uint128'
					},
					{
						'internalType': 'uint128',
						'name': 'currentStableBorrowRate',
						'type': 'uint128'
					},
					{
						'internalType': 'uint40',
						'name': 'lastUpdateTimestamp',
						'type': 'uint40'
					},
					{
						'internalType': 'address',
						'name': 'aTokenAddress',
						'type': 'address'
					},
					{
						'internalType': 'address',
						'name': 'stableDebtTokenAddress',
						'type': 'address'
					},
					{
						'internalType': 'address',
						'name': 'variableDebtTokenAddress',
						'type': 'address'
					},
					{
						'internalType': 'address',
						'name': 'interestRateStrategyAddress',
						'type': 'address'
					},
					{
						'internalType': 'uint8',
						'name': 'id',
						'type': 'uint8'
					}
				],
				'internalType': 'struct DataTypes.ReserveData',
				'name': '',
				'type': 'tuple'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			}
		],
		'name': 'getReserveNormalizedIncome',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			}
		],
		'name': 'getReserveNormalizedVariableDebt',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [],
		'name': 'getReservesList',
		'outputs': [
			{
				'internalType': 'address[]',
				'name': '',
				'type': 'address[]'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			}
		],
		'name': 'getUserAccountData',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': 'totalCollateralETH',
				'type': 'uint256'
			},
			{
				'internalType': 'uint256',
				'name': 'totalDebtETH',
				'type': 'uint256'
			},
			{
				'internalType': 'uint256',
				'name': 'availableBorrowsETH',
				'type': 'uint256'
			},
			{
				'internalType': 'uint256',
				'name': 'currentLiquidationThreshold',
				'type': 'uint256'
			},
			{
				'internalType': 'uint256',
				'name': 'ltv',
				'type': 'uint256'
			},
			{
				'internalType': 'uint256',
				'name': 'healthFactor',
				'type': 'uint256'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			}
		],
		'name': 'getUserConfiguration',
		'outputs': [
			{
				'components': [
					{
						'internalType': 'uint256',
						'name': 'data',
						'type': 'uint256'
					}
				],
				'internalType': 'struct DataTypes.UserConfigurationMap',
				'name': '',
				'type': 'tuple'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'aTokenAddress',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'stableDebtAddress',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'variableDebtAddress',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'interestRateStrategyAddress',
				'type': 'address'
			}
		],
		'name': 'initReserve',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'contract ILendingPoolAddressesProvider',
				'name': 'provider',
				'type': 'address'
			}
		],
		'name': 'initialize',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'collateralAsset',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'debtAsset',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			},
			{
				'internalType': 'uint256',
				'name': 'debtToCover',
				'type': 'uint256'
			},
			{
				'internalType': 'bool',
				'name': 'receiveAToken',
				'type': 'bool'
			}
		],
		'name': 'liquidationCall',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [],
		'name': 'paused',
		'outputs': [
			{
				'internalType': 'bool',
				'name': '',
				'type': 'bool'
			}
		],
		'stateMutability': 'view',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'user',
				'type': 'address'
			}
		],
		'name': 'rebalanceStableBorrowRate',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			},
			{
				'internalType': 'uint256',
				'name': 'rateMode',
				'type': 'uint256'
			},
			{
				'internalType': 'address',
				'name': 'onBehalfOf',
				'type': 'address'
			}
		],
		'name': 'repay',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256'
			}
		],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'uint256',
				'name': 'configuration',
				'type': 'uint256'
			}
		],
		'name': 'setConfiguration',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'bool',
				'name': 'val',
				'type': 'bool'
			}
		],
		'name': 'setPause',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'address',
				'name': 'rateStrategyAddress',
				'type': 'address'
			}
		],
		'name': 'setReserveInterestRateStrategyAddress',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'bool',
				'name': 'useAsCollateral',
				'type': 'bool'
			}
		],
		'name': 'setUserUseReserveAsCollateral',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'uint256',
				'name': 'rateMode',
				'type': 'uint256'
			}
		],
		'name': 'swapBorrowRateMode',
		'outputs': [],
		'stateMutability': 'nonpayable',
		'type': 'function'
	},
	{
		'inputs': [
			{
				'internalType': 'address',
				'name': 'asset',
				'type': 'address'
			},
			{
				'internalType': 'uint256',
				'name': 'amount',
				'type': 'uint256'
			},
			{
				'internalType': 'address',
				'name': 'to',
				'type': 'address'
			}
		],
		'name': 'withdraw',
		'outputs': [
			{
				'internalType': 'uint256',
				'name': '',
				'type': 'uint256'
			}
		],
		'stateMutability': 'nonpayable',
		'type': 'function'
	}
];


export const V_TOKEN_ABI: any[] = [{
	'anonymous': false,
	'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'owner', 'type': 'address'}, {
		'indexed': true,
		'internalType': 'address',
		'name': 'spender',
		'type': 'address'
	}, {'indexed': false, 'internalType': 'uint256', 'name': 'value', 'type': 'uint256'}],
	'name': 'Approval',
	'type': 'event'
}, {
	'anonymous': false,
	'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'fromUser', 'type': 'address'}, {
		'indexed': true,
		'internalType': 'address',
		'name': 'toUser',
		'type': 'address'
	}, {'indexed': false, 'internalType': 'address', 'name': 'asset', 'type': 'address'}, {
		'indexed': false,
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}],
	'name': 'BorrowAllowanceDelegated',
	'type': 'event'
}, {
	'anonymous': false,
	'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address'}, {
		'indexed': false,
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}, {'indexed': false, 'internalType': 'uint256', 'name': 'index', 'type': 'uint256'}],
	'name': 'Burn',
	'type': 'event'
}, {
	'anonymous': false,
	'inputs': [{
		'indexed': true,
		'internalType': 'address',
		'name': 'underlyingAsset',
		'type': 'address'
	}, {'indexed': true, 'internalType': 'address', 'name': 'pool', 'type': 'address'}, {
		'indexed': false,
		'internalType': 'address',
		'name': 'incentivesController',
		'type': 'address'
	}, {'indexed': false, 'internalType': 'uint8', 'name': 'debtTokenDecimals', 'type': 'uint8'}, {
		'indexed': false,
		'internalType': 'string',
		'name': 'debtTokenName',
		'type': 'string'
	}, {'indexed': false, 'internalType': 'string', 'name': 'debtTokenSymbol', 'type': 'string'}, {
		'indexed': false,
		'internalType': 'bytes',
		'name': 'params',
		'type': 'bytes'
	}],
	'name': 'Initialized',
	'type': 'event'
}, {
	'anonymous': false,
	'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'from', 'type': 'address'}, {
		'indexed': true,
		'internalType': 'address',
		'name': 'onBehalfOf',
		'type': 'address'
	}, {'indexed': false, 'internalType': 'uint256', 'name': 'value', 'type': 'uint256'}, {
		'indexed': false,
		'internalType': 'uint256',
		'name': 'index',
		'type': 'uint256'
	}],
	'name': 'Mint',
	'type': 'event'
}, {
	'anonymous': false,
	'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'from', 'type': 'address'}, {
		'indexed': true,
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'indexed': false, 'internalType': 'uint256', 'name': 'value', 'type': 'uint256'}],
	'name': 'Transfer',
	'type': 'event'
}, {
	'inputs': [],
	'name': 'DEBT_TOKEN_REVISION',
	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'POOL',
	'outputs': [{'internalType': 'contract ILendingPool', 'name': '', 'type': 'address'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'UNDERLYING_ASSET_ADDRESS',
	'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'owner', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'spender',
		'type': 'address'
	}],
	'name': 'allowance',
	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'spender', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}],
	'name': 'approve',
	'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'delegatee', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}], 'name': 'approveDelegation', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'user', 'type': 'address'}],
	'name': 'balanceOf',
	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'fromUser', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'toUser',
		'type': 'address'
	}],
	'name': 'borrowAllowance',
	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'user', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'index', 'type': 'uint256'}],
	'name': 'burn',
	'outputs': [],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'decimals',
	'outputs': [{'internalType': 'uint8', 'name': '', 'type': 'uint8'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'spender', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'subtractedValue',
		'type': 'uint256'
	}],
	'name': 'decreaseAllowance',
	'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'getIncentivesController',
	'outputs': [{'internalType': 'contract IAaveIncentivesController', 'name': '', 'type': 'address'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'user', 'type': 'address'}],
	'name': 'getScaledUserBalanceAndSupply',
	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': '',
		'type': 'uint256'
	}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'spender', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'addedValue',
		'type': 'uint256'
	}],
	'name': 'increaseAllowance',
	'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'contract ILendingPool', 'name': 'pool', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'underlyingAsset',
		'type': 'address'
	}, {
		'internalType': 'contract IAaveIncentivesController',
		'name': 'incentivesController',
		'type': 'address'
	}, {'internalType': 'uint8', 'name': 'debtTokenDecimals', 'type': 'uint8'}, {
		'internalType': 'string',
		'name': 'debtTokenName',
		'type': 'string'
	}, {'internalType': 'string', 'name': 'debtTokenSymbol', 'type': 'string'}, {
		'internalType': 'bytes',
		'name': 'params',
		'type': 'bytes'
	}], 'name': 'initialize', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'user', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'onBehalfOf',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'index',
		'type': 'uint256'
	}],
	'name': 'mint',
	'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'name',
	'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'user', 'type': 'address'}],
	'name': 'scaledBalanceOf',
	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'scaledTotalSupply',
	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'symbol',
	'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'totalSupply',
	'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'recipient', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'amount',
		'type': 'uint256'
	}],
	'name': 'transfer',
	'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'sender', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'recipient',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}],
	'name': 'transferFrom',
	'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}];

export const UNISWAP_ROUTER_ABI: any[] = [{
	'inputs': [{
		'internalType': 'address',
		'name': '_factory',
		'type': 'address'
	}, {'internalType': 'address', 'name': '_WETH', 'type': 'address'}],
	'stateMutability': 'nonpayable',
	'type': 'constructor'
}, {
	'inputs': [],
	'name': 'WETH',
	'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'tokenA', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'tokenB',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'amountADesired', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountBDesired',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'amountAMin', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountBMin',
		'type': 'uint256'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'deadline',
		'type': 'uint256'
	}],
	'name': 'addLiquidity',
	'outputs': [{'internalType': 'uint256', 'name': 'amountA', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountB',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'liquidity', 'type': 'uint256'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'token', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'amountTokenDesired',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'amountTokenMin', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountETHMin',
		'type': 'uint256'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'deadline',
		'type': 'uint256'
	}],
	'name': 'addLiquidityETH',
	'outputs': [{'internalType': 'uint256', 'name': 'amountToken', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountETH',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'liquidity', 'type': 'uint256'}],
	'stateMutability': 'payable',
	'type': 'function'
}, {
	'inputs': [],
	'name': 'factory',
	'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountOut', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'reserveIn',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'reserveOut', 'type': 'uint256'}],
	'name': 'getAmountIn',
	'outputs': [{'internalType': 'uint256', 'name': 'amountIn', 'type': 'uint256'}],
	'stateMutability': 'pure',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountIn', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'reserveIn',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'reserveOut', 'type': 'uint256'}],
	'name': 'getAmountOut',
	'outputs': [{'internalType': 'uint256', 'name': 'amountOut', 'type': 'uint256'}],
	'stateMutability': 'pure',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountOut', 'type': 'uint256'}, {
		'internalType': 'address[]',
		'name': 'path',
		'type': 'address[]'
	}],
	'name': 'getAmountsIn',
	'outputs': [{'internalType': 'uint256[]', 'name': 'amounts', 'type': 'uint256[]'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountIn', 'type': 'uint256'}, {
		'internalType': 'address[]',
		'name': 'path',
		'type': 'address[]'
	}],
	'name': 'getAmountsOut',
	'outputs': [{'internalType': 'uint256[]', 'name': 'amounts', 'type': 'uint256[]'}],
	'stateMutability': 'view',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountA', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'reserveA',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'reserveB', 'type': 'uint256'}],
	'name': 'quote',
	'outputs': [{'internalType': 'uint256', 'name': 'amountB', 'type': 'uint256'}],
	'stateMutability': 'pure',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'tokenA', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'tokenB',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'liquidity', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountAMin',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'amountBMin', 'type': 'uint256'}, {
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'deadline', 'type': 'uint256'}],
	'name': 'removeLiquidity',
	'outputs': [{'internalType': 'uint256', 'name': 'amountA', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountB',
		'type': 'uint256'
	}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'token', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'liquidity',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'amountTokenMin', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountETHMin',
		'type': 'uint256'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'deadline',
		'type': 'uint256'
	}],
	'name': 'removeLiquidityETH',
	'outputs': [{'internalType': 'uint256', 'name': 'amountToken', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountETH',
		'type': 'uint256'
	}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'token', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'liquidity',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'amountTokenMin', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountETHMin',
		'type': 'uint256'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'deadline',
		'type': 'uint256'
	}],
	'name': 'removeLiquidityETHSupportingFeeOnTransferTokens',
	'outputs': [{'internalType': 'uint256', 'name': 'amountETH', 'type': 'uint256'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'token', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'liquidity',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'amountTokenMin', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountETHMin',
		'type': 'uint256'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'deadline',
		'type': 'uint256'
	}, {'internalType': 'bool', 'name': 'approveMax', 'type': 'bool'}, {
		'internalType': 'uint8',
		'name': 'v',
		'type': 'uint8'
	}, {'internalType': 'bytes32', 'name': 'r', 'type': 'bytes32'}, {
		'internalType': 'bytes32',
		'name': 's',
		'type': 'bytes32'
	}],
	'name': 'removeLiquidityETHWithPermit',
	'outputs': [{'internalType': 'uint256', 'name': 'amountToken', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountETH',
		'type': 'uint256'
	}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'token', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'liquidity',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'amountTokenMin', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountETHMin',
		'type': 'uint256'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'deadline',
		'type': 'uint256'
	}, {'internalType': 'bool', 'name': 'approveMax', 'type': 'bool'}, {
		'internalType': 'uint8',
		'name': 'v',
		'type': 'uint8'
	}, {'internalType': 'bytes32', 'name': 'r', 'type': 'bytes32'}, {
		'internalType': 'bytes32',
		'name': 's',
		'type': 'bytes32'
	}],
	'name': 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens',
	'outputs': [{'internalType': 'uint256', 'name': 'amountETH', 'type': 'uint256'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'address', 'name': 'tokenA', 'type': 'address'}, {
		'internalType': 'address',
		'name': 'tokenB',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'liquidity', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountAMin',
		'type': 'uint256'
	}, {'internalType': 'uint256', 'name': 'amountBMin', 'type': 'uint256'}, {
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'deadline', 'type': 'uint256'}, {
		'internalType': 'bool',
		'name': 'approveMax',
		'type': 'bool'
	}, {'internalType': 'uint8', 'name': 'v', 'type': 'uint8'}, {
		'internalType': 'bytes32',
		'name': 'r',
		'type': 'bytes32'
	}, {'internalType': 'bytes32', 'name': 's', 'type': 'bytes32'}],
	'name': 'removeLiquidityWithPermit',
	'outputs': [{'internalType': 'uint256', 'name': 'amountA', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountB',
		'type': 'uint256'
	}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountOut', 'type': 'uint256'}, {
		'internalType': 'address[]',
		'name': 'path',
		'type': 'address[]'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'deadline',
		'type': 'uint256'
	}],
	'name': 'swapETHForExactTokens',
	'outputs': [{'internalType': 'uint256[]', 'name': 'amounts', 'type': 'uint256[]'}],
	'stateMutability': 'payable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountOutMin', 'type': 'uint256'}, {
		'internalType': 'address[]',
		'name': 'path',
		'type': 'address[]'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'deadline',
		'type': 'uint256'
	}],
	'name': 'swapExactETHForTokens',
	'outputs': [{'internalType': 'uint256[]', 'name': 'amounts', 'type': 'uint256[]'}],
	'stateMutability': 'payable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountOutMin', 'type': 'uint256'}, {
		'internalType': 'address[]',
		'name': 'path',
		'type': 'address[]'
	}, {'internalType': 'address', 'name': 'to', 'type': 'address'}, {
		'internalType': 'uint256',
		'name': 'deadline',
		'type': 'uint256'
	}],
	'name': 'swapExactETHForTokensSupportingFeeOnTransferTokens',
	'outputs': [],
	'stateMutability': 'payable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountIn', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountOutMin',
		'type': 'uint256'
	}, {'internalType': 'address[]', 'name': 'path', 'type': 'address[]'}, {
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'deadline', 'type': 'uint256'}],
	'name': 'swapExactTokensForETH',
	'outputs': [{'internalType': 'uint256[]', 'name': 'amounts', 'type': 'uint256[]'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountIn', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountOutMin',
		'type': 'uint256'
	}, {'internalType': 'address[]', 'name': 'path', 'type': 'address[]'}, {
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'deadline', 'type': 'uint256'}],
	'name': 'swapExactTokensForETHSupportingFeeOnTransferTokens',
	'outputs': [],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountIn', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountOutMin',
		'type': 'uint256'
	}, {'internalType': 'address[]', 'name': 'path', 'type': 'address[]'}, {
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'deadline', 'type': 'uint256'}],
	'name': 'swapExactTokensForTokens',
	'outputs': [{'internalType': 'uint256[]', 'name': 'amounts', 'type': 'uint256[]'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountIn', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountOutMin',
		'type': 'uint256'
	}, {'internalType': 'address[]', 'name': 'path', 'type': 'address[]'}, {
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'deadline', 'type': 'uint256'}],
	'name': 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
	'outputs': [],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountOut', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountInMax',
		'type': 'uint256'
	}, {'internalType': 'address[]', 'name': 'path', 'type': 'address[]'}, {
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'deadline', 'type': 'uint256'}],
	'name': 'swapTokensForExactETH',
	'outputs': [{'internalType': 'uint256[]', 'name': 'amounts', 'type': 'uint256[]'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {
	'inputs': [{'internalType': 'uint256', 'name': 'amountOut', 'type': 'uint256'}, {
		'internalType': 'uint256',
		'name': 'amountInMax',
		'type': 'uint256'
	}, {'internalType': 'address[]', 'name': 'path', 'type': 'address[]'}, {
		'internalType': 'address',
		'name': 'to',
		'type': 'address'
	}, {'internalType': 'uint256', 'name': 'deadline', 'type': 'uint256'}],
	'name': 'swapTokensForExactTokens',
	'outputs': [{'internalType': 'uint256[]', 'name': 'amounts', 'type': 'uint256[]'}],
	'stateMutability': 'nonpayable',
	'type': 'function'
}, {'stateMutability': 'payable', 'type': 'receive'}];
