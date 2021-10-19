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
				onAfterTabClick: id => this.onAfterTabClick(id)
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

		const datatable = TableView("activities", {
			activityTypesDB,
			contactsDB
		});

		return {
			rows: [
				{
					paddingX: 15,
					paddingY: 5,
					margin: 60,
					cols: [filterBtns, addBtn]
				},
				datatable
			]
		};
	}

	init() {
		this._popup = this.ui(Popup);
		const table = this.$$("table");
		table.parse(activitiesDB);

		this.on(activitiesDB.data, "onStoreUpdated", (id) => {
			if (id) table.filterByAll();
		});

		this.on(table, "onAfterFilter", () => this.onAfterFilter());

		this.on(table, "onItemClick", (id, e) => this.onEditIcon(id, e));
		this.on(table, "onItemClick", (id, e) => this.onDeleteIcon(id, e));
	}


	onDeleteIcon(id, e) {
		const editIcon = "far fa-trash-alt deleteIcon table-icon";
		const className = e.target.className;
		if (editIcon === className) {
			webix
				.confirm({
					title: "Delete",
					text: "Do you want to delete this record? Deleting cannot be undone."
				})
				.then(() => {
					activitiesDB.remove(id);
				});
		}
	}

	onEditIcon(id, e) {
		const editIcon = "far fa-edit editIcon table-icon";
		const className = e.target.className;
		if (editIcon === className) {
			this._popup.showWindow({id, mode: "edit", table: "activities"});
		}
	}

	overdueFilter(obj) {
		const today = new Date().setHours(0, 0, 0, 0);
		return obj.State === "Open" && obj.Date < today;
	}

	todayFilter(obj) {
		const today = new Date().setHours(0, 0, 0, 0);
		return +obj.Date === +today;
	}

	tommorowFilter(obj) {
		const tomorrow = +new Date().setHours(0, 0, 0, 0) + 1000 * 60 * 60 * 24;
		return +obj.Date === tomorrow;
	}

	weekFilter(obj) {
		const today = new Date();
		const date = +obj.Date;
		const todayNoTime = +today.setHours(0, 0, 0, 0);
		const dayIndex = today.getDay();
		const dayInMs = 1000 * 60 * 60 * 24;

		const startWeek = todayNoTime - dayInMs * dayIndex;
		const endWeek = todayNoTime + dayInMs * (6 - dayIndex);

		return date >= startWeek && date <= endWeek;
	}

	monthFilter(obj) {
		const today = new Date();

		const thisYear = today.getFullYear();
		const thisMonth = today.getMonth();

		const objYear = obj.Date.getFullYear();
		const objMonth = obj.Date.getMonth();

		return thisYear === objYear && thisMonth === objMonth;
	}

	onAfterTabClick(id) {
		const table = this.$$("table");
		switch (id) {
			case "all":
				table.filterByAll();
				break;

			case "overdue":
				table.filterByAll();
				table.filter(obj => this.overdueFilter(obj), "", true);
				break;

			case "completed":
				table.filterByAll();
				table.filter("#State#", "Close", true);
				break;

			case "today":
				table.filterByAll();
				table.filter(obj => this.todayFilter(obj), "", true);
				break;

			case "tomorrow":
				table.filterByAll();
				table.filter(obj => this.tommorowFilter(obj), "", true);
				break;

			case "week":
				table.filterByAll();
				table.filter(obj => this.weekFilter(obj), "", true);
				break;

			case "month":
				table.filterByAll();
				table.filter(obj => this.monthFilter(obj), "", true);
				break;

			default:
				break;
		}
	}

	onAfterFilter() {
		const filterBtns = this.$$("filterBtns");
		const table = this.$$("table");
		const btnValue = filterBtns.getValue();

		switch (btnValue) {
			case "all":
				break;

			case "overdue":
				table.filter(obj => this.overdueFilter(obj), "", true);
				break;

			case "completed":
				table.filter("#State#", "Close", true);
				break;

			case "today":
				table.filter(obj => this.todayFilter(obj), "", true);
				break;

			case "tomorrow":
				table.filter(obj => this.tommorowFilter(obj), "", true);
				break;

			case "week":
				table.filter(obj => this.weekFilter(obj), "", true);
				break;

			case "month":
				table.filter(obj => this.monthFilter(obj), "", true);
				break;

			default:
				break;
		}
	}
}
