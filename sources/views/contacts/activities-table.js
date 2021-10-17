import {JetView} from "webix-jet";

import activitiesDB from "../../models/activitiesDB";
import activityTypesDB from "../../models/activityTypesDB";
import Popup from "../popup";

export default class ActivitiesTable extends JetView {
	config() {
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
			header: {
				content: "selectFilter",
				compare: (cellValue, filterValue, obj) => {
					if (+obj.ContactID === +this._contactID) {
						return +obj.TypeID === +filterValue;
					}
					return false;
				}
			},

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
			header: {
				content: "datepickerFilter",
				compare: (cellValue, filterValue, obj) => {
					if (+obj.ContactID === +this._contactID) {
						return +cellValue === +filterValue;
					}
					return false;
				}
			},
			fillspace: 3,
			sort: "string",
			format: webix.i18n.longDateFormatStr
		};

		const detailsCol = {
			id: "Details",
			header: {
				content: "textFilter",
				compare: (cellValue, filterValue, obj) => {
					const _cellValue = cellValue.toLowerCase();
					const _filterValue = filterValue.toLowerCase();
					if (+obj.ContactID === +this._contactID) {
						return _cellValue.indexOf(_filterValue) !== -1;
					}
					return false;
				}
			},
			sort: "string",
			fillspace: 6
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


		const datatable = {
			view: "datatable",
			localId: "activitiesTable",
			columns: [
				checkCol,
				activityTypeCol,
				dueDateCol,
				detailsCol,
				editCol,
				deleteCol
			],
			css: "webix_data_border webix_header_border activity-table",
			onClick: {
				deleteIcon: (e, id) => this.deleteIcon(e, id),
				editIcon: (e, id) => this.editIcon(e, id)
			}
		};

		const AddActivityBtn = {
			view: "button",
			type: "icon",
			icon: "fas fa-plus-square",
			width: 180,
			height: 40,
			label: "Add activity",
			css: "customBtn",
			click: () => this.addActivity()
		};

		return {
			rows: [datatable, {paddingY: 2, cols: [{}, AddActivityBtn]}]
		};
	}

	init() {
		this._popup = this.ui(Popup);
		const table = this.$$("activitiesTable");
		this.on(table, "onBeforeFilter", (id, value) => {
			if (id === "ActivityType") {
				if (!value) {
					const contactID = this.getParam("id", true);
					table.data.sync(activitiesDB, function filter() {
						this.filter("#ContactID#", contactID);
					});
				}
			}
		});

		this.on(table, "onCheck", () => {
			table.filterByAll();
		});
		this.on(activitiesDB.data, "onDataUpdate", () => {
			table.filterByAll();
		});
		this.on(activitiesDB.data, "onAfterDelete", () => {
			table.filterByAll();
		});
		this.on(activitiesDB.data, "onAfterAdd", () => {
			table.filterByAll();
		});
	}

	urlChange() {
		const contactID = this.getParam("id", true);
		this._contactID = contactID;
		const table = this.$$("activitiesTable");
		table.filterByAll();
	}

	deleteIcon(e, id) {
		webix
			.confirm({
				title: "Delete",
				text: "Do you want to delete this record? Deleting cannot be undone."
			})
			.then(() => {
				activitiesDB.remove(id);
			});
	}

	editIcon(e, id) {
		this._popup.showWindow({
			id,
			mode: "edit",
			table: "contacts"
		});
	}

	addActivity() {
		this._popup.showWindow({
			id: this._contactID,
			mode: "add",
			table: "contacts"
		});
	}
}
