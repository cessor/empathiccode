var _ = require('underscore');

var inspirations = [
  'advance',
  'improve',
  'iterate',
  'learn',
  'start something',
  'refactor'
];

var inspire = function () {
  return random(inspirations);
};

var random = function (items) {
  var index = _.random(0, items.length - 1);
  return items[index];
};

module.exports = inspire;