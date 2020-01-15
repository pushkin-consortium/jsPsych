import jsPsych from '../../src/jspsych';
import utils from '../testing-utils';

beforeEach(() => {
  require('../../src/jspsych');
  require('../../plugins/jspsych-html-keyboard-response');
});

describe('loop function', () => {
  test('repeats a timeline when returns true', () => {
    let count = 0;

    const trial = {
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: 'foo',
      }],
      loop_function() {
        if (count < 1) {
          count++;
          return true;
        }
        return false;
      },
    };

    jsPsych.init({
      timeline: [trial],
    });

    // first trial
    utils.pressKey(32);
    expect(jsPsych.data.get().count()).toBe(1);

    // second trial
    utils.pressKey(32);
    expect(jsPsych.data.get().count()).toBe(2);
  });

  test('does not repeat when returns false', () => {
    const count = 0;

    const trial = {
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: 'foo',
      }],
      loop_function() {
        return false;
      },
    };

    jsPsych.init({
      timeline: [trial],
    });

    // first trial
    utils.pressKey(32);

    expect(jsPsych.data.get().count()).toBe(1);

    // second trial
    utils.pressKey(32);

    expect(jsPsych.data.get().count()).toBe(1);
  });

  test('gets the data from the most recent iteration', () => {
    const data_count = [];
    let count = 0;

    const trial = {
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: 'foo',
      }],
      loop_function(data) {
        data_count.push(data.count());
        if (count < 2) {
          count++;
          return true;
        }
        return false;
      },
    };

    jsPsych.init({
      timeline: [trial],
    });

    // first trial
    utils.pressKey(32);

    // second trial
    utils.pressKey(32);

    // third trial
    utils.pressKey(32);

    expect(data_count).toEqual([1, 1, 1]);
    expect(jsPsych.data.get().count()).toBe(3);
  });
});

describe('conditional function', () => {
  test('skips the timeline when returns false', () => {
    const conditional = {
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: 'foo',
      }],
      conditional_function() {
        return false;
      },
    };

    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'bar',
    };

    jsPsych.init({
      timeline: [conditional, trial],
    });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('bar');

    // clear
    utils.pressKey(32);
  });

  test('completes the timeline when returns true', () => {
    const conditional = {
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: 'foo',
      }],
      conditional_function() {
        return true;
      },
    };

    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'bar',
    };

    jsPsych.init({
      timeline: [conditional, trial],
    });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('foo');

    // next
    utils.pressKey(32);

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('bar');

    // clear
    utils.pressKey(32);
  });

  test('executes on every loop of the timeline', () => {
    let count = 0;
    let conditional_count = 0;

    const trial = {
      timeline: [{
        type: 'html-keyboard-response',
        stimulus: 'foo',
      }],
      loop_function() {
        if (count < 1) {
          count++;
          return true;
        }
        return false;
      },
      conditional_function() {
        conditional_count++;
        return true;
      },
    };

    jsPsych.init({
      timeline: [trial],
    });

    expect(conditional_count).toBe(1);

    // first trial
    utils.pressKey(32);

    expect(conditional_count).toBe(2);

    // second trial
    utils.pressKey(32);

    expect(conditional_count).toBe(2);
  });

  test('timeline variables from nested timelines are available', () => {
    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
    };

    const trial2 = {
      type: 'html-keyboard-response',
      stimulus: jsPsych.timelineVariable('word'),
    };

    const innertimeline = {
      timeline: [trial],
      conditional_function() {
        if (jsPsych.timelineVariable('word', true) == 'b') {
          return false;
        }
        return true;
      },
    };

    const outertimeline = {
      timeline: [trial2, innertimeline],
      timeline_variables: [
        { word: 'a' },
        { word: 'b' },
        { word: 'c' },
      ],
    };

    jsPsych.init({
      timeline: [outertimeline],
    });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('a');
    utils.pressKey(32);
    expect(jsPsych.getDisplayElement().innerHTML).toMatch('foo');
    utils.pressKey(32);
    expect(jsPsych.getDisplayElement().innerHTML).toMatch('b');
    utils.pressKey(32);
    expect(jsPsych.getDisplayElement().innerHTML).toMatch('c');
    utils.pressKey(32);
    expect(jsPsych.getDisplayElement().innerHTML).toMatch('foo');
    utils.pressKey(32);
  });
});

describe('endCurrentTimeline', () => {
  test('stops the current timeline, skipping to the end after the trial completes', () => {
    const t = {
      timeline: [
        {
          type: 'html-keyboard-response',
          stimulus: 'foo',
          on_finish() {
            jsPsych.endCurrentTimeline();
          },
        },
        {
          type: 'html-keyboard-response',
          stimulus: 'bar',
        },
      ],
    };

    const t2 = {
      type: 'html-keyboard-response',
      stimulus: 'woo',
    };

    jsPsych.init({
      timeline: [t, t2],
    });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('foo');

    utils.pressKey(32);

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('woo');

    utils.pressKey(32);
  });

  test('works inside nested timelines', () => {
    const t = {
      timeline: [
        {
          timeline: [
            {
              type: 'html-keyboard-response',
              stimulus: 'foo',
              on_finish() {
                jsPsych.endCurrentTimeline();
              },
            },
            {
              type: 'html-keyboard-response',
              stimulus: 'skip me!',
            },
          ],
        },
        {
          type: 'html-keyboard-response',
          stimulus: 'bar',
        },
      ],
    };

    const t2 = {
      type: 'html-keyboard-response',
      stimulus: 'woo',
    };

    jsPsych.init({
      timeline: [t, t2],
    });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('foo');

    utils.pressKey(32);

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('bar');

    utils.pressKey(32);

    expect(jsPsych.getDisplayElement().innerHTML).toMatch('woo');

    utils.pressKey(32);
  });
});
