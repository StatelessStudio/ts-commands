# ts-commands - Readme

## Installation

1. `npm i ts-commands`

## Usage

### Creating Commands
Create a command file:

`src/bin/greet-command.ts`
```typescript
import { Command, OptionType, ParsedArguments } from '../src';

interface Args extends ParsedArguments {
	fname: string;
	lname: string;
	informal?: boolean;
}

export class GreetCommmand extends Command {
	override key = 'greet';
	override description = 'say hello';

	override positional = [
		{
			key: 'fname',
			type: OptionType.string,
			description: 'first name',
			default: 'Tom',
		},
		{
			key: 'lname',
			type: OptionType.string,
			description: 'last name',
			default: 'Tester',
		},
	];

	override options = [
		{
			key: 'informal',
			type: OptionType.boolean,
			default: false,
			description: 'Informal?',
		},
	];

	override async handle(args: Args) {
		const greeting = args.informal ? 'yo' : 'hello';

		/* eslint-disable-next-line no-console */
		console.log(`${greeting} ${args.fname} ${args.lname}`);
	}
}
```

### Registering Commands

#### Option 1 - Singular Command

If your app only needs one command (e.g. it only does one thing), you can use a singular style CLI:

`src/bin/index.ts`
```typescript
import { CommandRunner } from '../../src/command-runner';
import { GreetCommmand } from '../commands/greet';

new CommandRunner(new GreetCommmand()).run();
```

#### Option 2 - Dispatched Commands

Dispatched commands are useful for when you have multiple sub-commands in your CLI, such as `migration:run`, `migration:generate`, etc.

Create an index file to register your command(s):

`src/bin/index.ts`
```typescript
import { CommandDispatcher } from '../src/command-dispatcher';
import { FarewellCommmand } from './farewell';
import { GreetCommmand } from './greet';

new CommandDispatcher({
	commands: [FarewellCommmand, GreetCommmand],
}).run();

```

## Create Additional Commands
   1. Repeat "Creating Commands" section for each command
   2. Add each command in the `commands` of `CommandDispatcher`
