var iAnticipateThat = require('../lib/index');

var fizzBuzz = function (number) {
  if(number % 3 === 0 && number % 5 === 0) {
    return 'fizzbuzz';
  }
  if(number % 5 === 0) {
    return 'buzz';
  }
  if(number % 3 === 0) {
    return 'fizz'; 
  }
  return number;
};

iAnticipateThat(fizzBuzz, {
  'Numbers that can be divided by 3 are fizz': [
    { in: 3, out: 'fizz' },
    { in: 6, out: 'fizz' }
  ],
  'Numbers that can be divided by 5 are buzz': [
    { in:  5, out: 'buzz' },
    { in: 10, out: 'buzz' }
  ],
  'Numbers that can be divided by 3 and 5 are fizzbuzz': [
    { in:  0, out: 'fizzbuzz' },
    { in: 15, out: 'fizzbuzz' },
    { in: 30, out: 'fizzbuzz' }
  ],
  'Numbers that can\'t be divided': { in: 1, out: 1 }
});