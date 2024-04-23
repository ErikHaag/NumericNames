// Base Name Generator by Erik H

// declare all roots
// this will fill up with objects when getBestFactors is called
let factorArray = [];
factorArray["2"] = "root";
factorArray["3"] = "root";
factorArray["4"] = "root";
factorArray["5"] = "root";
factorArray["6"] = "root";
factorArray["7"] = "root";
factorArray["8"] = "root";
factorArray["9"] = "root";
factorArray["10"] = "root";
factorArray["11"] = "root";
factorArray["12"] = "root";
factorArray["13"] = "root";
factorArray["16"] = "root";
factorArray["17"] = "root";
factorArray["20"] = "root";
factorArray["36"] = "root";
factorArray["100"] = "root";

// predefine names so I don't need to create a specific cases for these
let numericNames = ["nullary", "unary"];
// ... and the same for abbreviations
let numericAbbreviation = ["nil", "uni"];

function getNumericName(num, suffix = true, first = true) {
    let neg = false;
    if (num < 0n) {
        neg = true;
        num *= -1n;
    }
    let key = num.toString();
    let component = "";
    if (first && suffix && numericNames[key]) {
        component = numericNames[key];
    } else {
        let factors = getBestFactors(num);
        if (factors == "root") {
            switch (num) {
                case 2n:
                    component = suffix ? "binary" : "bi";
                    break;
                case 3n:
                    component = suffix ? "trinary" : "tri";
                    break;
                case 4n:
                    component = suffix ? "quarternary" : "tetra";
                    break;
                case 5n:
                    component = suffix ? "quinary" : "penta"
                    break;
                case 6n:
                    component = suffix ? "seximal" : "hexa";
                    break;
                case 7n:
                    component = suffix ? "septimal" : "hepta";
                    break;
                case 8n:
                    component = suffix ? "octal" : "octa";
                    break;
                case 9n:
                    component = suffix ? "nonary" : "enna";
                    break;
                case 10n:
                    component = first ? "decimal" : suffix ? "gesimal" : "deca";
                    break;
                case 11n:
                    component = suffix ? "elevenary" : "leva";
                    break;
                case 12n:
                    component = suffix ? "dozenal" : "doza";
                    break;
                case 13n:
                    component = first ? "baker's dozenal" : suffix ? "ker's dozenal" : "baker";
                    break;
                case 16n:
                    component = suffix ? "hex" : "tesser";
                    break;
                case 17n:
                    component = suffix ? "suboptimal" : "mal";
                    break;
                case 20n:
                    component = suffix ? "vigesimal" : "icosi";``
                    break;
                case 36n:
                    component = suffix ? "niftimal" : "feta";
                    break;
                case 100n:
                    component = suffix ? "centesimal" : "hecto";
                    break;
            }
        } else {
            if (factors == "primeAboveRoot") {
                if (suffix) {
                    component = "un" + getNumericName(num - 1n, true, false);
                } else {
                    component = "hen" + getNumericName(num - 1n, false, false) + "sna";
                }
            } else if (factors.prime) {
                if (suffix) {
                    component = "un" + getNumericName(factors.left, false, false) + getNumericName(factors.right, true, false);
                } else {
                    component = "hen" + getNumericName(factors.left, false, false) + getNumericName(factors.right, false, false) + "sna";
                }
            } else {
                component = getNumericName(factors.left, false, false) + getNumericName(factors.right, suffix, false);
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
        }
        if (suffix && first && factors != "root") {
            numericNames[key] = component;
        }
    }
    if (neg) {
        if (/^[aeiou]/.test(component)) {
            component = "neg" + component;
        } else {
            component = "nega" + component;
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
    let key = num.toString();
    let component = "";
    if (numericAbbreviation[key]) {
        component = numericAbbreviation[key];
    } else {
        let factors = getBestFactors(num);
        if (factors == "root") {
            switch (num) {
                case 2n:
                    component = "b";
                    break;
                case 3n:
                    component = "t";
                    break;
                case 4n:
                    component = "T";
                    break;
                case 5n:
                    component = "p";
                    break;
                case 6n:
                    component = "h";
                    break;
                case 7n:
                    component = "s";
                    break;
                case 8n:
                    component = "o";
                    break;
                case 9n:
                    component = "n";
                    break;
                case 10n:
                    component = "d";
                    break;
                case 11n:
                    component = "l";
                    break;
                case 12n:
                    component = "D";
                    break;
                case 13n:
                    component = "B";
                    break;
                case 16n:
                    component = "x";
                    break;
                case 17n:
                    component = "S";
                    break;
                case 20n:
                    component = "i";
                    break;
                case 36n:
                    component = "f";
                    break;
                case 100n:
                    component = "c";
                    break;
            }
        } else {
            if (factors == "primeAboveRoot") {
                component = "[" + getNumericAbbreviation(num - 1n) + "]";
            } else if (factors.prime) {
                component = "[" + getNumericAbbreviation(factors.left) + getNumericAbbreviation(factors.right) + "]";
            } else {
                component = getNumericAbbreviation(factors.left) + getNumericAbbreviation(factors.right);
            }
        }
        if (factors != "root") {
            numericAbbreviation[key] = component;
        }
    }
    if (neg) {
        component = "-"+component;
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
    pow = 1n;
    while (pow < int) {
        pow *= 10n;
        digits++;
    }
    digits /= 2n;
    // alternate add and subtracting decreasing powers of 10
    let inc = true;
    var i = 0n;
    for (let j = digits; j >= 0n; j--) {
        pow /= 10n;
        if (inc) {
            for (; i * i <= int; i += pow) { }
        } else {
            for (; i * i > int; i -= pow) { }
        }
        inc = !inc;
    }
    if (i * i > int) i--;
    // go through each integer and yield factors
    for (; i >= 1n; i--) {
        if (int % i == 0n) yield i;
    }
}