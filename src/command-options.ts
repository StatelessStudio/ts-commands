import { ArgumentValue } from './argument-parser';

export enum OptionType {
	boolean = 'bool',
	number = 'number',
	string = 'string',
}

export interface CommandOption {
	key: string;
	type?: OptionType;
	alias?: string;
	description?: string;
	default?: ArgumentValue;
	choices?: number[] | string[];
}

export const defaultCommandOptions: Partial<CommandOption> = {
	type: OptionType.string,
	description: '',
};
