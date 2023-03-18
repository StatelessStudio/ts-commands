import { registerCommands } from '../src';
import { FarewellCommmand } from './farewell';
import { GreetCommmand } from './greet';

registerCommands({
	name: 'examples',
	commands: [FarewellCommmand, GreetCommmand],
});
