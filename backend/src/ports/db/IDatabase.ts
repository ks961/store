

export interface IDatabase<T> {
    readonly client: T;
    close(): Promise<void>;
}