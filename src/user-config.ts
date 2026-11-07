import { AppConfig, configure } from 'ts-appconfig';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';

/**
 * Base class for user configuration
 * Extend this class to define your application's user-level configuration
 * 
 * Configuration files are loaded from ~/.config/&lt;appName&gt;/config.env
 */
export abstract class UserConfig extends AppConfig {
	/**
	 * Application name - used to locate config directory.
	 * Override this in your config class.
	 * 
	 * Example: 'my-app'
	 */
	protected static appName: string;

	/**
	 * Config version - used for migration strategies.
	 * Override this in your config class.
	 * 
	 * Increment this when breaking changes are made to the config schema.
	 */
	protected static configVersion: string | number;

	// Default config path in user's home directory
	protected static get configBasePath(): string {
		return path.join(os.homedir(), '.config', (this as any).appName);
	}

	// Read-only property for accessing the config file path
	readonly configFilePath: string;

	/**
	 * Creates a UserConfig instance
	 * Validates the config directory path and creates the directory if it doesn't exist
	 */
	constructor() {
		super();
		const configDir = this.constructor['configBasePath'];
		const configPath = configDir + '/config.env';
		
		// Validate path
		if (!path.isAbsolute(configDir)) {
			throw new Error(`Config directory path must be absolute: ${configDir}`);
		}
		
		// Create config directory if it doesn't exist
		try {
			if (!fs.existsSync(configDir)) {
				fs.mkdirSync(configDir, { recursive: true });
				console.log(`Created config directory: ${configDir}`);
			}
		} catch (error) {
			throw new Error(`Failed to create config directory '${configDir}': ${(error as Error).message}`);
		}
		
		this.configFilePath = configPath;
	}

	/**
	 * Get the current config version
	 */
	static getConfigVersion(): string | number {
		return (this as any).configVersion;
	}
}

/**
 * Type definition for configuration options
 */
type ConfigOptions = {
	absolutePath?: string;
	relativePath?: string;
	allowUndeclared?: boolean;
	fromProcessEnv?: boolean;
	overwriteProcessEnv?: boolean;
};

/**
 * Create and configure a user configuration instance
 * This will look for config in ~/.config/&lt;appName&gt;/config.env
 * 
 * @param configClass - The configuration class to instantiate
 * @returns The configured configuration instance
 * @throws Error if config directory cannot be created or config file cannot be loaded
 */
export function configureUserConfig<T extends UserConfig>(configClass: {
	new (): T;
}): T {
	const instance = new configClass();
	
	const configPath = instance.configFilePath;
	
	console.log(`Loading configuration from: ${configPath}`);
	
	return configure(configClass, {
		absolutePath: configPath,
		fromProcessEnv: true,
		overwriteProcessEnv: false,
	});
}

/**
 * Get a user configuration instance with optional custom options
 * 
 * @param configClass - The configuration class to instantiate
 * @param customOptions - Optional configuration overrides
 * @returns The configured configuration instance
 * @throws Error if config directory cannot be created or config file cannot be loaded
 */
export function getUserConfig<T extends UserConfig>(
	configClass: {
		new (): T;
	},
	customOptions?: Partial<ConfigOptions>
): T {
	const instance = new configClass();
	
	const options: ConfigOptions = {
		absolutePath: instance.configFilePath,
		fromProcessEnv: true,
		overwriteProcessEnv: false,
		...customOptions,
	};
	
	// Validate custom absolutePath if provided
	if (options.absolutePath && !path.isAbsolute(options.absolutePath)) {
		throw new Error(`Config file path must be absolute: ${options.absolutePath}`);
	}
	
	// Ensure directory exists for custom paths
	if (options.absolutePath) {
		const configDir = path.dirname(options.absolutePath);
		try {
			if (!fs.existsSync(configDir)) {
				fs.mkdirSync(configDir, { recursive: true });
				console.log(`Created config directory: ${configDir}`);
			}
		} catch (error) {
			throw new Error(`Failed to create config directory '${configDir}': ${(error as Error).message}`);
		}
	}
	
	const configPath = options.absolutePath || instance.configFilePath;
	console.log(`Loading configuration from: ${configPath}`);
	
	return configure(configClass, options);
}
