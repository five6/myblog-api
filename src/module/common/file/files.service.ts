import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs'
import { GridFSBucketReadStream } from 'mongodb'
import { File } from '../../../config/result-beans/File'
import * as mongoose from 'mongoose';
import { Config } from 'src/config/config';

@Injectable()
export class FilesService {

    private fileModel: MongoGridFS;

    // this.fileModel = new MongoGridFS(conn.db, 'fs');
    constructor() {
      const con = mongoose.createConnection(Config.mongo_files);
      this.fileModel = new MongoGridFS(con.db, 'fs');
    }
  

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.fileModel.readFileStream(id);
  }

  async find(id: string): Promise<File> {
    const result = await this.fileModel
      .findById(id).catch(err => {
          throw new HttpException('File not found', HttpStatus.NOT_FOUND)
        } )
      .then(result => result);
    return {
        filename: result.filename,
        length: result.length,
        chunkSize: result.chunkSize,
        md5: result.md5,
        contentType: result.contentType      
    }
  }

  async deleteFile(id: string): Promise<boolean>{
    return await this.fileModel.delete(id)
  }


  async check(id: string): Promise<File>{
    return await this.fileModel.findOne(id)
  }
}