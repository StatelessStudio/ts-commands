import 'jasmine';
import { ArgumentParser } from '../../src';
import { Command } from '../../src/command';
import { OptionType } from '../../src/command-options';
import { MockCommand } from '../mock/mock-command';

describe('ArgumentParser', () => {
	let command: Command;
	let parser: ArgumentParser;

	beforeEach(() => {
		command = new MockCommand();
		command.options = [
			{ key: 'verbose', alias: 'v', type: OptionType.boolean },
			{ key: 'output', alias: 'o', type: OptionType.string },
		];
		command.positional = [{ key: 'input', type: OptionType.string }];
		parser = new ArgumentParser(command);
	});

	it('parses boolean flag options', () => {
		const args = ['--verbose', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ verbose: true, input: 'input.txt' });
	});

	it('parses string options with "="', () => {
		const args = ['--output=output.txt', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ output: 'output.txt', input: 'input.txt' });
	});

	it('parses string options with space-separated value', () => {
		const args = ['--output', 'output.txt', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ output: 'output.txt', input: 'input.txt' });
	});

	it('can parse number options', () => {
		command.options.push({ key: 'numeric', type: OptionType.number });
		const args = ['--numeric=123', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ numeric: 123, input: 'input.txt' });
	});

	it('can parse boolean true', () => {
		command.options.push({ key: 'boolean', type: OptionType.boolean });
		const args = ['--boolean=true', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ boolean: true, input: 'input.txt' });
	});

	it('can parse boolean 1', () => {
		command.options.push({ key: 'boolean', type: OptionType.boolean });
		const args = ['--boolean=1', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ boolean: true, input: 'input.txt' });
	});

	it('can parse boolean false', () => {
		command.options.push({ key: 'boolean', type: OptionType.boolean });
		const args = ['--boolean=false', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ boolean: false, input: 'input.txt' });
	});

	it('can parse boolean 0', () => {
		command.options.push({ key: 'boolean', type: OptionType.boolean });
		const args = ['--boolean=0', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ boolean: false, input: 'input.txt' });
	});

	it('parses alias options', () => {
		const args = ['-v', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ verbose: true, input: 'input.txt' });
	});

	it('parses alias string options with "="', () => {
		const args = ['-o=output.txt', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ output: 'output.txt', input: 'input.txt' });
	});

	it('parses alias string options with space-separated value', () => {
		const args = ['-o', 'output.txt', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ output: 'output.txt', input: 'input.txt' });
	});

	it('parses positional arguments', () => {
		const args = ['input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({ input: 'input.txt' });
	});

	it('can parse multiple options and positional arguments', () => {
		const args = ['--verbose', '--output', 'output.txt', 'input.txt'];
		const result = parser.parse(args);
		expect(result).toEqual({
			verbose: true,
			output: 'output.txt',
			input: 'input.txt',
		});
	});

	it('populates default values for positionals', () => {
		command.positional = [
			{
				key: 'input',
				type: OptionType.string,
				default: 'defaultInput.txt',
			},
		];
		command.options = [];
		command.init();

		const result = parser.parse([]);
		expect(result).toEqual({
			input: 'defaultInput.txt',
		});
	});

	it('populates default values for optionals', () => {
		command.positional = [];
		command.options = [
			{
				key: 'defaultOption',
				type: OptionType.string,
				default: 'defaultValue',
			},
		];
		command.init();

		const result = parser.parse([]);
		expect(result).toEqual({
			defaultOption: 'defaultValue',
		});
	});

	it('throws an error for missing value for string option', () => {
		const args = ['--output'];
		expect(() => parser.parse(args)).toThrowError(
			'Missing value for argument: --output'
		);
	});

	it('throws an error for invalid option key', () => {
		const args = ['--invalid'];
		expect(() => parser.parse(args)).toThrowError(
			'Invalid option key: --invalid'
		);
	});

	it('throws an error for invalid option alias', () => {
		const args = ['-x'];
		expect(() => parser.parse(args)).toThrowError(
			'Invalid option alias: -x'
		);
	});

	it('throws an error for missing positional argument', () => {
		const args = [];
		expect(() => parser.parse(args)).toThrowError(
			'Missing positional arguments: input'
		);
	});

	it('throws an error for missing positionals with multiple options', () => {
		const args = ['--verbose', '--output', 'output.txt'];
		expect(() => parser.parse(args)).toThrowError(
			'Missing positional arguments: input'
		);
	});

	it('throws an error for extra positional argument', () => {
		const args = ['input.txt', 'extra.txt'];
		expect(() => parser.parse(args)).toThrowError(
			'Invalid positional argument: extra.txt'
		);
	});

	it('allows optional positional options', () => {
		command.positional = [
			{ key: 'filename' },
			{ key: 'optional', default: 'default.txt' },
		];
		command.init();

		const result = parser.parse(['input.txt']);

		expect(result).toEqual({
			filename: 'input.txt',
			optional: 'default.txt',
		});
	});

	it('throws an error for invalid option value', () => {
		const args = ['--verbose=invalid.txt', 'input.txt'];
		expect(() => parser.parse(args)).toThrowError(
			'Invalid value for argument: verbose (invalid.txt)'
		);
	});

	it('throws an error for invalid option value with alias', () => {
		const args = ['-v=invalid.txt', 'input.txt'];
		expect(() => parser.parse(args)).toThrowError(
			'Invalid value for argument: verbose (invalid.txt)'
		);
	});

	it('throws an error for invalid option type', () => {
		const args = ['--verbose=invalid'];
		expect(() => parser.parse(args)).toThrowError(
			'Invalid value for argument: verbose (invalid)'
		);
	});

	it('throws an error for invalid option type with alias', () => {
		const args = ['-v=invalid'];
		expect(() => parser.parse(args)).toThrowError(
			'Invalid value for argument: verbose (invalid)'
		);
	});

	it('throws an error for invalid positional argument', () => {
		const args = ['input.txt', 'extra.txt'];
		expect(() => parser.parse(args)).toThrowError(
			'Invalid positional argument: extra.txt'
		);
	});

	it('throws an error for invalid choice', () => {
		command.positional = [];
		command.options.push({
			key: 'color',
			type: OptionType.string,
			choices: ['red', 'green', 'blue'],
		});
		command.init();

		const args = ['--color=yellow'];
		expect(() => parser.parse(args)).toThrowError(
			'Invalid choice for argument: color (yellow).' +
				' Allowed choices are [red, green, blue]'
		);
	});
});
