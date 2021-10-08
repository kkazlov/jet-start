import {JetView} from "webix-jet";

import {
	activitiesDB,
	activityTypesDB,
	contactsDB
} from "../models/dataCollections";
import PopupEdit from "./popup-edit";
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

		const checkCol = {
			id: "check",
			header: "",
			fillspace: 1,
			template: ({State}) => {
				const checked = State === "Close" ? "checked" : "";
				return `<input class="webix_table_checkbox" type="checkbox" ${checked}>`;
			},
			css: {"text-align": "center"}
		};

		const activityTypeCol = {
			id: "ActivityType",
			header: [
				"Activity Type",
				{
					content: "selectFilter",
					compare: function (cellValue, filterValue, obj) {
						return obj.TypeID == filterValue;
					}
				}
			],
			fillspace: 3,

			collection: activityTypesDB,
			template: function ({TypeID}) {
				const activityType = this.collection.getItem(TypeID) || {
					value: "",
					Icon: ""
				};
				const {Value, Icon} = activityType;
				return `${Value} <span class='fas fa-${Icon}'></span>`;
			}
		};

		const dueDateCol = {
			id: "DueDate",
			header: [
				"Due date",
				{
					content: "datepickerFilter",
					prepare: (filterValue) => {
						const newValue = webix.i18n.dateFormatStr(filterValue);

						return newValue;
					},
					compare: (cellValue, filterValue) => {
						const pareseDate = new Date(Date.parse(cellValue));
						const newValue = webix.i18n.dateFormatStr(pareseDate);

						return newValue === filterValue;
					}
				}
			],

			fillspace: 3
		};

		const detailsCol = {
			id: "Details",
			header: ["Details", {content: "textFilter"}],
			fillspace: 6
		};

		const contactCol = {
			id: "Contact",
			header: [
				"Activity Type",
				{
					content: "selectFilter",
					compare: function (cellValue, filterValue, obj) {
						return obj.ContactID == filterValue;
					}
				}
			],
			fillspace: 3,
			collection: contactsDB,
			template: function ({ContactID}) {
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
			template: () =>
				"<span class='far fa-edit onEdit table-icon'></span>"
		};

		const deleteCol = {
			id: "delete",
			header: "",
			fillspace: 1,
			css: {"text-align": "center"},
			template: () =>
				"<span class='far fa-trash-alt onDelete table-icon'></span>"
		};

		const table = {
			view: "datatable",
			localId: "table",
			css: "webix_data_border webix_header_border activiti-table",
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
				onDelete: function (e, id) {
					webix
						.confirm({
							title: "Delete",
							text: "Do you want delete this record? Deleting cannot be undone."
						})
						.then(() => {
							activitiesDB.remove(id);
						});
				},
				onEdit: (e, id) => {
					this._popupEdit.getActivity(id);
					this._popupEdit.showWindow();
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
		this._popupEdit = this.ui(PopupEdit);

		const btn = this.$$("addBtn");
		const table = this.$$("table");

		activitiesDB.waitData.then(() => table.parse(activitiesDB));

		btn.attachEvent("onItemClick", () => this._popup.showWindow());

		table.attachEvent("onCheck", (row, col, state) => {
			const _state = state ? "Close" : "Open";
			const activity = activitiesDB.getItem(row);
			activitiesDB.updateItem(row, {...activity, State: _state});
		});

		activitiesDB.data.attachEvent("onAfterAdd", () => {
			table.filterByAll();
		});
		activitiesDB.data.attachEvent("onDataUpdate", () => {
			table.filterByAll();
		});
	}
}
