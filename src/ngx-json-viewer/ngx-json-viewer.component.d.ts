import { OnChanges, SimpleChanges } from '@angular/core';
export interface Segment {
    key: string;
    value: any;
    type: undefined | string;
    description: string;
    expanded: boolean;
}
export declare class NgxJsonViewerComponent implements OnChanges {
    path: string[];
    json: any;
    expanded: boolean;
    segments: Segment[];
    private readonly expandedChildren;
    ngOnChanges(changes: SimpleChanges): void;
    isExpandable(segment: Segment): boolean;
    isChildExpanded(segment: Segment | string): boolean;
    toggle(segment: Segment): void;
    private parseKeyValue;
}
