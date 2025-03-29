import { CommandRunner } from '../../src/command-runner';
import { GreetCommmand } from '../commands/greet';

new CommandRunner(new GreetCommmand()).run();
