import jsPsych from '../../src/jspsych';
import utils from '../testing-utils';

beforeEach(() => {
  require('../../src/jspsych');
  require('../../plugins/jspsych-html-keyboard-response');
});

describe('randomize order', () => {
  test('holder', () => {
    expect(true).toBe(true);
  });
});

describe('repetitons', () => {
  test('holder', () => {
    expect(true).toBe(true);
  });
});

describe('sampling', () => {
  test('holder', () => {
    expect(true).toBe(true);
  });

  test('alternate-groups method produces alternating groups', () => {
    const trial = {
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: jsPsych.timelineVariable('stimulus'),
      }],
      timeline_variables: [
        { stimulus: 'a' },
        { stimulus: 'a' },
        { stimulus: 'b' },
        { stimulus: 'b' },
        { stimulus: 'c' },
        { stimulus: 'c' },
      ],
      sample: {
        type: 'alternate-groups',
        groups: [[0, 0, 0, 0, 1, 1, 1, 1], [2, 2, 2, 2, 3, 3, 3, 3], [4, 4, 4, 4, 5, 5, 5, 5]],
        randomize_group_order: true,
      },
    };

    jsPsych.init({ timeline: [trial] });
    let last = jsPsych.getDisplayElement().innerHTML;
    for (let i = 0; i < 23; i++) {
      utils.pressKey(32);
      const curr = jsPsych.getDisplayElement().innerHTML;
      expect(last).not.toMatch(curr);
      last = curr;
    }
    utils.pressKey(32);
  });

  test('sampling functions run when timeline loops', () => {
    let count = 0;
    const reps = 100;

    const trial = {
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: jsPsych.timelineVariable('stimulus'),
      }],
      timeline_variables: [
        { stimulus: '1' },
        { stimulus: '2' },
        { stimulus: '3' },
      ],
      sample: {
        type: 'without-replacement',
        size: 1,
      },
      loop_function() {
        count++;
        return (count < reps);
      },
    };

    jsPsych.init({
      timeline: [trial],
    });

    const result_1 = [];
    const result_2 = [];
    for (let i = 0; i < reps / 2; i++) {
      var html = jsPsych.getDisplayElement().innerHTML;
      result_1.push(html);
      utils.pressKey(32);
      var html = jsPsych.getDisplayElement().innerHTML;
      result_2.push(html);
      utils.pressKey(32);
    }

    expect(result_1).not.toEqual(result_2);
  });
});

describe('timeline variables are correctly evaluated', () => {
  test('when used as trial type parameter', () => {
    require('../../plugins/jspsych-html-button-response');

    const tvs = [
      { type: 'html-keyboard-response' },
      { type: 'html-button-response' },
    ];

    const timeline = [];

    timeline.push({
      timeline: [{
        type: jsPsych.timelineVariable('type'),
        stimulus: 'hello',
        choices: ['a', 'b'],
      }],
      timeline_variables: tvs,
    });

    jsPsych.init({
      timeline,
    });

    expect(jsPsych.getDisplayElement().innerHTML).not.toMatch('button');

    utils.pressKey(65); // 'a'

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('button');
  });

  test('when used with a plugin that has a FUNCTION parameter type', (done) => {
    require('../../plugins/jspsych-call-function');

    const mockFn = jest.fn();

    const tvs = [
      { fn() { mockFn('1'); } },
      { fn() { mockFn('2'); } },
    ];

    const timeline = [];

    timeline.push({
      timeline: [{
        type: 'call-function',
        func: jsPsych.timelineVariable('fn'),
      }],
      timeline_variables: tvs,
    });

    jsPsych.init({
      timeline,
      on_finish() {
        expect(mockFn.mock.calls.length).toBe(2);
        done();
      },
    });
  });

  test('custom sampling returns correct trials', () => {
    const tvs = [
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];

    const timeline = [];

    timeline.push({
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: 'foo',
        data: {
          id: jsPsych.timelineVariable('id'),
        },
      }],
      timeline_variables: tvs,
      sample: {
        type: 'custom',
        fn() {
          return [2, 0];
        },
      },
    });

    jsPsych.init({
      timeline,
    });

    utils.pressKey(65);
    utils.pressKey(65);
    expect(jsPsych.data.get().select('id').values).toEqual([2, 0]);
  });

  test('custom sampling works with a loop', () => {
    const tvs = [
      { id: 0 },
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];

    const timeline = [];
    let reps = 0;
    let sample = 3;

    timeline.push({
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: 'foo',
        data: {
          id: jsPsych.timelineVariable('id'),
        },
      }],
      timeline_variables: tvs,
      sample: {
        type: 'custom',
        fn() {
          return [sample];
        },
      },
      loop_function() {
        reps++;
        if (reps < 4) {
          sample = 3 - reps;
          return true;
        }
        return false;
      },
    });

    jsPsych.init({
      timeline,
    });

    utils.pressKey(65);
    utils.pressKey(65);
    utils.pressKey(65);
    utils.pressKey(65);
    expect(jsPsych.data.get().select('id').values).toEqual([3, 2, 1, 0]);
  });
});
