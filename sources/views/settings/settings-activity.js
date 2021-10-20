import {JetView} from "webix-jet";

import activityTypesDB from "../../models/activityTypesDB";

export default class SettingsActivity extends JetView {
	config() {
		const Table = {
			view: "datatable",
			localId: "table",
			css: "webix_data_border webix_header_border activity-table",
			columns: [
				{
					id: "Value",
					header: "Value",
					fillspace: 6
				},
				{
					id: "Icon",
					header: "Icon",
					fillspace: 6
				},
				{
					id: "delete",
					header: "",
					fillspace: 1,
					css: {"text-align": "center"},
					template: () => "<span class='far fa-trash-alt deleteIcon table-icon'></span>"
				}
			]
		};

		const AddBtn = {
			view: "button",
			value: "Add",
			css: "webix_primary"
		};

		const CancelBtn = {
			view: "button",
			value: "Cancel"
		};

		const Form = {
			view: "form",
			localId: "form",
			elementsConfig: {
				labelWidth: 120
			},
			elements: [
				{view: "text", label: "Activity Value"},
				{view: "text", label: "Activity Icon"},
				{cols: [AddBtn, CancelBtn]}
			]
		};

		return {
			rows: [Table, Form]
		};
	}

	init() {
		const table = this.$$("table");
		activityTypesDB.waitData.then(() => {
			table.data.sync(activityTypesDB);
		});
	}
}
