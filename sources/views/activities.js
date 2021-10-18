import {JetView} from "webix-jet";

import activitiesDB from "../models/activitiesDB";
import activityTypesDB from "../models/activityTypesDB";
import contactsDB from "../models/contactsDB";
import Popup from "./popup";
import TableView from "./tableView";

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

		const datatable = TableView("activities", {activityTypesDB, contactsDB});

		return {
			rows: [{paddingX: 15, paddingY: 5, cols: [{}, addBtn]}, datatable]
		};
	}

	init() {
		this._popup = this.ui(Popup);
		const table = this.$$("table");
		table.parse(activitiesDB);

		this.on(activitiesDB.data, "onStoreUpdated", (id) => {
			if (id) table.filterByAll();
		});

		this.on(table, "onItemClick", (id, e) => {
			const editIcon = "far fa-edit editIcon table-icon";
			const className = e.target.className;
			if (editIcon === className) {
				this.editIcon(e, id);
			}
		});

		this.on(table, "onItemClick", (id, e) => {
			const editIcon = "far fa-trash-alt deleteIcon table-icon";
			const className = e.target.className;
			if (editIcon === className) {
				this.deleteIcon(e, id);
			}
		});
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
		this._popup.showWindow({id, mode: "edit", table: "activities"});
	}
}
