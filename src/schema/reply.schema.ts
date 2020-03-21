import * as mongoose from 'mongoose';

export const ReplySchema = new mongoose.Schema({
    reply_id: String,
    reply_type: String,
    content: String,
    from_uid: String,
    to_uid: String,
});
