import { Command, OptionType, ParsedArguments } from '../../src';

interface Args extends ParsedArguments {
	fname: string;
	lname: string;
	informal?: boolean;
}

export class GreetCommand extends Command {
	override key = 'greet';
	override description = 'say hello';

	override positional = [
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

	override options = [
		{
			key: 'informal',
			type: OptionType.boolean,
			default: false,
			description: 'Informal?',
		},
	];

	override async handle(args: Args) {
		const greeting = args.informal ? 'yo' : 'hello';

		/* eslint-disable-next-line no-console */
		console.log(`${greeting} ${args.fname} ${args.lname}`);
	}
}
