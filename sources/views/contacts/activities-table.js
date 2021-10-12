import {JetView} from "webix-jet";

import activitiesDB from "../../models/activitiesDB";
import activityTypesDB from "../../models/activityTypesDB";

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
			header: [
				"Activity Type",
				{
					content: "selectFilter",
					compare: (cellValue, filterValue, obj) =>
						+obj.TypeID === +filterValue
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

		const editCol = {
			id: "edit",
			header: "",
			fillspace: 1,
			css: {"text-align": "center"},
			template: () =>
				"<span class='far fa-edit editIcon table-icon'></span>"
		};

		const deleteCol = {
			id: "delete",
			header: "",
			fillspace: 1,
			css: {"text-align": "center"},
			template: () =>
				"<span class='far fa-trash-alt deleteIcon table-icon'></span>"
		};

		return {
			view: "datatable",
			localId: "table",
			columns: [
				checkCol,
				activityTypeCol,
				dueDateCol,
				detailsCol,
				editCol,
				deleteCol
			]
		};
	}

	init() {
		const table = this.$$("table");
		table.data.sync(activitiesDB, function handler() {
			this.filter("#ContactID#", 2);
		});
	}
}
