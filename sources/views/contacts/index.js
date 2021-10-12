import {JetView} from "webix-jet";

import contactsDB from "../../models/contactsDB";
import statusesDB from "../../models/statusesDB";
import ActivitiesTable from "./activities-table";
import {InfoHead, InfoMain} from "./info";
import List from "./list";

import "../../styles/contacts.css";

export default class Contacts extends JetView {
	config() {
		const Tabbar = {
			view: "tabbar",
			borderless: true,
			multiview: true,
			value: "Activities",
			options: [
				{id: "Activities", value: "Activities"},
				{id: "Files", value: "Files"}
			]
		};

		const Multiview = {
			borderless: true,
			cells: [
				{$subview: ActivitiesTable, id: "Activities"},
				{
					id: "Files",
					template: "<i>Info about the Form</i>"
				}
			]
		};

		return {
			cols: [
				List,
				{
					gravity: 3,
					padding: 15,
					margin: 30,
					type: "clean",
					rows: [
						{rows: [InfoHead, InfoMain]},
						Tabbar,
						Multiview
					]
				}
			]
		};
	}

	init() {
		const list = this.$$("list");

		contactsDB.waitData.then(() => {
			list.parse(contactsDB);
			const initSelect = list.getFirstId();
			list.select(initSelect);
		});
	}

	ready() {
		const list = this.$$("list");
		this.on(list, "onAfterSelect", (id) => {
			const title = this.$$("infoTitle");
			const main = this.$$("infoMain");

			const contact = contactsDB.getItem(id);
			const statusID = contact.StatusID;
			statusesDB.waitData.then(() => {
				const statuses = statusesDB.getItem(statusID);
				const {Value: status, Icon: icon} = statuses;
				main.setValues(
					{...contact, Status: status, StatusIcon: icon},
					true
				);
			});
			title.parse(contact);
		});
	}
}
