import 'jasmine';
import { MockConsole, MockExit } from 'ts-jasmine-spies';
import { Command, CommandRunner } from '../../src';
import { ArgumentParser, ParsedArguments } from '../../src/argument-parser';
import { MockCommand } from '../mock/mock-command';

describe('CommandRunner', () => {
	let command: Command;
	let commandRunner: CommandRunner;
	let mockConsole: MockConsole;
	let mockExit: MockExit;

	beforeEach(() => {
		command = new MockCommand();
		commandRunner = new CommandRunner(command);
		mockConsole = new MockConsole();
		mockExit = new MockExit();
	});

	it('should parse arguments using ArgumentParser', () => {
		const args = ['arg1', 'arg2'];
		const parseSpy = spyOn(
			ArgumentParser.prototype,
			'parse'
		).and.returnValue({ parsed: true });

		const result = commandRunner['parseArgs'](args);

		expect(parseSpy).toHaveBeenCalledWith(args);
		expect(result).toEqual({ parsed: true });
	});

	it('should invoke command handle method with args', async () => {
		const parsedArgs: ParsedArguments = { args: 'arg1' };
		const handleSpy = spyOn(command, 'handle').and.returnValue(
			Promise.resolve(0)
		);

		const result = await commandRunner['handle'](parsedArgs);

		expect(handleSpy).toHaveBeenCalledWith(parsedArgs);
		expect(result).toBe(0);
	});

	it('should log errors and return 1', async () => {
		class MockCommandWithError extends MockCommand {
			override async handle() {
				throw new Error('Test error');
			}
		}

		await new CommandRunner(new MockCommandWithError()).invoke([]);

		mockConsole.expectStderrContains('Error: Test error\n');
		mockExit.expectExit(1);
	});

	it('should exit returning result from handle method', async () => {
		const args = [];
		const handleSpy = spyOn(command, 'handle').and.returnValue(
			Promise.resolve(42)
		);

		await commandRunner.invoke(args);

		expect(handleSpy).toHaveBeenCalledWith({});
		mockExit.expectExit(42);
	});

	it('should exit 0 if the command handle returns void', async () => {
		const args = [];
		const handleSpy = spyOn(command, 'handle').and.returnValue(
			Promise.resolve()
		);

		await commandRunner.invoke(args);

		expect(handleSpy).toHaveBeenCalledWith({});
		mockExit.expectExit(0);
	});

	it('should show help if argument error occurs', async () => {
		const args = ['--invalid-arg'];
		const showHelpSpy = spyOn(command, 'help');

		await commandRunner.invoke(args);

		expect(showHelpSpy).toHaveBeenCalled();
		mockConsole.expectStderr('Error: Invalid option key: --invalid-arg\n');
		mockExit.expectExit(1);
	});

	it('can run standalone for single-command apps', async () => {
		const handleSpy = spyOn(command, 'handle').and.returnValue(
			Promise.resolve(0)
		);

		spyOn(commandRunner, 'parseArgs').and.returnValue({});
		await commandRunner.run();

		// Wait for promise
		await new Promise((resolve) => setTimeout(resolve, 1));

		expect(handleSpy).toHaveBeenCalled();
		mockExit.expectExit(0);
	});
});
