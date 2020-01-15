import jsPsych from '../../src/jspsych';

require('../../plugins/jspsych-html-keyboard-response');

describe('#getKeyboardResponse', () => {
  beforeEach(() => {
    const t = {
      type: 'html-keyboard-response',
      stimulus: 'foo',
      choices: ['Q'],
    };

    jsPsych.init({
      timeline: [t],
    });
  });
  test('should execute a function after successful keypress', () => {
    const callback = jest.fn();
    jsPsych.pluginAPI.getKeyboardResponse({ callback_function: callback });
    expect(callback.mock.calls.length).toBe(0);
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }));
    expect(callback.mock.calls.length).toBe(1);
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }));
    expect(callback.mock.calls.length).toBe(1);
  });
  test('should execute only valid keys', () => {
    const callback = jest.fn();
    jsPsych.pluginAPI.getKeyboardResponse({ callback_function: callback, valid_responses: [13] });
    expect(callback.mock.calls.length).toBe(0);
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 54 }));
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 54 }));
    expect(callback.mock.calls.length).toBe(0);
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 13 }));
    expect(callback.mock.calls.length).toBe(1);
  });
  test('should not respond when jsPsych.NO_KEYS is used', () => {
    const callback = jest.fn();
    jsPsych.pluginAPI.getKeyboardResponse({ callback_function: callback, valid_responses: jsPsych.NO_KEYS });
    expect(callback.mock.calls.length).toBe(0);
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 54 }));
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 54 }));
    expect(callback.mock.calls.length).toBe(0);
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }));
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }));
    expect(callback.mock.calls.length).toBe(0);
  });
  test('should not respond to held keys when allow_held_key is false', () => {
    const callback = jest.fn();
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }));
    jsPsych.pluginAPI.getKeyboardResponse({ callback_function: callback, valid_responses: jsPsych.ALL_KEYS, allow_held_key: false });
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }));
    expect(callback.mock.calls.length).toBe(0);
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }));
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }));
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }));
    expect(callback.mock.calls.length).toBe(1);
  });
  test('should respond to held keys when allow_held_key is true', () => {
    const callback = jest.fn();
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }));
    jsPsych.pluginAPI.getKeyboardResponse({ callback_function: callback, valid_responses: jsPsych.ALL_KEYS, allow_held_key: true });
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }));
    expect(callback.mock.calls.length).toBe(1);
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }));
  });
});

describe('#cancelKeyboardResponse', () => {
  test('should cancel a keyboard response listener', () => {
    const callback = jest.fn();
    const listener = jsPsych.pluginAPI.getKeyboardResponse({ callback_function: callback });
    expect(callback.mock.calls.length).toBe(0);
    jsPsych.pluginAPI.cancelKeyboardResponse(listener);
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }));
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }));
    expect(callback.mock.calls.length).toBe(0);
  });
});

describe('#cancelAllKeyboardResponses', () => {
  test('should cancel all keyboard response listeners', () => {
    const callback = jest.fn();
    jsPsych.pluginAPI.getKeyboardResponse({ callback_function: callback });
    expect(callback.mock.calls.length).toBe(0);
    jsPsych.pluginAPI.cancelAllKeyboardResponses();
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 32 }));
    document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: 32 }));
    expect(callback.mock.calls.length).toBe(0);
  });
});

describe('#compareKeys', () => {
  test('should compare keys regardless of type', () => {
    expect(jsPsych.pluginAPI.compareKeys('q', 81)).toBe(true);
    expect(jsPsych.pluginAPI.compareKeys(81, 81)).toBe(true);
    expect(jsPsych.pluginAPI.compareKeys('q', 'Q')).toBe(true);
    expect(jsPsych.pluginAPI.compareKeys(80, 81)).toBe(false);
    expect(jsPsych.pluginAPI.compareKeys('q', '1')).toBe(false);
    expect(jsPsych.pluginAPI.compareKeys('q', 80)).toBe(false);
  });
});

describe('#convertKeyCharacterToKeyCode', () => {
  test('should return the keyCode for a particular character', () => {
    expect(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('q')).toBe(81);
    expect(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('1')).toBe(49);
    expect(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('space')).toBe(32);
    expect(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('enter')).toBe(13);
  });
});

describe('#convertKeyCodeToKeyCharacter', () => {
  test('should return the keyCode for a particular character', () => {
    expect(jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(81)).toBe('q');
    expect(jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(49)).toBe('1');
    expect(jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(32)).toBe('space');
    expect(jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(13)).toBe('enter');
  });
});

describe('#setTimeout', () => {
  test('basic setTimeout control with centralized storage', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    jsPsych.pluginAPI.setTimeout(callback, 1000);
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    expect(callback).toBeCalled();
  });
});

describe('#clearAllTimeouts', () => {
  test('clear timeouts before they execute', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    jsPsych.pluginAPI.setTimeout(callback, 5000);
    expect(callback).not.toBeCalled();
    jsPsych.pluginAPI.clearAllTimeouts();
    jest.runAllTimers();
    expect(callback).not.toBeCalled();
  });
});
