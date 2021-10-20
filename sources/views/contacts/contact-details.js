import {JetView} from "webix-jet";

import ActivitiesTable from "./activities-table";
import FilesTable from "./files-table";
import Info from "./info";


export default class ContactDetails extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const Tabbar = {
			view: "tabbar",
			borderless: true,
			multiview: true,
			value: "Activities",
			options: [
				{id: "Activities", value: _("Activities")},
				{id: "Files", value: _("Files")}
			],
			css: "custom-tabbar"
		};

		const Multiview = {
			borderless: true,
			cells: [
				{$subview: ActivitiesTable, id: "Activities"},
				{$subview: FilesTable, id: "Files"}
			]
		};
		return {
			rows: [Info, Tabbar, Multiview]
		};
	}
}
