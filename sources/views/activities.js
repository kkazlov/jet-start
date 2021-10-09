import {JetView} from "webix-jet";

import activitiesDB from "../models/activitiesDB";
import activityTypesDB from "../models/activityTypesDB";
import contactsDB from "../models/contactsDB";
import PopupConstr from "./popup-constr";

import "../styles/activities.css";

export default class Activities extends JetView {
	config() {
		const customSort = (a, b) => {
			if (a > b) {
				return 1;
			}
			else if (a < b) {
				return -1;
			}
			return 0;
		};

		const checkAndDateSort = (a, b, field) => {
			const aValue = a[field];
			const bValue = b[field];
			return customSort(aValue, bValue);
		};

		const activityAndContactSort = ({a, b, db, id, field}) => {
			const aValue = db.getItem(a[id])[field];
			const bValue = db.getItem(b[id])[field];
			return customSort(aValue, bValue);
		};

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
			css: {"text-align": "center"},
			sort: (a, b) => checkAndDateSort(a, b, "State"),
			template: "{common.checkbox()}"
			/* template: ({State}) => {
				const checked = State === "Close" ? "checked" : "";
				return `<input class="webix_table_checkbox" type="checkbox" ${checked}>`;
			} */
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
			sort: (a, b) => activityAndContactSort({a, b, db: activityTypesDB, id: "TypeID", field: "Value"}),
			collection: activityTypesDB,
			template({TypeID}) {
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
			fillspace: 3,
			sort: (a, b) => checkAndDateSort(a, b, "DueDate")
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
			sort: (a, b) => activityAndContactSort({a, b, db: contactsDB, id: "ContactID", field: "value"}),
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
			template: () => "<span class='far fa-edit onEdit table-icon'></span>"
		};

		const deleteCol = {
			id: "delete",
			header: "",
			fillspace: 1,
			css: {"text-align": "center"},
			template: () => "<span class='far fa-trash-alt onDelete table-icon'></span>"
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
				onDelete(e, id) {
					webix
						.confirm({
							title: "Delete",
							text: "Do you want to delete this record? Deleting cannot be undone."
						})
						.then(() => {
							activitiesDB.remove(id);
						});
				},
				onEdit: (e, id) => {
					this._popupEdit.getActivity(id);
					this._popupEdit.showWindow();
				}
			}
		};

		return {
			rows: [{paddingX: 15, paddingY: 5, cols: [{}, addBtn]}, table]
		};
	}

	init() {
		this._popup = this.ui(new PopupConstr(this.app, "Add"));
		this._popupEdit = this.ui(new PopupConstr(this.app, "Edit"));

		const btn = this.$$("addBtn");
		const table = this.$$("table");

		activitiesDB.waitData.then(() => table.parse(activitiesDB));

		btn.attachEvent("onItemClick", () => this._popup.showWindow());

		this.on(activitiesDB.data, "onAfterAdd", () => {
			table.filterByAll();
		});
		this.on(activitiesDB.data, "onDataUpdate", () => {
			table.filterByAll();
		});
	}
}
