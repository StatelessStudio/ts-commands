import { Command } from './command';
import { CommandRunner } from './command-runner';

export class CommandDispatcher {
	public commands: Command[] = [];

	constructor(options: { commands: (typeof Command)[] }) {
		this.commands = options.commands.map(
			(command) => new (command as { new (): Command })()
		);
	}

	public run(): void {
		this.dispatch()
			.then(() => {
				process.exit(0);
			})
			.catch((error) => {
				console.error('Error running command:', error);
				process.exit(1);
			});
	}

	public async dispatch(): Promise<void> {
		const subcommand = process.argv[2] ?? null;

		if (!subcommand) {
			console.error('Please provide a subcommand.');
			await this.help();
			process.exit(1);
			return;
		}

		const command = this.getCommandByKey(subcommand);

		if (!command) {
			console.error(`Subcommand not found: ${subcommand}`);
			await this.help();
			process.exit(1);
			return;
		}

		const runner = new CommandRunner(command);
		await runner.invoke(process.argv.slice(3));
	}

	public help() {
		console.log('Subcommands:');

		this.commands.forEach((command) => {
			console.log(`  ${command.key}: ${command.description}`);
		});
	}

	protected getCommandByKey(key: string): Command | undefined {
		return this.commands.find((command) => command.key === key);
	}
}
