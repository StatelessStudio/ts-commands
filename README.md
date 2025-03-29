# ts-commands - Readme

## Installation

1. `npm i ts-commands`

## Usage

### Creating Commands
Create a command file:

`src/bin/greet-command.ts`
```typescript
import { Command, OptionType, ParsedArguments } from 'ts-commands';

interface Args extends ParsedArguments {
	fname: string;
	lname: string;
	informal?: boolean;
}

export class GreetCommand extends Command {
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

		console.log(`${greeting} ${args.fname} ${args.lname}`);
	}
}
```

### Registering Commands

#### Option 1 - Singular Command

If your app only needs one command (e.g. it only does one thing), you can use a singular style CLI:

`src/bin/index.ts`
```typescript
import { CommandRunner } from 'ts-commands';
import { GreetCommand } from '../commands/greet';

new CommandRunner(new GreetCommand()).run();
```

#### Option 2 - Dispatched Commands

Dispatched commands are useful for when you have multiple sub-commands in your CLI, such as `migration:run`, `migration:generate`, etc.

Create an index file to register your command(s):

`src/bin/index.ts`
```typescript
import { CommandDispatcher } from 'ts-commands';
import { FarewellCommand } from './farewell';
import { GreetCommand } from './greet';

new CommandDispatcher({
	commands: [FarewellCommand, GreetCommand],
}).run();
```

#### Option 3 - Automatically Register all Commands in a Folder

Use [ts-import-ts](https://www.npmjs.com/package/ts-import-ts) to load all Commands in a directory. Note, you will need to change each Command to the default export of the module, e.g. `export default class MyCommand...`. Please read the readme of that package for proper usage.

First, install with `npm i ts-import-ts`

Create your dispatcher:

`src/bin/index.ts`
```typescript
import { tsimportDirectory } from 'ts-import-ts';
import { Command, CommandDispatcher } from 'ts-commands';

new CommandDispatcher({
	commands: tsimportDirectory<typeof Command>('scripts'),
}).run();
```

## Create Additional Commands
   1. Repeat "Creating Commands" section for each command
   2. Add each command in the `commands` of `CommandDispatcher`
