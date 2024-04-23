# Description
Generate base names using Jan Misali's system!
Factor, Name, and Abbreviation calculations are done once when requested, then stored in a list for future look up.
Abbreviations are done in a more sensible substitution that is already unique, rather than a small unique and unhelpful subset of the name.
# Abbreviation meaning
- nul is nullary
- uni is uninary 
- \- is negative
- \[n\] is n + 1 and is prime
- b is times 2 (**b**i)
- t is times 3 (**t**ri)
- T is times 4 (**t**etra)
- p is times 5 (**p**enta)
- h is times 6 (**h**exa)
- s is times 7 (**s**epta)
- o is times 8 (**o**cta)
- n is times 9 (**n**ona)
- d is times 10 (**d**eca)
- l is time 11 (**l**eva)
- D is times 12 (**d**ozen)
- B is times 13 (**b**aker)
- x is times 16 (he**x**)
- S is times 17 (**s**ubopt)
- f is times 36 (ni**f**t)
- c is times 100 (**c**entes)
# Functions
```javascript
getNumericName(19n); // "untriseximal"
getNumericName(19n, false); // "hentrihexasna"
getNumericAbbreviation(19n); // "[th]"
```