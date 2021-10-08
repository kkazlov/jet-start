import {JetView} from "webix-jet";

import {
	activitiesDB,
	activityTypesDB,
	contactsDB
} from "../models/dataCollections";

export default class PopupConstr extends JetView {
	constructor(app, popupType) {
		super(app);
		this._popupType = popupType;
	}

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
				filter: (item, value) => item.Value.toString().toLowerCase()
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
			name: "State"
		};

		const actionBtn = {
			view: "button",
			localId: "actionBtn",
			width: 120,
			value: this._popupType,
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
			head: this._popupType,
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
		this.$$("actionBtn").attachEvent("onItemClick", () => {
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
					if (this._popupType === "Add") {
						activitiesDB.add(dataObj);
					}
					else {
						activitiesDB.updateItem(this._id, dataObj);
					}
				});

				this.hideWindow();
				form.clear();
				this.$$("time").setValue(new Date());
				this.$$("date").setValue(new Date());
			}
		});
	}

	showWindow() {
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
	}

	getActivity(id) {
		this._id = id;
		const form = this.$$("form");

		activitiesDB.waitData.then(() => {
			const value = activitiesDB.getItem(id);
			const {DueDate, State} = value;
			const _state = State === "Close" ? 1 : 0;
			const _time = new Date(DueDate);
			const _date = new Date(DueDate);
			const dataObj = {...value, State: _state, Time: _time, Date: _date};
			delete dataObj.DueDate;
			form.setValues(dataObj);
		});
	}
}
