# Global User Configuration Examples

This directory contains examples demonstrating how to use global user configuration with ts-commands.

## Configuration File Format

Configuration files use the `.env` format with SCREAMING_SNAKE_CASE naming:

```env
# Your application configuration
APP_NAME=MyApplication
DEBUG_MODE=false

# Database settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb

# API configuration
API_TIMEOUT=30000
API_RETRIES=3
```

## File Location

Configuration is automatically loaded from:
- Linux: `~/.config/<appName>/config.env`
- macOS: `~/.config/<appName>/config.env`
- Windows: `~\.config\<appName>\config.env`

## Usage Example

```typescript
import { Command } from 'ts-commands';
import { UserConfig, configureUserConfig } from 'ts-commands/src/user-config';

class AppConfig extends UserConfig {
  protected static appName = 'myapp';
  protected static configVersion = 1;
  
  DB_HOST: string;
  DB_PORT: number;
  API_TIMEOUT: number;
}

export class MyCommand extends Command {
  async handle() {
    const config = configureUserConfig(AppConfig);
    
    console.log(`Database: ${config.DB_HOST}:${config.DB_PORT}`);
    console.log(`Timeout: ${config.API_TIMEOUT}ms`);
  }
}
```

## Key Points

1. **SCREAMING_SNAKE_CASE**: All configuration keys use uppercase with underscores
2. **Environment Variables**: Can be overridden by process environment variables
3. **User-Level**: Configuration is stored in the user's home directory
4. **Automatic Creation**: Config directories are created automatically if they don't exist
