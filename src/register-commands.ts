import Yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { RegisterCommandsOptions } from './register-commands-options';

export function registerCommands(options: RegisterCommandsOptions) {
	const yargs = Yargs(hideBin(process.argv));

	if (options.name) {
		yargs.scriptName(options.name);
	}

	for (const command of options.commands) {
		new command(options).register(yargs);
	}

	yargs.parse();
}
