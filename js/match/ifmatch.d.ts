export declare const enum EnumResponseCode {
    NOMATCH = 0,
    EXEC = 1,
    QUERY = 2,
}
export declare const CAT_CATEGORY = "category";
export declare const CAT_FILLER = "filler";
export declare const CAT_TOOL = "tool";
export declare const ERR_NO_KNOWN_WORD = "NO_KNOWN_WORD";
export declare const ERR_EMPTY_INPUT = "EMPTY_INPUT";
export interface IERError {
    err_code: string;
    text: string;
}
export interface IERErrorNO_KNOWN_WORD extends IERError {
    context: {
        token: string;
        index: number;
        tokens: string[];
    };
}
export interface IPromptDescription {
    description: string;
    type: string;
    pattern: RegExp;
    message: string;
    default: string;
    required: boolean;
}
export declare const aOperatorNames: string[];
export declare type OperatorName = "starting with" | "ending with" | "containing" | "being" | "excluding" | "having";
export interface IOperator {
    operator: OperatorName;
    code: string;
    arity: number;
    argcategory: [string[]];
}
export declare type IRecord = {
    [key: string]: string;
};
export interface IWhatIsAnswer {
    sentence: ISentence;
    record: IRecord;
    category: string;
    result: string;
    _ranking: number;
}
export interface IProcessedWhatIsAnswers extends IProcessed {
    sentences?: ISentence[];
    answers: IWhatIsAnswer[];
}
export interface IProcessedWhatIsTupelAnswers extends IProcessed {
    sentences?: ISentence[];
    tupelanswers: Array<IWhatIsTupelAnswer>;
}
export interface IWhatIsTupelAnswer {
    sentence: ISentence;
    record: IRecord;
    categories: string[];
    result: string[];
    _ranking: number;
}
export interface IMatchedSetRecord {
    setId: string;
    record: IRecord;
}
export declare type IMatchedSetRecords = IMatchedSetRecord[];
/**
 * Map category -> value
 */
export declare type IMatchSet = {
    [key: string]: string;
};
export declare const WORDTYPE: {
    FILLER: string;
    FACT: string;
    TOOL: string;
    META: string;
    CATEGORY: string;
    DOMAIN: string;
    OPERATOR: string;
};
export declare enum EnumRuleType {
    WORD = 0,
    REGEXP = 1,
}
export interface IToolSet {
    set: string[];
    response: string;
}
export declare type IToolSets = {
    [key: string]: IToolSet;
};
/**
 * @interface ITool
 *
 * var oTool = { 'name' : 'FLPD',
 *   'requires' : { 'systemId' : {}, 'client' :{}},
 *   'optional' : { 'catalog' : {}, 'group' :{}}
 * };
*/
export interface ITool {
    name: string;
    requires: {
        [key: string]: Object;
    };
    optional?: {
        [key: string]: Object;
    };
    sets?: IToolSets;
}
export interface IToolMatchResult {
    required: {
        [key: string]: IWord;
    };
    missing: {
        [key: string]: number;
    };
    optional?: {
        [key: string]: IWord;
    };
    spurious: {
        [key: string]: number;
    };
    toolmentioned: IWord[];
}
export interface IPrompt {
    text: string;
    category: string;
}
export interface IToolMatch {
    toolmatchresult: IToolMatchResult;
    sentence: ISentence;
    tool: ITool;
    rank: number;
}
export interface IWord {
    string: string;
    matchedString: string;
    category: string;
    _ranking?: number;
    levenmatch?: number;
    reinforce?: number;
    bitindex?: number;
    rule?: mRule;
}
export declare type ISentence = Array<IWord>;
export interface IRule {
    type: EnumRuleType;
    key: string;
    word?: string;
    regexp?: RegExp;
    argsMap?: {
        [key: number]: string;
    };
    follows: context;
}
export interface IntentRule {
    type: EnumRuleType;
    regexp: RegExp;
    argsMap: {
        [key: string]: number;
    };
    follows?: context;
}
export interface IRange {
    low: number;
    high: number;
}
export interface IWordRange extends IRange {
    rule?: mRule;
}
/**
 * A rule matching a single string
 */
export interface mRule {
    type: EnumRuleType;
    word?: string;
    lowercaseword?: string;
    regexp?: RegExp;
    matchedString?: string;
    matchIndex?: number;
    category: string;
    range?: IWordRange;
    wordType: string;
    bitindex: number;
    bitSentenceAnd: number;
    /**
     * only use an exact match
     */
    exactOnly?: boolean;
    _ranking?: number;
}
export interface IWordRules {
    rules: Array<mRule>;
    bitindex: number;
}
export interface SplitRules {
    allRules: Array<mRule>;
    nonWordRules: Array<mRule>;
    wordMap: {
        [key: string]: IWordRules;
    };
    wordCache: {
        [key: string]: Array<ICategorizedString>;
    };
}
export interface ICategorizedString {
    string: string;
    matchedString: string;
    category: string;
    breakdown?: Array<any>;
    score?: number;
    _ranking?: number;
    levenmatch?: number;
}
export interface ICategorizedStringRanged extends ICategorizedString {
    string: string;
    matchedString: string;
    category: string;
    breakdown?: Array<any>;
    /**
     * Length of the entry (for skipping following words)
     */
    score?: number;
    span?: number;
    rule: mRule;
    _ranking?: number;
    levenmatch?: number;
}
export interface IProcessed {
    tokens: string[];
    errors?: IERError[];
}
export interface IProcessedSentences extends IProcessed {
    tokens: string[];
    errors?: any;
    sentences: ISentence[];
}
export declare type ICategoryFilter = {
    [key: string]: boolean;
};
export declare type IDomainCategoryFilter = {
    domains: string[];
    categorySet: {
        [key: string]: boolean;
    };
};
export interface IProcessedExtractedCategories extends IProcessed {
    categories: string[];
}
export declare type context = {
    [key: string]: string;
};
/**
 * Defines the interface for an analysis
 * reponse
 */
export interface IResponse {
    rating: number;
    type: EnumResponseCode;
    query: string;
    context: {
        [key: string]: string;
    };
    text: string;
    action: IAction;
    prompts: {
        [key: string]: {
            text: string;
            /**
             * Follows the features of NPM prompts
             */
            description: IPromptDescription;
        };
    };
}
export declare const enum EnumActionType {
    STARTURL = 0,
    STARTCMDLINE = 1,
}
export interface IAction {
    data: any;
    type: EnumActionType;
    pattern: string;
    concrete: string;
}
export interface ICategoryDesc {
    name: string;
    importance?: number;
    description?: string;
    iskey?: boolean;
    exactMatch: boolean;
    synonyms?: string[];
}
export interface IModel {
    domain: string;
    bitindex: number;
    description?: string;
    tool: ITool;
    toolhidden?: boolean;
    synonyms?: {
        [key: string]: string[];
    };
    categoryDescribed: {
        name: string;
        description?: string;
        key?: string;
    }[];
    category: string[];
    columns?: string[];
    wordindex: string[];
    exactmatch?: string[];
    hidden: string[];
}
export interface IModels {
    full: {
        domain: {
            [key: string]: {
                description: string;
                bitindex: number;
                categories: {
                    [key: string]: ICategoryDesc;
                };
            };
        };
    };
    rawModels: {
        [key: string]: IModel;
    };
    domains: string[];
    tools: ITool[];
    category: string[];
    operators: {
        [key: string]: IOperator;
    };
    mRules: mRule[];
    rules: SplitRules;
    records: any[];
    seenRules?: {
        [key: string]: mRule[];
    };
    meta: {
        t3: {
            [key: string]: {
                [key: string]: any;
            };
        };
    };
}
