
import { Expose } from 'class-transformer';

export class FilesDto{
    length: number;
    chunkSize: number;
    filename: string;    
    md5: string;
    contentType: string;
}