export const INFO_MODAL: InfoModal = {
    HEALTH_FACTOR: {
        title: 'Health factor',
        content: 'The health factor represents the health of your loan, derived from the proportion of your collateral and how much you have borrowed. Keep it above 1 to avoid liquidation'
    },
    LIQUIDATION_THRESHOLD: {
        title: 'Liquidation threshold',
        content: 'This represents the threshold at which a borrow position will be considered undercollateralized and subject to liquidation for each collateral. For example, if the collateral has a liquidation threshold of 80%, it means that the loan will be liquidated when the debt value is worth 80% of the collateral value.'
    },
    MAXIMUM_LTV: {
        title: 'Maximum LTV',
        content: 'The Maximum Loan-to-Value ratio represents the maximum borrowing power of specific collateral. For example, if the collateral has an LTV of 75%, the user can borrow up to 0.75 worth of ETH in the principal currency for every 1 ETH worth of collateral.'
    },
    LIQUIDATION_PENALTY: {
        title: 'Liquidation penalty',
        content: 'When a liquidation occurs, liquidators repay part or all of the outstanding borrowed amount on behalf of the borrower. In return, they can buy the collateral at a discount and keep the difference as a bonus!'
    },
    COLLATERAL: {
        title: 'Adding and removing assets as collateral',
        content: 'Allows you to decide whether to use a deposited asset as collateral. An asset used as collateral will affect your borrowing power and health factor.'
    },
    LIQUIDATION_BONUS: {
        title: 'Liquidation bonus',
        content: 'This represents the threshold at which a borrow position will be considered undercollateralized and subject to liquidation for each collateral. For example, if the collateral has a liquidation threshold of 80%, it means that the loan will be liquidated when the debt value is worth 80% of the collateral value'
    },
    ORIGINATION_FEE: {
        title: 'Origination Fee',
        content: 'The origination fee is only for borrowers. It’s 0.01% of the loan amount that is collected on loan origination, from which 20% is used for referral integrators and 80% is swapped to LEND token and burned.\n' +
            '<br>For more information about fees, visit the <a class="red bold" target="_blank" href="https://evolution-finance.gitbook.io/evolution-finance/">FAQ</a>'
    },
    LOAN_TO_VALUE: {
        title: 'Loan to Value (LTV) Ratio',
        content: 'The maximum borrowing power of specific collateral. If collateral has a Loan to Value of 75%, for every 1 ETH worth of collateral the user will be able to borrow 0.75 ETH worth of principal currency. The Loan To Value is specified per collateral and expressed in percentage points.'
    },
    VARIABLE_INTEREST: {
        title: 'Variable Interest',
        content: 'Your interest rate will fluctuate based on the market.'
    }
};

export interface InfoModal {
    HEALTH_FACTOR: InfoModalBody;
    LIQUIDATION_THRESHOLD: InfoModalBody;
    MAXIMUM_LTV: InfoModalBody;
    LIQUIDATION_PENALTY: InfoModalBody;
    COLLATERAL: InfoModalBody;
    LIQUIDATION_BONUS: InfoModalBody;
    LOAN_TO_VALUE: InfoModalBody;
    ORIGINATION_FEE: InfoModalBody;
    VARIABLE_INTEREST: InfoModalBody;
}

export interface InfoModalBody {
    title: string;
    content: string;
}
