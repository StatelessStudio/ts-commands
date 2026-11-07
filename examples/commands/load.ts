import { Command, OptionType, ParsedArguments } from '../../src';
import { LoadingIndicator } from '../../src/loading-indicator';

interface Args extends ParsedArguments {
	seconds: number;
}

export class LoadCommand extends Command {
	override key = 'load';
	override description = 'load for a number of seconds';

	override positional = [
		{
			key: 'seconds',
			type: OptionType.number,
			description: 'number of seconds',
			default: 10,
		},
	];

	override async handle(args: Args) {
		const seconds = args.seconds;
		const indicator = new LoadingIndicator();
		await indicator.runWithIndicator(
			async () => {
				await new Promise(resolve =>
					setTimeout(resolve, seconds * 1000)
				);
			},
			`Loading for ${seconds} seconds...`
		);
		/* eslint-disable-next-line no-console */
		console.log(`Done loading for ${seconds} seconds.`);
	}
}
