object-listener
===============
[![Build Status](https://img.shields.io/travis/PaulAvery/node-object-listener.svg?style=flat)](https://travis-ci.org/PaulAvery/node-object-listener)

This module provides utilities to listen in on changes on an object.
There might be ways this is accomplished easier, but this is my first attempt at TypeScript and I thought this might be a nice experiment.
It is primarily useful for configuration management. Therefore it takes the full object everytime and diffs on its own.

Example
-------
Lets say we want to load a config file, and write back to it whenever something changes.
Also we might want to update parts of our application whenever certain parts of our configuration changes.

**Setup**
```js
//Create some listeners
var config = new Listener();
var colors = config.child('colors');
var fonts = config.child('fonts');

//Do something on certain changes
colors.child('fg').on('change', changeFGColor);
fonts.on('change', changeFonts);

//Write our config on a change
config.on('change', function(data) {
	var json = JSON.stringify(data);
	fs.writeFileSync('config.json');
});
```

**Upating the Data**
```js
//Load your config
var json = fs.readFileSync('config.json', 'utf8')
config.update(JSON.parse(json));

//And now maybe at some point update a color from within the app?
colors.child('bg').update('#000000');
colors.child('fg').update('#ffffff');

//Now, the changes have been written and
//changeFGColor has been called with the new value!
```

## Listener
### .update(data: any)
If called on a root listener, aka one you instantiated via `new Listener()`, this will diff the object with the previously stored one. It will then emit a `change` event if anything changed. In addition it will update all its child listeners with their new data as well, therefore propagating any changes downwards the object tree.

**Example**
```js
var listener = new Listener();
listener.on('change', console.log.bind(console));

//Logs "some data"
listener.update('some data');

//Logs { "some": "object" }
listener.update({some: 'object'});
```

If this method is called on a child listener, the change will first be propagated upwards to the root Listener. This listener will then be updated.
This allows you to easily update parts of your main object.
If called without an argument, it will delete its parents property.

**Example**
```js
var listener = new Listener();
var child = listener.child('property');
listener.on('change', console.log.bind(console));
child.on('change', console.log.bind(console));

//Throws, its parent is not an object!
child.update('something');

//Logs { "property": "data" }
//Logs "data"
listener.update({property: 'data'});

//Logs { "property": "other data" }
//Logs "other data"
child.update('other data');
```

### .child(path: string)
Creates a new instance of the `Listener` constructor. A path is a `.` delimited string of properties to traverse. It may lead with a number of `<` characters to traverse up the object tree.

**Example**
```js
var listener = new Listener();
var child1 = listener.child('some.property.chain');
var child2 = child1.child('<<other.property');

//child1 now listens in on the roots `some.property.chain` property,
//child2 listens in on changes to the roots `some.other.property`
```

### .data
The listeners current data. This uses a getter function to return a clone of the current data. Therefore, accessing this property is slightly costly. But you may modify the returned data without any problems, and be sure you dont mess up the internal state of the listener.

### Listener.defer(path: string)
Static utility method, allows you to define a path before you received a listener to create a child from.
Returns a function which takes a listener and returns its child accessed under the given path.
Basically a simpler way to pass paths around.

This might not seem this useful, but has some applications in other stuff I'm working on.

**Example**
```js
//Export the path so something else might use it
function getAnAccessPath() {
	return Listener.defer('some.property');
}

//Now some other code might do the following
var root = new Listener();
var child = getAnAccessPath()(root);
```
