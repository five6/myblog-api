export interface Topic {
    _id?: string;
    type?: string;
    title?: string;
    title_image?: string,
    content?: string;
    put_top?: boolean;
    from_uid?: string;
    isDeleted: boolean;
}
