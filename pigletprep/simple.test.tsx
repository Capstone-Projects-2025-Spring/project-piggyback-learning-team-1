import { q } from 'framer-motion/client';
import { describe, it, expect, assert, test } from 'vitest';

describe('Simple Math Test', () => {
  it('Add two numbers', () => {
    const sum = 1 + 2;
    // expect == assertions
    expect(sum).toBe(3);
  });

  it('Display hello world', () => {
    const message = 'Hello World';
    expect(message).toBe('Hello World');
  });

  test('assert', () => {
    assert('foo' as string !== 'bar' as string, 'foo should not be equal to bar');
  })

});