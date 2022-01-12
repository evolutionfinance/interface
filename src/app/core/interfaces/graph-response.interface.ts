export interface ReservesResponse {
    reserves: Reserve[];
}

export interface Reserve  {
    id: string;
    liquidityRate: string;
    name: string;
    price: {
        __typename: string;
        id: string;
    };
    stableBorrowRate: string;
    variableBorrowRate: string;
    __typename: string;
}
