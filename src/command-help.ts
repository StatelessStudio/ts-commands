import { Command } from './command';
import { CommandOption, OptionType } from './command-options';

export class CommandHelp {
	public constructor(public command: Command) {}

	public help() {
		this.showSignature();
		this.showDescription();
		console.log('');

		this.showOptionsHeader();
		this.showPositional();
		console.log('');
		this.showOptions();
		console.log('');

		this.footer();
	}

	public showSignature() {
		const signature = [
			this.command.key,
			...this.command.positional.map((p) => `<${p.key}>`),
			...this.command.options.map((o) => `--${o.key}`),
		].join(' ');

		console.log(`Usage: ${signature}`);
	}

	public showDescription() {
		console.log(this.command.description);
	}

	public showOptionsHeader() {
		console.log('Options:');
	}

	public showPositional() {
		for (const positional of this.command.positional) {
			this.showCommandOption(positional, true);
		}
	}

	public showOptions() {
		for (const option of this.command.options) {
			this.showCommandOption(option);
		}
	}

	public showCommandOption(option: CommandOption, isPositional = false) {
		let key = '';

		if (isPositional) {
			key = `<${option.key}>`;
		}
		else {
			if (option.alias) {
				key = `-${option.alias}, `;
			}

			key += `--${option.key}`;
		}

		const type =
			option.type && option.type !== OptionType.string
				? ` {${option.type}}`
				: '';
		const defaultValue =
			option.default !== undefined ? ` (default: ${option.default})` : '';
		const choices = option.choices
			? ` [choices: ${option.choices.join(', ')}]`
			: '';
		const description = option.description ?? '';
		const metadata = `${type}${defaultValue}${choices}`;
		const fullDescription = `${description}${metadata}`;

		console.log(`  ${key}: ${fullDescription}`);
	}

	public footer() {}
}
