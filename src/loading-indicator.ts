// Simple loading indicator for CLI commands
// Uses a spinner animation to indicate processing

export interface LoadingIndicatorOptions {
	/** Spinner frames to cycle through */
	frames?: string[];
	/** Duration between frame changes in milliseconds */
	frameDuration?: number;
	/** Whether to clear the line when stopping */
	clearOnStop?: boolean;
	/** Whether to show the message with the spinner */
	showMessage?: boolean;
}

export class LoadingIndicator {
	private isRunning = false;
	private frameIndex = 0;
	private intervalId?: NodeJS.Timeout;
	private message?: string;
	private isInteractive = false;
	private readonly options: Required<LoadingIndicatorOptions>;

	constructor(options: LoadingIndicatorOptions = {}) {
		this.options = {
			frames: ['|', '/', '-', '\\'],
			frameDuration: 100,
			clearOnStop: true,
			showMessage: true,
			...options,
		};
	}

	public start(message?: string): void {
		if (this.isRunning) {
			return;
		}

		this.isRunning = true;
		this.message = message;
		this.frameIndex = 0;
		this.isInteractive = Boolean(
			process.stdout.isTTY &&
			process.stdout.cursorTo &&
			process.stdout.clearLine
		);

		if (!this.isInteractive) {
			this.writeMessage();
			return;
		}

		this.render();

		this.intervalId = setInterval(() => {
			if (!this.isRunning) {
				return;
			}

			this.frameIndex++;
			this.render();
		}, this.options.frameDuration);
	}

	public stop(clear: boolean = this.options.clearOnStop): void {
		if (!this.isRunning) {
			return;
		}

		this.isRunning = false;

		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}

		if (!this.isInteractive) {
			return;
		}

		if (clear) {
			process.stdout.cursorTo(0);
			process.stdout.clearLine(0);
		}
		else {
			process.stdout.write('\n');
		}
	}

	public updateMessage(message: string): void {
		if (!this.isRunning) {
			return;
		}

		this.message = message;

		if (this.isInteractive) {
			this.render();
		}
		else {
			this.writeMessage();
		}
	}

	private render(): void {
		process.stdout.cursorTo(0);
		process.stdout.clearLine(0);
		const message = this.message && this.options.showMessage
			? this.message + ' '
			: '';
		const frame = this.options.frames[
			this.frameIndex % this.options.frames.length
		];
		process.stdout.write(message + frame + ' ');
	}

	private writeMessage(): void {
		if (this.message && this.options.showMessage) {
			process.stdout.write(this.message + '\n');
		}
	}

	public async runWithIndicator<T>(
		operation: () => Promise<T>,
		message?: string
	): Promise<T> {
		this.start(message);
		try {
			return await operation();
		}
		finally {
			this.stop();
		}
	}
}
