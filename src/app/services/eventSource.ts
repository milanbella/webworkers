import * as Rx from 'rxjs/Rx';
import { _ } from 'underscore';

export class EventSource {

	public foo: string;

	private observers: any = [];
	public source: any;

	constructor () {
		this.observers = [];

		this.source = Rx.Observable.create((observer) => {
			this.observers.push(observer);

			return () => {
				this.observers = _.filter(this.observers, (o) => {
					return o !== observer;
				});
			};

		});

	}

	public generateEvent (e?) {
		_.each(this.observers, (observer) => {
			observer.next(e);
		});
	};

	public generateError = (err) => {
		_.each(this.observers, (observer) => {
			observer.error(err);
		});
	};

	static authenticateEvenSource: EventSource = new EventSource();
	static principalChangeEventSource: EventSource = new EventSource();
	static offlineEventSource = new EventSource();
	static settingsChangeEventSource = new EventSource();
	static componentsMessagingnEventSource: EventSource = new EventSource();
} 

export type ComponentName = 'page-login' | 'page-bla-bla';

interface ComponentMessage {
	componentName: ComponentName
	message: any;
}

export function sendComponentMessage (target: ComponentName, message: any) {
	var componentMessage: ComponentMessage = {
		componentName: target,
		message: message
	};
	EventSource.componentsMessagingnEventSource.generateEvent(componentMessage);
}
