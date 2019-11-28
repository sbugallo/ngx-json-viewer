import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import isEqual from 'deep-equal';
let NgxJsonViewerComponent = class NgxJsonViewerComponent {
    constructor() {
        this.path = [];
        this.expanded = true;
        this.segments = [];
        this.expandedChildren = new Set();
    }
    ngOnChanges(changes) {
        // Re-parse only if JSON changed & values are not similar (use deep object/array comparison)
        if (!changes.json || isEqual(changes.json.previousValue, changes.json.currentValue)) {
            return;
        }
        const newJson = changes.json.currentValue;
        if (typeof newJson === 'object') {
            this.segments = Object.keys(newJson).map(key => this.parseKeyValue(key, newJson[key]));
        }
        else {
            this.segments = [this.parseKeyValue(`(${typeof newJson})`, newJson)];
        }
        if (!changes.expanded) {
            // Clean up expanded children keys that no longer exist.
            for (const oldChildSegmentdKey in this.expandedChildren.values()) {
                if (!this.segments.some(s => s.key === oldChildSegmentdKey)) {
                    this.expandedChildren.delete(oldChildSegmentdKey);
                }
            }
        }
        else {
            // Clear the state of individual elements.
            this.expandedChildren.clear();
        }
    }
    isExpandable(segment) {
        return segment.type === 'object' || segment.type === 'array';
    }
    isChildExpanded(segment) {
        return this.expandedChildren.has(typeof segment === 'string' ? segment : segment.key);
    }
    toggle(segment) {
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
    }
    parseKeyValue(key, value) {
        const segment = {
            key,
            value,
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
    }
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
        styles: ["@charset \"UTF-8\";.ngx-json-viewer{font-family:monospace;font-size:1em;width:100%;height:100%;overflow:hidden;position:relative}.ngx-json-viewer .segment{padding:2px;margin:1px 1px 1px 12px}.ngx-json-viewer .segment .segment-main{word-wrap:break-word}.ngx-json-viewer .segment .segment-main .toggler{position:absolute;margin-left:-14px;margin-top:3px;font-size:.8em;line-height:1.2em;vertical-align:middle;color:#787878}.ngx-json-viewer .segment .segment-main .toggler::after{display:inline-block;content:\"\u25BA\";-webkit-transition:-webkit-transform .1s ease-in;transition:transform .1s ease-in;transition:transform .1s ease-in,-webkit-transform .1s ease-in}.ngx-json-viewer .segment .segment-main .segment-key{color:#4e187c}.ngx-json-viewer .segment .segment-main .segment-separator{color:#999}.ngx-json-viewer .segment .segment-main .segment-value{color:#000}.ngx-json-viewer .segment .children{margin-left:12px}.ngx-json-viewer .segment-type-string>.segment-main>.segment-value{color:#ff6b6b}.ngx-json-viewer .segment-type-number>.segment-main>.segment-value{color:#009688}.ngx-json-viewer .segment-type-boolean>.segment-main>.segment-value{color:#b938a4}.ngx-json-viewer .segment-type-date>.segment-main>.segment-value{color:#05668d}.ngx-json-viewer .segment-type-array>.segment-main>.segment-value,.ngx-json-viewer .segment-type-function>.segment-main>.segment-value,.ngx-json-viewer .segment-type-object>.segment-main>.segment-value{color:#999}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value,.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{color:#fff}.ngx-json-viewer .segment-type-null>.segment-main>.segment-value{background-color:red}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-key{color:#999}.ngx-json-viewer .segment-type-undefined>.segment-main>.segment-value{background-color:#999}.ngx-json-viewer .segment-type-array>.segment-main,.ngx-json-viewer .segment-type-object>.segment-main{white-space:nowrap}.ngx-json-viewer .expanded>.toggler::after{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.ngx-json-viewer .expandable,.ngx-json-viewer .expandable>.toggler{cursor:pointer}"]
    })
], NgxJsonViewerComponent);
export { NgxJsonViewerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1qc29uLXZpZXdlci8iLCJzb3VyY2VzIjpbInNyYy9uZ3gtanNvbi12aWV3ZXIvbmd4LWpzb24tdmlld2VyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYSxLQUFLLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQzNFLE9BQU8sT0FBTyxNQUFNLFlBQVksQ0FBQztBQWVqQyxJQUFhLHNCQUFzQixHQUFuQyxNQUFhLHNCQUFzQjtJQUxuQztRQU9VLFNBQUksR0FBYSxFQUFFLENBQUM7UUFFcEIsYUFBUSxHQUFHLElBQUksQ0FBQztRQUV6QixhQUFRLEdBQWMsRUFBRSxDQUFDO1FBQ1IscUJBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztJQXVHdkQsQ0FBQztJQXJHQSxXQUFXLENBQUMsT0FBc0I7UUFDakMsNEZBQTRGO1FBQzVGLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3BGLE9BQU87U0FDUDtRQUNELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBRTFDLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZGO2FBQU07WUFDTixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLE9BQU8s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O29CQUMzQixPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztvQkFDdEIsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7aUJBQzdCO3FCQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ3hDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO29CQUN2QixPQUFPLENBQUMsV0FBVyxHQUFHLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzdGO3FCQUFNLElBQUksT0FBTyxDQUFDLEtBQUssWUFBWSxJQUFJLEVBQUU7b0JBQ3pDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO2lCQUN0QjtxQkFBTTtvQkFDTixPQUFPLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLFdBQVcsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2hFO2dCQUNELE1BQU07YUFDTjtTQUNEO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDaEIsQ0FBQztDQUNELENBQUE7QUE1R1M7SUFBUixLQUFLLEVBQUU7b0RBQXFCO0FBQ3BCO0lBQVIsS0FBSyxFQUFFO29EQUFXO0FBQ1Y7SUFBUixLQUFLLEVBQUU7d0RBQWlCO0FBSmIsc0JBQXNCO0lBTGxDLFNBQVMsQ0FBQztRQUNWLFFBQVEsRUFBRSxpQkFBaUI7UUFDM0IsNDdCQUErQzs7S0FFL0MsQ0FBQztHQUNXLHNCQUFzQixDQThHbEM7U0E5R1ksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkNoYW5nZXMsIElucHV0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgaXNFcXVhbCBmcm9tICdkZWVwLWVxdWFsJztcblxuZXhwb3J0IGludGVyZmFjZSBTZWdtZW50IHtcblx0a2V5OiBzdHJpbmc7XG5cdHZhbHVlOiBhbnk7XG5cdHR5cGU6IHVuZGVmaW5lZCB8IHN0cmluZztcblx0ZGVzY3JpcHRpb246IHN0cmluZztcblx0ZXhwYW5kZWQ6IGJvb2xlYW47XG59XG5cbkBDb21wb25lbnQoe1xuXHRzZWxlY3RvcjogJ25neC1qc29uLXZpZXdlcicsXG5cdHRlbXBsYXRlVXJsOiAnLi9uZ3gtanNvbi12aWV3ZXIuY29tcG9uZW50Lmh0bWwnLFxuXHRzdHlsZVVybHM6IFsnLi9uZ3gtanNvbi12aWV3ZXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOZ3hKc29uVmlld2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuXHRASW5wdXQoKSBwYXRoOiBzdHJpbmdbXSA9IFtdO1xuXHRASW5wdXQoKSBqc29uOiBhbnk7XG5cdEBJbnB1dCgpIGV4cGFuZGVkID0gdHJ1ZTtcblxuXHRzZWdtZW50czogU2VnbWVudFtdID0gW107XG5cdHByaXZhdGUgcmVhZG9ubHkgZXhwYW5kZWRDaGlsZHJlbiA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG5cdG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcblx0XHQvLyBSZS1wYXJzZSBvbmx5IGlmIEpTT04gY2hhbmdlZCAmIHZhbHVlcyBhcmUgbm90IHNpbWlsYXIgKHVzZSBkZWVwIG9iamVjdC9hcnJheSBjb21wYXJpc29uKVxuXHRcdGlmICghY2hhbmdlcy5qc29uIHx8IGlzRXF1YWwoY2hhbmdlcy5qc29uLnByZXZpb3VzVmFsdWUsIGNoYW5nZXMuanNvbi5jdXJyZW50VmFsdWUpKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdGNvbnN0IG5ld0pzb24gPSBjaGFuZ2VzLmpzb24uY3VycmVudFZhbHVlO1xuXG5cdFx0aWYgKHR5cGVvZiBuZXdKc29uID09PSAnb2JqZWN0Jykge1xuXHRcdFx0dGhpcy5zZWdtZW50cyA9IE9iamVjdC5rZXlzKG5ld0pzb24pLm1hcChrZXkgPT4gdGhpcy5wYXJzZUtleVZhbHVlKGtleSwgbmV3SnNvbltrZXldKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2VnbWVudHMgPSBbdGhpcy5wYXJzZUtleVZhbHVlKGAoJHt0eXBlb2YgbmV3SnNvbn0pYCwgbmV3SnNvbildO1xuXHRcdH1cblxuXHRcdGlmKCFjaGFuZ2VzLmV4cGFuZGVkKXtcblx0XHRcdC8vIENsZWFuIHVwIGV4cGFuZGVkIGNoaWxkcmVuIGtleXMgdGhhdCBubyBsb25nZXIgZXhpc3QuXG5cdFx0XHRmb3IoY29uc3Qgb2xkQ2hpbGRTZWdtZW50ZEtleSBpbiB0aGlzLmV4cGFuZGVkQ2hpbGRyZW4udmFsdWVzKCkpe1xuXHRcdFx0XHRpZighdGhpcy5zZWdtZW50cy5zb21lKHMgPT4gcy5rZXkgPT09IG9sZENoaWxkU2VnbWVudGRLZXkpKXtcblx0XHRcdFx0XHR0aGlzLmV4cGFuZGVkQ2hpbGRyZW4uZGVsZXRlKG9sZENoaWxkU2VnbWVudGRLZXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gQ2xlYXIgdGhlIHN0YXRlIG9mIGluZGl2aWR1YWwgZWxlbWVudHMuXG5cdFx0XHR0aGlzLmV4cGFuZGVkQ2hpbGRyZW4uY2xlYXIoKTtcblx0XHR9XG5cdH1cblxuXHRpc0V4cGFuZGFibGUoc2VnbWVudDogU2VnbWVudCkge1xuXHRcdHJldHVybiBzZWdtZW50LnR5cGUgPT09ICdvYmplY3QnIHx8IHNlZ21lbnQudHlwZSA9PT0gJ2FycmF5Jztcblx0fVxuXG5cdGlzQ2hpbGRFeHBhbmRlZChzZWdtZW50OiBTZWdtZW50IHwgc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHRoaXMuZXhwYW5kZWRDaGlsZHJlbi5oYXModHlwZW9mIHNlZ21lbnQgPT09ICdzdHJpbmcnID8gc2VnbWVudCA6IHNlZ21lbnQua2V5KTtcblx0fVxuXG5cdHRvZ2dsZShzZWdtZW50OiBTZWdtZW50KSB7XG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIGdpdmVuIHNlZ21lbnQgaXMgZXhwYW5kYWJsZS5cblx0XHQvLyBUaGlzIGNoZWNrIGlzIHJlcXVpcmVkIHRvIGF2b2lkIHN0b3JpbmcgdXNlbGVzcyBrZXlzIGluIHRoZSBleHBhbmRlZCBjaGlsZHJlbiBzZXQuXG5cdFx0aWYgKHRoaXMuaXNFeHBhbmRhYmxlKHNlZ21lbnQpKSB7XG5cdFx0XHQvLyBBZGQgb3IgcmVtb3ZlIHRoZSBzZWdtZW50IGtleSB0byB0aGUgc2V0IG9mIG9wZW5lZCBzZWdtZW50c1xuXHRcdFx0aWYgKHRoaXMuaXNDaGlsZEV4cGFuZGVkKHNlZ21lbnQpKSB7XG5cdFx0XHRcdHRoaXMuZXhwYW5kZWRDaGlsZHJlbi5kZWxldGUoc2VnbWVudC5rZXkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5leHBhbmRlZENoaWxkcmVuLmFkZChzZWdtZW50LmtleSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBwYXJzZUtleVZhbHVlKGtleTogYW55LCB2YWx1ZTogYW55KTogU2VnbWVudCB7XG5cdFx0Y29uc3Qgc2VnbWVudDogU2VnbWVudCA9IHtcblx0XHRcdGtleSxcblx0XHRcdHZhbHVlLFxuXHRcdFx0dHlwZTogdW5kZWZpbmVkLFxuXHRcdFx0ZGVzY3JpcHRpb246ICcnICsgdmFsdWUsXG5cdFx0XHQvLyBSZXRyaWV2ZSB0aGUgY3VycmVudCBleHBhbmQgc3RhdGUuXG5cdFx0XHRleHBhbmRlZDogdGhpcy5leHBhbmRlZCB8fCB0aGlzLmlzQ2hpbGRFeHBhbmRlZChrZXkpLFxuXHRcdH07XG5cblx0XHRzd2l0Y2ggKHR5cGVvZiBzZWdtZW50LnZhbHVlKSB7XG5cdFx0XHRjYXNlICdudW1iZXInOiB7XG5cdFx0XHRcdHNlZ21lbnQudHlwZSA9ICdudW1iZXInO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNhc2UgJ2Jvb2xlYW4nOiB7XG5cdFx0XHRcdHNlZ21lbnQudHlwZSA9ICdib29sZWFuJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdmdW5jdGlvbic6IHtcblx0XHRcdFx0c2VnbWVudC50eXBlID0gJ2Z1bmN0aW9uJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdzdHJpbmcnOiB7XG5cdFx0XHRcdHNlZ21lbnQudHlwZSA9ICdzdHJpbmcnO1xuXHRcdFx0XHRzZWdtZW50LmRlc2NyaXB0aW9uID0gJ1wiJyArIHNlZ21lbnQudmFsdWUgKyAnXCInO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGNhc2UgJ3VuZGVmaW5lZCc6IHtcblx0XHRcdFx0c2VnbWVudC50eXBlID0gJ3VuZGVmaW5lZCc7XG5cdFx0XHRcdHNlZ21lbnQuZGVzY3JpcHRpb24gPSAndW5kZWZpbmVkJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlICdvYmplY3QnOiB7XG5cdFx0XHRcdC8vIHllYSwgbnVsbCBpcyBvYmplY3Rcblx0XHRcdFx0aWYgKHNlZ21lbnQudmFsdWUgPT09IG51bGwpIHtcblx0XHRcdFx0XHRzZWdtZW50LnR5cGUgPSAnbnVsbCc7XG5cdFx0XHRcdFx0c2VnbWVudC5kZXNjcmlwdGlvbiA9ICdudWxsJztcblx0XHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNlZ21lbnQudmFsdWUpKSB7XG5cdFx0XHRcdFx0c2VnbWVudC50eXBlID0gJ2FycmF5Jztcblx0XHRcdFx0XHRzZWdtZW50LmRlc2NyaXB0aW9uID0gJ0FycmF5WycgKyBzZWdtZW50LnZhbHVlLmxlbmd0aCArICddICcgKyBKU09OLnN0cmluZ2lmeShzZWdtZW50LnZhbHVlKTtcblx0XHRcdFx0fSBlbHNlIGlmIChzZWdtZW50LnZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuXHRcdFx0XHRcdHNlZ21lbnQudHlwZSA9ICdkYXRlJztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWdtZW50LnR5cGUgPSAnb2JqZWN0Jztcblx0XHRcdFx0XHRzZWdtZW50LmRlc2NyaXB0aW9uID0gJ09iamVjdCAnICsgSlNPTi5zdHJpbmdpZnkoc2VnbWVudC52YWx1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNlZ21lbnQ7XG5cdH1cbn1cbiJdfQ==