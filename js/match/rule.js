"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IMatch = require("./ifmatch");
var Model = require("../model/model");
exports.oKeyOrder = ["systemObjectCategory", "systemId", "systemObjectId"];
var mUnitTestURLMap = {};
var aregex = /\/([^/]*).qunit.html/;
var UnitTestList = [
    // alphabetic order please
    'test-resources/sap/ushell/qunit/adapters/cdm/ClientSideTargetResolutionAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/cdm/CommonDataModelAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/cdm/LaunchPageAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/local/AppStateAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/local/ClientSideTargetResolutionAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/local/ContainerAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/local/EndUserFeedbackAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/local/NavTargetResolutionAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/local/PersonalizationAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/local/SupportTicketAdapterTest.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/local/UserDefaultParameterPersistenceAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/adapters/local/UserInfoAdapter.qunit.html',
    'test-resources/sap/ushell/qunit/bootstrap/sandbox.qunit.html',
    'test-resources/sap/ushell/qunit/CanvasShapesManager.qunit.html',
    'test-resources/sap/ushell/qunit/components/container/ApplicationContainer.qunit.html',
    'test-resources/sap/ushell/qunit/components/factsheet/annotation/ODataURLTemplating.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/ComponentKeysHandler.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/FlpApp.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/launchpad/appfinder/EasyAccess.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/launchpad/DashboardManager.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/launchpad/PagingManager.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/launchpad/appfinder/AppFinder.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/launchpad/appfinder/GroupListPopover.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/launchpad/appfinder/HierarchyApps.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/launchpad/appfinder/HierarchyFolders.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/userPreferences/LanguageRegionSelector.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/launchpad/dashboard/DashboardContent.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/launchpad/dashboard/DashboardUIActions.qunit.html',
    'test-resources/sap/ushell/qunit/components/flp/settings/FlpSettings.qunit.html',
    'test-resources/sap/ushell/qunit/components/tiles/applauncher/StaticTile.qunit.html',
    'test-resources/sap/ushell/qunit/components/tiles/applauncherdynamic/DynamicTile.qunit.html',
    'test-resources/sap/ushell/qunit/components/tiles/cdm/applauncher/StaticTile.qunit.html',
    'test-resources/sap/ushell/qunit/components/tiles/cdm/applauncherdynamic/DynamicTile.qunit.html',
    'test-resources/sap/ushell/qunit/components/tiles/utils.qunit.html',
    'test-resources/sap/ushell/qunit/components/tiles/utilsRT.qunit.html',
    'test-resources/sap/ushell/qunit/components/userActivity/userActivityLog.qunit.html',
    // "test-resources/sap/ushell/qunit/demoapps/UserDefaultPluginSample/UserDefaultPluginSample.qunit.html", // Currently not run inside the QUnit Test Loader for ushell-lib
    'test-resources/sap/ushell/qunit/FLPAnalytics.qunit.html',
    'test-resources/sap/ushell/qunit/Layout.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/AccessKeysHandler.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/DefaultParameters/DefaultParameters.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/Lifecycle.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/meArea/MeArea.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/meArea/UserSettings.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/notifications/Notifications.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/notifications/Settings.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/Renderer.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/RendererExtensions.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/Shell.qunit.html',
    'test-resources/sap/ushell/qunit/renderers/fiori2/UIActions.qunit.html',
    'test-resources/sap/ushell/qunit/services/AppConfiguration.qunit.html',
    'test-resources/sap/ushell/qunit/services/AppContext.qunit.html',
    'test-resources/sap/ushell/qunit/services/AppLifeCycle.qunit.html',
    'test-resources/sap/ushell/qunit/services/AppState.qunit.html',
    'test-resources/sap/ushell/qunit/services/Bookmark.qunit.html',
    'test-resources/sap/ushell/qunit/services/ClientSideTargetResolution.qunit.html',
    'test-resources/sap/ushell/qunit/services/CommonDataModel.qunit.html',
    'test-resources/sap/ushell/qunit/services/CommonDataModel/PersonalizationProcessor.qunit.html',
    'test-resources/sap/ushell/qunit/services/CommonDataModel/PersonalizationProcessorCDMBlackbox.qunit.html',
    'test-resources/sap/ushell/qunit/services/Container.qunit.html',
    'test-resources/sap/ushell/qunit/services/CrossApplicationNavigation.qunit.html',
    'test-resources/sap/ushell/qunit/services/EndUserFeedback.qunit.html',
    'test-resources/sap/ushell/qunit/services/LaunchPage.qunit.html',
    'test-resources/sap/ushell/qunit/services/Message.qunit.html',
    'test-resources/sap/ushell/qunit/services/NavTargetResolution.qunit.html',
    'test-resources/sap/ushell/qunit/services/NavTargetResolutionCDMBlackbox.qunit.html',
    'test-resources/sap/ushell/qunit/services/Notifications.qunit.html',
    'test-resources/sap/ushell/qunit/services/Personalization.qunit.html',
    'test-resources/sap/ushell/qunit/services/PluginManager.qunit.html',
    'test-resources/sap/ushell/qunit/services/ReferenceResolver.qunit.html',
    'test-resources/sap/ushell/qunit/services/ShellNavigation.History.qunit.html',
    'test-resources/sap/ushell/qunit/services/ShellNavigation.qunit.html',
    'test-resources/sap/ushell/qunit/services/SupportTicket.qunit.html',
    'test-resources/sap/ushell/qunit/services/URLParsing.qunit.html',
    'test-resources/sap/ushell/qunit/services/URLShortening.qunit.html',
    'test-resources/sap/ushell/qunit/services/Ui5ComponentLoader.qunit.html',
    'test-resources/sap/ushell/qunit/services/UsageAnalytics.qunit.html',
    'test-resources/sap/ushell/qunit/services/UserDefaultParameterPersistence.qunit.html',
    'test-resources/sap/ushell/qunit/services/UserDefaultParameters.qunit.html',
    'test-resources/sap/ushell/qunit/services/UserInfo.qunit.html',
    'test-resources/sap/ushell/qunit/services/UserRecents.qunit.html',
    'test-resources/sap/ushell/qunit/services/SmartNavigation.qunit.html',
    'test-resources/sap/ushell/qunit/System.qunit.html',
    'test-resources/sap/ushell/qunit/ui/footerbar/AboutButton.qunit.html',
    'test-resources/sap/ushell/qunit/ui/footerbar/AddBookmarkButton.qunit.html',
    'test-resources/sap/ushell/qunit/ui/footerbar/ContactSupportButton.qunit.html',
    'test-resources/sap/ushell/qunit/ui/footerbar/EndUserFeedback.qunit.html',
    'test-resources/sap/ushell/qunit/ui/footerbar/JamDiscussButton.qunit.html',
    'test-resources/sap/ushell/qunit/ui/footerbar/JamShareButton.qunit.html',
    'test-resources/sap/ushell/qunit/ui/footerbar/LogoutButton.qunit.html',
    'test-resources/sap/ushell/qunit/ui/footerbar/SettingsButton.qunit.html',
    'test-resources/sap/ushell/qunit/ui/footerbar/UserPreferencesButton.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/AccessibilityCustomData.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/ActionItem.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/AnchorItem.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/AnchorNavigationBar.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/EmbeddedSupportErrorMessage.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/Fiori2LoadingDialog.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/GroupListItem.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/LinkTileWrapper.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/LoadingDialog.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/TileContainer.qunit.html',
    'test-resources/sap/ushell/qunit/ui/launchpad/ViewPortContainer.qunit.html',
    'test-resources/sap/ushell/qunit/ui/shell/FloatingContainer.qunit.html',
    'test-resources/sap/ushell/qunit/ui/shell/RightFloatingContainer.qunit.html',
    'test-resources/sap/ushell/qunit/ui/shell/ShellAppTitle.qunit.html',
    'test-resources/sap/ushell/qunit/ui/shell/ShellLayout.qunit.html',
    'test-resources/sap/ushell/qunit/ui/shell/ShellTitle.qunit.html',
    'test-resources/sap/ushell/qunit/ui/shell/SplitContainer.qunit.html',
    'test-resources/sap/ushell/qunit/ui/tile/DynamicTile.qunit.html',
    'test-resources/sap/ushell/qunit/ui/tile/ImageTile.qunit.html',
    'test-resources/sap/ushell/qunit/ui/tile/StaticTile.qunit.html',
    'test-resources/sap/ushell/qunit/ui/tile/TileBase.qunit.html',
    'test-resources/sap/ushell/qunit/ui5service/ShellUIService.qunit.html'
];
var mUnitTestWords = UnitTestList.map(function (sEntry) {
    var sString = aregex.exec(sEntry)[1]; //.match('/([^/]*).qunit.html')[1]
    //console.log("here is the test " + sString);
    mUnitTestURLMap[sString] = "http://localhost:8080/sap/bc/" + sEntry;
    return {
        category: "unit test",
        matchedString: sString,
        type: 0 /* WORD */,
        bitindex: 0x03,
        word: sString,
        _ranking: 0.95
    };
});
/* @covignore */
function getRuleMap() {
    var systemObjectCategory = [
        {
            type: 0 /* WORD */,
            key: "systemObjectCategory",
            word: "unit test",
            follows: {
                systemObjectCategory: "unit test"
            }
        },
        {
            type: 0 /* WORD */,
            key: "systemObjectCategory",
            word: "unit",
            follows: {
                systemObjectCategory: "unit test"
            }
        }
    ];
    /* @covignore */
    var systemObjectCategory2 = [["unit test", "unit"],
        ["wiki", "web page"],
        ["fiori catalog", "flp catalog", "catalog"],
        ["fiori group", "flp group", "group"],
        ["url"],
        ["flp", "fiori launchpad", "lauchpage", "launchpad"],
        ["flpd"]
    ].map(function (aArr) {
        // console.log(JSON.stringify(aArr));
        var bestSynonym = aArr[0];
        return aArr.map(function (sEntry) {
            return {
                type: 0 /* WORD */,
                key: "systemObjectCategory",
                word: sEntry,
                follows: {
                    systemObjectCategory: bestSynonym
                }
            };
        });
    });
    systemObjectCategory2 = systemObjectCategory2.reduce(function (a, b) { return a.concat(b); }, []);
    var systemObjectCategory = systemObjectCategory.concat(systemObjectCategory2);
    var oRuleMap = {
        "systemObjectCategory": systemObjectCategory,
        "systemId": [
            {
                regexp: /^([a-z0-9_]{3,3})CLNT(\d{3,3})$/i,
                key: 'systemId',
                argsMap: {
                    1: 'systemId',
                    2: 'client'
                },
                type: 1 /* REGEXP */,
                follows: {}
            },
            {
                regexp: /^([a-z0-9_]{3,3})$/i,
                key: 'systemId',
                argsMap: {
                    1: 'systemId'
                },
                type: 1 /* REGEXP */,
                follows: {}
            }
        ],
    };
    var systemObjectId = UnitTestList.map(function (sEntry) {
        var sString = aregex.exec(sEntry)[1]; //.match('/([^/]*).qunit.html')[1]
        return {
            key: "systemObjectId",
            word: sString,
            type: 0 /* WORD */,
            follows: {
                systemObjectCategory: "unit test",
                systemObjectId: sString
            }
        };
    }); // map
    var systemObjectId2 = [
        // wiki aliases, this is an old legacy foramt
        {
            key: 'Support page',
            res: 'CA-UI2-INT-FE support',
        },
        { key: 'FCC ABAP Alignment' },
        { key: 'UI2 test links' },
        { key: 'Support schedule', res: 'TIP Core UI Integration support' },
        { key: 'UII Support schedule', res: 'TIP Core UI Integration support' },
        {
            key: 'UI2 Support page',
            res: 'CA-UI2-INT-FE support'
        },
        {
            key: 'Backend Sprint Reviews',
            res: 'Backend Sprint Review'
        },
        {
            key: 'UI5 patch schedule',
            res: 'UI5 UI2 Patch plan'
        }
    ].map(function (oEntry) {
        return {
            word: oEntry.key,
            key: "systemObjectId",
            type: 0 /* WORD */,
            follows: {
                systemObjectCategory: "wiki",
                systemObjectId: (oEntry.res || oEntry.key).toLowerCase()
            }
        };
    }); // map
    systemObjectId = systemObjectId.concat(systemObjectId2);
    systemObjectId = systemObjectId.concat([
        {
            type: 0 /* WORD */,
            key: "systemObjectId",
            word: "flpd",
            follows: {}
        },
        {
            type: 1 /* REGEXP */,
            key: "systemObjectId",
            regexp: /^\S+$/i,
            follows: {
                _ranking: 0.9
            }
        }
    ]);
    oRuleMap["systemObjectId"] = systemObjectId;
    return oRuleMap;
}
exports.getRuleMap = getRuleMap;
var mRuleArray;
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
function getIntMRulesSample() {
    var mRules = [];
    mRules = mRules.concat([
        // a generic rule for any id
        {
            type: 1 /* REGEXP */,
            category: "systemObjectId",
            regexp: /^\S+$/i,
            bitindex: 0x01,
            _ranking: 0.5
        },
        {
            type: 1 /* REGEXP */,
            category: "fiori catalog",
            regexp: /^[A-Z0-9a-z_\/]+$/i,
            bitindex: 0x01,
            _ranking: 0.5
        },
        {
            type: 1 /* REGEXP */,
            category: "client",
            regexp: /^\d{3,3}$/i,
            bitindex: 0x01,
            _ranking: 0.8
        },
        {
            type: 1 /* REGEXP */,
            category: "systemId",
            regexp: /^[A-Z][A-Z0-9][A-Z0-9]$/i,
            bitindex: 0x01,
            _ranking: 0.7
        },
        {
            type: 0 /* WORD */,
            category: "systemId",
            word: "UV2",
            bitindex: 0x01,
            matchedString: "UV2"
        },
        {
            type: 1 /* REGEXP */,
            category: "transaction",
            regexp: /^[A-Z][A-Z0-9_]{3,3}$/i,
            bitindex: 0x01,
            _ranking: 0.7
        },
        {
            type: 1 /* REGEXP */,
            category: "fiori catalog",
            regexp: /^SAP_BC[A-Z][A-Z0-9_]*$/,
            bitindex: 0x01,
            _ranking: 0.85
        },
        {
            type: 1 /* REGEXP */,
            category: "fiori catalog",
            regexp: /^SAP_TC[A-Z][A-Z0-9_]*$/,
            bitindex: 0x01,
            _ranking: 0.85
        },
        // a few unit tests
        {
            category: "unit test",
            matchedString: "NavTargetResolution",
            type: 0,
            bitindex: 0x01,
            word: "NavTargetResolution"
        },
        {
            category: "unit test",
            matchedString: "NavTargetResolutionAdapter",
            type: 0,
            bitindex: 0x01,
            word: "NavTargetResolutionAdapter"
        },
        // a few unit tests
        {
            category: "wiki",
            matchedString: "UI2 Integration",
            type: 0,
            bitindex: 0x01,
            word: "UI2 Integration"
        },
        {
            category: "wiki",
            matchedString: "UI2 Support pages",
            type: 0,
            bitindex: 0x01,
            word: "UI2 Support pages"
        },
        // categories of this model
        {
            category: "category",
            matchedString: "wiki",
            type: 0,
            bitindex: 0x01,
            word: "wiki",
        },
        {
            category: "category",
            matchedString: "unit test",
            type: 0,
            bitindex: 0x01,
            word: "unit test",
        },
        {
            category: "category",
            matchedString: "url",
            type: 0,
            bitindex: 0x01,
            word: "url",
        },
        {
            category: "category",
            matchedString: "transaction",
            type: 0,
            bitindex: 0x01,
            word: "transaction",
        },
        {
            category: "category",
            matchedString: "transaction",
            type: 0,
            bitindex: 0x01,
            word: "ta",
        },
        {
            category: "category",
            matchedString: "fiori catalog",
            type: 0,
            bitindex: 0x01,
            word: "fiori catalog",
        },
        {
            category: "category",
            matchedString: "fiori catalog",
            type: 0,
            _ranking: 0.8,
            bitindex: 0x01,
            word: "catalog",
        },
        {
            category: "category",
            matchedString: "systemId",
            type: 0,
            bitindex: 0x01,
            word: "system",
        },
        {
            category: "category",
            matchedString: "client",
            type: 0,
            bitindex: 0x01,
            word: "client",
        },
        // tools of the sample model
        {
            category: "tool",
            matchedString: "FLPD",
            type: 0,
            bitindex: 0x01,
            word: "flpd",
        },
        {
            category: "operator",
            matchedString: "starts with",
            type: 0,
            bitindex: 0x01,
            word: "starting with",
        },
        {
            category: "tool",
            matchedString: "FLP",
            type: 0,
            bitindex: 0x01,
            word: "flp",
        },
        {
            category: "tool",
            matchedString: "FLP",
            type: 0,
            bitindex: 0x01,
            word: "Fiori Launchpad",
        },
        {
            category: "tool",
            matchedString: "wiki",
            type: 0,
            bitindex: 0x01,
            word: "wiki",
        },
        // fillers
        // tools of the sample model
        {
            category: "filler",
            type: 1,
            regexp: /^((start)|(show)|(from)|(in))$/i,
            matchedString: "filler",
            bitindex: 0x02,
            _ranking: 0.9
        },
    ]);
    var mRules = assureLowerCaseWord(mRules);
    return mRules.sort(cmpMRule);
}
exports.getIntMRulesSample = getIntMRulesSample;
function getMRulesSample() {
    return Model.splitRules(getIntMRulesSample());
}
exports.getMRulesSample = getMRulesSample;
function assureLowerCaseWord(mRules) {
    return mRules.map(function (oRule) {
        if (oRule.type === 0 /* WORD */) {
            oRule.lowercaseword = oRule.word.toLowerCase();
        }
        return oRule;
    });
}
exports.assureLowerCaseWord = assureLowerCaseWord;
function getUnitTestUrl(string) {
    return mUnitTestURLMap[string];
}
exports.getUnitTestUrl = getUnitTestUrl;
function getWikiUrl(string) {
    // TODO
    return mUnitTestURLMap[string];
}
exports.getWikiUrl = getWikiUrl;
function getMRulesFull() {
    var mRules = getIntMRulesSample();
    mRules = mRules.concat(mUnitTestWords);
    mRules = assureLowerCaseWord(mRules);
    return Model.splitRules(mRules.sort(cmpMRule));
}
exports.getMRulesFull = getMRulesFull;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYXRjaC9ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0NBQW9DO0FBRXBDLHNDQUF3QztBQUczQixRQUFBLFNBQVMsR0FBa0IsQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUUvRixJQUFJLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFFekIsSUFBSSxNQUFNLEdBQUcsc0JBQXNCLENBQUM7QUFFcEMsSUFBSSxZQUFZLEdBQ2Q7SUFDRSwwQkFBMEI7SUFFMUIsMkZBQTJGO0lBQzNGLGdGQUFnRjtJQUNoRiwyRUFBMkU7SUFFM0UsMkVBQTJFO0lBQzNFLDZGQUE2RjtJQUM3Riw0RUFBNEU7SUFDNUUsa0ZBQWtGO0lBQ2xGLHNGQUFzRjtJQUN0RixrRkFBa0Y7SUFDbEYsb0ZBQW9GO0lBQ3BGLGtHQUFrRztJQUNsRywyRUFBMkU7SUFFM0UsOERBQThEO0lBQzlELGdFQUFnRTtJQUVoRSxzRkFBc0Y7SUFDdEYsK0ZBQStGO0lBQy9GLGdGQUFnRjtJQUNoRixrRUFBa0U7SUFDbEUsMEZBQTBGO0lBQzFGLHNGQUFzRjtJQUN0RixtRkFBbUY7SUFDbkYseUZBQXlGO0lBQ3pGLGdHQUFnRztJQUNoRyw2RkFBNkY7SUFDN0YsZ0dBQWdHO0lBQ2hHLG9HQUFvRztJQUNwRyxnR0FBZ0c7SUFDaEcsa0dBQWtHO0lBQ2xHLGdGQUFnRjtJQUVoRixvRkFBb0Y7SUFDcEYsNEZBQTRGO0lBQzVGLHdGQUF3RjtJQUN4RixnR0FBZ0c7SUFDaEcsbUVBQW1FO0lBQ25FLHFFQUFxRTtJQUNyRSxvRkFBb0Y7SUFFcEYsMEtBQTBLO0lBQzFLLHlEQUF5RDtJQUN6RCxtREFBbUQ7SUFFbkQsK0VBQStFO0lBQy9FLGlHQUFpRztJQUNqRyx1RUFBdUU7SUFDdkUsMkVBQTJFO0lBQzNFLGlGQUFpRjtJQUNqRix5RkFBeUY7SUFDekYsb0ZBQW9GO0lBQ3BG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