import { Command } from './command';

export interface RegisterCommandsOptions {
	commands: (typeof Command)[];
	name?: string;
	forceExit?: boolean;
}
