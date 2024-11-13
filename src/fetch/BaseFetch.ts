import { FinalRequestOptions, UnifiedResponse } from "types";


export abstract class Fetch {
    abstract call(url: string, options: FinalRequestOptions): Promise<UnifiedResponse>;
}
