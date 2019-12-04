import { __decorate } from 'tslib';
import { Input, Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import isEqual from 'deep-equal';

var NgxJsonViewerComponent = /** @class */ (function () {
    function NgxJsonViewerComponent() {
        this.path = [];
        this.expanded = true;
        this.segments = [];
        this.expandedChildren = new Set();
    }
    NgxJsonViewerComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        // Re-parse only if JSON changed & values are not similar (use deep object/array comparison)
        if (!changes.json || isEqual(changes.json.previousValue, changes.json.currentValue)) {
            return;
        }
        var newJson = changes.json.currentValue;
        if (typeof newJson === 'object') {
            this.segments = Object.keys(newJson).map(function (key) { return _this.parseKeyValue(key, newJson[key]); });
        }
        else {
            this.segments = [this.parseKeyValue("(" + typeof newJson + ")", newJson)];
        }
        if (!changes.expanded) {
            var _loop_1 = function (oldChildSegmentdKey) {
                if (!this_1.segments.some(function (s) { return s.key === oldChildSegmentdKey; })) {
                    this_1.expandedChildren.delete(oldChildSegmentdKey);
                }
            };
            var this_1 = this;
            // Clean up expanded children keys that no longer exist.
            for (var oldChildSegmentdKey in this.expandedChildren.values()) {
                _loop_1(oldChildSegmentdKey);
            }
        }
        else {
            // Clear the state of individual elements.
            this.expandedChildren.clear();
        }
    };
    NgxJsonViewerComponent.prototype.isExpandable = function (segment) {
        return segment.type === 'object' || segment.type === 'array';
    };
    NgxJsonViewerComponent.prototype.isChildExpanded = function (segment) {
        return this.expandedChildren.has(typeof segment === 'string' ? segment : segment.key);
    };
    NgxJsonViewerComponent.prototype.toggle = function (segment) {
        // Check if the given segment is expandable.
        // This check is required to avoid storing useless keys in the expanded children set.
        if (this.isExpandable(segment)) {
            // Add or remove the segment key to the set of opened segments
            if (this.isChildExpanded(segment)) {
                this.expandedChildren.delete(segment.key);
            }
            else {
                this.expandedChildren.add(segment.key);
            }
        }
    };
    NgxJsonViewerComponent.prototype.parseKeyValue = function (key, value) {
        var segment = {
            key: key,
            value: value,
            type: undefined,
            description: '' + value,
            // Retrieve the current expand state.
            expanded: this.expanded || this.isChildExpanded(key),
        };
        switch (typeof segment.value) {
            case 'number': {
                segment.type = 'number';
                break;
            }
            case 'boolean': {
                segment.type = 'boolean';
                break;
            }
            case 'function': {
                segment.type = 'function';
                break;
            }
            case 'string': {
                segment.type = 'string';
                segment.description = '"' + segment.value + '"';
                break;
            }
            case 'undefined': {
                segment.type = 'undefined';
                segment.description = 'undefined';
                break;
            }
            case 'object': {
                // yea, null is object
                if (segment.value === null) {
                    segment.type = 'null';
                    segment.description = 'null';
                }
                else if (Array.isArray(segment.value)) {
                    segment.type = 'array';
                    segment.description = 'Array[' + segment.value.length + '] ' + JSON.stringify(segment.value);
                }
                else if (segment.value instanceof Date) {
                    segment.type = 'date';
                }
                else {
                    segment.type = 'object';
                    segment.description = 'Object ' + JSON.stringify(segment.value);
                }
                break;
            }
        }
        return segment;
    };
    __decorate([
        Input()
    ], NgxJsonViewerComponent.prototype, "path", void 0);
    __decorate([
        Input()
    ], NgxJsonViewerComponent.prototype, "json", void 0);
    __decorate([
        Input()
    ], NgxJsonViewerComponent.prototype, "expanded", void 0);
    NgxJsonViewerComponent = __decorate([
        Component({
            selector: 'ngx-json-viewer',
            template: "<section class=\"ngx-json-viewer\">\n  <section\n    *ngFor=\"let segment of segments\"\n    [ngClass]=\"['segment', 'segment-type-' + segment.type]\">\n    <section\n      (click)=\"toggle(segment)\"\n      [ngClass]=\"{\n        'segment-main': true,\n        'expandable': isExpandable(segment),\n        'expanded': isChildExpanded(segment)\n      }\">\n      <div *ngIf=\"isExpandable(segment)\" class=\"toggler\"></div>\n      <span class=\"segment-key\">{{ segment.key }}</span>\n      <span class=\"segment-separator\">: </span>\n      <span *ngIf=\"!segment.expanded || !isExpandable(segment)\" class=\"segment-value\">{{ segment.description }}</span>\n    </section>\n    <section *ngIf=\"isChildExpanded(segment) && isExpandable(segment)\" class=\"children\">\n      <ngx-json-viewer [json]=\"segment.value\" [expanded]=\"expanded\" [path]=\"path.concat([segment.key])\"></ngx-json-viewer>\n    </section>\n  </section>\n</section>\n",
            styles: ["@charset \"UTF-8\";.ngx-json-viewer{font-family:monospace;font-size:1em;width:100%;height:100%;overflow:auto;position:relative}.ngx-json-viewer .segment{padding:2px;margin:1px 1px 1px 12px}.ngx-json-viewer .segment .segment-main{word-wrap:break-word}.ngx-json-viewer .segment .segment-main .toggler{position:absolute;margin-left:-14px;margin-top:3px;font-size:.8em;line-height:1.2em;vertical-align:middle;color:#787878}.ngx-json-viewer .segment .segment-main .toggler::after{display:inline-block;content:\"\u25BA\";-webkit-transition:-webkit-transform .1s ease-in;transition:transform .1s ease-in;transition:transform .1s ease-in,-webkit-transform .1s ease-in}.ngx-json-viewer .segment .segment-main .segment-key{color:#4e187c}.ngx-json-viewer .segment .segment-main .segment-separator{color:#999}.ngx-json-viewer .segment .segment-main .segment-value{color:#000}.ngx-json-viewer .segment .children{margin-left:12px}.ngx-json-viewer .segment-type-string>.segment-main>.segment-value{color:#ff6b6b}.ngx-json-viewer .segment-type-number>.segment-main>.segment-value{color:#009688}.ngx-json-viewer .segment-type-boolean>.segment-main>.segment-value{color:#b938a4}.ngx-json-viewer .segment-type-date>.segment-main>.segment-value{color:#05668d}.ngx-json-viewer .segment-type-array>.segment-main>.segment-value,.ngx-json-viewer .segment-type-function>.segment-main>.segment-value,.ngx-json-viewer .segment-type-object>.segment-main>.segment-value{color:#999}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value,.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{color:#fff}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value{background-color:red}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-key{color:#999}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{background-color:#999}.ngx-json-viewer .segment-type-array>.segment-main,.ngx-json-viewer .segment-type-object>.segment-main{white-space:nowrap}.ngx-json-viewer .expanded>.toggler::after{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.ngx-json-viewer .expandable,.ngx-json-viewer .expandable>.toggler{cursor:pointer}"]
        })
    ], NgxJsonViewerComponent);
    return NgxJsonViewerComponent;
}());

var NgxJsonViewerModule = /** @class */ (function () {
    function NgxJsonViewerModule() {
    }
    NgxJsonViewerModule = __decorate([
        NgModule({
            imports: [
                CommonModule
            ],
            declarations: [
                NgxJsonViewerComponent
            ],
            exports: [
                NgxJsonViewerComponent
            ]
        })
    ], NgxJsonViewerModule);
    return NgxJsonViewerModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { NgxJsonViewerComponent, NgxJsonViewerModule };
//# sourceMappingURL=ngx-json-viewer.js.map
