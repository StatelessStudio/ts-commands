import { CommandDispatcher } from '../../src/command-dispatcher';
import { FarewellCommmand } from '../commands/farewell';
import { GreetCommmand } from '../commands/greet';

new CommandDispatcher({
	commands: [FarewellCommmand, GreetCommmand],
}).run();
