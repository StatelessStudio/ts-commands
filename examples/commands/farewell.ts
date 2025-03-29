import { Command, OptionType, ParsedArguments } from '../../src';

interface Args extends ParsedArguments {
	fname: string;
	lname: string;
	informal?: boolean;
}

export class FarewellCommand extends Command {
	override key = 'farewell';
	override description = 'say goodbye';

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
			alias: 'i',
		},
	];

	override async handle(args: Args) {
		const greeting = args.informal ? 'later' : 'goodbye';

		/* eslint-disable-next-line no-console */
		console.log(`${greeting} ${args.fname} ${args.lname}`);
	}
}
