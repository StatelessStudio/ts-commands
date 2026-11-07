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
	private cursorLine?: number;
	private readonly options: LoadingIndicatorOptions;

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

		// Clear any previous output on the same line
		if (this.cursorLine !== undefined) {
			if (process.stdout.moveCursor) {
				process.stdout.moveCursor(0, -this.cursorLine);
			}
			if (process.stdout.clearLine) {
				process.stdout.clearLine(0);
			}
		}

		// Write initial message
		if (message && this.options.showMessage) {
			process.stdout.write(message + ' ');
		}
		process.stdout.write(this.options.frames[0]);
		process.stdout.write(' ');

		// Start the spinner interval
		this.intervalId = setInterval(() => {
			if (!this.isRunning) {
				return;
			}

			if (process.stdout.moveCursor) {
				process.stdout.moveCursor(0, -1);
			}
			if (process.stdout.clearLine) {
				process.stdout.clearLine(0);
			}

			const frames = this.options.frames;
			const frame = frames[this.frameIndex % frames.length];
			if (message && this.options.showMessage) {
				process.stdout.write(message + ' ');
			}
			process.stdout.write(frame);
			process.stdout.write(' ');

			this.frameIndex++;
		}, this.options.frameDuration);

		// Track cursor position for later cleanup
		this.cursorLine = 1;
	}

	public stop(clear: boolean = true): void {
		if (!this.isRunning) {
			return;
		}

		this.isRunning = false;

		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = undefined;
		}

		// Clean up the spinner
		if (clear && this.cursorLine !== undefined) {
			if (process.stdout.moveCursor) {
				process.stdout.moveCursor(0, -this.cursorLine);
			}
			if (process.stdout.clearLine) {
				process.stdout.clearLine(0);
			}
		} else if (!clear) {
			// Move to next line to keep the output
			if (process.stdout.write) {
				process.stdout.write('\n');
			}
		}

		this.cursorLine = undefined;
	}

	public updateMessage(message: string): void {
		if (!this.isRunning) {
			return;
		}

		if (process.stdout.moveCursor) {
			process.stdout.moveCursor(0, -1);
		}
		if (process.stdout.clearLine) {
			process.stdout.clearLine(0);
		}

		if (process.stdout.write) {
			process.stdout.write(message);
			process.stdout.write(' ');
			const frames = this.options.frames;
			const frame = frames[this.frameIndex % frames.length];
			process.stdout.write(frame);
			process.stdout.write(' ');
		}
	}

	public async runWithIndicator<T>(
		operation: () => Promise<T>,
		message?: string
	): Promise<T> {
		this.start(message);
		try {
			const result = await operation();
			this.stop(true);
			return result;
		} catch (error) {
			this.stop(true);
			throw error;
		}
	}
}
