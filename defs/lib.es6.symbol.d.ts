/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

interface Symbol {
    /** Returns a string representation of an object. */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): Object;

    [Symbol.toStringTag]: string;
}

interface SymbolConstructor {
    /**
      * A reference to the prototype.
      */
    prototype: Symbol;

    /**
      * Returns a new unique Symbol value.
      * @param  description Description of the new Symbol object.
      */
    (description?: string|number): symbol;

    /**
      * Returns a Symbol object from the global symbol registry matching the given key if found.
      * Otherwise, returns a new symbol with this key.
      * @param key key to search for.
      */
    for(key: string): symbol;

    /**
      * Returns a key from the global symbol registry matching the given Symbol if found.
      * Otherwise, returns a undefined.
      * @param sym Symbol to find the key for.
      */
    keyFor(sym: symbol): string;

    // Well-known Symbols

    /**
      * A method that determines if a constructor object recognizes an object as one of the
      * constructor’s instances. Called by the semantics of the instanceof operator.
      */
    hasInstance: symbol;

    /**
      * A Boolean value that if true indicates that an object should flatten to its array elements
      * by Array.prototype.concat.
      */
    isConcatSpreadable: symbol;

    /**
      * A method that returns the default iterator for an object. Called by the semantics of the
      * for-of statement.
      */
    iterator: symbol;

    /**
      * A regular expression method that matches the regular expression against a string. Called
      * by the String.prototype.match method.
      */
    match: symbol;

    /**
      * A regular expression method that replaces matched substrings of a string. Called by the
      * String.prototype.replace method.
      */
    replace: symbol;

    /**
      * A regular expression method that returns the index within a string that matches the
      * regular expression. Called by the String.prototype.search method.
      */
    search: symbol;

    /**
      * A function valued property that is the constructor function that is used to create
      * derived objects.
      */
    species: symbol;

    /**
      * A regular expression method that splits a string at the indices that match the regular
      * expression. Called by the String.prototype.split method.
      */
    split: symbol;

    /**
      * A method that converts an object to a corresponding primitive value.Called by the ToPrimitive
      * abstract operation.
      */
    toPrimitive: symbol;

    /**
      * A String value that is used in the creation of the default string description of an object.
      * Called by the built-in method Object.prototype.toString.
      */
    toStringTag: symbol;

    /**
      * An Object whose own property names are property names that are excluded from the with
      * environment bindings of the associated objects.
      */
    unscopables: symbol;
}

declare var Symbol: SymbolConstructor;
