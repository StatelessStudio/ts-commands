import { CommandDispatcher } from '../../src/command-dispatcher';
import { AskCommand } from '../commands/ask';
import { FarewellCommand } from '../commands/farewell';
import { GreetCommand } from '../commands/greet';

new CommandDispatcher({
	commands: [AskCommand, FarewellCommand, GreetCommand],
}).run();
