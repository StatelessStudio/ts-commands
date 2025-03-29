import 'jasmine';
import { CommandDispatcher, OptionType } from '../../src';
import { MockCommand } from '../mock/mock-command';
import { MockConsole, MockExit } from 'ts-jasmine-spies';

describe('CommandDispatcher', () => {
	let mockConsole: MockConsole;
	let mockExit: MockExit;

	beforeEach(() => {
		mockConsole = new MockConsole();
		mockExit = new MockExit();
	});

	it('should initialize with provided commands', () => {
		const dispatcher = new CommandDispatcher({
			commands: [MockCommand],
		});

		expect(dispatcher.commands.length).toBe(1);
		expect(dispatcher.commands[0]).toBeInstanceOf(MockCommand);
	});

	it('shows help and exits if no subcommand is provided', async () => {
		process.argv = ['node', 'script.js'];
		const dispatcher = new CommandDispatcher({
			commands: [MockCommand],
		});

		const helpSpy = spyOn(dispatcher, 'help');

		await dispatcher.dispatch();

		expect(helpSpy).toHaveBeenCalled();
		mockConsole.expectStderr('Please provide a subcommand.\n');
		mockExit.expectExit(1);
	});

	it('shows help and exits if subcommand is not found', async () => {
		process.argv = ['node', 'script.js', 'unknown'];
		const dispatcher = new CommandDispatcher({
			commands: [MockCommand],
		});

		const helpSpy = spyOn(dispatcher, 'help');

		await dispatcher.dispatch();

		expect(helpSpy).toHaveBeenCalled();
		mockConsole.expectStderr('Subcommand not found: unknown\n');
		mockExit.expectExit(1);
	});

	it('should run the specified subcommand', async () => {
		process.argv = ['node', 'script.js', 'mock', 'val1', 'val2'];

		class MockCommandWithPositionals extends MockCommand {
			positional = [
				{ key: 'arg1', type: OptionType.string },
				{ key: 'arg2', type: OptionType.string },
			];
		}

		const dispatcher = new CommandDispatcher({
			commands: [MockCommandWithPositionals],
		});

		const commandSpy = spyOn(
			MockCommandWithPositionals.prototype,
			'handle'
		).and.returnValue(Promise.resolve());

		await dispatcher.dispatch();

		expect(commandSpy).toHaveBeenCalledWith({ arg1: 'val1', arg2: 'val2' });
		mockExit.expectExit(0);
	});

	it('should display help information', async () => {
		const dispatcher = new CommandDispatcher({
			commands: [MockCommand],
		});

		await dispatcher.help();

		mockConsole.expectStdout('Subcommands:\n  mock: Mock command\n');
	});

	it('exits returning 0 when command is successful', async () => {
		const dispatcher = new CommandDispatcher({
			commands: [MockCommand],
		});

		const dispatchSpy = spyOn(dispatcher, 'dispatch').and.returnValue(
			Promise.resolve()
		);

		dispatcher.run();

		// Wait for dispatcher promise to resolve
		await new Promise((resolve) => setTimeout(resolve, 1));

		expect(dispatchSpy).toHaveBeenCalled();
		mockExit.expectExit(0);
	});

	it('exits returning 1 when dispatch throws an error', async () => {
		const dispatcher = new CommandDispatcher({
			commands: [MockCommand],
		});

		const dispatchSpy = spyOn(dispatcher, 'dispatch').and.returnValue(
			Promise.reject(new Error('Dispatch error'))
		);

		dispatcher.run();

		// Wait for the dispatcher promise to resolve
		await new Promise((resolve) => setTimeout(resolve, 1));

		expect(dispatchSpy).toHaveBeenCalled();
		mockConsole.expectStderrContains(
			'Error running command: Error: Dispatch error'
		);
		mockExit.expectExit(1);
	});
});
