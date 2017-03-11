/**
 * Functionality managing the match models
 *
 * @file
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import * as intf from 'constants';
var debug = require("debug");
var debuglog = debug('meta');
/**
 * the model path, may be controlled via environment variable
 */
var modelPath = process.env["ABOT_MODELPATH"] || "testmodel";
var separator = " -:- ";
var validTypes = ["relation", "category", "domain"];
var AMeta = (function () {
    function AMeta(type, name) {
        if (validTypes.indexOf(type) < 0) {
            throw new Error("Illegal Type " + type);
        }
        this.name = name;
        this.type = type;
    }
    AMeta.prototype.toName = function () {
        return this.name;
    };
    AMeta.prototype.toFullString = function () {
        return this.type + separator + this.name;
    };
    AMeta.prototype.toType = function () {
        return this.type;
    };
    return AMeta;
}());
exports.AMeta = AMeta;
function getStringArray(arr) {
    return arr.map(function (oMeta) {
        return oMeta.toName();
    });
}
exports.getStringArray = getStringArray;
exports.RELATION_hasCategory = "hasCategory";
exports.RELATION_isCategoryOf = "isCategoryOf";
function parseAMeta(a) {
    var r = a.split(separator);
    if (!r || r.length !== 2) {
        throw new Error("cannot parse " + a + " as Meta");
    }
    switch (r[0]) {
        case "category":
            return getMetaFactory().Category(r[1]);
        case "relation":
            return getMetaFactory().Relation(r[1]);
        case "domain":
            return getMetaFactory().Domain(r[1]);
        default:
            throw new Error("unknown meta type" + r[0]);
    }
}
function getMetaFactory() {
    return {
        Domain: function (a) {
            return new AMeta("domain", a);
        },
        Category: function (a) {
            return new AMeta("category", a);
        },
        Relation: function (a) {
            return new AMeta("relation", a);
        },
        parseIMeta: parseAMeta
    };
}
exports.getMetaFactory = getMetaFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbC9tZXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7OztBQUVILG9DQUFvQztBQUVwQyw2QkFBK0I7QUFFL0IsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBTTdCOztHQUVHO0FBQ0gsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLFdBQVcsQ0FBQztBQVM3RCxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDMUIsSUFBTSxVQUFVLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRXREO0lBR0ksZUFBWSxJQUFhLEVBQUUsSUFBYTtRQUNwQyxFQUFFLENBQUEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxzQkFBTSxHQUFOO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUNELDRCQUFZLEdBQVo7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUM3QyxDQUFDO0lBQ0Qsc0JBQU0sR0FBTjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQztBQW5CWSxzQkFBSztBQThCbEIsd0JBQStCLEdBQWE7SUFDeEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBUyxLQUFhO1FBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBSkQsd0NBSUM7QUFFWSxRQUFBLG9CQUFvQixHQUFHLGFBQWEsQ0FBQztBQUNyQyxRQUFBLHFCQUFxQixHQUFHLGNBQWMsQ0FBQztBQUVwRCxvQkFBb0IsQ0FBVTtJQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNCLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUNELE1BQU0sQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVixLQUFLLFVBQVU7WUFDWCxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLEtBQUssVUFBVTtZQUNYLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsS0FBSyxRQUFRO1lBQ1QsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QztZQUNJLE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztBQUNiLENBQUM7QUFFRDtJQUNFLE1BQU0sQ0FBQztRQUNELE1BQU0sRUFBRyxVQUFTLENBQVU7WUFDeEIsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsUUFBUSxFQUFHLFVBQVMsQ0FBVTtZQUMxQixNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDRCxRQUFRLEVBQUcsVUFBUyxDQUFVO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUNELFVBQVUsRUFBRyxVQUFVO0tBQzNCLENBQUM7QUFDTCxDQUFDO0FBYkQsd0NBYUMifQ==