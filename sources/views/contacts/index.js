import {JetView} from "webix-jet";

import contactsDB from "../../models/contactsDB";
import ActivitiesTable from "./activities-table";
import ContactForm from "./contact-form";
import FilesTable from "./files-table";
import Info from "./info";
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
				{$subview: FilesTable, id: "Files"}
			]
		};

		const AddContactBtn = {
			view: "button",
			type: "icon",
			localId: "contactAddBtn",
			height: 40,
			icon: "fas fa-plus-square",
			label: "Add contact",
			css: "customBtn",
			click: () => {
				this.setParam("form", "add", true);
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
							localId: "contactLayout",
							rows: [Info, Tabbar, Multiview]
						},
						{$subview: ContactForm, id: "contactForm"}
					]
				}
			]
		};
	}

	init() {
		const list = this.$$("list");
		this.setParam("form", false, true);
		this.setParam("list", false, true);

		contactsDB.waitData.then(() => {
			list.parse(contactsDB);
			const initSelect = list.getFirstId();
			list.select(initSelect);
		});
	}

	urlChange(view, url) {
		const contactFormState = url[0].params.form;
		const listParam = url[0].params.list;
		const contactLayout = this.$$("contactLayout");
		const contactAddBtn = this.$$("contactAddBtn");
		const list = this.$$("list");

		if (contactFormState) {
			webix.$$("contactForm").show();
			list.disable();
			contactAddBtn.disable();
		}
		else {
			contactLayout.show();
			list.enable();
			contactAddBtn.enable();
		}

		if (listParam) {
			const id = listParam === "first"
				? list.getFirstId()
				: list.getLastId();
			list.select(id);
			this.setParam("list", false, true);
		}
	}

	ready() {
		const list = this.$$("list");

		this.on(list, "onAfterSelect", (id) => {
			this.setParam("id", id, true);
		});
	}
}
