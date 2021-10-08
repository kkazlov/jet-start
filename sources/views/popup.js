import {JetView} from "webix-jet";

import {
	activitiesDB,
	activityTypesDB,
	contactsDB
} from "../models/dataCollections";

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
			localId: "typeCombo",
			label: "Type",
			name: "TypeID",
			options: {
				filter: (item, value) =>
					item.Value.toString()
						.toLowerCase()
						.indexOf(value.toLowerCase()) !== -1,

				body: {
					data: activityTypesDB,
					template: "#Value#"
				}
			}
		};

		const contact = {
			view: "combo",
			label: "Contact",
			name: "ContactID",
			localId: "contactsCombo",
			options: {
				filter: (item, value) => {
					const {FirstName, LastName} = item;
					const firstName = FirstName.toLowerCase();
					const lastName = LastName.toLowerCase();

					return (
						firstName.indexOf(value) !== -1 ||
						lastName.indexOf(value) !== -1
					);
				},
				body: {
					data: contactsDB,
					template: "#FirstName# #LastName#"
				}
			}
		};

		const date = {
			view: "datepicker",
			label: "Date",
			name: "Date"
		};

		const time = {
			view: "datepicker",
			type: "time",
			label: "Time",
			name: "Time",
			labelAlign: "right"
		};

		const completed = {
			view: "checkbox",
			label: "Completed",
			name: "State"
		};

		const addBtn = {
			view: "button",
			localId: "addBtn",
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
				localId: "form",
				elements: [
					details,
					type,
					contact,
					{cols: [date, time]},
					completed,
					{margin: 10, cols: [{}, addBtn, cancelBtn]}
				],
				rules: {
					Details: webix.rules.isNotEmpty,
					TypeID: webix.rules.isNotEmpty,
					ContactID: webix.rules.isNotEmpty
				},
				elementsConfig: {
					invalidMessage: "Enter the correct value!",
					on: {
						onFocus: () => {
							this.$$("form").clearValidation();
						}
					}
				}
			}
		};
	}

	init() {
		this.$$("addBtn").attachEvent("onItemClick", () => {
			const form = this.$$("form");
			const value = form.getValues();
			const {Date: dateValue, Time: timeValue, State: stateValue} = value;

			const dataFormat = webix.Date.dateToStr("%Y-%m-%d");
			const timeFormat = webix.Date.dateToStr("%H:%i");
			const date = dataFormat(dateValue);
			const time = timeFormat(timeValue);

			const DueDate = `${date} ${time}`;
			const state = stateValue ? "Close" : "Open";

			const dataObj = {...value, DueDate, State: state};
			delete dataObj.Time;
			delete dataObj.Date;

			const validation = form.validate();

			if (validation) {
				activitiesDB.waitSave(() => {
					activitiesDB.add(dataObj);
				});
				this.hideWindow();
				form.clear();
			}
		});
	}

	showWindow() {
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
	}
}
