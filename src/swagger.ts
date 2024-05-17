// 目的：swagger 文件的 JSON 生成
import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const doc = {
  info: {
    title: 'TicketsGo API',  // swagger 文件的名稱
    description: 'TicketsGo API document',  // 描述此文件在幹嘛的
  },
  host: process.env.SWAGGER_HOST,  // 要生成swagger文件的地方
  schemes: ['http', 'https'],  // 目前這個 swagger 文件支援哪幾種模式
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: '輸入 API token',
    },
  },
};

const outputFile = './swagger-output.json';  // 輸出文件，預設生成 JSON 格式
const endpointsFiles = ['./src/app.ts'];  // 注入的檔案(通常放進入點的檔案)，若有多個進入點，則用陣列來帶

// 創建一個 async 函數來初始化 Swagger 文檔生成
const initSwagger = async () => {
  const generate = swaggerAutogen();
  try {
    await generate(outputFile, endpointsFiles, doc);
    console.log('Swagger generation complete.');
  } catch (error) {
    console.error('Error generating Swagger documentation:', error);
  }
};

initSwagger();