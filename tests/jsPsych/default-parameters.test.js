import jsPsych from '../../src/jspsych';

beforeEach(() => {
  require('../../src/jspsych');
  require('../../plugins/jspsych-survey-text');
});

describe('nested defaults', () => {
  test('work in basic situation', () => {
    const t = {
      type: 'survey-text',
      questions: [
        {
          prompt: 'Question 1.',
        },
        {
          prompt: 'Question 2.',
        },
      ],
    };

    jsPsych.init({ timeline: [t] });

    const display = jsPsych.getDisplayElement();

    expect(display.querySelector('input').placeholder).toBe('');
    expect(display.querySelector('input').size).toBe(40);
  });
});
