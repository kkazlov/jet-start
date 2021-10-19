import {JetView} from "webix-jet";

import activitiesDB from "../models/activitiesDB";
import activityTypesDB from "../models/activityTypesDB";
import contactsDB from "../models/contactsDB";
import Popup from "./popup";
import TableView from "./tableView";

export default class Activities extends JetView {
	config() {
		const filterBtns = {
			view: "segmented",
			localId: "filterBtns",
			value: "all",
			options: [
				{id: "all", value: "All"},
				{id: "overdue", value: "Overdue"},
				{id: "completed", value: "Completed"},
				{id: "today", value: "Today"},
				{id: "tomorrow", value: "Tomorrow"},
				{id: "week", value: "This week"},
				{id: "month", value: "This month"}
			],
			on: {
				onAfterTabClick: (id) => {
					const table = this.$$("table");
					if (id === "completed") {
						table.filter("#State#", "Close", true);
					}
					if (id === "all") {
						table.filterByAll();
					}
				}
			},
			css: "filterBtns"
		};

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
			rows: [{paddingX: 15, paddingY: 5, margin: 60, cols: [filterBtns, addBtn]}, datatable]
		};
	}

	init() {
		this._popup = this.ui(Popup);
		const table = this.$$("table");
		const filterBtns = this.$$("filterBtns");

		table.parse(activitiesDB);

		this.on(activitiesDB.data, "onStoreUpdated", (id) => {
			if (id) table.filterByAll();
		});

		this.on(table, "onAfterFilter", () => {
			const btnValue = filterBtns.getValue();
			if (btnValue === "completed") {
				table.filter("#State#", "Close", true);
			}
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
