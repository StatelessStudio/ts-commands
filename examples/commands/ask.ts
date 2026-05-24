import { Command, ParsedArguments } from '../../src';

interface Args extends ParsedArguments {}

export class AskCommand extends Command {
	override key = 'ask';
	override description = 'ask a question and get an answer';

	override positional = [];

	override options = [];

	override async handle(_args: Args) {
		const answer = await this.ask('What is your name? ');

		/* eslint-disable-next-line no-console */
		console.log(`Your name is ${answer}`);
	}
}
