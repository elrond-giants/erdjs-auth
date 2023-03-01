import {EventHandler, EventType, IEventBus} from "./types";

export default class EventsBus implements IEventBus {
    private bus: Record<string, EventHandler[]> = {};

    subscribe(key: EventType, handler: EventHandler): void {
        if (this.bus[key] === undefined) {
            this.bus[key] = [];
        }

        this.bus[key].push(handler);
    }

    unsubscribe(key: EventType, handler: EventHandler): void {
        if (this.bus[key] === undefined) {return;}
        const idx = this.bus[key].indexOf(handler);
        if (idx < 0) {return;}
        this.bus[key].splice(idx, 1);
    }

    emit(key: EventType, payload: any) {
        this.bus[key]?.forEach((handler) => {
            handler(payload);
        });
    }
};