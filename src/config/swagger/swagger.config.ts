/**
 * Configuration for the Swagger UI
 */
interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
}

export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'Cookshare',
  description: 'A documentation for Cookshare API',
  version: '1.0',
};
