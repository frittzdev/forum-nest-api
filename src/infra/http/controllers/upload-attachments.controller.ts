import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachments-type-error'
import { UploadAndCreateAttachmentsUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachments'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments')
export class UploadAttachmentsController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentsUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { attachment } = result.value

    return {
      attachmentId: attachment.id.toString(),
    }
  }
}
