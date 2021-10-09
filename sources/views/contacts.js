import {JetView} from "webix-jet";

import contactsDB from "../models/contactsDB";
import statusesDB from "../models/statusesDB";
import "../styles/contacts.css";


export default class Contacts extends JetView {
	config() {
		const list = {
			view: "list",
			localId: "list",
			template: ({Photo, FirstName, LastName, Company}) => {
				const _photo = !Photo
					? "https://via.placeholder.com/550"
					: Photo;

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

		const btnDelete = {
			view: "button",
			type: "icon",
			width: 120,
			height: 50,
			icon: "far fa-trash-alt",
			label: "Delete",
			css: "customBtn"
		};

		const btnEdit = {
			view: "button",
			type: "icon",
			width: 120,
			height: 50,
			icon: "far fa-edit",
			label: "Edit",
			css: "customBtn"
		};

		const infoHead = {
			type: "clean",
			margin: 10,
			cols: [
				{
					localId: "infoTitle",
					borderless: true,
					autoheight: true,
					template: ({FirstName, LastName}) => `${FirstName} ${LastName}`,
					css: "info__label",
					ready() {
						this.refresh();
					}
				},
				{},
				btnDelete,
				btnEdit
			]
		};

		const infoTemplate = ({
			Photo,
			Email,
			Skype,
			Job,
			Company,
			Birthday,
			Address,
			Status = "No status",
			StatusIcon = ""
		}) => {
			const _photo = !Photo ? "https://via.placeholder.com/550" : Photo;

			return `
			<div class="info">
				<div class="info__block">
					<div class="info__photo">
						<img src=${_photo} alt="photo">
					</div>

					<div class="info__status">
						<span class="status-name">${Status}</span>
						<span class='fas fa-${StatusIcon}'></span>
					</div>
				</div>


				<div class="info__items">
					<div class="info__item">
						<span class="fas fa-envelope"></span>
						<span>Email: ${Email}</span>
					</div>

					<div class="info__item">
						<span class="fab fa-skype"></span>
						<span>Skype: ${Skype}</span>
					</div>

					<div class="info__item">
						<span class="fas fa-tag"></span>
						<span>Job: ${Job}</span>
					</div>

					<div class="info__item">
						<span class="fas fa-briefcase"></span>
						<span>Company: ${Company}</span>
					</div>

					<div class="info__item">
						<span class="far fa-calendar-alt"></span>
						<span>Date of birth: ${Birthday}</span>
					</div>

					<div class="info__item">
						<span class="fas fa-map-marker-alt"></span>
						<span>Location: ${Address}</span>
					</div>
				</div>
			</div>
		`;
		};

		const infoMain = {
			localId: "infoMain",
			borderless: true,
			template: infoTemplate
		};

		return {
			cols: [
				list,
				{
					gravity: 3,
					padding: 15,
					margin: 30,
					type: "clean",
					rows: [infoHead, infoMain, {}]
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
				const status = statusesDB.getItem(statusID).Value;
				const icon = statusesDB.getItem(statusID).Icon;
				main.setValues({Status: status, StatusIcon: icon}, true);
			});
			main.parse(contact);
			title.parse(contact);
		});
	}
}
