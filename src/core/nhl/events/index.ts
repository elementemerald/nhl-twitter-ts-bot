// Base event
export interface EventData {
    description: string
}

export class GenericEvent {
    data?: EventData;

    constructor(data: EventData) {
        this.data = data;
    }
}

// Built-in events
import { GoalEvent } from "./GoalEvent";

export interface EventMap {
    [index: string]: GenericEvent
}