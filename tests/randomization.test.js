import jsPsych from '../src/jspsych';

test('shuffle', () => {
  // mock function that should be used as the implementation of the mock.
  Math.random = jest.fn().mockImplementation(() => 0.5);
  const arr = [1, 2, 3, 4, 5, 6];
  expect(jsPsych.randomization.shuffle(arr)).toEqual([1, 6, 2, 5, 3, 4]);
});

test('shuffle in alternating groups', () => {
  Math.random = jest.fn().mockImplementation(() => 0.5);
  const toShuffle = [['a', 'b', 'c'], [1, 2, 3]];
  expect(jsPsych.randomization.shuffleAlternateGroups(toShuffle)).toEqual(['a', 1, 'c', 3, 'b', 2]);
});

test('randomID', () => {
  // mock function that accepts a value that will be returned for one call.
  Math.random = jest.fn().mockReturnValueOnce(0.1).mockReturnValueOnce(0.2).mockReturnValueOnce(0.3);
  expect(jsPsych.randomization.randomID(3)).toBe('37a');
});
