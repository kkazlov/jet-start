import {JetView} from "webix-jet";

export default class PopupView extends JetView {
	config() {
		const details = {
			view: "textarea",
			label: "Details",
			name: "Details",
			height: 100
		};

		const type = {
			view: "combo",
			label: "Type",
			name: "Type",
			options: ["One", "Two", "Three"]
		};

		const contact = {
			view: "combo",
			label: "Contact",
			name: "Contact",
			options: ["One", "Two", "Three"]
		};

		const date = {
			view: "datepicker",
			label: "Date",
			name: "Date",
			value: new Date()
		};

		const time = {
			view: "datepicker",
			type: "time",
			label: "Time",
			name: "Time",
			value: new Date(),
			labelAlign: "right"
		};

		const completed = {
			view: "checkbox",
			label: "Completed",
			name: "Completed",
			value: 1
		};

		const addBtn = {
			view: "button",
			width: 120,
			value: "Add",
			css: "customBtn"
		};

		const cancelBtn = {
			view: "button",
			width: 120,
			value: "Cancel",
			css: "customBtn",
			click: () => this.hideWindow()
		};

		return {
			view: "window",
			position: "center",
			head: "Save",
			width: 600,
			body: {
				view: "form",
				elements: [
					details,
					type,
					contact,
					{cols: [date, time]},
					completed,
					{margin: 10, cols: [{}, addBtn, cancelBtn]}
				]
			}
		};
	}

	showWindow() {
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
	}
}
