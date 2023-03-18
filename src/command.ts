import { CommandOptions } from './command-options';

export class Command {
	public signature: string;
	public description?: string;

	public positional: CommandOptions[];
	public options: CommandOptions[];

	public async handle(args): Promise<void> {}

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
			this.handle.bind(this)
		);
	}
}
