import { CommandDispatcher } from '../../src/command-dispatcher';
import { FarewellCommand } from '../commands/farewell';
import { GreetCommand } from '../commands/greet';

new CommandDispatcher({
	commands: [FarewellCommand, GreetCommand],
}).run();
