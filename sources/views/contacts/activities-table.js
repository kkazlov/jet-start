import {JetView} from "webix-jet";

import activitiesDB from "../../models/activitiesDB";
import activityTypesDB from "../../models/activityTypesDB";
import Popup from "../popup";
import TableView from "../tableView";


export default class ActivitiesTable extends JetView {
	config() {
		const datatable = TableView("contact", {activityTypesDB});
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
		const table = this.$$("table");
		this._popup = this.ui(Popup);
		this.on(table, "onAfterFilter", () => {
			const contactID = this.getParam("id", true);
			table.data.filter(obj => +obj.ContactID === +contactID, "", true);
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

	urlChange() {
		const table = this.$$("table");

		activitiesDB.waitData.then(() => {
			const contactID = this.getParam("id", true);
			this._contactID = contactID;
			table.data.sync(activitiesDB, () => {
				table.filter(obj => +obj.ContactID === +contactID);
				table.filterByAll();
			});
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
