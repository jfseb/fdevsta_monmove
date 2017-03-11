"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IMatch = require("./ifmatch");
exports.oKeyOrder = ["systemObjectCategory", "systemId", "systemObjectId"];
function compareMRuleFull(a, b) {
    var r = a.category.localeCompare(b.category);
    if (r) {
        return r;
    }
    r = a.type - b.type;
    if (r) {
        return r;
    }
    if (a.matchedString && b.matchedString) {
        r = a.matchedString.localeCompare(b.matchedString);
        if (r) {
            return r;
        }
    }
    if (a.word && b.word) {
        var r = a.word.localeCompare(b.word);
        if (r) {
            return r;
        }
    }
    r = (a._ranking || 1.0) - (b._ranking || 1.0);
    if (r) {
        return r;
    }
    if (a.exactOnly && !b.exactOnly) {
        return -1;
    }
    if (b.exactOnly && !a.exactOnly) {
        return +1;
    }
    return 0;
}
exports.compareMRuleFull = compareMRuleFull;
function cmpMRule(a, b) {
    var r = a.category.localeCompare(b.category);
    if (r) {
        return r;
    }
    r = a.type - b.type;
    if (r) {
        return r;
    }
    if (a.matchedString && b.matchedString) {
        r = a.matchedString.localeCompare(b.matchedString);
        if (r) {
            return r;
        }
    }
    if (a.word && b.word) {
        return a.word.localeCompare(b.word);
        /*
        if(r) {
          return r;
        }*/
    }
    r = (a._ranking || 1.0) - (b._ranking || 1.0);
    if (r) {
        return r;
    }
    return 0;
    /*
    if(a.exactOnly && !b.exactOnly) {
      return -1;
    }
    if(b.exactOnly && !a.exactOnly) {
      return +1;
    }*/
}
exports.cmpMRule = cmpMRule;
function assureLowerCaseWord(mRules) {
    return mRules.map(function (oRule) {
        if (oRule.type === 0 /* WORD */) {
            oRule.lowercaseword = oRule.word.toLowerCase();
        }
        return oRule;
    });
}
exports.assureLowerCaseWord = assureLowerCaseWord;

//# sourceMappingURL=rule.js.map
