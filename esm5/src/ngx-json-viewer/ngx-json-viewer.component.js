import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
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
    tslib_1.__decorate([
        Input()
    ], NgxJsonViewerComponent.prototype, "path", void 0);
    tslib_1.__decorate([
        Input()
    ], NgxJsonViewerComponent.prototype, "json", void 0);
    tslib_1.__decorate([
        Input()
    ], NgxJsonViewerComponent.prototype, "expanded", void 0);
    NgxJsonViewerComponent = tslib_1.__decorate([
        Component({
            selector: 'ngx-json-viewer',
            template: "<section class=\"ngx-json-viewer\">\n  <section\n    *ngFor=\"let segment of segments\"\n    [ngClass]=\"['segment', 'segment-type-' + segment.type]\">\n    <section\n      (click)=\"toggle(segment)\"\n      [ngClass]=\"{\n        'segment-main': true,\n        'expandable': isExpandable(segment),\n        'expanded': isChildExpanded(segment)\n      }\">\n      <div *ngIf=\"isExpandable(segment)\" class=\"toggler\"></div>\n      <span class=\"segment-key\">{{ segment.key }}</span>\n      <span class=\"segment-separator\">: </span>\n      <span *ngIf=\"!segment.expanded || !isExpandable(segment)\" class=\"segment-value\">{{ segment.description }}</span>\n    </section>\n    <section *ngIf=\"isChildExpanded(segment) && isExpandable(segment)\" class=\"children\">\n      <ngx-json-viewer [json]=\"segment.value\" [expanded]=\"expanded\" [path]=\"path.concat([segment.key])\"></ngx-json-viewer>\n    </section>\n  </section>\n</section>\n",
            styles: ["@charset \"UTF-8\";.ngx-json-viewer{font-family:monospace;font-size:1em;width:100%;height:100%;overflow:auto;position:relative}.ngx-json-viewer .segment{padding:2px;margin:1px 1px 1px 12px}.ngx-json-viewer .segment .segment-main{word-wrap:break-word}.ngx-json-viewer .segment .segment-main .toggler{position:absolute;margin-left:-14px;margin-top:3px;font-size:.8em;line-height:1.2em;vertical-align:middle;color:#787878}.ngx-json-viewer .segment .segment-main .toggler::after{display:inline-block;content:\"\u25BA\";-webkit-transition:-webkit-transform .1s ease-in;transition:transform .1s ease-in;transition:transform .1s ease-in,-webkit-transform .1s ease-in}.ngx-json-viewer .segment .segment-main .segment-key{color:#4e187c}.ngx-json-viewer .segment .segment-main .segment-separator{color:#999}.ngx-json-viewer .segment .segment-main .segment-value{color:#000}.ngx-json-viewer .segment .children{margin-left:12px}.ngx-json-viewer .segment-type-string>.segment-main>.segment-value{color:#ff6b6b}.ngx-json-viewer .segment-type-number>.segment-main>.segment-value{color:#009688}.ngx-json-viewer .segment-type-boolean>.segment-main>.segment-value{color:#b938a4}.ngx-json-viewer .segment-type-date>.segment-main>.segment-value{color:#05668d}.ngx-json-viewer .segment-type-array>.segment-main>.segment-value,.ngx-json-viewer .segment-type-function>.segment-main>.segment-value,.ngx-json-viewer .segment-type-object>.segment-main>.segment-value{color:#999}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value,.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{color:#fff}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value{background-color:red}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-key{color:#999}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{background-color:#999}.ngx-json-viewer .segment-type-array>.segment-main,.ngx-json-viewer .segment-type-object>.segment-main{white-space:nowrap}.ngx-json-viewer .expanded>.toggler::after{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.ngx-json-viewer .expandable,.ngx-json-viewer .expandable>.toggler{cursor:pointer}"]
        })
    ], NgxJsonViewerComponent);
    return NgxJsonViewerComponent;
}());
export { NgxJsonViewerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1qc29uLXZpZXdlci8iLCJzb3VyY2VzIjpbInNyYy9uZ3gtanNvbi12aWV3ZXIvbmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYSxLQUFLLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQzNFLE9BQU8sT0FBTyxNQUFNLFlBQVksQ0FBQztBQWVqQztJQUxBO1FBT1csU0FBSSxHQUFhLEVBQUUsQ0FBQztRQUVwQixhQUFRLEdBQUcsSUFBSSxDQUFDO1FBRXpCLGFBQVEsR0FBYyxFQUFFLENBQUM7UUFDUixxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO0lBdUd4RCxDQUFDO0lBckdDLDRDQUFXLEdBQVgsVUFBWSxPQUFzQjtRQUFsQyxpQkF5QkM7UUF4QkMsNEZBQTRGO1FBQzVGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ25GLE9BQU87U0FDUjtRQUNELElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBRTFDLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxLQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO1NBQ3hGO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFJLE9BQU8s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cywgSW5wdXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCBpc0VxdWFsIGZyb20gJ2RlZXAtZXF1YWwnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlZ21lbnQge1xuICBrZXk6IHN0cmluZztcbiAgdmFsdWU6IGFueTtcbiAgdHlwZTogdW5kZWZpbmVkIHwgc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBleHBhbmRlZDogYm9vbGVhbjtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmd4LWpzb24tdmlld2VyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25neC1qc29uLXZpZXdlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25neC1qc29uLXZpZXdlci5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5neEpzb25WaWV3ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gIEBJbnB1dCgpIHBhdGg6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIGpzb246IGFueTtcbiAgQElucHV0KCkgZXhwYW5kZWQgPSB0cnVlO1xuXG4gIHNlZ21lbnRzOiBTZWdtZW50W10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBleHBhbmRlZENoaWxkcmVuID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIC8vIFJlLXBhcnNlIG9ubHkgaWYgSlNPTiBjaGFuZ2VkICYgdmFsdWVzIGFyZSBub3Qgc2ltaWxhciAodXNlIGRlZXAgb2JqZWN0L2FycmF5IGNvbXBhcmlzb24pXG4gICAgaWYgKCFjaGFuZ2VzLmpzb24gfHwgaXNFcXVhbChjaGFuZ2VzLmpzb24ucHJldmlvdXNWYWx1ZSwgY2hhbmdlcy5qc29uLmN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbmV3SnNvbiA9IGNoYW5nZXMuanNvbi5jdXJyZW50VmFsdWU7XG5cbiAgICBpZiAodHlwZW9mIG5ld0pzb24gPT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLnNlZ21lbnRzID0gT2JqZWN0LmtleXMobmV3SnNvbikubWFwKGtleSA9PiB0aGlzLnBhcnNlS2V5VmFsdWUoa2V5LCBuZXdKc29uW2tleV0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWdtZW50cyA9IFt0aGlzLnBhcnNlS2V5VmFsdWUoYCgke3R5cGVvZiBuZXdKc29ufSlgLCBuZXdKc29uKV07XG4gICAgfVxuXG4gICAgaWYgKCFjaGFuZ2VzLmV4cGFuZGVkKSB7XG4gICAgICAvLyBDbGVhbiB1cCBleHBhbmRlZCBjaGlsZHJlbiBrZXlzIHRoYXQgbm8gbG9uZ2VyIGV4aXN0LlxuICAgICAgZm9yIChjb25zdCBvbGRDaGlsZFNlZ21lbnRkS2V5IGluIHRoaXMuZXhwYW5kZWRDaGlsZHJlbi52YWx1ZXMoKSkge1xuICAgICAgICBpZiAoIXRoaXMuc2VnbWVudHMuc29tZShzID0+IHMua2V5ID09PSBvbGRDaGlsZFNlZ21lbnRkS2V5KSkge1xuICAgICAgICAgIHRoaXMuZXhwYW5kZWRDaGlsZHJlbi5kZWxldGUob2xkQ2hpbGRTZWdtZW50ZEtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDbGVhciB0aGUgc3RhdGUgb2YgaW5kaXZpZHVhbCBlbGVtZW50cy5cbiAgICAgIHRoaXMuZXhwYW5kZWRDaGlsZHJlbi5jbGVhcigpO1xuICAgIH1cbiAgfVxuXG4gIGlzRXhwYW5kYWJsZShzZWdtZW50OiBTZWdtZW50KSB7XG4gICAgcmV0dXJuIHNlZ21lbnQudHlwZSA9PT0gJ29iamVjdCcgfHwgc2VnbWVudC50eXBlID09PSAnYXJyYXknO1xuICB9XG5cbiAgaXNDaGlsZEV4cGFuZGVkKHNlZ21lbnQ6IFNlZ21lbnQgfCBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbmRlZENoaWxkcmVuLmhhcyh0eXBlb2Ygc2VnbWVudCA9PT0gJ3N0cmluZycgPyBzZWdtZW50IDogc2VnbWVudC5rZXkpO1xuICB9XG5cbiAgdG9nZ2xlKHNlZ21lbnQ6IFNlZ21lbnQpIHtcbiAgICAvLyBDaGVjayBpZiB0aGUgZ2l2ZW4gc2VnbWVudCBpcyBleHBhbmRhYmxlLlxuICAgIC8vIFRoaXMgY2hlY2sgaXMgcmVxdWlyZWQgdG8gYXZvaWQgc3RvcmluZyB1c2VsZXNzIGtleXMgaW4gdGhlIGV4cGFuZGVkIGNoaWxkcmVuIHNldC5cbiAgICBpZiAodGhpcy5pc0V4cGFuZGFibGUoc2VnbWVudCkpIHtcbiAgICAgIC8vIEFkZCBvciByZW1vdmUgdGhlIHNlZ21lbnQga2V5IHRvIHRoZSBzZXQgb2Ygb3BlbmVkIHNlZ21lbnRzXG4gICAgICBpZiAodGhpcy5pc0NoaWxkRXhwYW5kZWQoc2VnbWVudCkpIHtcbiAgICAgICAgdGhpcy5leHBhbmRlZENoaWxkcmVuLmRlbGV0ZShzZWdtZW50LmtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV4cGFuZGVkQ2hpbGRyZW4uYWRkKHNlZ21lbnQua2V5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlS2V5VmFsdWUoa2V5OiBhbnksIHZhbHVlOiBhbnkpOiBTZWdtZW50IHtcbiAgICBjb25zdCBzZWdtZW50OiBTZWdtZW50ID0ge1xuICAgICAga2V5LFxuICAgICAgdmFsdWUsXG4gICAgICB0eXBlOiB1bmRlZmluZWQsXG4gICAgICBkZXNjcmlwdGlvbjogJycgKyB2YWx1ZSxcbiAgICAgIC8vIFJldHJpZXZlIHRoZSBjdXJyZW50IGV4cGFuZCBzdGF0ZS5cbiAgICAgIGV4cGFuZGVkOiB0aGlzLmV4cGFuZGVkIHx8IHRoaXMuaXNDaGlsZEV4cGFuZGVkKGtleSksXG4gICAgfTtcblxuICAgIHN3aXRjaCAodHlwZW9mIHNlZ21lbnQudmFsdWUpIHtcbiAgICAgIGNhc2UgJ251bWJlcic6IHtcbiAgICAgICAgc2VnbWVudC50eXBlID0gJ251bWJlcic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAnYm9vbGVhbic6IHtcbiAgICAgICAgc2VnbWVudC50eXBlID0gJ2Jvb2xlYW4nO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzoge1xuICAgICAgICBzZWdtZW50LnR5cGUgPSAnZnVuY3Rpb24nO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3N0cmluZyc6IHtcbiAgICAgICAgc2VnbWVudC50eXBlID0gJ3N0cmluZyc7XG4gICAgICAgIHNlZ21lbnQuZGVzY3JpcHRpb24gPSAnXCInICsgc2VnbWVudC52YWx1ZSArICdcIic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAndW5kZWZpbmVkJzoge1xuICAgICAgICBzZWdtZW50LnR5cGUgPSAndW5kZWZpbmVkJztcbiAgICAgICAgc2VnbWVudC5kZXNjcmlwdGlvbiA9ICd1bmRlZmluZWQnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgJ29iamVjdCc6IHtcbiAgICAgICAgLy8geWVhLCBudWxsIGlzIG9iamVjdFxuICAgICAgICBpZiAoc2VnbWVudC52YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHNlZ21lbnQudHlwZSA9ICdudWxsJztcbiAgICAgICAgICBzZWdtZW50LmRlc2NyaXB0aW9uID0gJ251bGwnO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2VnbWVudC52YWx1ZSkpIHtcbiAgICAgICAgICBzZWdtZW50LnR5cGUgPSAnYXJyYXknO1xuICAgICAgICAgIHNlZ21lbnQuZGVzY3JpcHRpb24gPSAnQXJyYXlbJyArIHNlZ21lbnQudmFsdWUubGVuZ3RoICsgJ10gJyArIEpTT04uc3RyaW5naWZ5KHNlZ21lbnQudmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlZ21lbnQudmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgc2VnbWVudC50eXBlID0gJ2RhdGUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlZ21lbnQudHlwZSA9ICdvYmplY3QnO1xuICAgICAgICAgIHNlZ21lbnQuZGVzY3JpcHRpb24gPSAnT2JqZWN0ICcgKyBKU09OLnN0cmluZ2lmeShzZWdtZW50LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudDtcbiAgfVxufVxuIl19