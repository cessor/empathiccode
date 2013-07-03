var iAnticipateThat = require('../lib/index');

var div = function (first, second) {
  if(second === 0) {
    throw new Error('Division by zero');
  }
  return first / second;
};

iAnticipateThat(div, {
  'I want to divide numbers': [
    { in: [ 17, 2 ], out: 8.5 },
    { in: [ 27, 9 ], out: 3 }
  ],
  'Division by 0 is bad': { in: [ 1, 0 ], error: { message : 'Division by zero' } }
});