const pressKey = (key) => {
  document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keydown', { keyCode: key }));
  document.querySelector('.jspsych-display-element').dispatchEvent(new KeyboardEvent('keyup', { keyCode: key }));
};

const mouseDownMouseUpTarget = (target) => {
  target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
};

const clickTarget = (target) => {
  target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

export default { pressKey, mouseDownMouseUpTarget, clickTarget };
