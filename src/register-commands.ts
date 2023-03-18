import Yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { Command } from './command';

interface RegisterCommandsOptions {
	commands: (typeof Command)[];
	name?: string;
}

export function registerCommands(options: RegisterCommandsOptions) {
	const yargs = Yargs(hideBin(process.argv));

	if (options.name) {
		yargs.scriptName(options.name);
	}

	for (const command of options.commands) {
		new command().register(yargs);
	}

	yargs.parse();
}
