/// <reference types="core-js" />
import * as IMatch from './ifmatch';
export declare const oKeyOrder: Array<String>;
export declare function getRuleMap(): {
    "systemObjectCategory": {
        type: IMatch.EnumRuleType;
        key: string;
        word: string;
        follows: {
            systemObjectCategory: string;
        };
    }[];
    "systemId": ({
        regexp: RegExp;
        key: string;
        argsMap: {
            1: string;
            2: string;
        };
        type: IMatch.EnumRuleType;
        follows: {};
    } | {
        regexp: RegExp;
        key: string;
        argsMap: {
            1: string;
        };
        type: IMatch.EnumRuleType;
        follows: {};
    })[];
};
export declare function compareMRuleFull(a: IMatch.mRule, b: IMatch.mRule): number;
export declare function cmpMRule(a: IMatch.mRule, b: IMatch.mRule): number;
export declare function getIntMRulesSample(): Array<IMatch.mRule>;
export declare function getMRulesSample(): IMatch.SplitRules;
export declare function assureLowerCaseWord(mRules: Array<IMatch.mRule>): IMatch.mRule[];
export declare function getUnitTestUrl(string: string): any;
export declare function getWikiUrl(string: string): any;
export declare function getMRulesFull(): IMatch.SplitRules;
