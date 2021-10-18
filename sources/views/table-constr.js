import {JetView} from "webix-jet";

import activitiesDB from "../models/activitiesDB";
import activityTypesDB from "../models/activityTypesDB";

export default class TableConstr extends JetView {
	constructor(app, tableConfig) {
		super(app);
	}

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
				compare: (cellValue, filterValue, obj) => +obj.TypeID === +filterValue
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

		return {
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
		}
	}
}