import { GenericEvent, EventData } from ".";

export class GoalEvent extends GenericEvent {
    constructor(data: EventData) {
        super(data);
    }
}