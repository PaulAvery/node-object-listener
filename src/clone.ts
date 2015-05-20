//Simple cloning function for anything parsed from a JSON string.
//This means no checks for prototypes/instanceof, we only know raw objects, arrays and primitive types.
export default function clone(obj: any) {
	if(typeof obj !== 'object' || obj === null) {
		//Primitive, simply return
		return obj;
	} else {
		if(Array.isArray(obj)) {
			//Map array through clone to create a new array with cloned entries
			return obj.map(clone);
		} else {
			//Assign all properties to new object and clone them beforehand
			return Object.keys(obj).reduce((sum, key) => {
				sum[key] = clone(obj[key]);
				return sum;
			}, {});
		}
	}
}
