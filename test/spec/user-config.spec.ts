import 'jasmine';
import { UserConfig, configureUserConfig, getUserConfig } from '../../src/user-config';

// Mock abstract methods for testing
class TestConfig extends UserConfig {
	protected static appName = 'test-app';
	protected static configVersion = '1.0';

	serverUrl: string = 'http://localhost:3000';
	apiKey: string = 'default-key';
	maxRetries: number = 3;
	enableDebug: boolean = false;
}

describe('UserConfig', () => {
	it('should create a UserConfig instance', () => {
		const config = new TestConfig();
		
		expect(config).toBeDefined();
	});

	it('should have configFilePath property', () => {
		const config = new TestConfig();
		
		expect(config.configFilePath).toBeDefined();
		expect(config.configFilePath).toContain('.config/test-app/config.env');
	});

	it('should configure with absolutePath from configFilePath', () => {
		const config = configureUserConfig(TestConfig);
		
		expect(config).toBeDefined();
		expect(config.configFilePath).toContain('.config/test-app/config.env');
		expect(config.serverUrl).toBe('http://localhost:3000');
		expect(config.apiKey).toBe('default-key');
		expect(config.maxRetries).toBe(3);
		expect(config.enableDebug).toBe(false);
	});

	it('should handle boolean type casting', () => {
		const config = configureUserConfig(TestConfig);
		
		expect(config.enableDebug).toBe(false);
	});

	it('should allow getUserConfig with custom options', () => {
		const config = getUserConfig(TestConfig, {
			allowUndeclared: true,
		});
		
		expect(config).toBeDefined();
		expect(config.serverUrl).toBe('http://localhost:3000');
	});

	it('should allow modifying configuration properties', () => {
		const config = configureUserConfig(TestConfig);
		
		config.serverUrl = 'https://api.example.com';
		config.apiKey = 'new-key';
		
		expect(config.serverUrl).toBe('https://api.example.com');
		expect(config.apiKey).toBe('new-key');
	});

	it('should support numeric type properties', () => {
		const config = configureUserConfig(TestConfig);
		
		expect(config.maxRetries).toBe(3);
		expect(typeof config.maxRetries).toBe('number');
	});
});

describe('UserConfig with ts-appconfig', () => {
	it('should extend AppConfig from ts-appconfig', () => {
		const config = configureUserConfig(TestConfig);
		
		expect(config).toBeInstanceOf(UserConfig);
		expect(config).toBeDefined();
	});
});
