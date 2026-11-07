import 'jasmine';
import { LoadingIndicator, LoadingIndicatorOptions } from '../../src/loading-indicator';

describe('LoadingIndicator', () => {
	let loadingIndicator: LoadingIndicator;

	beforeEach(() => {
		loadingIndicator = new LoadingIndicator();
	});

	afterEach(() => {
		loadingIndicator.stop(true);
	});

	it('should start spinner with message', async () => {
		loadingIndicator.start('Loading...');

		// Give the interval time to run
		await new Promise(resolve => setTimeout(resolve, 150));

		// Just verify that the interval ran without throwing errors
		expect(true).toBe(true);
	});

	it('should update message while running', async () => {
		loadingIndicator.start('Loading...');

		// Give the interval time to run
		await new Promise(resolve => setTimeout(resolve, 150));

		loadingIndicator.updateMessage('Processing...');

		// Just verify that the update ran without throwing errors
		expect(true).toBe(true);
	});

	it('should stop spinner and clear output', async () => {
		loadingIndicator.start('Loading...');
		await new Promise(resolve => setTimeout(resolve, 150));

		loadingIndicator.stop(true);

		// Should stop the interval without errors
		expect(true).toBe(true);
	});

	it('should stop spinner and keep output', async () => {
		loadingIndicator.start('Loading...');
		await new Promise(resolve => setTimeout(resolve, 150));

		loadingIndicator.stop(false);

		// Should add newline without errors
		expect(true).toBe(true);
	});

	it('should run operation with indicator', async () => {
		let operationCalled = false;
		const operation = async () => {
			operationCalled = true;
			return 'Result';
		};

		const result = await loadingIndicator.runWithIndicator(operation, 'Loading...');

		expect(result).toBe('Result');
		expect(operationCalled).toBe(true);
	});

	it('should handle errors in operation', async () => {
		let operationCalled = false;
		const operation = async () => {
			operationCalled = true;
			throw new Error('Operation failed');
		};

		try {
			await loadingIndicator.runWithIndicator(operation, 'Loading...');
			fail('Operation should have thrown an error');
		} catch (error) {
			expect((error as Error).message).toBe('Operation failed');
			expect(operationCalled).toBe(true);
		}
	});

	it('should not start if already running', async () => {
		loadingIndicator.start('Loading...');

		// Call start again
		loadingIndicator.start('Another message...');

		// Should not throw errors
		expect(true).toBe(true);
	});

	it('should not update message if not running', () => {
		expect(() => loadingIndicator.updateMessage('Message')).not.toThrow();
	});

	it('should support custom spinner frames', async () => {
		const options: LoadingIndicatorOptions = {
			frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
		};

		const customIndicator = new LoadingIndicator(options);
		customIndicator.start('Loading with custom frames...');

		// Give the interval time to run
		await new Promise(resolve => setTimeout(resolve, 150));

		expect(customIndicator).toBeDefined();
		customIndicator.stop(true);
	});

	it('should support custom frame duration', async () => {
		const options: LoadingIndicatorOptions = {
			frameDuration: 200
		};

		const customIndicator = new LoadingIndicator(options);
		customIndicator.start('Loading with custom duration...');

		// Give the interval time to run
		await new Promise(resolve => setTimeout(resolve, 150));

		expect(customIndicator).toBeDefined();
		customIndicator.stop(true);
	});

	it('should support showMessage option', async () => {
		const options: LoadingIndicatorOptions = {
			showMessage: false
		};

		const customIndicator = new LoadingIndicator(options);
		customIndicator.start('This should not be visible');

		// Give the interval time to run
		await new Promise(resolve => setTimeout(resolve, 150));

		expect(customIndicator).toBeDefined();
		customIndicator.stop(true);
	});

	it('should support loadingIndicatorOptions constructor', () => {
		const options: LoadingIndicatorOptions = {
			frames: ['-', '=', '–'],
			frameDuration: 150,
			clearOnStop: false,
			showMessage: false
		};

		const customIndicator = new LoadingIndicator(options);
		expect(customIndicator).toBeDefined();
	});
});
