/* eslint-disable no-undef */
import {JetApp, EmptyRouter, HashRouter} from "webix-jet";
import "./styles/app.css";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: !PRODUCTION,
			start: "/top/contacts"
		};

		super({...defaults, ...config});
	}
}
const app = new MyApp();
if (!BUILD_AS_MODULE) {
	webix.ready(() => {
		app.render();
		app.attachEvent("app:error:resolve", () => {
			webix.delay(() => app.show("/top/contacts"));
		});
	});
}
