import jsPsych from '../src/jspsych';

const data = [
  { value: 100, filter: true },
  { value: 200, filter: false },
  { value: 300, filter: true },
  { value: 400, filter: false },
  { value: 500, filter: false },
];

jsPsych.data._customInsert(data);

describe('DataColumn', () => {
  test('sum', () => {
    expect(jsPsych.data.get().select('value').sum()).toBe(1500);
  });

  test('mean', () => {
    expect(jsPsych.data.get().select('value').mean()).toBe(300);
  });

  test('count', () => {
    expect(jsPsych.data.get().select('value').count()).toBe(5);
  });

  test('min', () => {
    expect(jsPsych.data.get().select('value').min()).toBe(100);
  });

  test('max', () => {
    expect(jsPsych.data.get().select('value').max()).toBe(500);
  });

  test('variance', () => {
    expect(jsPsych.data.get().select('value').variance()).toBe((Math.pow(200, 2) + Math.pow(100, 2) + Math.pow(100, 2) + Math.pow(200, 2)) / 5);
  });

  test('sd', () => {
    expect(jsPsych.data.get().select('value').sd()).toBe(Math.sqrt((Math.pow(200, 2) + Math.pow(100, 2) + Math.pow(100, 2) + Math.pow(200, 2)) / 5));
  });

  test('median', () => {
    expect(jsPsych.data.get().select('value').median()).toBe(300);
  });

  test('subset', () => {
    expect(jsPsych.data.get().select('value').subset((x) => x > 300).count()).toBe(2);
  });

  test('frequencies', () => {
    expect(jsPsych.data.get().select('filter').frequencies()).toEqual({ true: 2, false: 3 });
  });

  test('all', () => {
    expect(jsPsych.data.get().select('value').all((x) => x < 600)).toBe(true);
    expect(jsPsych.data.get().select('filter').all((x) => x)).toBe(false);
  });
});
