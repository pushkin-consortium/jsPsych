import jsPsych from '../../src/jspsych';
import utils from '../testing-utils';

beforeEach(() => {
  require('../../src/jspsych');
  require('../../plugins/jspsych-html-keyboard-response');
});

test('works on basic timeline', () => {
  const timeline = [
    {
      type: 'html-keyboard-response',
      stimulus: 'trial 1',
      on_finish() {
        jsPsych.endExperiment('the end');
      },
    },
    {
      type: 'html-keyboard-response',
      stimulus: 'trial 2',
    },
  ];

  jsPsych.init({ timeline });

  expect(jsPsych.getDisplayElement().innerHTML).toMatch('trial 1');

  utils.pressKey(32);

  expect(jsPsych.getDisplayElement().innerHTML).toMatch('the end');
});

test('works with looping timeline (#541)', () => {
  const timeline = [
    {
      timeline: [{ type: 'html-keyboard-response', stimulus: 'trial 1' }],
      loop_function() {
        jsPsych.endExperiment('the end');
      },
    },
  ];

  jsPsych.init({ timeline });

  expect(jsPsych.getDisplayElement().innerHTML).toMatch('trial 1');

  utils.pressKey(32);

  expect(jsPsych.getDisplayElement().innerHTML).toMatch('the end');
});
