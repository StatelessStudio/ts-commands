import 'jasmine';
import * as index from '../../src';

describe('ts-commands', () => {
	it('exports a', () => {
		expect(index.a).toBeTrue();
	});
});
