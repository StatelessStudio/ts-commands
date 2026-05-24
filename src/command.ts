import * as readline from 'node:readline/promises';
import { DependencyContainer } from 'hidi/container';
import { ParsedArguments } from './argument-parser';
import { CommandHelp } from './command-help';
import { CommandOption, defaultCommandOptions } from './command-options';
import { HasDependencies } from 'hidi/has-dependencies';

export abstract class Command implements HasDependencies {
	public key: string;
	public description?: string;

	public positional: CommandOption[] = [];
	public options: CommandOption[] = [];

	public commandHelp = new CommandHelp(this);

	protected rl!: readline.Interface;

	public inject(container: DependencyContainer) {
		this.rl = container.require('readline');
	}

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

	public async ask(question: string): Promise<string> {
		return this.rl.question(question);
	}

	public teardown() {}
}
