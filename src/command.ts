import { ParsedArguments } from './argument-parser';
import { CommandHelp } from './command-help';
import { CommandOption, defaultCommandOptions } from './command-options';

export abstract class Command {
	public key: string;
	public description?: string;

	public positional: CommandOption[] = [];
	public options: CommandOption[] = [];

	public commandHelp = new CommandHelp(this);

	public init() {
		for (let i = 0; i < this.positional.length; i++) {
			this.positional[i] = {
				...defaultCommandOptions,
				...this.positional[i],
			};
		}

		for (let i = 0; i < this.options.length; i++) {
			this.options[i] = {
				...defaultCommandOptions,
				...this.options[i],
			};
		}
	}

	public abstract handle(args: ParsedArguments): Promise<void | number>;

	public help() {
		this.init();
		this.commandHelp.help();
	}

	public teardown() {}
}
