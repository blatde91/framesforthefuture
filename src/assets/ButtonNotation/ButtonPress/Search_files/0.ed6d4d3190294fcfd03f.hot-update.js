webpackHotUpdate(0,{

/***/ "./app/components/SiteItem/SiteViewItem.tsx":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__("./node_modules/react/index.js");
var styled_components_1 = __webpack_require__("./node_modules/styled-components/dist/styled-components.browser.es.js");
var react_bootstrap_1 = __webpack_require__("./node_modules/react-bootstrap/es/index.js");
var react_router_dom_1 = __webpack_require__("./node_modules/react-router-dom/index.js");
var DeleteSiteViewMutation_1 = __webpack_require__("./app/mutations/DeleteSiteViewMutation.tsx");
var UpdateSiteViewMutation_1 = __webpack_require__("./app/mutations/UpdateSiteViewMutation.tsx");
var CopySiteViewMutation_1 = __webpack_require__("./app/mutations/CopySiteViewMutation.tsx");
var StyledButton = styled_components_1.default(react_bootstrap_1.Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-right: 15px;\n"], ["\n  margin-right: 15px;\n"])));
// const PreviewText;
var SiteViewItem = /** @class */ (function (_super) {
    __extends(SiteViewItem, _super);
    function SiteViewItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.handleEditClick = function () {
            var siteViewId = _this.props.siteView.id;
            var siteId = _this.props.match.params.id;
            _this.props.history.push("/sites/" + siteId + "/edit/siteviews/" + siteViewId + "/edit");
        };
        _this.handleCheckbox = function (updateSiteView) {
            var siteView = _this.props.siteView;
            if (siteView.default) {
                alert('There must be a default site view.');
                return null;
            }
            updateSiteView({
                variables: {
                    input: {
                        default: true,
                        id: siteView.id,
                        mutations: [],
                        name: siteView.name,
                    },
                },
            }).then(function () {
                _this.props.refresh();
            });
        };
        _this.handleDelete = function (deleteSiteView) {
            var siteView = _this.props.siteView;
            if (siteView.default) {
                alert('There must be a default site.');
                return null;
            }
            if (!window)
                return;
            if (window.confirm('Are you sure?')) {
                deleteSiteView({
                    variables: {
                        input: {
                            id: siteView.id,
                        },
                    },
                }).then(function (res) {
                    // console.log(res);
                    _this.props.refresh();
                });
            }
        };
        _this.handleCopy = function (copySiteView) {
            var _a = _this.props, siteView = _a.siteView, site = _a.site;
            var copiedName = siteView.name + "copy";
            var copiedUrl = siteView.url + "copy";
            copySiteView({
                variables: {
                    input: {
                        name: copiedName,
                        url: copiedUrl,
                        default: false,
                        siteId: site.id,
                        siteViewId: siteView.id,
                    },
                },
            }).then(function (res) {
                _this.props.refresh();
            });
        };
        return _this;
    }
    SiteViewItem.prototype.render = function () {
        var _this = this;
        var _a = this.props, siteView = _a.siteView, site = _a.site;
        console.log(this.props.site);
        var urlString;
        if (site.subdomain != 'default') {
            urlString = "https://" + site.subdomain + ".clinwiki.org/search/" + siteView.url;
        }
        return (React.createElement("tr", null,
            React.createElement("td", null, siteView.name),
            React.createElement("td", null, siteView.url),
            React.createElement("td", null,
                React.createElement(UpdateSiteViewMutation_1.default, null, function (updateSiteView) { return (React.createElement(react_bootstrap_1.Checkbox, { checked: siteView.default, onChange: function () { return _this.handleCheckbox(updateSiteView); } })); })),
            React.createElement("td", null,
                React.createElement("a", { target: "_blank", href: urlString }, urlString)),
            React.createElement("td", null,
                React.createElement(StyledButton, { onClick: this.handleEditClick }, "Edit"),
                React.createElement(CopySiteViewMutation_1.default, null, function (copySiteView) { return (React.createElement(StyledButton, { onClick: function () { return _this.handleCopy(copySiteView); } }, "Copy")); }),
                React.createElement(DeleteSiteViewMutation_1.default, null, function (deleteSiteView) { return (React.createElement(StyledButton, { onClick: function () { return _this.handleDelete(deleteSiteView); } }, "Delete")); }))));
    };
    return SiteViewItem;
}(React.PureComponent));
//@ts-ignore
exports.default = react_router_dom_1.withRouter(SiteViewItem);
var templateObject_1;


/***/ })

})
//# sourceMappingURL=0.ed6d4d3190294fcfd03f.hot-update.js.map