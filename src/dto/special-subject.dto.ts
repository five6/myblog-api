import { IsString, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SpecialSubjectDto {
    _id?: string;

    @IsString()
    @ApiProperty({description: '专题标题', required:  true})
    title: {
      type: string,
      required: true
    };
  
    @IsString()
    @ApiProperty({description: '专题图片', required:  true})
    title_image?: {
      type: string,
      required: true
    };

    @IsString()
    @ApiProperty({description: '专题介绍', required:  true})
    content?: {
      type: string,
      required: true
    };
  
    @IsString()
    @ApiProperty({description: 'user id', required:  true})
    from_uid?: {
      type: string,
      required: true
    };

    @IsBoolean()
    isDeleted : {
      type: Boolean,
      required: true,
    };
}