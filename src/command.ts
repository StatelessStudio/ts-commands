import { ParsedArguments } from './argument-parser';
import { CommandHelp } from './command-help';
import { CommandOption } from './command-options';

export abstract class Command {
	public key: string;
	public description?: string;

	public positional: CommandOption[] = [];
	public options: CommandOption[] = [];

	public commandHelp = new CommandHelp(this);

	public abstract handle(args: ParsedArguments): Promise<void | number>;

	public help() {
		this.commandHelp.help();
	}

	public teardown() {}
}
