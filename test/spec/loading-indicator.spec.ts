import 'jasmine';
import { LoadingIndicator } from '../../src/loading-indicator';

describe('LoadingIndicator', () => {
	let loadingIndicator: LoadingIndicator;
	let write: jasmine.Spy;
	let cursorTo: jasmine.Spy;
	let clearLine: jasmine.Spy;
	let moveCursor: jasmine.Spy;
	const properties = [
		'isTTY', 'cursorTo', 'clearLine', 'moveCursor',
	] as const;
	let descriptors: (PropertyDescriptor | undefined)[];

	beforeEach(() => {
		descriptors = properties.map(property =>
			Object.getOwnPropertyDescriptor(process.stdout, property)
		);
		cursorTo = jasmine.createSpy('cursorTo');
		clearLine = jasmine.createSpy('clearLine');
		moveCursor = jasmine.createSpy('moveCursor');
		Object.defineProperties(process.stdout, {
			isTTY: { configurable: true, value: true },
			cursorTo: { configurable: true, value: cursorTo },
			clearLine: { configurable: true, value: clearLine },
			moveCursor: { configurable: true, value: moveCursor },
		});
		write = spyOn(process.stdout, 'write').and.returnValue(true);
		jasmine.clock().install();
		loadingIndicator = new LoadingIndicator();
	});

	afterEach(() => {
		loadingIndicator.stop(true);
		jasmine.clock().uninstall();
		properties.forEach((property, index) => {
			const descriptor = descriptors[index];
			if (descriptor) {
				Object.defineProperty(process.stdout, property, descriptor);
			}
			else {
				Reflect.deleteProperty(process.stdout, property);
			}
		});
	});

	it('should redraw frames at column zero on the current row', () => {
		loadingIndicator.start('Loading...');
		expect(cursorTo).toHaveBeenCalledBefore(clearLine);
		expect(clearLine).toHaveBeenCalledBefore(write);
		jasmine.clock().tick(300);

		expect(write.calls.allArgs()).toEqual([
			['| Loading... '],
			['/ Loading... '],
			['- Loading... '],
			['\\ Loading... '],
		]);
		expect(cursorTo.calls.allArgs()).toEqual([[0], [0], [0], [0]]);
		expect(clearLine.calls.allArgs()).toEqual([[0], [0], [0], [0]]);
		expect(moveCursor).not.toHaveBeenCalled();
	});

	it('should retain updated messages on subsequent frames', () => {
		loadingIndicator.start('Loading...');
		loadingIndicator.updateMessage('Processing...');
		jasmine.clock().tick(100);

		expect(write.calls.allArgs()).toEqual([
			['| Loading... '],
			['| Processing... '],
			['/ Processing... '],
		]);
		expect(cursorTo).toHaveBeenCalledTimes(3);
		expect(clearLine).toHaveBeenCalledTimes(3);
		expect(moveCursor).not.toHaveBeenCalled();
	});

	it('should clear the current row and cancel animation when stopped', () => {
		loadingIndicator.start('Loading...');
		loadingIndicator.stop();
		jasmine.clock().tick(500);

		expect(cursorTo.calls.allArgs()).toEqual([[0], [0]]);
		expect(clearLine.calls.allArgs()).toEqual([[0], [0]]);
		expect(write).toHaveBeenCalledOnceWith('| Loading... ');
		expect(moveCursor).not.toHaveBeenCalled();
	});

	it('should finish with a newline when keeping output', () => {
		loadingIndicator.start('Loading...');
		loadingIndicator.stop(false);
		jasmine.clock().tick(500);

		expect(write.calls.allArgs()).toEqual([['| Loading... '], ['\n']]);
		expect(clearLine).toHaveBeenCalledTimes(1);
	});

	it('should respect clearOnStop by default', () => {
		loadingIndicator = new LoadingIndicator({ clearOnStop: false });
		loadingIndicator.start('Loading...');
		loadingIndicator.stop();

		expect(write).toHaveBeenCalledWith('\n');
		expect(clearLine).toHaveBeenCalledTimes(1);
	});

	it('should allow an explicit stop argument to override clearOnStop', () => {
		loadingIndicator = new LoadingIndicator({ clearOnStop: false });
		loadingIndicator.start('Loading...');
		loadingIndicator.stop(true);

		expect(write).not.toHaveBeenCalledWith('\n');
		expect(clearLine).toHaveBeenCalledTimes(2);
	});

	it('should restart at the first frame after stopping', () => {
		loadingIndicator.start('First');
		jasmine.clock().tick(100);
		loadingIndicator.stop();
		loadingIndicator.start('Second');

		expect(write).toHaveBeenCalledWith('/ First ');
		expect(write.calls.mostRecent().args).toEqual(['| Second ']);
	});

	it('should not start twice while already running', () => {
		loadingIndicator.start('Loading...');
		loadingIndicator.start('Another message...');
		jasmine.clock().tick(100);

		expect(write.calls.allArgs()).toEqual([
			['| Loading... '], ['/ Loading... '],
		]);
	});

	it('should not update or clear output when not running', () => {
		loadingIndicator.updateMessage('Message');
		loadingIndicator.stop();

		expect(write).not.toHaveBeenCalled();
		expect(cursorTo).not.toHaveBeenCalled();
		expect(clearLine).not.toHaveBeenCalled();
	});

	it('should cycle custom frames at the configured duration', () => {
		loadingIndicator = new LoadingIndicator({
			frames: ['a', 'b'],
			frameDuration: 200,
		});
		loadingIndicator.start();
		jasmine.clock().tick(199);
		expect(write).toHaveBeenCalledOnceWith('a ');
		jasmine.clock().tick(201);
		expect(write.calls.allArgs()).toEqual([['a '], ['b '], ['a ']]);
	});

	it('should hide messages when showMessage is false', () => {
		loadingIndicator = new LoadingIndicator({ showMessage: false });
		loadingIndicator.start('Hidden');
		loadingIndicator.updateMessage('Also hidden');
		jasmine.clock().tick(100);

		expect(write.calls.allArgs()).toEqual([['| '], ['| '], ['/ ']]);
	});

	it('should print plain messages for non-TTY output', () => {
		Object.defineProperty(process.stdout, 'isTTY', { value: false });
		loadingIndicator.start('Loading...');
		jasmine.clock().tick(500);
		loadingIndicator.updateMessage('Processing...');
		loadingIndicator.stop(false);

		expect(write.calls.allArgs()).toEqual([
			['Loading...\n'], ['Processing...\n'],
		]);
		expect(cursorTo).not.toHaveBeenCalled();
		expect(clearLine).not.toHaveBeenCalled();
		expect(moveCursor).not.toHaveBeenCalled();
	});

	it('should hide messages for non-TTY output', () => {
		Object.defineProperty(process.stdout, 'isTTY', { value: false });
		loadingIndicator = new LoadingIndicator({ showMessage: false });
		loadingIndicator.start('Hidden');
		loadingIndicator.updateMessage('Also hidden');
		jasmine.clock().tick(500);
		loadingIndicator.stop();

		expect(write).not.toHaveBeenCalled();
	});

	it('should use plain output when cursor controls are unavailable', () => {
		Object.defineProperty(process.stdout, 'cursorTo', {
			value: undefined,
		});
		loadingIndicator.start('Loading...');
		jasmine.clock().tick(500);
		loadingIndicator.stop();

		expect(write).toHaveBeenCalledOnceWith('Loading...\n');
		expect(clearLine).not.toHaveBeenCalled();
	});

	it('should return operation results and stop the animation', async () => {
		const operation = jasmine.createSpy('operation')
			.and.returnValue(Promise.resolve('Result'));

		const result = await loadingIndicator.runWithIndicator(
			'Loading...', operation
		);
		jasmine.clock().tick(500);

		expect(result).toBe('Result');
		expect(operation).toHaveBeenCalledTimes(1);
		expect(write).toHaveBeenCalledOnceWith('| Loading... ');
		expect(clearLine).toHaveBeenCalledTimes(2);
	});

	it('should propagate operation errors and stop the animation', async () => {
		const error = new Error('Operation failed');
		const operation = async () => {
			throw error;
		};

		await expectAsync(
			loadingIndicator.runWithIndicator('Loading...', operation)
		).toBeRejectedWith(error);
		jasmine.clock().tick(500);

		expect(write).toHaveBeenCalledOnceWith('| Loading... ');
		expect(clearLine).toHaveBeenCalledTimes(2);
	});

	it('should respect clearOnStop when wrapping an operation', async () => {
		loadingIndicator = new LoadingIndicator({ clearOnStop: false });
		await loadingIndicator.runWithIndicator(undefined, async () => 'Result');

		expect(write.calls.allArgs()).toEqual([['| '], ['\n']]);
		expect(clearLine).toHaveBeenCalledTimes(1);
	});
});
