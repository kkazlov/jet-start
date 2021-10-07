import {JetView} from "webix-jet";

export default class PopupView extends JetView {
	config() {
		return {
			view: "window",
			head: "Окошко",
			position: "center"
		};
	}

	showWindow() {
		this.getRoot().show();
	}
}
