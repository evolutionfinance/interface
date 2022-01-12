import {ILineChartOptions} from 'chartist';

export const DEFAULT_CHART_OPTIONS: ILineChartOptions = {
    axisX: {
        showGrid: false,
        // showLabel: false,
        labelInterpolationFnc: (value: string, index: number, labels: any) => {
            return index % 25 === 0 ? value : null;
        }
    },
    axisY: {
        labelInterpolationFnc: (value: string, index: null) => {
            return value + '%';
        }
    },
    height: 200,
};

export const STABLE_COINS: string[] = ['BUSD', 'DAI', 'GUSD', 'SUSD', 'TUSD', 'USDC', 'USDT'];
export const APPROVE_AMOUNT: string = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
