import {EventEmitter} from 'events';
import equal from './equal';
import clone from './clone';

class Listener extends EventEmitter {
	watchers: {[prop: string]: Listener} = {};
	data: any = undefined;

	constructor(public parent: Listener = null, public prop: string = null) {
		super();
	}

	//Update this listeners data. Call this only on the top level listener
	update(obj: any, fromParent: boolean = false) {
		if(fromParent || !this.parent) {
			//Propagate down
			var oldObj = this.data;
			this.data = obj;

			//Only emit a change if anything was modified
			if(!equal(oldObj, this.data)) {
				this.emit('change', this.data);

				Object.keys(this.watchers).map(prop => {
					//update all children, and if we do not have an object, update them with undefined
					if(typeof this.data === 'object' && this.data !== null) {
						this.watchers[prop].update(this.data[prop], true);
					} else {
						this.watchers[prop].update(undefined, true);
					}
				});
			}
		} else {
			//Propagate up
			this.parent.updateProp(this.prop, obj);
		}
	}

	//Update a single property
	updateProp(prop: string, obj: any) {
		if(typeof this.data !== 'object') {
			throw new Error('Cannot update property on non-object');
		}

		//Clone the object to avoid weird shit happening
		var newObj = clone(this.data);
		newObj[prop] = obj;

		//Update ourselves and therefore propagate further up
		this.update(newObj);
	}

	//Create a child instance. Basically watch a part of the main object. Pass a path like 'some.path.to.property'
	child(path: string): Listener {
		if(path[0] === '<') {
			//We want to access the parent, so fetch the child from the parent
			return this.parent.child(path.substr(1));
		} else {
			var parts = path.split('.');
			var prop = parts.shift();

			//If we already have a watcher, dont create a new one
			this.watchers[prop] = this.watchers[prop] || new Listener(this, prop);

			if(parts.length > 0) {
				//We have a property chain, so access a child of a child of a child etc.
				return this.watchers[prop].child(parts.join('.'));
			} else {
				return this.watchers[prop];
			}
		}
	}

	//Utility function to allow passing a path and supplying the parent listener later
	//Useful in certain situations where you only know your path ahead of time
	static defer(pth: string) {
		return function(ctx: Listener) {
			return ctx.child(pth);
		};
	}
}

export = Listener;
