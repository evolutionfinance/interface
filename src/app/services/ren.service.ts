import {Injectable} from '@angular/core';

import {RenCurrency} from '../core/interfaces/ren';
import {
    Bitcoin,
    BitcoinCash,
    Dogecoin,
    Zcash
} from '@renproject/chains-bitcoin';
// import {Filecoin} from '@renproject/chains-filecoin';
// import {Terra} from '@renproject/chains-terra';

@Injectable({
    providedIn: 'root'
})
export class RenService {

    constructor() {
    }

    getRenCurrencies(): RenCurrency[] {
        return [
            {
                name: 'Bitcoin',
                symbol: 'BTC',
                imageLink: 'assets/icons/bitcoin.svg',
                action: Bitcoin()
            },
            {
                name: 'Zcash',
                symbol: 'ZEC',
                imageLink: 'assets/icons/assets/Zcash.svg',
                action: Zcash()
            },
            {
                name: 'BitcoinCash',
                symbol: 'BCH',
                imageLink: 'assets/icons/assets/BCH.svg',
                action: BitcoinCash()
            },
            // {
            //     name: 'Filecoin',
            //     symbol: 'FIL',
            //     imageLink: 'assets/icons/assets/FIL.svg',
            //     action: Filecoin()
            // },
            // {
            //     name: 'Luna',
            //     symbol: 'LUNA',
            //     imageLink: 'assets/icons/question-mark.svg',
            //     action: Terra()
            // },
            // {
            //     name: 'Dogecoin',
            //     symbol: 'DOGE',
            //     imageLink: 'assets/icons/assets/DOGE.svg',
            //     action: Dogecoin()
            // }
        ];
    }
}
