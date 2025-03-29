import { MockConsole } from 'ts-jasmine-spies';
import { MockCommand } from '../mock/mock-command';
import { CommandHelp } from '../../src/command-help';

class HelpTestCommand extends MockCommand {
	override key = 'test';
	override description = 'Test command description';

	override positional = [
		{ key: 'arg1', description: 'First argument' },
		{ key: 'arg2', description: 'Second argument' },
	];

	override options = [
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
			'  --opt1 -o: First option\n  --opt2: Second option\n'
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
