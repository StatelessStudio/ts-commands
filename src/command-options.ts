export enum OptionType {
	boolean,
	number,
	string,
}

export interface CommandOptions {
	key: string;
	type: OptionType;
	alias?: string;
	description?: string;
	default?: any;
	choices?: number[] | string[];
}