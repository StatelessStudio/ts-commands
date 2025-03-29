import {
	ArgumentError,
	ArgumentParser,
	ParsedArguments,
} from './argument-parser';
import { Command } from './command';

export class CommandRunner {
	constructor(public command: Command) {}

	public run(): void {
		this.invoke(process.argv.slice(2)).catch(console.error);
	}

	public async invoke(args: string[]): Promise<void | number> {
		let parsedArgs: ParsedArguments;
		let result: number;

		try {
			parsedArgs = this.parseArgs(args);
			result = await this.handle(parsedArgs);
		}
		catch (error) {
			result = 1;

			if (error instanceof ArgumentError) {
				console.error(`Error: ${error.message}`);
				this.command.help();
			}
			else {
				console.error(error);
			}
		}

		process.exit(result ?? 0);
	}

	public parseArgs(args: string[]): ParsedArguments {
		return new ArgumentParser(this.command).parse(args);
	}

	protected async handle(
		parsedArgs: ParsedArguments
	): Promise<undefined | number> {
		return <undefined | number>await this.command.handle(parsedArgs);
	}
}
