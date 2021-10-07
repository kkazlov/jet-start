import {JetView} from "webix-jet";

import {
	activitiesDB,
	activityTypesDB,
	contactsDB
} from "../models/dataCollections";
import PopupView from "./popup";

import "../styles/activities.css";

export default class Activities extends JetView {
	config() {
		const addBtn = {
			view: "button",
			localId: "addBtn",
			type: "icon",
			width: 150,
			height: 50,
			icon: "fas fa-plus-square",
			label: "Add activity",
			css: "customBtn",
			click: () => this._popup.showWindow()
		};

		const table = {
			view: "datatable",
			localId: "table",
			css: "webix_data_border webix_header_border activiti-table",
			columns: [
				{
					id: "check",
					header: "",
					fillspace: 1,
					template: "{common.checkbox()}",
					css: {"text-align": "center"}
				},
				{
					id: "ActivityType",
					header: "Activity type",
					fillspace: 3,
					template: ({TypeID}) => {
						const activityType = activityTypesDB.getItem(TypeID);
						const {Value, Icon} = activityType;
						return `${Value} <span class='fas fa-${Icon}'></span>`;
					}
				},
				{id: "DueDate", header: "Due date", fillspace: 3},
				{id: "Details", header: "Details", fillspace: 6},
				{
					id: "Contact",
					header: "Contact",
					fillspace: 3,
					template: ({ContactID}) => {
						const contact = contactsDB.getItem(ContactID);
						const {FirstName, LastName} = contact;
						return `${FirstName} ${LastName}`;
					}
				},
				{
					id: "edit",
					header: "",
					fillspace: 1,
					css: {"text-align": "center"},
					template: () =>
						"<span class='far fa-edit onEdit table-icon'></span>"
				},
				{
					id: "delete",
					header: "",
					fillspace: 1,
					css: {"text-align": "center"},
					template: () =>
						"<span class='far fa-trash-alt onDelete table-icon'></span>"
				}
			],

			onClick: {
				onDelete: function (e, id) {
					webix
						.confirm({
							title: "Delete",
							text: "Do you want delete this record?"
						})
						.then(() => {
							this.remove(id);
						});
				}
			},

			ready: function () {
				this.refresh();
			}
		};

		return {
			rows: [{paddingX: 15, paddingY: 5, cols: [{}, addBtn]}, table]
		};
	}

	init() {
		this._popup = this.ui(PopupView);
		const btn = this.$$("addBtn");
		const table = this.$$("table");
		activitiesDB.waitData.then(() => table.parse(activitiesDB));
		btn.attachEvent("onItemClick", () => this._popup.showWindow());
	}
}
