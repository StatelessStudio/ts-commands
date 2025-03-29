# Migration Guide

## [1.x] -> [2.x]

### Commands
1. Command `Args` interfaces must now extend `ParsedArguments`
```typescript
import { ... ParsedArguments } from 'ts-commands'; // Add the import

interface Args extends ParsedArguments { // Add "extends ParsedArguments"
    ...
}
```
2. Remove `signature` and replace with `key`.
```typescript
    // signature = 'farewell [fname] [lname]' // Remove this line
    key = 'farewell' // and replace it with this
```

### Index
1. In your index file (or wherever you call `registerCommands`), replace with a CommandDispatcher
```typescript
// import { registerCommands } from 'ts-commands'; // Remove this
import { CommandDispatcher } from 'ts-commands'; // Add this

// Remove these lines
// registerCommands({
//  name: examples,
//  commands: [Command1, Command2],
//});

// And replace it with this:
new CommandDispatcher({
    commands: [Command1, Command2],
}).run();
```
