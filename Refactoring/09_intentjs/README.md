# intent.js

Functional testing for Node.js and the browser.

If you have any questions or feedback, feel free to contact us using [@goloroden](https://twitter.com/goloroden) or [@pro_cessor](https://twitter.com/pro_cessor) on Twitter.

## Installation

    $ npm install intent.js

## Quick start

Basically, using `intent.js` is quite easy. Just add a reference to it within your application:

```javascript
var iAnticipateThat = require('intent.js');
```

### What is your intent?

Before writing your first test, you need to think about what is your *intent*. An intent describes what you want to achieve and the reason why you want to do so.

For example, your first intent for a function `divide` may be that it divides positive numbers. intent.js allows you to express this in your code. Just add the following lines:

```javascript
iAnticipateThat(divide, {
  'divides positive numbers': // ...
});
```

### What are your goals?

The next thing you need is a concrete *goal* that describes what you need so that you are happy and your intent has been satisfied. A goal for intent.js is always given as a tuple that describes - in its most basic form - an input and an output.

When talking about the `divide` function the input may be the numbers `6` and `3`, the output may be `2`. So add this to your intent:

```javascript
iAnticipateThat(divide, {
  'divides positive numbers': { in: [ 6, 3 ], out: 2 }
});
```

There may be more than one goal for an intent to be satisfied. Example given, you could also want the intent to work with positive decimal numbers. So, go and add a second goal for the intent:

```javascript
iAnticipateThat(divide, {
  'divides positive numbers': [
    { in: [ 6, 3 ], out: 2 },
    { in: [ 7.5, 3 ], out: 2.5 }
  ]
});
```

### Do you have additional intents?

There may be more than one intent. Example given, you might want the `divide` function to throw an error when trying to divide by zero, which is not defined according to mathematics:

```javascript
iAnticipateThat(divide, {
  'divides positive numbers': [
    { in: [ 6, 3 ], out: 2 },
    { in: [ 7.5, 3 ], out: 2.5 }
  ],
  'fails when dividing by zero': // ...
});
```

### So you want to handle errors?

Again, you could specify a goal as before, but this time it's more reasonable to anticipate an *error* than a normal output. So describe the `Error` instance that you anticipate:

```javascript
iAnticipateThat(divide, {
  'divides positive numbers': [
    { in: [ 6, 3 ], out: 2 },
    { in: [ 7.5, 3 ], out: 2.5 }
  ],
  'fails when dividing by zero':
    { in: [ 1, 0 ], error: { message: 'Division by zero' } }
});
```

And basically, that's it :-)!

## License

The MIT License (MIT)
Copyright (c) 2012 Johannes Hofmeister and Golo Roden.
 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.