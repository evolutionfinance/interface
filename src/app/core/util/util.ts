import Big from 'big.js';

export function compareBigNumberByKey(a: any, b: any, key: string): number {
	if (Big(a[key]).gt(Big((b)[key]))) {
		return 1;
	} else if (Big(a[key]).eq(Big((b)[key]))) {
		return 0;
	} else {
		return -1;
	}
}

export function compareBigNumber(a: any, b: any): number {
	if (Big(a).gt(Big(b))) {
		return 1;
	} else if (Big(a).eq(Big(b))) {
		return 0;
	} else {
		return -1;
	}
}

export function getBigNumbersSum(a: string, b: string): string {
	if (!a || !b) {
		return '';
	}
	return Big(a).plus(b).toString();
}

export function getRandomColorBySymbol(symbol: string): string {
	const colors = ['#f94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F', '#90BE6D', '#43AA8B', '#4D908E', '#577590', '#577590'];
	return colors[getRandomIntFromInterval(0, 10)] as string;
}


export function getRandomIntFromInterval(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getAssetPictureBySymbol(symbol: string): string {
	switch (symbol) {
		case 'AAVE':
		case 'BAL':
		case 'BAT':
		case 'BCH':
		case 'BUSD':
		case 'CAKE':
		case 'CEL':
		case 'COMP':
		case 'CRO':
		case 'CRV':
		case 'DAI':
		case 'DGB':
		case 'DOGE':
		case 'ETH':
		case 'ENV':
		case 'FIL':
		case 'FTT':
		case 'GRT':
		case 'HT':
		case 'KNC':
		case 'LEO':
		case 'LINK':
		case 'LRC':
		case 'MANA':
		case 'MKR':
		case 'OKB':
		case 'OX':
		case 'PAX':
		case 'REN':
		case 'renBTC':
		case 'RSR':
		case 'SNX':
		case 'SUSD':
		case 'SUSHI':
		case 'TUSD':
		case 'UMA':
		case 'UNI':
		case 'USDC':
		case 'USDT':
		case 'WBTC':
		case 'YFI':
		case 'Zcash':
			return `assets/icons/assets/${symbol}.svg`;
			break;
		default:
			return 'assets/icons/coin-placeholder.svg';
	}
}

export function getAssetColorBySymbol(symbol: string): string {
	switch (symbol) {
		case 'AAVE':
			return '#2EBAC6';
			break;
		case 'BAL':
			return '#1E1E1E';
			break;
		case 'BAT':
			return '#9E1F63';
			break;
		case 'BCH':
			return '#8DC351';
		case 'BNB':
			return '#F3BA2F';
		case 'BUSD':
			return '#F0B90B';
		case 'CAKE':
			return  '#FEDC90';
		case 'CEL':
			return  '#262761';
		case 'COMP':
			return '#00D395';
		case 'CRO':
			return '#03316C';
		case 'CRV':
			return '#EBFF0C';
		case 'DAI':
			return '#F5AC37';
		case 'DGB':
			return '#0066CC';
		case 'DOGE':
			return '#C2A633';
		case 'ETH':
			return '#000000';
		case 'WETH':
			return '#000000';
		case 'ENV':
			return '#DA4D7B';
		case 'FIL':
			return '#0090FF';
		case 'FTT':
			return '#5FCADE';
		case 'GRT':
			return '#6747ED';
		case 'HT':
			return '#059BDC';
		case 'KNC':
			return '#31CB9E';
		case 'LEO':
			return '#EDA735';
		case 'LINK':
			return '#2A5ADA';
		case 'LRC':
			return '#1C60FF';
		case 'MANA':
			return '#FFC95B';
		case 'MKR':
			return '#6ACEBB';
		case 'OKB':
			return '#0932E8';
		case 'OX':
			return '#231815';
		case 'PAX':
			return '#BAD147';
		case 'REN':
			return '#001C3A';
		case 'renBTC':
			return '#87888C';
		case 'RSR':
			return '#000000';
		case 'SNX':
			return '#170659';
		case 'SUSD':
			return '#08021E';
		case 'SUSHI':
			return '#03B8FF';
		case 'TUSD':
			return '#002868';
		case 'UMA':
			return '#FF4A4A';
		case 'UNI':
			return '#FF007A';
		case 'USDC':
			return '#2775CA';
		case 'USDT':
			return '#26A17B';
		case 'WBTC':
			return '#8C8C94';
		case 'YFI':
			return '#0377FC';
		case 'Zcash':
			return  '#FFD25C';
		default:
			return '#e5e5e5';
	}
}

export function  hex_to_ascii(str1: string) {
	const hex  = str1.toString();
	let str = '';
	for (let n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}

