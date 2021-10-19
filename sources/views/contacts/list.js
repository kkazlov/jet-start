import {JetView} from "webix-jet";

import contactsDB from "../../models/contactsDB";

export default class ListView extends JetView {
	config() {
		const Input = {
			view: "text",
			localId: "input",
			placeholder: "Type to find matching contacts"
		};

		const List = {
			view: "list",
			localId: "list",
			minWidth: 200,
			template: ({Photo, FirstName, LastName, Company}) => {
				const _photo = Photo || "https://via.placeholder.com/550";
				return `
				<div class="contact__item">
					<div class="contact__photo">
						<img src=${_photo} alt="Photo">
					</div>
					<div class="contact__name">
						<div>${FirstName} ${LastName}</div>
						<div>${Company}</div>
					</div>
				</div>
				`;
			},
			select: true
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
				this.setParam("id", false, true);
				this.show("contacts.contact-form");
			}
		};

		return {
			rows: [Input, List, AddContactBtn]
		};
	}

	init() {
		const list = this.$$("list");
		const input = this.$$("input");
		this.setParam("list", false, true);

		contactsDB.waitData.then(() => {
			list.parse(contactsDB);
			const initSelect = list.getFirstId();
			list.select(initSelect);
		});

		this.on(input, "onTimedKeyPress", () => {
			const inputValue = input.getValue().toLowerCase();
			const matchValue = (obj, value) => obj.toLowerCase().indexOf(value) !== -1;

			list.filter(({value, Company, Address, Job, Skype, Email, Website}) => {
				const fullName = matchValue(value, inputValue);
				const company = matchValue(Company, inputValue);
				const address = matchValue(Address, inputValue);
				const job = matchValue(Job, inputValue);
				const skype = matchValue(Skype, inputValue);
				const email = matchValue(Email, inputValue);
				const website = matchValue(Website, inputValue);

				return fullName || company || address || job || skype || email || website;
			});
		});
	}

	urlChange(view, url) {
		const list = this.$$("list");
		const input = this.$$("input");
		const addBtn = this.$$("addBtn");
		const listParam = url[0].params.list;
		const idParam = url[0].params.id;

		if (listParam === "unselect") {
			list.disable();
			list.unselect();
			addBtn.disable();

			input.disable();
			input.setValue("");
			list.filter();
		}
		else {
			input.enable();
			list.enable();
			addBtn.enable();
			if (listParam && listParam !== "unselect") {
				input.setValue("");
				list.filter();
				let id;
				switch (listParam) {
					case "first":
						id = list.getFirstId();
						break;
					case "current":
						id = idParam;
						break;
					case "last":
						id = list.getLastId();
						break;
					default: break;
				}
				this.setParam("id", id, true);
				list.select(id);
				this.setParam("list", false, true);
			}
		}
	}

	ready() {
		const list = this.$$("list");
		this.on(list, "onAfterSelect", (id) => {
			this.setParam("id", id, true);
			this.show("contacts.contact-details");
		});
	}
}
