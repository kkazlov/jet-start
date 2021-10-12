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
			header: {content: "datepickerFilter"},
			fillspace: 3,
			sort: "string",
			format: webix.i18n.longDateFormatStr
		};

		const detailsCol = {
			id: "Details",
			header: {content: "textFilter"},
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
			css: "webix_data_border webix_header_border activity-table"
		};

		return {
			rows: [
				datatable,
				{
					paddingY: 5,
					cols: [
						{},
						{
							view: "button",
							type: "icon",
							icon: "fas fa-plus-square",
							width: 180,
							height: 40,
							label: "Add activity",
							css: "customBtn"
						}
					]
				}
			]
		};
	}

	urlChange() {
		const contactID = this.getParam("id");
		const table = this.$$("activitiesTable");
		table.data.sync(activitiesDB, function filter() {
			this.filter("#ContactID#", contactID);
		});
	}
}
