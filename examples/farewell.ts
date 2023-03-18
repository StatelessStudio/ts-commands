import { Command, OptionType } from '../src';

interface Args {
	fname: string;
	lname: string;
	informal?: boolean;
}

export class FarewellCommmand extends Command {
	signature = 'farewell [fname] [lname]';
	description = 'say goodbye';

	positional = [
		{
			key: 'fname',
			type: OptionType.string,
			description: 'first name',
			default: 'Tom',
		},
		{
			key: 'lname',
			type: OptionType.string,
			description: 'last name',
			default: 'Tester',
		},
	];

	options = [
		{
			key: 'informal',
			type: OptionType.boolean,
			default: false,
			description: 'Informal?',
		},
	];

	async handle(args: Args) {
		const greeting = args.informal ? 'later' : 'goodbye';

		/* eslint-disable-next-line no-console */
		console.log(`${greeting} ${args.fname} ${args.lname}`);
	}
}
