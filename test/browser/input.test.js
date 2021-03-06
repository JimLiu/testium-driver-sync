import assert from 'assertive';
import { extend, noop } from 'lodash';

import InputMixin from '../../lib/browser/input';

describe('input api', () => {
  describe('#type', () => {
    const element = { type() {} };
    const input = extend({
      getExistingElement() { return element; },
    }, InputMixin);
    const selector = '.box';
    const keys = 'puppies';

    it('fails if selector is undefined', () => {
      assert.throws(() => input.type(undefined, keys));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() => input.type(noop, keys));
    });

    it('fails if keys is not defined', () => {
      assert.throws(() => input.type(selector));
    });

    it('succeeds if all conditions are met', () => {
      input.type(selector, keys);
    });
  });

  describe('#clear', () => {
    const element = { clear() {} };
    const input = extend({
      getExistingElement() { return element; },
    }, InputMixin);
    const selector = '.box';

    it('fails if selector is undefined', () => {
      assert.throws(() => input.clear(undefined));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() => input.clear(noop));
    });

    it('succeeds if all conditions are met', () => {
      input.clear(selector);
    });
  });

  describe('#clearAndType', () => {
    const element = { clear() {}, type() {} };
    const input = extend({
      getExistingElement() { return element; },
    }, InputMixin);
    const selector = '.box';
    const keys = 'puppies';

    it('fails if selector is undefined', () => {
      assert.throws(() => input.clearAndType(undefined, keys));
    });

    it('fails if selector is not a String', () => {
      assert.throws(() => input.clearAndType(noop, keys));
    });

    it('fails if keys is not defined', () => {
      assert.throws(() => input.clearAndType(selector));
    });

    it('succeeds if all conditions are met', () => {
      input.clearAndType(selector, keys);
    });
  });
});
