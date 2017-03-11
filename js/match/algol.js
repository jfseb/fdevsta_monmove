/**
 * @file algol.ts
 *
 * Constant determining the algorithm
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Number of sentences which are not used
 */
exports.Cutoff_Sentences = 120;
exports.RANKING_EPSILON = 0.000000001;
/*
 try 4, 1.2

 instead of 8, 1.5
*/
exports.calcDist = {
    lengthDelta1: 15,
};
/**
 * levenshtein distances above this will not be considered valid
 */
exports.Cutoff_LevenShtein = 150;
exports.Cutoff_WordMatch = 0.935; // 0.85  // 0.98
exports.Cutoff_rangeCloseMatch = 0.98;
/**
 * Maximum amount of spaces permitted in a combined word
 *
 * Note that quoted words are never combined, and may exceed this limit,
 * e.g.   A "q u o t e d" entry.
 */
exports.MaxSpacesPerCombinedWord = 3;
/**
 * Weight factor to use on the a given word distance
 * of 0, 1, 2, 3 ....
 */
exports.aReinforceDistWeight = [0.1, 0.1, 0.05, 0.02];
/**
 * only the top n words are considered
 */
exports.Top_N_WordCategorizations = 5;
exports.DescribeValueListMinCountValueList = 3;
exports.DescribeValueListLengthCharLimit = 60;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxnb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWF0Y2gvYWxnb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7Ozs7R0FJRzs7O0FBR0g7O0dBRUc7QUFDVSxRQUFBLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUl2QixRQUFBLGVBQWUsR0FBRyxXQUFXLENBQUM7QUFFM0M7Ozs7RUFJRTtBQUVXLFFBQUEsUUFBUSxHQUFJO0lBQ3ZCLFlBQVksRUFBRyxFQUFFO0NBQ2xCLENBQUE7QUFDRDs7R0FFRztBQUNVLFFBQUEsa0JBQWtCLEdBQVksR0FBRyxDQUFDO0FBRWxDLFFBQUEsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLENBQUEsZ0JBQWdCO0FBRXpDLFFBQUEsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO0FBRTNDOzs7OztHQUtHO0FBQ1UsUUFBQSx3QkFBd0IsR0FBWSxDQUFDLENBQUM7QUFFbkQ7OztHQUdHO0FBQ1UsUUFBQSxvQkFBb0IsR0FBa0IsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUUxRTs7R0FFRztBQUNVLFFBQUEseUJBQXlCLEdBQUcsQ0FBQyxDQUFDO0FBSTlCLFFBQUEsa0NBQWtDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUEsZ0NBQWdDLEdBQUcsRUFBRSxDQUFDIn0=