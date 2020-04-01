export interface Reply {
    _id?: string;
    topic_id?: string;
    from_uid?: string,
    to_uid?: boolean;
    parent_reply_id?: boolean;
    reply_level?: number;
    isDeleted: boolean
}
