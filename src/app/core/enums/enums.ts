export enum MarketViewMode {
    USD,
    NATIVE
}

export enum DashboardViewMode {
    Deposit = 'deposits',
    Borrowings = 'borrowings'
}

export enum BorrowCoinsViewMode {
    ALL,
    STABLE
}


export enum TransactionFlowStep {
    SUBMIT = 'submit',
    SUCCESS = 'success',
    APPROVE = 'approve'
}

export enum TransactionStepStatus {
    DEFAULT = 'default',
    PENDING = 'pending',
    SUCCESS = 'success',
    DENIED = 'denied'
}

export enum FlowSteps {
    USER_INPUT,
    TRANSACTION_DETAILS
}

export enum RenStatuses {
    SUBMITTING = 'Submitting to RenVM...',
    ERROR = 'Error',
    DETECTED = 'Detected',
    CONFIRMED = 'Confirmed',
    SIGNED = 'Signed',
    REVERTED = 'Reverted',
    DONE = 'Done'
}

