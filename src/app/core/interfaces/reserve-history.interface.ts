export interface ReserveParamsHistoryItem {
    liquidityRate: string;
    stableBorrowRate: string;
    timestamp: number;
    utilizationRate: string;
    variableBorrowRate: string;
    __typename: string;
}


export interface ReserveParamsHistoryItemsResponse {
    reserveParamsHistoryItems: ReserveParamsHistoryItem[];
}
