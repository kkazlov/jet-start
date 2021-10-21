import {JetView} from "webix-jet";

import activitiesDB from "../models/activitiesDB";
import activityTypesDB from "../models/activityTypesDB";
import contactsDB from "../models/contactsDB";
import Popup from "./popup";
import TableView from "./tableView";

export default class Activities extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const filterBtns = {
			view: "segmented",
			localId: "filterBtns",
			value: "all",
			options: [
				{id: "all", value: _("All")},
				{id: "overdue", value: _("Overdue")},
				{id: "completed", value: _("Completed")},
				{id: "today", value: _("Today")},
				{id: "tomorrow", value: _("Tomorrow")},
				{id: "week", value: _("This week")},
				{id: "month", value: _("This month")}
			],
			on: {
				onAfterTabClick: id => this.onAfterTabClick(id)
			},
			css: "filterBtns"
		};

		const addBtn = {
			view: "button",
			type: "icon",
			width: 200,
			height: 50,
			icon: "fas fa-plus-square",
			label: _("Add activity"),
			css: "customBtn",
			click: () => {
				this._popup.showWindow({mode: "add", table: "activities"});
			}
		};

		const datatable = TableView("activities", {
			activityTypesDB,
			contactsDB
		}, _);

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
		const _ = this.app.getService("locale")._;

		const editIcon = "far fa-trash-alt deleteIcon table-icon";
		const className = e.target.className;
		if (editIcon === className) {
			webix
				.confirm({
					title: _("Delete"),
					text: _("Do you want to delete this record? Deleting cannot be undone.")
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
		const today = webix.Date.dayStart(new Date());
		return obj.State === "Open" && obj.Date < today;
	}

	todayFilter(obj) {
		const today = webix.Date.dayStart(new Date());
		return webix.Date.equal(obj.Date, today);
	}

	tomorrowFilter(obj) {
		const tomorrow = webix.Date.add(new Date(), 1, "day");
		const tomorrowStart = webix.Date.dayStart(tomorrow);
		return webix.Date.equal(obj.Date, tomorrowStart);
	}

	weekFilter(obj) {
		const date = obj.Date;
		const today = webix.Date.dayStart(new Date());
		const dayIndex = today.getDay();

		const startWeek = webix.Date.weekStart(today);
		const endWeek = webix.Date.add(today, 6 - dayIndex, "day");

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
				table.filter(obj => this.tomorrowFilter(obj), "", true);
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
				table.filter(obj => this.tomorrowFilter(obj), "", true);
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
