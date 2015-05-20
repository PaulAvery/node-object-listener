//Short-circuiting equality check for anything parsed from a JSON string.
//This means no checks for prototypes/instanceof, we only know raw objects, arrays and primitive types.
export default function equal(a: any, b: any) {
	if(a === b) return true;

	//Shortcircuit if types dont match
	if(typeof a !== typeof b) {
		return false;
	}

	if(typeof a === 'object' && a !== null && b !== null) {
		//We have an object and need to check all properties recursively
		if(Array.isArray(a) && Array.isArray(b)) {
			//Two arrays, so loop over all entries
			if(a.length !== b.length) return false;

			for(let x = 0; x < a.length; x++) {
				if(!equal(a[x], b[x])) return false;
			}
		} else if(!Array.isArray(a) && !Array.isArray(b)) {
			//Neither is an array, so check all properties
			if(Object.keys(a).length !== Object.keys(b).length) return false;

			for(let key in a) {
				if(!equal(a[key], b[key])) return false;
			}
		} else {
			//One is an array and the other is not, so they are not the same
			return false;
		}
	} else {
		//Simple type, simple check via equality operator
		if(a !== b) return false;
	}

	//We checked everything so return
	return true;
}
