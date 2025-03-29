import { ParsedArguments } from '../../src/argument-parser';
import { Command } from '../../src/command';

export class MockCommand extends Command {
	key = 'mock';
	description = 'Mock command';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	override async handle(args: ParsedArguments): Promise<void> {
		// Mock implementation
	}
}
