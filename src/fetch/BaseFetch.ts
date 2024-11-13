export abstract class Fetch {
    abstract call(url: string, options?: RequestInit): Promise<Response>;
}
