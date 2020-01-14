import jsPsych from '../src/jspsych';

// create a sample map
let data = [
  { value: 100, filter: true },
  { value: 200, filter: false },
  { value: 300, filter: true },
  { value: 400, filter: false },
  { value: 500, filter: false },
];

// module._customInsert = function (data) {
//   allData = DataCollection(data);
// };

jsPsych.data._customInsert(data);

describe('DataCollection', () => {
  test('filter', () => {
    expect(jsPsych.data.get().filter({ filter: true }).count()).toBe(2);
  });

  test('OR filter', () => {
    expect(jsPsych.data.get().filter([{ filter: true }, { value: 300 }]).count()).toBe(2);
    expect(jsPsych.data.get().filter([{ filter: true }, { value: 200 }]).count()).toBe(3);
  });

  test('custom filter', () => {
    expect(jsPsych.data.get().filterCustom((x) => x.value > 200 && x.filter == false).count()).toBe(2);
  });

  test('ignore', () => {
    expect(jsPsych.data.get().ignore('value').select('value').count()).toBe(0);
  });

  test('select', () => {
    expect(JSON.stringify(jsPsych.data.get().select('value').values)).toBe(JSON.stringify([100, 200, 300, 400, 500]));
  });
  
  test('addToAll', () => {
    expect(jsPsych.data.get().readOnly().addToAll({ added: 5 }).select('added')
      .count()).toBe(5);
  });

  test('addToLast', () => {
    jsPsych.data.get().addToLast({ lastonly: true });
    expect(jsPsych.data.get().values()[4].lastonly).toBe(true);
  });

  test('readOnly', () => {
    const d = jsPsych.data.get().readOnly().values();
    d[0].value = 0;
    expect(jsPsych.data.get().values()[0].value).toBe(100);
  });

  test('not readOnly', () => {
    const d = jsPsych.data.get().values();
    d[0].value = 0;
    expect(jsPsych.data.get().values()[0].value).toBe(0);
  });

  test('count', () => {
    expect(jsPsych.data.get().count()).toBe(5);
  });

  test('push', () => {
    jsPsych.data.get().push({ value: 600, filter: true });
    expect(jsPsych.data.get().count()).toBe(6);
    data = [
      { value: 100, filter: true },
      { value: 200, filter: false },
      { value: 300, filter: true },
      { value: 400, filter: false },
      { value: 500, filter: false },
    ];
    jsPsych.data._customInsert(data);
  });

  test('values', () => {
    expect(JSON.stringify(jsPsych.data.get().values())).toBe(JSON.stringify(data));
  });
  
  test('first', () => {
    expect(jsPsych.data.get().first(3).count()).toBe(3);
    expect(jsPsych.data.get().first(2).values()[1].value).toBe(200);
  });
  
  test('last', () => {
    expect(jsPsych.data.get().last(2).count(2)).toBe(2);
    expect(jsPsych.data.get().last(2).values()[0].value).toBe(400);
  });
  
  test('join', () => {
    const dc1 = jsPsych.data.get().filter({ filter: true });
    const dc2 = jsPsych.data.get().filter({ value: 500 });
    const data = dc1.join(dc2);
    expect(data.count()).toBe(3);
    expect(data.values()[2].value).toBe(500);
  });
  
  test('unqiueNames', () => {
    const data = [
      { value: 100, filter: true },
      { value: 200, filter: false },
      { value: 300, filter: true, v1: false },
      { value: 400, filter: false, v2: true },
      { value: 500, filter: false, v1: false },
    ];
    jsPsych.data._customInsert(data);
    expect(jsPsych.data.get().uniqueNames().length).toBe(4);
  });
});
