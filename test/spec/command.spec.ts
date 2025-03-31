import 'jasmine';
import { MockConsole } from 'ts-jasmine-spies';
import { MockCommand } from '../mock/mock-command';
import { CommandOption, OptionType } from '../../src/command-options';

describe('Command', () => {
	let mockConsole: MockConsole;

	beforeEach(() => {
		mockConsole = new MockConsole();
	});

	it('should initialize with default values', () => {
		const command = new MockCommand();
		expect(command.key).toEqual('mock');
		expect(command.description).toEqual('Mock command');
		expect(command.positional).toEqual([]);
		expect(command.options).toEqual([]);
	});

	it('should init positional and options with default values', () => {
		const command = new MockCommand();
		command.positional = [{ key: 'arg1' }];
		command.options = [{ key: 'opt1' }];

		command.init();

		expect(command.positional[0]).toEqual(<CommandOption>{
			key: 'arg1',
			type: OptionType.string,
			description: '',
		});

		expect(command.options[0]).toEqual(<CommandOption>{
			key: 'opt1',
			type: OptionType.string,
			description: '',
		});
	});

	it('should log help information', () => {
		const command = new MockCommand();
		command.key = 'test-command';
		command.description = 'Test command description';
		command.positional = [
			{ key: 'pos1', description: 'Positional argument 1' },
		];
		command.options = [{ key: 'opt1', description: 'Option 1' }];

		command.help();

		mockConsole.expectStdout(
			'Usage: test-command <pos1> --opt1\n' +
				'Test command description\n' +
				'\n' +
				'Options:\n' +
				'  <pos1>: Positional argument 1\n' +
				'\n' +
				'  --opt1: Option 1\n' +
				'\n'
		);
	});

	it('should allow teardown without errors', () => {
		const command = new MockCommand();
		expect(() => command.teardown()).not.toThrow();
	});
});
