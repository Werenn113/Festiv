"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = ['http://localhost:5173'];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'authorization'],
        exposedHeaders: 'authorization'
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map