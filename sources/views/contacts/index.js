import {JetView} from "webix-jet";

import contactsDB from "../../models/contactsDB";
import statusesDB from "../../models/statusesDB";
import ActivitiesTable from "./activities-table";
import ContactForm from "./contact-form";
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
			],
			css: "custom-tabbar"
		};

		const Multiview = {
			borderless: true,
			cells: [
				{$subview: ActivitiesTable, id: "Activities"},
				{id: "Files", template: "<i>Info about the Form</i>"}
			]
		};

		const AddContactBtn = {
			view: "button",
			type: "icon",
			localId: "addBtn",
			height: 40,
			icon: "fas fa-plus-square",
			label: "Add contact",
			css: "customBtn",
			click: () => {
				webix.$$("contactForm").show();
				this.$$("list").disable();
				this.$$("addBtn").disable();
			}
		};

		return {
			type: "clean",
			cols: [
				{rows: [List, AddContactBtn]},
				{
					gravity: 3,
					paddingX: 15,
					cells: [
						{
							id: "contactLayout",
							rows: [
								{rows: [InfoHead, InfoMain]},
								Tabbar,
								Multiview
							]
						},
						{$subview: ContactForm, id: "contactForm"}
					]
				}
			]
		};
	}

	init() {
		const list = this.$$("list");
		const contactLayout = webix.$$("contactLayout");

		contactLayout.show();
		list.enable();

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
			this.setParam("id", id, true);

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
