import jsPsych from '../../src/jspsych';
import utils from '../testing-utils';

beforeEach(() => {
  require('../../src/jspsych');
  require('../../plugins/jspsych-html-keyboard-response');
});

describe('automatic progress bar', () => {
  test('progress bar does not display by default', () => {
    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
    };

    jsPsych.init({
      timeline: [trial],
    });

    expect(document.querySelector('#jspsych-progressbar-container')).toBe(null);

    utils.pressKey(32);
  });

  test('progress bar displays when show_progress_bar is true', () => {
    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
    };

    jsPsych.init({
      timeline: [trial],
      show_progress_bar: true,
    });

    expect(document.querySelector('#jspsych-progressbar-container').innerHTML).toMatch('<span>Completion Progress</span><div id="jspsych-progressbar-outer"><div id="jspsych-progressbar-inner"></div></div>');

    utils.pressKey(32);
  });

  test('progress bar automatically updates by default', () => {
    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
    };

    jsPsych.init({
      timeline: [trial, trial, trial, trial],
      show_progress_bar: true,
    });

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('25%');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('50%');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('75%');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('100%');
  });

  test('progress bar does not automatically update when auto_update_progress_bar is false', () => {
    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
    };

    jsPsych.init({
      timeline: [trial, trial, trial, trial],
      show_progress_bar: true,
      auto_update_progress_bar: false,
    });

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('');
  });

  test('setProgressBar() manually', () => {
    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
      on_finish() {
        jsPsych.setProgressBar(0.2);
      },
    };

    const trial_2 = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
      on_finish() {
        jsPsych.setProgressBar(0.8);
      },
    };

    jsPsych.init({
      timeline: [trial, trial_2],
      show_progress_bar: true,
      auto_update_progress_bar: false,
    });

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('20%');

    utils.pressKey(32);

    expect(document.querySelector('#jspsych-progressbar-inner').style.width).toBe('80%');
  });

  test('getProgressBarCompleted() -- manual updates', () => {
    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
      on_finish() {
        jsPsych.setProgressBar(0.2);
      },
    };

    const trial_2 = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
      on_finish() {
        jsPsych.setProgressBar(0.8);
      },
    };

    jsPsych.init({
      timeline: [trial, trial_2],
      show_progress_bar: true,
      auto_update_progress_bar: false,
    });

    utils.pressKey(32);

    expect(jsPsych.getProgressBarCompleted()).toBe(0.2);

    utils.pressKey(32);

    expect(jsPsych.getProgressBarCompleted()).toBe(0.8);
  });

  test('getProgressBarCompleted() -- automatic updates', () => {
    const trial = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
    };

    jsPsych.init({
      timeline: [trial, trial, trial, trial],
      show_progress_bar: true,
    });

    utils.pressKey(32);

    expect(jsPsych.getProgressBarCompleted()).toBe(0.25);

    utils.pressKey(32);

    expect(jsPsych.getProgressBarCompleted()).toBe(0.50);

    utils.pressKey(32);

    expect(jsPsych.getProgressBarCompleted()).toBe(0.75);

    utils.pressKey(32);

    expect(jsPsych.getProgressBarCompleted()).toBe(1);
  });
});
