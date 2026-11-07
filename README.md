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

## Prompting the User

You can use the `this.ask()` method to prompt the user for input and await their response:

```typescript
export class AskCommand extends Command {
	override key = 'ask';
	override description = 'ask a question and get an answer';

	override async handle(args: ParsedArguments) {
		const answer = await this.ask('What is your name? ');
		console.log(`Your name is ${answer}`);
	}
}
```

## Loading Indicator

Use `LoadingIndicator` from `ts-commands/loading-indicator` to show a spinner
while an asynchronous operation runs:

```typescript
import { LoadingIndicator } from 'ts-commands/loading-indicator';

const indicator = new LoadingIndicator();
await indicator.runWithIndicator(
	async () => {
		await new Promise(resolve => setTimeout(resolve, 1000));
	},
	'Loading...'
);
```

The spinner redraws on the current terminal line and stops automatically on success or failure. Redirected (non-TTY) output prints messages on separate lines without animation. `updateMessage()` changes the message for subsequent frames.

Set `clearOnStop: false` to keep the final frame followed by a newline, or pass an explicit boolean to `stop()` to override that option.

## User Configuration

ts-commands includes support for global user configuration using the `ts-appconfig` library. Configuration is loaded from `~/.config/<appName>/config.env` with the following priority:

1. Defaults from your `UserConfig` class
2. `.env` file in user's config directory
3. Environment variables (`process.env`)

### Setting up User Configuration

1. Create a configuration class that extends `UserConfig`:

```typescript
import { UserConfig, configureUserConfig } from 'ts-commands';

export class MyAppConfig extends UserConfig {
	// Application metadata
	protected appName = 'my-app';
	protected configVersion = '1.0';

	// Configuration properties - use SCREAMING_SNAKE_CASE
	APP_TITLE: string = 'My Application';
	LOG_LEVEL: string = 'info';
	OUTPUT_FORMAT: string = 'text';
	ENABLE_COLORS: boolean = true;
}

// Create the configuration instance
export const config = configureUserConfig(MyAppConfig);
```

2. Use the configuration in your commands:

```typescript
import { Command, ParsedArguments } from 'ts-commands';
import { config } from './config';

export class ShowConfigCommand extends Command {
	override key = 'show-config';
	override description = 'display current configuration';

	override async handle(args: ParsedArguments) {
		// Register the config with the command
		this.userConfig = config;
		
		// Access typed configuration
		console.log(`Title: ${this.config?.APP_TITLE}`);
		console.log(`Log Level: ${this.config?.LOG_LEVEL}`);
	}
}
```

3. The first time your app runs, it will create the config directory. Create a `.env` file at `~/.config/my-app/config.env` to customize settings. Note: property names in the `.env` file must match the SCREAMING_SNAKE_CASE property names in your config class:

```
APP_TITLE="My Custom App"
LOG_LEVEL="debug"
OUTPUT_FORMAT="json"
ENABLE_COLORS="false"
VERBOSE="true"
```

### Configuration Options

The `configureUserConfig()` function accepts the same options as `ts-appconfig`:

- `absolutePath`: Absolute path to the config file
- `relativePath`: Path relative to cwd (disabled if `absolutePath` is provided)
- `allowUndeclared`: Allow variables not defined in schema (default: false)
- `fromProcessEnv`: Load from `process.env` (default: true)
- `overwriteProcessEnv`: Write back to `process.env` (default: false for user config)

### Programmatic Configuration Access

For more control, use `getUserConfig()` with custom options:

```typescript
import { getUserConfig } from 'ts-commands';

// Use custom config file location
const config = getUserConfig(MyAppConfig, {
	absolutePath: '/custom/path/to/config.env',
	fromProcessEnv: true,
});
```

## Create Additional Commands
   1. Repeat "Creating Commands" section for each command
   2. Add each command in the `commands` of `CommandDispatcher`
