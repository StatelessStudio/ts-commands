import { CommandDispatcher } from '../src/command-dispatcher';
import { FarewellCommmand } from './farewell';
import { GreetCommmand } from './greet';

new CommandDispatcher({
	commands: [FarewellCommmand, GreetCommmand],
}).run();
