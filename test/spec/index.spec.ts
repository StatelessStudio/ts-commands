import 'jasmine';
import * as index from '../../src';

describe('ts-commands', () => {
	it('exports Command', () => {
		expect(index.Command).toBeDefined();
	});
});
