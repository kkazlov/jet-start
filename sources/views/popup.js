import {JetView} from "webix-jet";

import activitiesDB from "../models/activitiesDB";
import activityTypesDB from "../models/activityTypesDB";
import contactsDB from "../models/contactsDB";

export default class Popup extends JetView {
	config() {
		const details = {
			view: "textarea",
			localId: "Details",
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
				body: {
					data: contactsDB,
					template: "#FirstName# #LastName#"
				}
			}
		};

		const date = {
			view: "datepicker",
			localId: "date",
			format: "%d %M %Y",
			label: "Date",
			value: new Date(),
			name: "Date"
		};

		const time = {
			view: "datepicker",
			localId: "time",
			type: "time",
			label: "Time",
			format: "%H:%i",
			value: new Date(),
			name: "Time",
			labelAlign: "right"
		};

		const completed = {
			view: "checkbox",
			label: "Completed",
			name: "State",
			checkValue: "Close",
			uncheckValue: "Open"
		};

		const actionBtn = {
			view: "button",
			localId: "actionBtn",
			width: 120,
			css: "customBtn"
		};

		const cancelBtn = {
			view: "button",
			width: 120,
			value: "Cancel",
			css: "customBtn",
			click: () => {
				this.hideWindow();
			}
		};

		return {
			view: "window",
			localId: "window",
			position: "center",
			head: "Add",
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
					{margin: 10, cols: [{}, actionBtn, cancelBtn]}
				],
				rules: {
					Details: webix.rules.isNotEmpty,
					TypeID: webix.rules.isNotEmpty,
					ContactID: webix.rules.isNotEmpty,
					Date: webix.rules.isNotEmpty,
					Time: webix.rules.isNotEmpty
				},
				elementsConfig: {
					invalidMessage: "Enter the correct value!"
				},
				on: {
					onChange: () => {
						this.$$("form").clearValidation();
					}
				}
			}
		};
	}

	init() {
		this.$$("actionBtn").attachEvent("onItemClick", () => {
			const form = this.$$("form");
			const value = form.getValues();
			const {Date: dateValue, Time: timeValue} = value;

			const dataFormat = webix.Date.dateToStr("%Y-%m-%d");
			const timeFormat = webix.Date.dateToStr("%H:%i");
			const date = dataFormat(dateValue);
			const time = timeFormat(timeValue);

			const DueDate = `${date} ${time}`;

			const dataObj = {...value, DueDate};
			delete dataObj.Time;
			delete dataObj.Date;

			const validation = form.validate();

			if (validation) {
				activitiesDB.waitSave(() => {
					if (this._popupType === "Add") {
						activitiesDB.add(dataObj);
					}
					else {
						activitiesDB.updateItem(this._id, dataObj);
					}
				});

				this.hideWindow();
			}
		});

		const details = this.$$("Details");
		this.on(details, "onFocus", () => this.$$("form").clearValidation());
	}

	showWindow(id) {
		if (id) {
			this._popupType = "Edit";
			this.getActivity(id);
		}
		else {
			this._popupType = "Add";
		}

		this.$$("actionBtn").setValue(this._popupType);

		const head = this.$$("window").getHead();
		head.$view.innerText = this._popupType;

		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();

		const form = this.$$("form");
		form.clear();
		form.clearValidation();

		this.$$("time").setValue(new Date());
		this.$$("date").setValue(new Date());
		webix.$$("addBtn").blur();
	}

	getActivity(id) {
		this._id = id;
		const form = this.$$("form");

		activitiesDB.waitData.then(() => {
			const value = activitiesDB.getItem(id);
			const {DueDate} = value;
			const _time = new Date(DueDate);
			const _date = new Date(DueDate);
			const dataObj = {...value, Time: _time, Date: _date};
			delete dataObj.DueDate;
			form.setValues(dataObj);
		});
	}
}
