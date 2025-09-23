

export class StoreRating {
    constructor(
        public id: string,
        public ownerId: string,
        public storeId: string,
        public rating: number
    ) {};
}