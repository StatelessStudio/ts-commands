import { Command, OptionType } from '../src';

interface Args {
	fname: string;
	lname: string;
	informal?: boolean;
}

export class GreetCommmand extends Command {
	signature = 'greet [fname] [lname]';
	description = 'say hello';

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
		const greeting = args.informal ? 'yo' : 'hello';

		/* eslint-disable-next-line no-console */
		console.log(`${greeting} ${args.fname} ${args.lname}`);
	}
}
