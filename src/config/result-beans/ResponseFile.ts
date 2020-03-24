import { Expose } from 'class-transformer';
import { File } from './File';

export class ResponseFile {

   message: string;
   file: File;
}