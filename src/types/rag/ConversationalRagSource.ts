export interface ConversationalRagSource {
    text: string;
    file_id: string;
    file_name: string;
    score: number;
    order?: number | null;
    public_url?: string | null;
    labels?: string[] | null;
}
