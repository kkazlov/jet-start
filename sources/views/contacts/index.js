import {JetView} from "webix-jet";

import ListView from "./list";

import "../../styles/contacts.css";

export default class Contacts extends JetView {
	config() {
		return {
			type: "clean",
			cols: [
				ListView,
				{
					gravity: 3,
					paddingX: 15,
					animate: false,
					cells: [{$subview: true}]
				}
			]
		};
	}

	/* urlChange(view, url) {
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
	} */
}
