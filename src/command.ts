import * as readline from 'node:readline/promises';
import { DependencyContainer } from 'hidi/container';
import { ParsedArguments } from './argument-parser';
import { CommandHelp } from './command-help';
import { CommandOption, defaultCommandOptions } from './command-options';
import { HasDependencies } from 'hidi/has-dependencies';
import { UserConfig, configureUserConfig } from './user-config';

export abstract class Command implements HasDependencies {
	public key: string;
	public description?: string;
	public alias?: string;

	public positional: CommandOption[] = [];
	public options: CommandOption[] = [];

	public commandHelp = new CommandHelp(this);

	protected rl!: readline.Interface;
	
	/**
	 * User configuration instance
	 * Override this in your config class to provide typed configuration
	 */
	protected userConfig?: UserConfig;

	/**
	 * Get user configuration instance
	 * This will be lazily initialized on first access
	 */
	protected get config(): UserConfig | undefined {
		if (this.userConfig === undefined) {
			// Override this method in your command subclass
			// to provide your custom UserConfig class
			// Example:
			// if (this.userConfig === undefined) {
			//   this.userConfig = configureUserConfig(MyAppConfig);
			// }
			this.userConfig = undefined;
		}
		return this.userConfig;
	}

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
