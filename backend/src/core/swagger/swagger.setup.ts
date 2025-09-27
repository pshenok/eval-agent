import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setup = async (app: INestApplication): Promise<void> => {
    const options = new DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('Clean Architecture API')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
};
