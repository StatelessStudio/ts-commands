import { Command } from './command';
import { CommandOption, OptionType } from './command-options';

export type ArgumentValue = null | string | number | boolean;
export type ParsedArguments = { [key: string]: ArgumentValue };
export class ArgumentError extends Error {}

export class ArgumentParser {
	protected positionalIndex = 0;

	constructor(protected command: Command) {}

	public parse(args: string[]): ParsedArguments {
		const matches = {};

		for (let i = 0; i < args.length; i++) {
			const arg = args[i];
			const { option, isPositional } = this.getOption(arg);
			let outputValue: ArgumentValue = null;

			if (arg.includes('=')) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const [key, value] = arg.split('=', 2);
				outputValue = value;
			}
			else if (option.type === OptionType.boolean) {
				outputValue = true;
			}
			else if (isPositional) {
				outputValue = arg;
			}
			else {
				const value = args[i + 1] ?? null;

				if (
					value &&
					!this.isOptionalKey(value) &&
					!this.isOptionalAlias(value)
				) {
					outputValue = value;
					i++;
				}
				else {
					throw new ArgumentError(
						`Missing value for argument: ${arg}`
					);
				}
			}

			outputValue = this.castOptionValue(option, outputValue);
			this.validateOptionValue(option, outputValue);
			matches[option.key] = outputValue;
		}

		const requiredPositionals: CommandOption[] = [];

		for (const positional of this.command.positional) {
			/* istanbul ignore else */
			if (positional.default === undefined) {
				requiredPositionals.push(positional);
			}
			else if (matches[positional.key] === undefined) {
				matches[positional.key] = positional.default;
			}
		}

		for (const option of this.command.options) {
			if (
				matches[option.key] === undefined &&
				option.default !== undefined
			) {
				matches[option.key] = option.default;
			}
		}

		if (this.positionalIndex < requiredPositionals.length) {
			throw new ArgumentError(
				`Missing positional arguments: ${requiredPositionals
					.slice(this.positionalIndex)
					.map((o) => o.key)
					.join(', ')}`
			);
		}

		return matches;
	}

	protected getOption(arg: string): {
		option: CommandOption;
		isPositional?: boolean;
	} {
		if (this.isOptionalKey(arg)) {
			return { option: this.getOptionalByKey(arg) };
		}
		else if (this.isOptionalAlias(arg)) {
			return { option: this.getOptionalByAlias(arg) };
		}
		else {
			return { option: this.getPositional(arg), isPositional: true };
		}
	}

	protected getOptionalByKey(arg: string): CommandOption {
		const key = this.getStrippedName(arg, 2);
		const option = this.command.options.find((o) => o.key === key);

		if (!option) {
			throw new ArgumentError(`Invalid option key: ${arg}`);
		}

		return option;
	}

	protected getOptionalByAlias(arg: string): CommandOption {
		const alias = this.getStrippedName(arg, 1);
		const option = this.command.options.find((o) => o.alias === alias);

		if (!option) {
			throw new ArgumentError(`Invalid option alias: ${arg}`);
		}

		return option;
	}

	protected getPositional(arg: string): CommandOption {
		const positional =
			this.command.positional[this.positionalIndex++] ?? null;

		if (!positional) {
			throw new ArgumentError(`Invalid positional argument: ${arg}`);
		}

		return positional;
	}

	protected getStrippedName(arg: string, start: number): string {
		const equalIndex = arg.indexOf('=');

		return equalIndex > 0
			? arg.substring(start, equalIndex)
			: arg.substring(start);
	}

	protected isOptionalKey(arg: string): boolean {
		return arg.startsWith('--');
	}

	protected isOptionalAlias(arg: string): boolean {
		return arg.startsWith('-');
	}

	protected castOptionValue(
		option: CommandOption,
		value: ArgumentValue
	): string | number | boolean {
		/* istanbul ignore else */
		if (option.type === OptionType.string) {
			return value;
		}
		else if (option.type === OptionType.number) {
			return Number(value);
		}
		else if (option.type === OptionType.boolean) {
			if (
				value === 'true' ||
				value === '1' ||
				value === null ||
				value === undefined
			) {
				return true;
			}
			else if (value === 'false' || value === '0') {
				return false;
			}
			else {
				return value;
			}
		}
	}

	protected validateOptionValue(
		option: CommandOption,
		value: ArgumentValue
	): void {
		if (!this.isValid(option, value)) {
			const displayValue = `(${value})`;

			throw new ArgumentError(
				`Invalid value for argument: ${option.key} ${displayValue}`
			);
		}

		if (!this.validateChoices(option, value)) {
			const choices = option.choices.join(', ');

			throw new ArgumentError(
				`Invalid choice for argument: ${option.key} (${value}). Allowed choices are [${choices}]`
			);
		}
	}

	protected isValid(option: CommandOption, value: ArgumentValue): boolean {
		/* istanbul ignore else */
		if (option.type === OptionType.string) {
			return typeof value === 'string';
		}
		else if (option.type === OptionType.number) {
			return !isNaN(Number(value));
		}
		else if (option.type === OptionType.boolean) {
			return (
				value === true ||
				value === false ||
				value === null ||
				value === undefined
			);
		}
	}

	protected validateChoices(
		option: CommandOption,
		value: ArgumentValue
	): boolean {
		if (option.choices) {
			return (<string[]>option.choices).includes(<string>value);
		}

		return true;
	}
}
