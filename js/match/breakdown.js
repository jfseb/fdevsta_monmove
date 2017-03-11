/**
 * @file
 * @module jfseb.fdevstart.breakdown
 * @copyright (c) 2016 Gerd Forstmann
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debug = require("debug");
var debuglog = debug('breakdown');
function cleanseString(sString) {
    var len = 0;
    while (len !== sString.length) {
        len = sString.length;
        sString = sString.replace(/\s+/g, ' ');
        sString = sString.replace(/^\s+/, '');
        sString = sString.replace(/\s+$/, '');
        sString = sString.replace(/^[,;.]+/, '');
        sString = sString.replace(/[,;.]+$/, '');
    }
    return sString;
}
exports.cleanseString = cleanseString;
function cleanseStringLeaveDots(sString) {
    var len = 0;
    while (len !== sString.length) {
        len = sString.length;
        sString = sString.replace(/\s+/g, ' ');
        sString = sString.replace(/^\s+/, '');
        sString = sString.replace(/\s+$/, '');
        sString = sString.replace(/^[,;!?]+/, '');
        sString = sString.replace(/[,;!?]+$/, '');
    }
    return sString;
}
exports.cleanseStringLeaveDots = cleanseStringLeaveDots;
function cleanseQuotedString(sString) {
    var len = 0;
    while (len !== sString.length) {
        len = sString.length;
        sString = sString.replace(/\s\s+/g, ' ');
        sString = sString.replace(/\s+/g, ' ');
        sString = sString.replace(/^\s+/, '');
        sString = sString.replace(/\s+$/, '');
        sString = sString.replace(/^[,;.]+/, '');
        sString = sString.replace(/[,;.]+$/, '');
    }
    return sString;
}
exports.cleanseQuotedString = cleanseQuotedString;
var regexpRemoveDouble = new RegExp(/^\"(\".*\")\"$/);
var striptail = new RegExp(/^\"([^\"]+)"$/);
function trimQuoted(sString) {
    var skipUntil = 0;
    var stripped = sString;
    var m = regexpRemoveDouble.exec(sString);
    while (m) {
        stripped = m[1];
        m = regexpRemoveDouble.exec(stripped);
    }
    debuglog("stripped " + stripped);
    m = striptail.exec(stripped);
    if (m) {
        return m[1];
    }
    return cleanseString(sString);
}
exports.trimQuoted = trimQuoted;
function trimQuotedSpaced(sString) {
    var skipUntil = 0;
    sString = sString.replace(/^"\s+/g, '"');
    sString = sString.replace(/\s+\"$/g, '"');
    return sString;
}
exports.trimQuotedSpaced = trimQuotedSpaced;
function recombineQuoted(aArr) {
    var skipUntil = 0;
    aArr = aArr.map(function (s, index) {
        if (index < skipUntil) {
            debuglog("skipping >" + s + "<");
            return undefined;
        }
        if (/^"/.exec(s)) {
            var i = index;
            while (i < aArr.length && (!/"$/.exec(aArr[i]) || (index === i && s === '"'))) {
                i = i + 1;
            }
            if (i === aArr.length) {
                debuglog("Unterminated quoted string");
                return s;
            }
            else {
                skipUntil = i + 1;
                var res = aArr.slice(index, i + 1).join(" ");
            }
            return res;
        }
        return s;
    }).filter(function (s) {
        return s !== undefined;
    }).map(function (s) {
        return trimQuotedSpaced(s);
    });
    return aArr;
}
exports.recombineQuoted = recombineQuoted;
function isQuoted(sString) {
    return !!/^".*"$/.exec(sString);
}
exports.isQuoted = isQuoted;
function countSpaces(sString) {
    var r = 0;
    for (var i = 0; i < sString.length; ++i) {
        if (sString.charAt(i) === ' ') {
            r = r + 1;
        }
    }
    return r;
}
exports.countSpaces = countSpaces;
var Quotes = /^"([^"]+)"/;
function swallowQuote(str, i) {
    var m = Quotes.exec(str.substring(i));
    if (!m) {
        return { token: undefined,
            nextpos: i
        };
    }
    return {
        token: cleanseStringLeaveDots(m[1]),
        nextpos: (i + m[0].length)
    };
}
exports.swallowQuote = swallowQuote;
var Word2 = /^([.]?([-#A-Z_a-z0-9\/\\\%\$&]([\'.][-#A-Z_a-z0-9\/\\\%\$&])*)+)/;
var Word = /^(([^.,;\'\"]|(\.[^ ,;\'\"]))([^. ,;?!\"']|(\.[^ ,;?!\"'])|(\'[^. ,;?!\"\'])*)+)/;
function swallowWord(str, i) {
    var m = Word.exec(str.substring(i));
    if (!m) {
        return { token: undefined,
            nextpos: i
        };
    }
    return {
        token: m[1],
        nextpos: (i + m[0].length)
    };
}
exports.swallowWord = swallowWord;
function pushToken(res, token) {
    res.tokens.push(token);
    res.fusable[res.tokens.length] = true;
}
/**
 * Returns true iff tokenized represents multiple words, which
 * can potenially be added together;
 */
function isCombinableSplit(tokenized) {
    if (tokenized.tokens.length <= 1) {
        return false;
    }
    for (var i = 1; i < tokenized.tokens.length; ++i) {
        if (!tokenized.fusable[i]) {
            return false;
        }
    }
    return true;
}
exports.isCombinableSplit = isCombinableSplit;
/**
 * return true iff  range @ index is a suitable combinable overlap
 *
 * (typically in the parsed real string)
 * return the targetindex or -1 if impossible
 */
function isCombinableRangeReturnIndex(range, fusable, index) {
    var start = index + range.low;
    var end = index + range.high;
    // example range = -1, 0             index = 1  => start = 0, end = 1, test fusable[1]
    for (var i = start; i < end; ++i) {
        if (!fusable[i + 1]) {
            return -1;
        }
    }
    return start;
}
exports.isCombinableRangeReturnIndex = isCombinableRangeReturnIndex;
function combineTokens(range, index, tokens) {
    var start = index + range.low;
    var end = index + range.high;
    var res = [];
    for (var i = start; i <= end; ++i) {
        res.push(tokens[i]);
    }
    return res.join(" ");
}
exports.combineTokens = combineTokens;
/**
 *
 * Note: this tokenizer recognized .gitigore or .a.b.c as one token
 * trailing . is stripped!
 *@param {string} sString , e.g. "a,b c;d O'Hara and "murph'ys"
 *@return {Array<String>} broken down array, e.g.
 * [["a b c"], ["a", "b c"], ["a b", "c"], ....["a", "b", "c"]]
 */
function tokenizeString(sString, spacesLimit) {
    var res = {
        tokens: [],
        fusable: [false]
    };
    var i = 0;
    var seenSep = false;
    while (i < sString.length) {
        switch (sString.charAt(i)) {
            case '"':
                var _a = swallowQuote(sString, i), token = _a.token, nextpos = _a.nextpos;
                if (nextpos === i) {
                    // unterminated quote, treat like separator
                    res.fusable[res.tokens.length] = false;
                    seenSep = true;
                    ++i;
                }
                else if (token === "") {
                    res.fusable[res.tokens.length] = false;
                    seenSep = true;
                    i = nextpos;
                }
                else {
                    res.fusable[res.tokens.length] = false;
                    pushToken(res, token);
                    res.fusable[res.tokens.length] = false;
                    i = nextpos;
                }
                break;
            case '\t':
            case '\n':
            case '\r':
            case ' ':
                i++;
                break;
            case ':':
            case ',':
            case '?':
            case '!':
            case ';':
                res.fusable[res.tokens.length] = false;
                seenSep = true;
                ++i;
                break;
            case '.':
            default:
                var _b = swallowWord(sString, i), token = _b.token, nextpos = _b.nextpos;
                if (token) {
                    pushToken(res, token);
                    i = nextpos;
                }
                else {
                    res.fusable[res.tokens.length] = false;
                    i++;
                }
                break;
        }
    }
    res.fusable[res.tokens.length] = false;
    return res;
}
exports.tokenizeString = tokenizeString;
function makeMatchPattern(str) {
    var tokens = tokenizeString(str);
    var bestlen = 0;
    if (!isCombinableSplit(tokens)) {
        return undefined;
    }
    var best = {
        longestToken: "",
        span: { low: 0, high: 0 }
    };
    if (tokens.tokens.length > 1) {
        tokens.tokens.forEach(function (token, index) {
            var len = token.length;
            if (len > bestlen) {
                bestlen = len;
                best.longestToken = token;
                best.span.low = -index;
            }
        });
        best.span.high = tokens.tokens.length + best.span.low - 1;
        return best;
    }
    return undefined;
}
exports.makeMatchPattern = makeMatchPattern;
/**
 *@param {string} sString , e.g. "a b c"
 *@return {Array<Array<String>>} broken down array, e.g.
 *[["a b c"], ["a", "b c"], ["a b", "c"], ....["a", "b", "c"]]
 */
function breakdownString(sString, spacesLimit) {
    var rString = cleanseString(sString);
    if (spacesLimit === undefined) {
        spacesLimit = -1;
    }
    var u = rString.split(" ");
    u = recombineQuoted(u);
    var k = 0;
    if (u.length === 0) {
        return [[]];
    }
    var w = [[u[0]]];
    while (k < u.length - 1) {
        k = k + 1;
        var r1 = w.map(function (entry) {
            //  debuglog(debuglog.enabled ? JSON.stringify(entry): "-");
            var entry = entry.slice(0);
            //  debuglog(debuglog.enabled ? JSON.stringify(entry): "-");
            var preventry = entry[entry.length - 1];
            // do not combine quoted strings!
            if (preventry === null) {
                /* do nothing */ //return entry;
            }
            else if (isQuoted(u[k]) || isQuoted(preventry)) {
                entry[entry.length - 1] = null;
            }
            else {
                var combined = preventry + " " + u[k];
                if (spacesLimit > 0 && countSpaces(combined) > spacesLimit) {
                    combined = null;
                }
                entry[entry.length - 1] = combined;
            }
            return entry;
        });
        var r2 = w.map(function (entry) {
            //   debuglog(debuglog.enabled ? ("2 >" + JSON.stringify(entry)) : "-");
            var entry = entry.slice(0);
            entry.push(u[k]);
            return entry;
        });
        //debuglog(JSON.stringify(r1));
        //debuglog(JSON.stringify(r2));
        w = r1.concat(r2);
    }
    w = w.filter(function (oMap) {
        return oMap.every(function (sWord) {
            return sWord !== null;
        });
    });
    return w.map(function (oMap) {
        return oMap.map(function (sWord) {
            return trimQuoted(sWord);
        });
    });
}
exports.breakdownString = breakdownString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWtkb3duLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21hdGNoL2JyZWFrZG93bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHOzs7QUFFSCw2QkFBK0I7QUFDL0IsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBTW5DLHVCQUE4QixPQUFlO0lBQ3pDLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNaLE9BQU8sR0FBRyxLQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM1QixHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNyQixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN0QyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDekMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFBO0FBQ2xCLENBQUM7QUFYRCxzQ0FXQztBQUVELGdDQUF1QyxPQUFlO0lBQ2xELElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNaLE9BQU8sR0FBRyxLQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM1QixHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNyQixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxP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