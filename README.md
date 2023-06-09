# ts-commands - Readme

## Installation

1. `npm i ts-commands`

## Creating Commands
Create a command file:

`src/bin/greet-command.ts`
```typescript
import { Command, OptionType } from '../src';

interface Args {
	fname: string;
	lname: string;
	informal?: boolean;
}

export class GreetCommmand extends Command {
	signature = 'greet [fname] [lname]';
	description = 'say hello';

	positional = [
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

	options = [
		{
			key: 'informal',
			type: OptionType.boolean,
			default: false,
			description: 'Informal?',
		},
	];

	async handle(args: Args) {
		const greeting = args.informal ? 'yo' : 'hello';

		console.log(`${greeting} ${args.fname} ${args.lname}`);
	}
}
```

## Register Commands

Create an index file to register your command(s):

`src/bin/index.ts`
```typescript
import { registerCommands } from 'ts-commands';
import { GreetCommmand } from './greet-command';

registerCommands({
	name: 'examples',
	commands: [GreetCommmand],
});
```

## Create Additional Commands
   1. Repeat "Creating Commands" section for each command
   2. Add each command in the `commands` array of `registerCommands`
