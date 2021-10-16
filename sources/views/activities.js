import {JetView} from "webix-jet";

import activitiesDB from "../models/activitiesDB";
import activityTypesDB from "../models/activityTypesDB";
import contactsDB from "../models/contactsDB";
import Popup from "./popup";

import "../styles/activities.css";

export default class Activities extends JetView {
	config() {
		const addBtn = {
			view: "button",
			type: "icon",
			width: 150,
			height: 50,
			icon: "fas fa-plus-square",
			label: "Add activity",
			css: "customBtn",
			click: () => {
				this._popup.showWindow({mode: "add", table: "activities"});
			}
		};

		const checkCol = {
			id: "State",
			header: "",
			fillspace: 1,
			css: {"text-align": "center"},
			sort: "string",
			template: "{common.checkbox()}",
			checkValue: "Close",
			uncheckValue: "Open"
		};

		const activityTypeCol = {
			id: "ActivityType",
			header: [
				"Activity Type",
				{
					content: "selectFilter",
					compare: (cellValue, filterValue, obj) => +obj.TypeID === +filterValue
				}
			],
			fillspace: 3,
			sort: "text",
			collection: activityTypesDB,
			template({TypeID}) {
				const activityType = this.collection.getItem(TypeID) || {
					Value: "",
					Icon: ""
				};
				const {Value, Icon} = activityType;
				return `${Value} <span class='fas fa-${Icon}'></span>`;
			}
		};

		const dueDateCol = {
			id: "Date",
			header: ["Due date", {content: "datepickerFilter"}],
			fillspace: 3,
			sort: "string",
			format: webix.i18n.longDateFormatStr
		};

		const detailsCol = {
			id: "Details",
			header: ["Details", {content: "textFilter"}],
			sort: "string",
			fillspace: 6
		};

		const contactCol = {
			id: "Contact",
			header: [
				"Contacts",
				{
					content: "selectFilter",
					compare(cellValue, filterValue, obj) {
						return +obj.ContactID === +filterValue;
					}
				}
			],
			sort: "text",
			fillspace: 3,
			collection: contactsDB,
			template({ContactID}) {
				const contact = this.collection.getItem(ContactID) || {
					FirstName: "",
					LastName: ""
				};
				const {FirstName, LastName} = contact;
				return `${FirstName} ${LastName}`;
			}
		};

		const editCol = {
			id: "edit",
			header: "",
			fillspace: 1,
			css: {"text-align": "center"},
			template: () => "<span class='far fa-edit editIcon table-icon'></span>"
		};

		const deleteCol = {
			id: "delete",
			header: "",
			fillspace: 1,
			css: {"text-align": "center"},
			template: () => "<span class='far fa-trash-alt deleteIcon table-icon'></span>"
		};

		const table = {
			view: "datatable",
			localId: "table",
			css: "webix_data_border webix_header_border activity-table",
			columns: [
				checkCol,
				activityTypeCol,
				dueDateCol,
				detailsCol,
				contactCol,
				editCol,
				deleteCol
			],

			onClick: {
				deleteIcon(e, id) {
					webix
						.confirm({
							title: "Delete",
							text: "Do you want to delete this record? Deleting cannot be undone."
						})
						.then(() => {
							activitiesDB.remove(id);
						});
				},
				editIcon: (e, id) => {
					this._popup.showWindow({id, mode: "edit", table: "activities"});
				}
			}
		};

		return {
			rows: [{paddingX: 15, paddingY: 5, cols: [{}, addBtn]}, table]
		};
	}

	init() {
		this._popup = this.ui(Popup);
		const table = this.$$("table");
		table.parse(activitiesDB);

		this.on(activitiesDB.data, "onStoreUpdated", (id) => {
			if (id) table.filterByAll();
		});
	}
}
