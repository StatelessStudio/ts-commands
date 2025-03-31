import { MockConsole } from 'ts-jasmine-spies';
import { MockCommand } from '../mock/mock-command';
import { CommandHelp } from '../../src/command-help';
import { CommandOption, OptionType } from '../../src/command-options';

class HelpTestCommand extends MockCommand {
	override key = 'test';
	override description = 'Test command description';

	override positional: CommandOption[] = [
		{ key: 'arg1', description: 'First argument' },
		{ key: 'arg2', description: 'Second argument' },
	];

	override options: CommandOption[] = [
		{ key: 'opt1', description: 'First option', alias: 'o' },
		{ key: 'opt2', description: 'Second option', alias: undefined },
	];
}

describe('CommandHelp', () => {
	let commandHelp: CommandHelp;
	let mockCommand: HelpTestCommand;
	let mockConsole: MockConsole;

	beforeEach(() => {
		mockCommand = new HelpTestCommand();
		commandHelp = new CommandHelp(mockCommand);
		mockConsole = new MockConsole();
	});

	it('should display the correct signature in showSignature', () => {
		commandHelp.showSignature();
		mockConsole.expectStdout('Usage: test <arg1> <arg2> --opt1 --opt2\n');
	});

	it('should display the correct description in showDescription', () => {
		commandHelp.showDescription();
		mockConsole.expectStdout('Test command description\n');
	});

	it('should display the correct options header in showOptionsHeader', () => {
		commandHelp.showOptionsHeader();
		mockConsole.expectStdout('Options:\n');
	});

	it('can show positional arguments', () => {
		commandHelp.showPositional();
		mockConsole.expectStdout(
			'  <arg1>: First argument\n  <arg2>: Second argument\n'
		);
	});

	it('can show optional arguments', () => {
		commandHelp.showOptions();
		mockConsole.expectStdout(
			'  -o, --opt1: First option\n  --opt2: Second option\n'
		);
	});

	it('shows option default value', () => {
		mockCommand.options = [
			{
				key: 'opt1',
				description: 'First option',
				default: 'defaultValue',
			},
		];

		commandHelp.showOptions();
		mockConsole.expectStdout(
			'  --opt1: First option (default: defaultValue)\n'
		);
	});

	it('can show option without description', () => {
		mockCommand.options = [{ key: 'opt1', default: 'defaultValue' }];
		commandHelp.showOptions();
		mockConsole.expectStdout('  --opt1:  (default: defaultValue)\n');
	});

	it('shows option choices', () => {
		mockCommand.options = [
			{
				key: 'opt1',
				description: 'First option',
				choices: ['choice1', 'choice2'],
			},
		];

		commandHelp.showOptions();
		mockConsole.expectStdout(
			'  --opt1: First option [choices: choice1, choice2]\n'
		);
	});

	it('shows option type', () => {
		mockCommand.options = [
			{
				key: 'opt1',
				description: 'First option',
				type: OptionType.number,
			},
		];

		commandHelp.showOptions();
		mockConsole.expectStdout('  --opt1: First option {number}\n');
	});

	it('shows skips option type for strings', () => {
		mockCommand.options = [
			{
				key: 'opt1',
				description: 'First option',
			},
		];

		commandHelp.showOptions();
		mockConsole.expectStdout('  --opt1: First option\n');
	});

	it('shows default value and choices', () => {
		mockCommand.options = [
			{
				key: 'opt1',
				description: 'First option',
				default: 'defaultValue',
				choices: ['choice1', 'choice2'],
				type: OptionType.string,
			},
		];
		commandHelp.showOptions();
		mockConsole.expectStdout(
			'  --opt1: First option (default: defaultValue)' +
				' [choices: choice1, choice2]\n'
		);
	});

	it('should call all helper methods in help', () => {
		spyOn(commandHelp, 'showSignature').and.callThrough();
		spyOn(commandHelp, 'showDescription').and.callThrough();
		spyOn(commandHelp, 'showOptionsHeader').and.callThrough();
		spyOn(commandHelp, 'showPositional').and.callThrough();
		spyOn(commandHelp, 'showOptions').and.callThrough();
		spyOn(commandHelp, 'footer').and.callThrough();

		commandHelp.help();

		expect(commandHelp.showSignature).toHaveBeenCalled();
		expect(commandHelp.showDescription).toHaveBeenCalled();
		expect(commandHelp.showOptionsHeader).toHaveBeenCalled();
		expect(commandHelp.showPositional).toHaveBeenCalled();
		expect(commandHelp.showOptions).toHaveBeenCalled();
		expect(commandHelp.footer).toHaveBeenCalled();
	});
});
