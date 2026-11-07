import { Command } from '../src/command';
import { UserConfig, configureUserConfig } from '../src/user-config';
import { Args } from 'ts-appconfig';

// Define your application configuration class
// All configuration properties use SCREAMING_SNAKE_CASE
export class MyAppConfig extends UserConfig {
	protected static appName = 'myapp';
	protected static configVersion = 1;

	// Configuration properties - SCREAMING_SNAKE_CASE
	DB_HOST: string = process.env.DB_HOST || 'localhost';
	DB_PORT: number = parseInt(process.env.DB_PORT || '5432', 10);
	DB_NAME: string = process.env.DB_NAME || 'production_db';
	LOG_LEVEL: string = process.env.LOG_LEVEL || 'info';
	API_TIMEOUT: number = parseInt(process.env.API_TIMEOUT || '30000', 10);
	ENABLE_ANALYTICS: boolean = process.env.ENABLE_ANALYTICS !== 'false';
}

export class ConfigExampleCommand extends Command {
	override key = 'config-demo';
	override description = 'Demonstrate user configuration with SCREAMING_SNAKE_CASE';

	override async handle() {
		// Configure the application with user-level configuration
		const config = configureUserConfig(MyAppConfig);

		// Access configuration values
		console.log('Configuration loaded successfully:');
		console.log(`DB Host: ${config.DB_HOST}`);
		console.log(`DB Port: ${config.DB_PORT}`);
		console.log(`DB Name: ${config.DB_NAME}`);
		console.log(`Log Level: ${config.LOG_LEVEL}`);
		console.log(`API Timeout: ${config.API_TIMEOUT}ms`);
		console.log(`Enable Analytics: ${config.ENABLE_ANALYTICS}`);
	}
}
