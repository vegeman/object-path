const _ = require('lodash')

function findPropPaths(obj, predicate) {  // The function 
    const discoveredObjects = []; // For checking for cyclic object
    const path = [];    // The current path being searched
    const results = []; // The array of paths that satify the predicate === true
    let pathName
    if (!obj && (typeof obj !== "object" || Array.isArray(obj))) {
        throw new TypeError("First argument of finPropPath is not the correct type Object");
    }
    if (typeof predicate !== "function") {
        throw new TypeError("Predicate is not a function");
    }
    (function find(obj) {
        for (const key of Object.keys(obj)) {  // use only enumrable own properties.
            if (predicate(key, path, obj) === true) {     // Found a path
                pathName = ""
                path.push(key);                // push the key
                _.forEach(path, (v,i)=> pathName = pathName.concat("[\'"+v+"\']"))
                results.push(pathName);  // Add the found path to results
                path.pop();                    // remove the key.
            }
            const o = obj[key];                 // The next object to be searched
            if (o && _.size(o) && ! _.isString(o)) {   // check for null then type object
                if (! discoveredObjects.find(obj => obj === o)) {  // check for cyclic link
                    path.push(key);
                    discoveredObjects.push(o);
                    find(o);
                    path.pop();
                }
            }
        }
    } (obj));
    return results;
}

const myObj = {x:1,y:2,z:{x:3,y:[{x:4},{y:5}]}}
// myObj.f = myObj;

// find all paths to property name "x"
const arrayOfPaths = findPropPaths(myObj, key => key === "x");
console.log("All unique paths to 'x'");
console.log(arrayOfPaths)
// arrayOfPaths.forEach(path => console.log(path));