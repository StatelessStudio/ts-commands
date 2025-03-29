import { Command } from './command';

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
			console.log(`  <${positional.key}>: ${positional.description}`);
		}
	}

	public showOptions() {
		for (const option of this.command.options) {
			const key = `--${option.key}`;
			const alias = option.alias ? ` -${option.alias}` : '';
			console.log(`  ${key}${alias}: ${option.description}`);
		}
	}

	public footer() {}
}
