import jsPsych from '../../src/jspsych';
import utils from '../testing-utils';


jest.useFakeTimers();

beforeEach(() => {
  require('../../src/jspsych');
  require('../../plugins/jspsych-html-keyboard-response');
});

describe('default iti parameter', () => {
  test('has a default value of 0', () => {
    const t = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
    };

    const t2 = {
      type: 'html-keyboard-response',
      stimulus: 'bar',
    };

    jsPsych.init({ timeline: [t, t2] });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('foo');
    utils.pressKey(32);
    expect(jsPsych.getDisplayElement().innerHTML).toMatch('bar');
    utils.pressKey(32);
  });

  test('creates a correct delay when set', () => {
    const t = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
    };

    const t2 = {
      type: 'html-keyboard-response',
      stimulus: 'bar',
    };

    jsPsych.init({ timeline: [t, t2], default_iti: 100 });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('foo');
    utils.pressKey(32);
    expect(jsPsych.getDisplayElement().innerHTML).not.toMatch('bar');
    jest.advanceTimersByTime(100);
    expect(jsPsych.getDisplayElement().innerHTML).toMatch('bar');
    utils.pressKey(32);
  });
});
