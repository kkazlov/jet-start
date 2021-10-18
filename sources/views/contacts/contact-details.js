import {JetView} from "webix-jet";

import ActivitiesTable from "./activities-table";
import FilesTable from "./files-table";
import Info from "./info";
import "../../styles/contact-details.css";


export default class ContactDetails extends JetView {
	config() {
		const Tabbar = {
			view: "tabbar",
			borderless: true,
			multiview: true,
			value: "Activities",
			options: [
				{id: "Activities", value: "Activities"},
				{id: "Files", value: "Files"}
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
