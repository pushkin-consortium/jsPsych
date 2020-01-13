/* eslint-disable no-undef */
import jsPsych from '../src/jspsych';

// testing flatten method
describe('flatten', () => {
  test('flat array', () => {
    const input = [1, 2, 2, 3, 5];
    const output = jsPsych.utils.flatten(input);
    expect(output).toEqual(input);
  });

  test('multi-demensional array', () => {
    const input = [1, [1, 2], [1, 2, 3], [4]];
    const output = jsPsych.utils.flatten(input);
    expect(output).toEqual([1, 1, 2, 1, 2, 3, 4]);
  });
});

// testing unique method
describe('unique', () => {
  test('array without duplicates', () => {
    const input = [1, 3, 5, 7, 6, 4, 2];
    const output = jsPsych.utils.unique(input);
    expect(output).toEqual([1, 3, 5, 7, 6, 4, 2]);
  });

  test('array with duplicates', () => {
    const input = [1, 1, 3, 3, 5, 5, 7, 7];
    const output = jsPsych.utils.unique(input);
    expect(output).toEqual([1, 3, 5, 7]);
  });
});

// testing deepCopy method
describe('deepCopy', () => {
  test('objects', () => {
    const object1 = { a: 1, b: { c: 2, d: 3 } };
    const object2 = jsPsych.utils.deepCopy(object1);
    object2.b.c = 4;
    expect(object1.b.c).toBe(2);
  });

  test('objects with array', () => {
    const object1 = { a: 1, b: [2, 3] };
    const object2 = jsPsych.utils.deepCopy(object1);
    object2.b[0] = 6;
    expect(JSON.stringify(object2.b)).toBe(JSON.stringify([6, 3]));
  });

  test('objects with functions', () => {
    let c = 0;
    const object1 = { a: 1, b: () => { c = 2; } };
    const object2 = jsPsych.utils.deepCopy(object1);
    object2.b = () => { c = 5; };
    object1.b();
    expect(c).toBe(2);
    object2.b();
    expect(c).toBe(5);
  });
});
