import {JetView} from "webix-jet";

import PopupView from "./popup";
import "../styles/activities.css";

export default class Activities extends JetView {
	config() {
		const btnAdd = {
			view: "button",
			type: "icon",
			width: 150,
			height: 50,
			icon: "fas fa-plus-square",
			label: "Add activity",
			css: "info__btn",
			click: () => this._jetPopup.showWindow()
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
				{id: "activity", header: "Activity type", fillspace: 3},
				{id: "date", header: "Due date", fillspace: 2},
				{id: "details", header: "Details", fillspace: 6},
				{id: "contact", header: "Contact", fillspace: 3},
				{
					id: "edit",
					header: "",
					fillspace: 1,
					css: {"text-align": "center"},
					template: () => "<span class='far fa-edit onEdit'></span>"
				},
				{
					id: "delete",
					header: "",
					fillspace: 1,
					css: {"text-align": "center"},
					template: () => "<span class='far fa-trash-alt onDelete'></span>"
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
			}
		};

		return {
			rows: [{cols: [{}, btnAdd]}, table]
		};
	}

	init() {
		this._jetPopup = this.ui(PopupView);
	}
}
