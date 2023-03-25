import { CommandOptions } from './command-options';
import { RegisterCommandsOptions } from './register-commands-options';

export class Command {
	public signature: string;
	public description?: string;

	public positional: CommandOptions[];
	public options: CommandOptions[];

	public registerCommandsOptions: RegisterCommandsOptions;

	public constructor(options: RegisterCommandsOptions) {
		this.registerCommandsOptions = options;
	}

	public async handle(args): Promise<void | number> {}

	public register(yargs) {
		yargs.command(
			this.signature,
			this.description,
			(_y) => {
				for (const arg of this.positional) {
					const name = arg.key;
					delete arg.key;
					_y.positional(name, arg);
				}

				for (const arg of this.options) {
					const name = arg.key;
					delete arg.key;
					_y.option(name, arg);
				}

				return _y;
			},
			async (...args) => {
				const returned = await this.handle.bind(this)(...args);
				await this.teardown.bind(this)(returned ?? 0);
			}
		);
	}

	public teardown(exitCode: number) {
		if (this.registerCommandsOptions.forceExit) {
			process.exit(exitCode);
		}
	}
}
