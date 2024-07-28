// Base Name Generator by Erik H
let initialRoots = [
    { int: 0n, abbr: "nul", alone: "null", postfix: "ary" },
    { int: 1n, abbr: "uni", alone: "uni", postfix: "nary" },
    { int: 2n, abbr: "b", alone: "bin", prefix: "bi", infix: "bin", postfix: "ary" },
    { int: 3n, abbr: "t", alone: "tri", prefix: "tri", infix: "tri", postfix: "ary" },
    { int: 4n, abbr: "T", alone: "quatern", prefix: "tetra", infix: "quatern", postfix: "ary" },
    { int: 5n, abbr: "p", alone: "quin", prefix: "penta", infix: "quin", postfix: "ary" },
    { int: 6n, abbr: "h", alone: "sex", prefix: "hexa", infix: "sex", postfix: "imal" },
    { int: 7n, abbr: "s", alone: "sept", prefix: "hepta", infix: "sept", postfix: "imal" },
    { int: 8n, abbr: "o", alone: "oct", prefix: "octa", infix: "oct", postfix: "al" },
    { int: 9n, abbr: "n", alone: "non", prefix: "enna", infix: "non", postfix: "ary" },
    { int: 10n, abbr: "d", alone: "dec", prefix: "deca", infix: "ges", postfix: "imal" },
    { int: 11n, abbr: "l", alone: "eleven", prefix: "leva", infix: "eleven", postfix: "ary" },
    { int: 12n, abbr: "D", alone: "dozen", prefix: "doza", infix: "doza", postfix: "al" },
    { int: 13n, abbr: "B", alone: "baker's dozen", prefix: "baker", infix: "ker's dozen", postfix: "al" },
    { int: 16n, abbr: "x", alone: "hex", prefix: "tesser", infix: "hex", postfix: "" },
    { int: 17n, abbr: "S", alone: "suboptim", prefix: "mal", infix: "suboptim", postfix: "al" },
    { int: 20n, abbr: "i", alone: "viges", prefix: "icosi", infix: "viges", postfix: "imal" },
    { int: 36n, abbr: "f", alone: "nift", prefix: "feta", infix: "nift", postfix: "imal" },
    { int: 100n, abbr: "c", alone: "centes", prefix: "hecto", infix: "centes", postfix: "imal" }
];

let factorArray, rootInts;

function resetNumericNames() {
    // declare all roots
    // this will fill up with objects when getBestFactors is called
    factorArray = [];
    for (let root of initialRoots) {
        factorArray[root.int] = "root";
    }
    rootInts = initialRoots.map((r) => r.int);
}

resetNumericNames();

function intIndexOf(array, value) {
    let index = -1n;
    for (let i in array) {
        if (array[i] === value) {
            index = BigInt(i);
            break;
        }
    }
    return index;
}

function getNumericName(num, postfixed = true, infix = true, first = true) {
    let neg = false;
    if (num < 0n) {
        neg = true;
        num *= -1n;
    }
    let component = "";
    let factors = getBestFactors(num);
    if (factors == "root") {
        let index = intIndexOf(rootInts, num);
        if (first) {
            component = initialRoots[index].alone;
        } else if (infix) {
            component = initialRoots[index].infix;
        }else {
            component = initialRoots[index].prefix;
        }
        if (postfixed && (first || infix)) {
            component += initialRoots[index].postfix;
        }
    } else {
        if (factors == "primeAboveRoot") {
            if (infix) {
                component = "un" + getNumericName(num - 1n, postfixed, true, false);
            } else {
                component = "hen" + getNumericName(num - 1n, postfixed, false, false) + "sna";
            }
        } else if (factors.prime) {
            if (infix) {
                component = "un" + getNumericName(factors.left, false, false, false) + getNumericName(factors.right, postfixed, true, false);
            } else {
                component = "hen" + getNumericName(factors.left, false, false, false) + getNumericName(factors.right, false, false, false) + "sna";
            }
        } else {
            component = getNumericName(factors.left, false, false, false) + getNumericName(factors.right, postfixed, infix, false);
        }
    }
    if (first) {
        let index = -1;
        while ((index = component.search(/[ao][aeiou]/g)) != -1) {
            component = component.substring(0, index) + component.substring(index + 1);
        }
        while ((index = component.search(/[i][iu]/g)) != -1) {
            component = component.substring(0, index + 1) + component.substring(index + 2);
        }
        if (neg) {
            if (/^[aeiou]/.test(component)) {
                component = "neg" + component;
            } else {
                component = "nega" + component;
            }
        }
    }
    return component;
}

function getNumericAbbreviation(num) {
    let neg = false;
    if (num < 0n) {
        neg = true;
        num *= -1n;
    }
    let component = "";
    let factors = getBestFactors(num);
    if (factors == "root") {
        let index = intIndexOf(rootInts, num);
        component = initialRoots[index].abbr;
    } else {
        if (factors == "primeAboveRoot") {
            component = "[" + getNumericAbbreviation(num - 1n) + "]";
        } else if (factors.prime) {
            component = "[" + getNumericAbbreviation(factors.left) + getNumericAbbreviation(factors.right) + "]";
        } else {
            component = getNumericAbbreviation(factors.left) + getNumericAbbreviation(factors.right);
        }
    }
    if (neg) {
        component = "-" + component;
    }
    return component;
}

// get the best factor pair that minimizes root count, the root count is < doBetterThan, and whose difference is minimal
function getBestFactors(num, doBetterThan = -1n) {
    let key = num.toString();
    let br = -1n;
    let brc = (doBetterThan <= -2n) ? -1n : doBetterThan;
    if (factorArray[key]) {
        // skip idempotent work
        if (factorArray[key]?.rootMinimum === undefined) {
            // if best already found, return it
            return factorArray[key];
        } else if (brc != -1n && factorArray[key].rootMinimum >= doBetterThan) {
            // if best not found, but less strictly than now, run out of factors immediately
            return "runOut";
        }
    }
    // if not root, can't do better than 1 root, so run out of factors immediately
    if (brc == 1n || brc == 2n) return "runOut";
    let isFirstFactor = true;
    const factorsGenerator = factorsOf(num);
    for (const factor of factorsGenerator) {
        if (factor == 1n) {
            if (isFirstFactor) {
                // if it's prime
                let returnVal = structuredClone(getBestFactors(num - 1n));
                if (returnVal == "root") {
                    // special case for 36 and 100
                    returnVal = "primeAboveRoot";
                } else {
                    returnVal.prime = true;
                }
                factorArray[key] = returnVal;
                return returnVal;
            }
            if (br == -1n) {
                // if no factor that exceeded expectations was found
                // increase the minimum root requirement
                factorArray[key] = { rootMinimum: doBetterThan };
                return "runOut";
            }
            break;
        }
        isFirstFactor = false;
        // get the best factors of factor
        let lbf = getBestFactors(factor, brc - 1n);
        // if things went poorly, continue to next factor
        if (lbf == "runOut") continue;
        // deal with roots not needing to be factored
        if (lbf == "root" || lbf == "primeAboveRoot") {
            lbf = { rootCount: 1n };
        }
        if (brc != -1n && lbf.rootCount >= brc) continue; //ignore if definitely worse
        // repeat with other factor
        let rbf = getBestFactors(num / factor, brc - lbf.rootCount);
        if (rbf == "runOut") continue;
        if (rbf == "root" || rbf == "primeAboveRoot") {
            rbf = { rootCount: 1n };
        }
        if (lbf.rootCount + rbf.rootCount < brc || brc == -1n) {
            // if best roots are found
            br = factor;
            brc = lbf.rootCount + rbf.rootCount;
            if (brc == 2n) break; //escape early in best case
        }
    }
    // assign results to list and return
    let returnVal = { rootCount: brc, left: br, right: num / br, prime: false };
    factorArray[key] = returnVal;
    return returnVal;
}
// yields the factors of int from 1 to sqrt(int) in decending order
// ie. 400n -> 20n, 16n, 10n, 8n, 6n, 5n, 4n, 2n, 1n
function* factorsOf(int) {
    // take log_10(sqrt(int)) "quickly"
    let digits = 0n;
    let pow = 1n;
    while (pow < int) {
        pow *= 10n;
        digits++;
    }
    digits /= 2n;
    // alternate add and subtracting decreasing powers of 10
    let inc = true;
    var i = 0n;
    for (let j = digits; j >= 0n; j--) {
        let p = 10n ** j;
        if (inc) {
            for (; i * i <= int; i += p) { }
        } else {
            for (; i * i > int; i -= p) { }
        }
        inc = !inc;
    }
    if (i * i > int) i--;
    // go through each integer and yield factors
    for (; i >= 1n; i--) {
        if (int % i == 0n) yield i;
    }
}