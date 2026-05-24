import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

import { Command } from './command';
import { CommandRunner } from './command-runner';
import { DependencyContainer } from 'hidi';

export class CommandDispatcher {
	public commands: Command[] = [];
	public container: DependencyContainer = new DependencyContainer();

	constructor(options: { commands: (typeof Command)[] }) {
		this.container.register(
			'readline',
			readline.createInterface(stdin, stdout)
		);

		this.commands = options.commands.map((command) => {
			const cmd = new (command as { new (): Command })();
			cmd.inject(this.container);

			return cmd;
		});
	}

	public run(): void {
		let exitCode = 0;

		this.dispatch()
			.then(() => {
				exitCode = 0;
			})
			.catch((error) => {
				console.error('Error running command:', error);
				exitCode = 1;
			})
			.finally(() => {
				this.teardown();
				process.exit(exitCode);
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

	protected teardown() {
		this.commands.forEach((command) => command.teardown());
		this.container.get<readline.Interface>('readline')?.close();
	}
}
