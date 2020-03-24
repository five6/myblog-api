import * as mongoose from 'mongoose';
export const FilesSchema = new mongoose.Schema({
    id: String,
    length: Number,
    chunkSize: Number,
    // uploadDate: Any,
    md5: String,
    filename: String,
    contentType: String,
    aliases:  Array,
    // metadata: any,
});
