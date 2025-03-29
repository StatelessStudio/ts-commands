import { CommandRunner } from '../../src/command-runner';
import { GreetCommand } from '../commands/greet';

new CommandRunner(new GreetCommand()).run();
