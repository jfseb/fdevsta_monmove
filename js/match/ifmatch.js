"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumResponseCode;
(function (EnumResponseCode) {
    EnumResponseCode[EnumResponseCode["NOMATCH"] = 0] = "NOMATCH";
    EnumResponseCode[EnumResponseCode["EXEC"] = 1] = "EXEC";
    EnumResponseCode[EnumResponseCode["QUERY"] = 2] = "QUERY";
})(EnumResponseCode = exports.EnumResponseCode || (exports.EnumResponseCode = {}));
exports.CAT_CATEGORY = "category";
exports.CAT_FILLER = "filler";
exports.CAT_TOOL = "tool";
exports.ERR_NO_KNOWN_WORD = "NO_KNOWN_WORD";
exports.ERR_EMPTY_INPUT = "EMPTY_INPUT";
;
;
exports.aOperatorNames = ["starting with", "ending with", "containing", "excluding", "having", "being"];
;
var EnumRuleType;
(function (EnumRuleType) {
    EnumRuleType[EnumRuleType["WORD"] = 0] = "WORD";
    EnumRuleType[EnumRuleType["REGEXP"] = 1] = "REGEXP";
})(EnumRuleType = exports.EnumRuleType || (exports.EnumRuleType = {}));
;
;
;
;
;
;
var EnumActionType;
(function (EnumActionType) {
    EnumActionType[EnumActionType["STARTURL"] = 0] = "STARTURL";
    EnumActionType[EnumActionType["STARTCMDLINE"] = 1] = "STARTCMDLINE";
})(EnumActionType = exports.EnumActionType || (exports.EnumActionType = {}));
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWZtYXRjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXRjaC9pZm1hdGNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsSUFBa0IsZ0JBSWpCO0FBSkQsV0FBa0IsZ0JBQWdCO0lBQ2hDLDZEQUFXLENBQUE7SUFDWCx1REFBSSxDQUFBO0lBQ0oseURBQUssQ0FBQTtBQUNQLENBQUMsRUFKaUIsZ0JBQWdCLEdBQWhCLHdCQUFnQixLQUFoQix3QkFBZ0IsUUFJakM7QUFHWSxRQUFBLFlBQVksR0FBRyxVQUFVLENBQUM7QUFDMUIsUUFBQSxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQ3RCLFFBQUEsUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUdsQixRQUFBLGlCQUFpQixHQUFHLGVBQWUsQ0FBQztBQUNwQyxRQUFBLGVBQWUsR0FBRyxhQUFhLENBQUM7QUFLNUMsQ0FBQztBQVFELENBQUM7QUFhVyxRQUFBLGNBQWMsR0FBRyxDQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFnRDVHLENBQUM7QUFPRixJQUFtQixZQUdsQjtBQUhELFdBQW1CLFlBQVk7SUFDN0IsK0NBQUksQ0FBQTtJQUNKLG1EQUFNLENBQUE7QUFDUixDQUFDLEVBSGtCLFlBQVksR0FBWixvQkFBWSxLQUFaLG9CQUFZLFFBRzlCO0FBS0ksQ0FBQztBQTJFTCxDQUFDO0FBSWUsQ0FBQztBQStCakIsQ0FBQztBQW9DRCxDQUFDO0FBYUQsQ0FBQztBQTRCRixJQUFrQixjQUdqQjtBQUhELFdBQWtCLGNBQWM7SUFDOUIsMkRBQVEsQ0FBQTtJQUNSLG1FQUFZLENBQUE7QUFDZCxDQUFDLEVBSGlCLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBRy9CO0FBb0NBLENBQUMifQ==