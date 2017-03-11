

import * as IMatch from './ifmatch';

import * as Model from '../model/model';


export const oKeyOrder: Array<String> = ["systemObjectCategory", "systemId", "systemObjectId"];




export function compareMRuleFull(a: IMatch.mRule, b: IMatch.mRule) {
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
    if(r) {
      return r;
    }
  }
  r = (a._ranking || 1.0) - (b._ranking || 1.0);
  if(r) {
    return r;
  }
  if(a.exactOnly && !b.exactOnly) {
    return -1;
  }
  if(b.exactOnly && !a.exactOnly) {
    return +1;
  }
  return 0;
}

export function cmpMRule(a: IMatch.mRule, b: IMatch.mRule) {
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
  if(r) {
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




export function assureLowerCaseWord(mRules: Array<IMatch.mRule>) {
  return mRules.map(function (oRule) {
    if (oRule.type === IMatch.EnumRuleType.WORD) {
      oRule.lowercaseword = oRule.word.toLowerCase();
    }
    return oRule;
  });
}

