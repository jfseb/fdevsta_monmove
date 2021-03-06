/**
 * Functionality managing the match models
 *
 * @file
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as intf from 'constants';
var debug = require("debug");
var debuglog = debug('model');
//const loadlog = logger.logger('modelload', '');
var IMatch = require("../match/ifmatch");
var InputFilterRules = require("../match/rule");
//import * as Tools from '../match/tools';
var fs = require("fs");
var Meta = require("./meta");
var Utils = require("abot_utils");
var CircularSer = require("abot_utils");
var Distance = require("abot_stringdist");
var process = require("process");
var _ = require("lodash");
/**
 * the model path, may be controlled via environment variable
 */
var envModelPath = process.env["ABOT_MODELPATH"] || "node_modules/abot_testmodel/testmodel";
function cmpTools(a, b) {
    return a.name.localeCompare(b.name);
}
exports.cmpTools = cmpTools;
var ARR_MODEL_PROPERTIES = ["domain", "bitindex", "defaultkeycolumn", "defaulturi", "categoryDescribed", "columns", "description", "tool", "toolhidden", "synonyms", "category", "wordindex", "exactmatch", "hidden"];
function addSynonyms(synonyms, category, synonymFor, bitindex, bitSentenceAnd, wordType, mRules, seen) {
    synonyms.forEach(function (syn) {
        var oRule = {
            category: category,
            matchedString: synonymFor,
            type: IMatch.EnumRuleType.WORD,
            word: syn,
            bitindex: bitindex,
            bitSentenceAnd: bitSentenceAnd,
            wordType: wordType,
            _ranking: 0.95
        };
        debuglog(debuglog.enabled ? ("inserting synonym" + JSON.stringify(oRule)) : '-');
        insertRuleIfNotPresent(mRules, oRule, seen);
    });
}
function getRuleKey(rule) {
    var r1 = rule.matchedString + "-|-" + rule.category + " -|- " + rule.type + " -|- " + rule.word + " " + rule.bitindex + " " + rule.wordType;
    if (rule.range) {
        var r2 = getRuleKey(rule.range.rule);
        r1 += " -|- " + rule.range.low + "/" + rule.range.high + " -|- " + r2;
    }
    return r1;
}
var Breakdown = require("../match/breakdown");
/* given a rule which represents a word sequence which is split during tokenization */
function addBestSplit(mRules, rule, seenRules) {
    //if(!global_AddSplits) {
    //    return;
    //}
    if (rule.type !== IMatch.EnumRuleType.WORD) {
        return;
    }
    var best = Breakdown.makeMatchPattern(rule.lowercaseword);
    if (!best) {
        return;
    }
    var newRule = {
        category: rule.category,
        matchedString: rule.matchedString,
        bitindex: rule.bitindex,
        bitSentenceAnd: rule.bitindex,
        wordType: rule.wordType,
        word: best.longestToken,
        type: 0,
        lowercaseword: best.longestToken,
        _ranking: 0.95,
        //    exactOnly : rule.exactOnly,
        range: best.span
    };
    if (rule.exactOnly) {
        newRule.exactOnly = rule.exactOnly;
    }
    ;
    newRule.range.rule = rule;
    insertRuleIfNotPresent(mRules, newRule, seenRules);
}
exports.addBestSplit = addBestSplit;
function insertRuleIfNotPresent(mRules, rule, seenRules) {
    if (rule.type !== IMatch.EnumRuleType.WORD) {
        mRules.push(rule);
        return;
    }
    if ((rule.word === undefined) || (rule.matchedString === undefined)) {
        throw new Error('illegal rule' + JSON.stringify(rule, undefined, 2));
    }
    var r = getRuleKey(rule);
    /* if( (rule.word === "service" || rule.word=== "services") && r.indexOf('OData') >= 0) {
         console.log("rulekey is" + r);
         console.log("presence is " + JSON.stringify(seenRules[r]));
     }*/
    rule.lowercaseword = rule.word.toLowerCase();
    if (seenRules[r]) {
        debuglog(debuglog.enabled ? ("Attempting to insert duplicate" + JSON.stringify(rule, undefined, 2)) : "-");
        var duplicates = seenRules[r].filter(function (oEntry) {
            return 0 === InputFilterRules.compareMRuleFull(oEntry, rule);
        });
        if (duplicates.length > 0) {
            return;
        }
    }
    seenRules[r] = (seenRules[r] || []);
    seenRules[r].push(rule);
    if (rule.word === "") {
        debuglog(debuglog.enabled ? ('Skipping rule with emtpy word ' + JSON.stringify(rule, undefined, 2)) : '-');
        //g('Skipping rule with emtpy word ' + JSON.stringify(rule, undefined, 2));
        return;
    }
    mRules.push(rule);
    addBestSplit(mRules, rule, seenRules);
    return;
}
function readFileAsJSON(filename) {
    var data = fs.readFileSync(filename, 'utf-8');
    try {
        return JSON.parse(data);
    }
    catch (e) {
        console.log("Content of file " + filename + " is no json" + e);
        process.exit(-1);
    }
    return undefined;
}
function loadModelData(modelPath, oMdl, sModelName, oModel) {
    // read the data ->
    // data is processed into mRules directly,
    var bitindex = oMdl.bitindex;
    var sFileName = ('./' + modelPath + '/' + sModelName + ".data.json");
    var oMdlData = readFileAsJSON(sFileName);
    oMdlData.forEach(function (oEntry) {
        if (!oEntry.domain) {
            oEntry._domain = oMdl.domain;
        }
        if (!oEntry.tool && oMdl.tool.name) {
            oEntry.tool = oMdl.tool.name;
        }
        oModel.records.push(oEntry);
        oMdl.category.forEach(function (cat) {
            if (oEntry[cat] === 'undefined') {
                oEntry[cat] = "n/a";
                var bug = "INCONSISTENT*> ModelData " + sFileName + " does not contain category " + cat + " with value 'undefined', undefined is illegal value, use n/a " + JSON.stringify(oEntry) + "";
                debuglog(bug);
                //console.log(bug);
                //process.exit(-1);
            }
        });
        oMdl.wordindex.forEach(function (category) {
            if (oEntry[category] === undefined) {
                debuglog("INCONSISTENT*> ModelData " + sFileName + " does not contain category " + category + " of wordindex" + JSON.stringify(oEntry) + "");
                return;
            }
            if (oEntry[category] !== "*") {
                var sString = oEntry[category];
                debuglog("pushing rule with " + category + " -> " + sString);
                var oRule = {
                    category: category,
                    matchedString: sString,
                    type: IMatch.EnumRuleType.WORD,
                    word: sString,
                    bitindex: bitindex,
                    bitSentenceAnd: bitindex,
                    wordType: IMatch.WORDTYPE.FACT,
                    _ranking: 0.95
                };
                if (oMdl.exactmatch && oMdl.exactmatch.indexOf(category) >= 0) {
                    oRule.exactOnly = true;
                }
                insertRuleIfNotPresent(oModel.mRules, oRule, oModel.seenRules);
                if (oMdlData.synonyms && oMdlData.synonyms[category]) {
                    throw new Error("how can this happen?");
                    //addSynonyms(oMdlData.synonyms[category], category, sString, bitindex, bitindex, "X", oModel.mRules, oModel.seenRules);
                }
                // a synonym for a FACT
                if (oEntry.synonyms && oEntry.synonyms[category]) {
                    addSynonyms(oEntry.synonyms[category], category, sString, bitindex, bitindex, IMatch.WORDTYPE.FACT, oModel.mRules, oModel.seenRules);
                }
            }
        });
    });
}
function loadModel(modelPath, sModelName, oModel) {
    debuglog(" loading " + sModelName + " ....");
    var oMdl = readFileAsJSON('./' + modelPath + '/' + sModelName + ".model.json");
    mergeModelJson(sModelName, oMdl, oModel);
    loadModelData(modelPath, oMdl, sModelName, oModel);
}
function getAllDomainsBitIndex(oModel) {
    var len = oModel.domains.length;
    var res = 0;
    for (var i = 0; i < len; ++i) {
        res = res << 1;
        res = res | 0x0001;
    }
    return res;
}
exports.getAllDomainsBitIndex = getAllDomainsBitIndex;
function getDomainBitIndex(domain, oModel) {
    var index = oModel.domains.indexOf(domain);
    if (index < 0) {
        index = oModel.domains.length;
    }
    if (index >= 32) {
        throw new Error("too many domain for single 32 bit index");
    }
    return 0x0001 << index;
}
exports.getDomainBitIndex = getDomainBitIndex;
function mergeModelJson(sModelName, oMdl, oModel) {
    var categoryDescribedMap = {};
    oMdl.bitindex = getDomainBitIndex(oMdl.domain, oModel);
    oMdl.categoryDescribed = [];
    // rectify category
    oMdl.category = oMdl.category.map(function (cat) {
        if (typeof cat === "string") {
            return cat;
        }
        if (typeof cat.name !== "string") {
            console.log("Missing name in object typed category in " + JSON.stringify(cat) + " in model " + sModelName);
            process.exit(-1);
            //throw new Error('Domain ' + oMdl.domain + ' already loaded while loading ' + sModelName + '?');
        }
        categoryDescribedMap[cat.name] = cat;
        oMdl.categoryDescribed.push(cat);
        return cat.name;
    });
    // add the categories to the model:
    oMdl.category.forEach(function (category) {
        insertRuleIfNotPresent(oModel.mRules, {
            category: "category",
            matchedString: category,
            type: IMatch.EnumRuleType.WORD,
            word: category,
            lowercaseword: category.toLowerCase(),
            bitindex: oMdl.bitindex,
            wordType: IMatch.WORDTYPE.CATEGORY,
            bitSentenceAnd: oMdl.bitindex,
            _ranking: 0.95
        }, oModel.seenRules);
    });
    if (oModel.domains.indexOf(oMdl.domain) >= 0) {
        debuglog("***********here mdl" + JSON.stringify(oMdl, undefined, 2));
        throw new Error('Domain ' + oMdl.domain + ' already loaded while loading ' + sModelName + '?');
    }
    // check properties of model
    Object.keys(oMdl).sort().forEach(function (sProperty) {
        if (ARR_MODEL_PROPERTIES.indexOf(sProperty) < 0) {
            throw new Error('Model property "' + sProperty + '" not a known model property in model of domain ' + oMdl.domain + ' ');
        }
    });
    // consider streamlining the categories
    oModel.rawModels[oMdl.domain] = oMdl;
    oModel.full.domain[oMdl.domain] = {
        description: oMdl.description,
        categories: categoryDescribedMap,
        bitindex: oMdl.bitindex
    };
    // check that
    // check that members of wordindex are in categories,
    oMdl.wordindex = oMdl.wordindex || [];
    oMdl.wordindex.forEach(function (sWordIndex) {
        if (oMdl.category.indexOf(sWordIndex) < 0) {
            throw new Error('Model wordindex "' + sWordIndex + '" not a category of domain ' + oMdl.domain + ' ');
        }
    });
    oMdl.exactmatch = oMdl.exactmatch || [];
    oMdl.exactmatch.forEach(function (sExactMatch) {
        if (oMdl.category.indexOf(sExactMatch) < 0) {
            throw new Error('Model exactmatch "' + sExactMatch + '" not a category of domain ' + oMdl.domain + ' ');
        }
    });
    oMdl.columns = oMdl.columns || [];
    oMdl.columns.forEach(function (sExactMatch) {
        if (oMdl.category.indexOf(sExactMatch) < 0) {
            throw new Error('Model column "' + sExactMatch + '" not a category of domain ' + oMdl.domain + ' ');
        }
    });
    // add relation domain -> category
    var domainStr = MetaF.Domain(oMdl.domain).toFullString();
    var relationStr = MetaF.Relation(Meta.RELATION_hasCategory).toFullString();
    var reverseRelationStr = MetaF.Relation(Meta.RELATION_isCategoryOf).toFullString();
    oMdl.category.forEach(function (sCategory) {
        var CategoryString = MetaF.Category(sCategory).toFullString();
        oModel.meta.t3[domainStr] = oModel.meta.t3[domainStr] || {};
        oModel.meta.t3[domainStr][relationStr] = oModel.meta.t3[domainStr][relationStr] || {};
        oModel.meta.t3[domainStr][relationStr][CategoryString] = {};
        oModel.meta.t3[CategoryString] = oModel.meta.t3[CategoryString] || {};
        oModel.meta.t3[CategoryString][reverseRelationStr] = oModel.meta.t3[CategoryString][reverseRelationStr] || {};
        oModel.meta.t3[CategoryString][reverseRelationStr][domainStr] = {};
    });
    // add a precice domain matchrule
    insertRuleIfNotPresent(oModel.mRules, {
        category: "domain",
        matchedString: oMdl.domain,
        type: IMatch.EnumRuleType.WORD,
        word: oMdl.domain,
        bitindex: oMdl.bitindex,
        bitSentenceAnd: oMdl.bitindex,
        wordType: "D",
        _ranking: 0.95
    }, oModel.seenRules);
    // check the tool
    if (oMdl.tool && oMdl.tool.requires) {
        var requires = Object.keys(oMdl.tool.requires || {});
        var diff = _.difference(requires, oMdl.category);
        if (diff.length > 0) {
            console.log(" " + oMdl.domain + " : Unkown category in requires of tool: \"" + diff.join('"') + '"');
            process.exit(-1);
        }
        var optional = Object.keys(oMdl.tool.optional);
        diff = _.difference(optional, oMdl.category);
        if (diff.length > 0) {
            console.log(" " + oMdl.domain + " : Unkown category optional of tool: \"" + diff.join('"') + '"');
            process.exit(-1);
        }
        Object.keys(oMdl.tool.sets || {}).forEach(function (setID) {
            var diff = _.difference(oMdl.tool.sets[setID].set, oMdl.category);
            if (diff.length > 0) {
                console.log(" " + oMdl.domain + " : Unkown category in setId " + setID + " of tool: \"" + diff.join('"') + '"');
                process.exit(-1);
            }
        });
        // extract tools an add to tools:
        oModel.tools.filter(function (oEntry) {
            if (oEntry.name === (oMdl.tool && oMdl.tool.name)) {
                console.log("Tool " + oMdl.tool.name + " already present when loading " + sModelName);
                //throw new Error('Domain already loaded?');
                process.exit(-1);
            }
        });
    }
    else {
        oMdl.toolhidden = true;
        oMdl.tool.requires = { "impossible": {} };
    }
    // add the tool name as rule unless hidden
    if (!oMdl.toolhidden && oMdl.tool && oMdl.tool.name) {
        insertRuleIfNotPresent(oModel.mRules, {
            category: "tool",
            matchedString: oMdl.tool.name,
            type: IMatch.EnumRuleType.WORD,
            word: oMdl.tool.name,
            bitindex: oMdl.bitindex,
            bitSentenceAnd: oMdl.bitindex,
            wordType: IMatch.WORDTYPE.TOOL,
            _ranking: 0.95
        }, oModel.seenRules);
    }
    ;
    if (oMdl.synonyms && oMdl.synonyms["tool"]) {
        addSynonyms(oMdl.synonyms["tool"], "tool", oMdl.tool.name, oMdl.bitindex, oMdl.bitindex, IMatch.WORDTYPE.TOOL, oModel.mRules, oModel.seenRules);
    }
    ;
    if (oMdl.synonyms) {
        Object.keys(oMdl.synonyms).forEach(function (ssynkey) {
            if (oMdl.category.indexOf(ssynkey) >= 0 && ssynkey !== "tool") {
                if (oModel.full.domain[oMdl.domain].categories[ssynkey]) {
                    oModel.full.domain[oMdl.domain].categories[ssynkey].synonyms = oMdl.synonyms[ssynkey];
                }
                addSynonyms(oMdl.synonyms[ssynkey], "category", ssynkey, oMdl.bitindex, oMdl.bitindex, IMatch.WORDTYPE.CATEGORY, oModel.mRules, oModel.seenRules);
            }
        });
    }
    oModel.domains.push(oMdl.domain);
    if (oMdl.tool.name) {
        oModel.tools.push(oMdl.tool);
    }
    oModel.category = oModel.category.concat(oMdl.category);
    oModel.category.sort();
    oModel.category = oModel.category.filter(function (string, index) {
        return oModel.category[index] !== oModel.category[index + 1];
    });
} // loadmodel
function splitRules(rules) {
    var res = {};
    var nonWordRules = [];
    rules.forEach(function (rule) {
        if (rule.type === IMatch.EnumRuleType.WORD) {
            if (!rule.lowercaseword) {
                throw new Error("Rule has no member lowercaseword" + JSON.stringify(rule));
            }
            res[rule.lowercaseword] = res[rule.lowercaseword] || { bitindex: 0, rules: [] };
            res[rule.lowercaseword].bitindex = res[rule.lowercaseword].bitindex | rule.bitindex;
            res[rule.lowercaseword].rules.push(rule);
        }
        else {
            nonWordRules.push(rule);
        }
    });
    return {
        wordMap: res,
        nonWordRules: nonWordRules,
        allRules: rules,
        wordCache: {}
    };
}
exports.splitRules = splitRules;
function cmpLengthSort(a, b) {
    var d = a.length - b.length;
    if (d) {
        return d;
    }
    return a.localeCompare(b);
}
var Algol = require("../match/algol");
// offset[0] : len-2
//             len -1
//             len
//             len +1
//             len +2
//             len +3
function findNextLen(targetLen, arr, offsets) {
    offsets.shift();
    for (var i = offsets[4]; (i < arr.length) && (arr[i].length <= targetLen); ++i) {
        /* empty*/
    }
    //console.log("pushing " + i);
    offsets.push(i);
}
exports.findNextLen = findNextLen;
function addRangeRulesUnlessPresent(rules, lcword, rangeRules, presentRulesForKey, seenRules) {
    rangeRules.forEach(function (rangeRule) {
        var newRule = Object.assign({}, rangeRule);
        newRule.lowercaseword = lcword;
        newRule.word = lcword;
        //if((lcword === 'services' || lcword === 'service') && newRule.range.rule.lowercaseword.indexOf('odata')>=0) {
        //    console.log("adding "+ JSON.stringify(newRule) + "\n");
        //}
        //todo: check whether an equivalent rule is already present?
        var cnt = rules.length;
        insertRuleIfNotPresent(rules, newRule, seenRules);
    });
}
exports.addRangeRulesUnlessPresent = addRangeRulesUnlessPresent;
function addCloseExactRangeRules(rules, seenRules) {
    var keysMap = {};
    var rangeKeysMap = {};
    rules.forEach(function (rule) {
        if (rule.type === IMatch.EnumRuleType.WORD) {
            //keysMap[rule.lowercaseword] = 1;
            keysMap[rule.lowercaseword] = keysMap[rule.lowercaseword] || [];
            keysMap[rule.lowercaseword].push(rule);
            if (!rule.exactOnly && rule.range) {
                rangeKeysMap[rule.lowercaseword] = rangeKeysMap[rule.lowercaseword] || [];
                rangeKeysMap[rule.lowercaseword].push(rule);
            }
        }
    });
    var keys = Object.keys(keysMap);
    keys.sort(cmpLengthSort);
    var len = 0;
    keys.forEach(function (key, index) {
        if (key.length != len) {
            //console.log("shift to len" + key.length + ' at ' + index + ' ' + key );
        }
        len = key.length;
    });
    //   keys = keys.slice(0,2000);
    var rangeKeys = Object.keys(rangeKeysMap);
    rangeKeys.sort(cmpLengthSort);
    //console.log(` ${keys.length} keys and ${rangeKeys.length} rangekeys `);
    var low = 0;
    var high = 0;
    var lastlen = 0;
    var offsets = [0, 0, 0, 0, 0, 0];
    var len = rangeKeys.length;
    findNextLen(0, keys, offsets);
    findNextLen(1, keys, offsets);
    findNextLen(2, keys, offsets);
    rangeKeys.forEach(function (rangeKey) {
        if (rangeKey.length !== lastlen) {
            for (i = lastlen + 1; i <= rangeKey.length; ++i) {
                findNextLen(i + 2, keys, offsets);
            }
            //   console.log(` shifted to ${rangeKey.length} with offsets beeing ${offsets.join(' ')}`);
            //   console.log(` here 0 ${offsets[0]} : ${keys[Math.min(keys.length-1, offsets[0])].length}  ${keys[Math.min(keys.length-1, offsets[0])]} `);
            //  console.log(` here 5-1  ${keys[offsets[5]-1].length}  ${keys[offsets[5]-1]} `);
            //   console.log(` here 5 ${offsets[5]} : ${keys[Math.min(keys.length-1, offsets[5])].length}  ${keys[Math.min(keys.length-1, offsets[5])]} `);
            lastlen = rangeKey.length;
        }
        for (var i = offsets[0]; i < offsets[5]; ++i) {
            var d = Distance.calcDistanceAdjusted(rangeKey, keys[i]);
            // console.log(`${rangeKey.length-keys[i].length} ${d} ${rangeKey} and ${keys[i]}  `);
            if ((d !== 1.0) && (d >= Algol.Cutoff_rangeCloseMatch)) {
                //console.log(`would add ${rangeKey} for ${keys[i]} ${d}`);
                var cnt = rules.length;
                // we only have to add if there is not yet a match rule here which points to the same
                addRangeRulesUnlessPresent(rules, keys[i], rangeKeysMap[rangeKey], keysMap[keys[i]], seenRules);
                if (rules.length > cnt) {
                    //console.log(` added ${(rules.length - cnt)} records at${rangeKey} for ${keys[i]} ${d}`);
                }
            }
        }
    });
    /*
    [
        ['aEFG','aEFGH'],
        ['aEFGH','aEFGHI'],
        ['Odata','ODatas'],
   ['Odata','Odatas'],
   ['Odata','Odatb'],
   ['Odata','UData'],
   ['service','services'],
   ['this isfunny and more','this isfunny and mores'],
    ].forEach(rec => {
        console.log(`distance ${rec[0]} ${rec[1]} : ${Distance.calcDistance(rec[0],rec[1])}  adf ${Distance.calcDistanceAdjusted(rec[0],rec[1])} `);

    });
    console.log("distance Odata Udata"+ Distance.calcDistance('OData','UData'));
    console.log("distance Odata Odatb"+ Distance.calcDistance('OData','ODatb'));
    console.log("distance Odatas Odata"+ Distance.calcDistance('OData','ODataa'));
    console.log("distance Odatas abcde"+ Distance.calcDistance('abcde','abcdef'));
    console.log("distance services "+ Distance.calcDistance('services','service'));
    */
}
exports.addCloseExactRangeRules = addCloseExactRangeRules;
var n = 0;
function loadModels(modelPath) {
    var oModel;
    oModel = {
        full: { domain: {} },
        rawModels: {},
        domains: [],
        tools: [],
        rules: undefined,
        category: [],
        operators: {},
        mRules: [],
        seenRules: {},
        records: [],
        meta: { t3: {} }
    };
    var t = Date.now();
    modelPath = modelPath || envModelPath;
    try {
        var a = CircularSer.load('./' + modelPath + '/_cachefalse.js');
        //console.log("found a cache ?  " + !!a);
        //a = undefined;
        if (a) {
            debuglog(" return preparese model ");
            if (process.env.ABOT_EMAIL_USER) {
                console.log("loaded models from cache in " + (Date.now() - t) + " ");
            }
            return a;
        }
    }
    catch (e) {
        //console.log('error' + e);
        // no cache file,
    }
    var mdls = readFileAsJSON('./' + modelPath + '/models.json');
    mdls.forEach(function (sModelName) {
        loadModel(modelPath, sModelName, oModel);
    });
    // add the categories to the model:
    /*
    oModel.category.forEach(function (category) {
        insertRuleIfNotPresent(oModel.mRules, {
            category: "category",
            matchedString: category,
            type: IMatch.EnumRuleType.WORD,
            word: category,
            lowercaseword: category.toLowerCase(),
            bitindex : oMdl.
            _ranking: 0.95
        }, oModel.seenRules);
    });
    */
    var metaBitIndex = getDomainBitIndex('meta', oModel);
    var bitIndexAllDomains = getAllDomainsBitIndex(oModel);
    // add the domain meta rule
    insertRuleIfNotPresent(oModel.mRules, {
        category: "meta",
        matchedString: "domain",
        type: IMatch.EnumRuleType.WORD,
        word: "domain",
        bitindex: metaBitIndex,
        wordType: IMatch.WORDTYPE.META,
        bitSentenceAnd: bitIndexAllDomains,
        _ranking: 0.95
    }, oModel.seenRules);
    var fillerBitIndex = getDomainBitIndex('meta', oModel);
    //add a filler rule
    var fillers = readFileAsJSON('./' + modelPath + '/filler.json');
    /*
    var re = "^((" + fillers.join(")|(") + "))$";
    oModel.mRules.push({
        category: "filler",
        type: IMatch.EnumRuleType.REGEXP,
        regexp: new RegExp(re, "i"),
        matchedString: "filler",
        bitindex: fillerBitIndex,
        _ranking: 0.9
    });
    */
    fillers.forEach(function (filler) {
        insertRuleIfNotPresent(oModel.mRules, {
            category: "filler",
            type: IMatch.EnumRuleType.WORD,
            word: filler,
            lowercaseword: filler.toLowerCase(),
            matchedString: filler,
            exactOnly: true,
            bitindex: fillerBitIndex,
            bitSentenceAnd: bitIndexAllDomains,
            wordType: IMatch.WORDTYPE.FILLER,
            _ranking: 0.9
        }, oModel.seenRules);
    });
    //add operators
    var operators = readFileAsJSON('./' + modelPath + '/operators.json');
    var operatorBitIndex = getDomainBitIndex('operators', oModel);
    Object.keys(operators.operators).forEach(function (operator) {
        if (IMatch.aOperatorNames.indexOf(operator) < 0) {
            debuglog("unknown operator " + operator);
            throw new Error("unknown operator " + operator);
        }
        oModel.operators[operator] = operators.operators[operator];
        oModel.operators[operator].operator = operator;
        Object.freeze(oModel.operators[operator]);
        var word = operator;
        insertRuleIfNotPresent(oModel.mRules, {
            category: "operator",
            word: word.toLowerCase(),
            lowercaseword: word.toLowerCase(),
            type: IMatch.EnumRuleType.WORD,
            matchedString: word,
            bitindex: operatorBitIndex,
            bitSentenceAnd: bitIndexAllDomains,
            wordType: IMatch.WORDTYPE.OPERATOR,
            _ranking: 0.9
        }, oModel.seenRules);
        // add all synonyms
        if (operators.synonyms[operator]) {
            Object.keys(operators.synonyms[operator]).forEach(function (synonym) {
                insertRuleIfNotPresent(oModel.mRules, {
                    category: "operator",
                    word: synonym.toLowerCase(),
                    lowercaseword: synonym.toLowerCase(),
                    type: IMatch.EnumRuleType.WORD,
                    matchedString: operator,
                    bitindex: operatorBitIndex,
                    bitSentenceAnd: bitIndexAllDomains,
                    wordType: IMatch.WORDTYPE.OPERATOR,
                    _ranking: 0.9
                }, oModel.seenRules);
            });
        }
    });
    /*
        })
            {
          category: "filler",
          type: 1,
          regexp: /^((start)|(show)|(from)|(in))$/i,
          matchedString: "filler",
          _ranking: 0.9
        },
    */
    oModel.mRules = oModel.mRules.sort(InputFilterRules.cmpMRule);
    addCloseExactRangeRules(oModel.mRules, oModel.seenRules);
    oModel.mRules = oModel.mRules.sort(InputFilterRules.cmpMRule);
    forceGC();
    oModel.rules = splitRules(oModel.mRules);
    forceGC();
    oModel.tools = oModel.tools.sort(cmpTools);
    delete oModel.seenRules;
    debuglog('saving');
    forceGC();
    CircularSer.save('./' + modelPath + '/_cachefalse.js', oModel);
    forceGC();
    if (process.env.ABOT_EMAIL_USER) {
        console.log("loaded models by calculation in " + (Date.now() - t) + " ");
    }
    return oModel;
}
exports.loadModels = loadModels;
function sortCategoriesByImportance(map, cats) {
    var res = cats.slice(0);
    res.sort(rankCategoryByImportance.bind(undefined, map));
    return res;
}
exports.sortCategoriesByImportance = sortCategoriesByImportance;
function rankCategoryByImportance(map, cata, catb) {
    var catADesc = map[cata];
    var catBDesc = map[catb];
    if (cata === catb) {
        return 0;
    }
    // if a is before b, return -1
    if (catADesc && !catBDesc) {
        return -1;
    }
    if (!catADesc && catBDesc) {
        return +1;
    }
    var prioA = (catADesc && catADesc.importance) || 99;
    var prioB = (catBDesc && catBDesc.importance) || 99;
    // lower prio goes to front
    var r = prioA - prioB;
    if (r) {
        return r;
    }
    return cata.localeCompare(catb);
}
exports.rankCategoryByImportance = rankCategoryByImportance;
var MetaF = Meta.getMetaFactory();
function getOperator(mdl, operator) {
    return mdl.operators[operator];
}
exports.getOperator = getOperator;
function getResultAsArray(mdl, a, rel) {
    if (rel.toType() !== 'relation') {
        throw new Error("expect relation as 2nd arg");
    }
    var res = mdl.meta.t3[a.toFullString()] &&
        mdl.meta.t3[a.toFullString()][rel.toFullString()];
    if (!res) {
        return [];
    }
    return Object.getOwnPropertyNames(res).sort().map(MetaF.parseIMeta);
}
exports.getResultAsArray = getResultAsArray;
function getCategoriesForDomain(theModel, domain) {
    if (theModel.domains.indexOf(domain) < 0) {
        throw new Error("Domain \"" + domain + "\" not part of model");
    }
    var res = getResultAsArray(theModel, MetaF.Domain(domain), MetaF.Relation(Meta.RELATION_hasCategory));
    return Meta.getStringArray(res);
}
exports.getCategoriesForDomain = getCategoriesForDomain;
function getTableColumns(theModel, domain) {
    if (theModel.domains.indexOf(domain) < 0) {
        throw new Error("Domain \"" + domain + "\" not part of model");
    }
    return theModel.rawModels[domain].columns.slice(0);
}
exports.getTableColumns = getTableColumns;
function forceGC() {
    if (global && global.gc) {
        global.gc();
    }
}
/**
 * Return all categories of a domain which can appear on a word,
 * these are typically the wordindex domains + entries generated by generic rules
 *
 * The current implementation is a simplification
 */
function getPotentialWordCategoriesForDomain(theModel, domain) {
    // this is a simplified version
    return getCategoriesForDomain(theModel, domain);
}
exports.getPotentialWordCategoriesForDomain = getPotentialWordCategoriesForDomain;
function getDomainsForCategory(theModel, category) {
    if (theModel.category.indexOf(category) < 0) {
        throw new Error("Category \"" + category + "\" not part of model");
    }
    var res = getResultAsArray(theModel, MetaF.Category(category), MetaF.Relation(Meta.RELATION_isCategoryOf));
    return Meta.getStringArray(res);
}
exports.getDomainsForCategory = getDomainsForCategory;
/*
export function getAllRecordCategoriesForTargetCategory(model: IMatch.IModels, category: string, wordsonly: boolean): { [key: string]: boolean } {
    var res = {};
    //
    var fn = wordsonly ? getPotentialWordCategoriesForDomain : getCategoriesForDomain;
    var domains = getDomainsForCategory(model, category);
    domains.forEach(function (domain) {
        fn(model, domain).forEach(function (wordcat) {
            res[wordcat] = true;
        });
    });
    Object.freeze(res);
    return res;
}

export function getAllRecordCategoriesForTargetCategories(model: IMatch.IModels, categories: string[], wordsonly: boolean): { [key: string]: boolean } {
    var res = {};
    //
    var fn = wordsonly ? getPotentialWordCategoriesForDomain : getCategoriesForDomain;
    var domains = undefined;
    categories.forEach(function (category) {
        var catdomains = getDomainsForCategory(model, category)
        if (!domains) {
            domains = catdomains;
        } else {
            domains = _.intersection(domains, catdomains);
        }
    });
    if (domains.length === 0) {
        throw new Error('categories ' + Utils.listToQuotedCommaAnd(categories) + ' have no common domain.')
    }
    domains.forEach(function (domain) {
        fn(model, domain).forEach(function (wordcat) {
            res[wordcat] = true;
        });
    });
    Object.freeze(res);
    return res;
}
*/
/**
 * givena  set  of categories, return a structure
 *
 *
 * { domains : ["DOMAIN1", "DOMAIN2"],
 *   categorySet : {   cat1 : true, cat2 : true, ...}
 * }
 */
function getDomainCategoryFilterForTargetCategories(model, categories, wordsonly) {
    var res = {};
    //
    var fn = wordsonly ? getPotentialWordCategoriesForDomain : getCategoriesForDomain;
    var domains = undefined;
    categories.forEach(function (category) {
        var catdomains = getDomainsForCategory(model, category);
        if (!domains) {
            domains = catdomains;
        }
        else {
            domains = _.intersection(domains, catdomains);
        }
    });
    if (domains.length === 0) {
        throw new Error('categories ' + Utils.listToQuotedCommaAnd(categories) + ' have no common domain.');
    }
    domains.forEach(function (domain) {
        fn(model, domain).forEach(function (wordcat) {
            res[wordcat] = true;
        });
    });
    Object.freeze(res);
    return { domains: domains,
        categorySet: res };
}
exports.getDomainCategoryFilterForTargetCategories = getDomainCategoryFilterForTargetCategories;
function getDomainCategoryFilterForTargetCategory(model, category, wordsonly) {
    return getDomainCategoryFilterForTargetCategories(model, [category], wordsonly);
}
exports.getDomainCategoryFilterForTargetCategory = getDomainCategoryFilterForTargetCategory;

//# sourceMappingURL=model.js.map
