export const EMPTY_LIST: EmptyList = {
    BORROW: {
        title: 'Nothing borrowed yet',
        content: 'There will be a list of all the assets you borrowed. For now it’s empty until you start to borrow.',
        mainButton: {title: 'Borrow Now', route: '/borrow'},
        secondButton: {title: 'Go back', route: '/markets'}
    },
    SWAP: {
        title: 'Swap',
        content: 'You must have at least <b>1 asset deposited</b> in the Evolution Protocol to make use of the swap functionality. This swap functionality only <b>contains the assets you deposited</b> in the Evolution Protocol.',
        secondContent: 'For more information on the swap feature, please read the <a class="red bold" target="_blank">FAQ</a>.',
        mainButton: {title: 'Deposit now', route: '/deposit'},
        secondButton: {title: 'Go back', route: '/markets'}
    },
    HISTORY: {
        title: 'No history yet',
        content: 'There will be a list of all the transactions you’ve made. For now it’s empty until you perform your first action.',
        mainButton: {title: 'Deposit Now', route: '/deposit'},
        secondButton: {title: 'Go back', route: '/markets'}
    }
};

export interface EmptyList {
    BORROW: EmptyListBody;
    SWAP: EmptyListBody;
    HISTORY: EmptyListBody;
}

export interface EmptyListBody {
    title: string;
    content: string;
    secondContent?: string;
    mainButton: { title: string, route: string };
    secondButton: { title: string, route: string };
}
