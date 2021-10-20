import {JetView} from "webix-jet";

import activitiesDB from "../../models/activitiesDB";
import contactsDB from "../../models/contactsDB";
import filesDB from "../../models/filesDB";
import statusesDB from "../../models/statusesDB";

export default class Info extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const BtnDelete = {
			view: "button",
			type: "icon",
			width: 120,
			height: 50,
			icon: "far fa-trash-alt",
			label: _("Delete"),
			css: "customBtn",
			click: () => {
				webix
					.confirm({
						title: _("Delete"),
						text: _("Do you want to delete this contact? Deleting cannot be undone.")
					})
					.then(() => {
						const id = this.getParam("id", true);
						const parentView = this.getParentView().getParentView();

						this.deleteRecords(activitiesDB, id);
						this.deleteRecords(filesDB, id);

						contactsDB.remove(id);

						parentView.setParam("list", "first", true);
					});
			}
		};

		const BtnEdit = {
			view: "button",
			type: "icon",
			width: 120,
			height: 50,
			icon: "far fa-edit",
			label: _("Edit"),
			css: "customBtn",
			click: () => {
				this.show("contacts.contact-form");
			}
		};

		const InfoHead = {
			type: "clean",
			paddingY: 10,
			margin: 10,
			cols: [
				{
					localId: "infoTitle",
					borderless: true,
					autoheight: true,
					width: 600,
					template: ({FirstName, LastName}) => `${FirstName} ${LastName}`,
					css: "info__label"
				},
				{},
				BtnDelete,
				BtnEdit
			]
		};

		const InfoMain = {
			localId: "infoMain",
			borderless: true,
			template: this.infoTemplate()
		};

		return {rows: [InfoHead, InfoMain]};
	}

	urlChange() {
		const title = this.$$("infoTitle");
		const main = this.$$("infoMain");
		contactsDB.waitData.then(() => {
			const id = this.getParam("id", true);
			const contact = contactsDB.getItem(id);
			const statusID = contact.StatusID;
			statusesDB.waitData.then(() => {
				const statuses = statusesDB.getItem(statusID) || {Value: "", Icon: ""};
				const {Value: status, Icon: icon} = statuses;
				main.setValues(
					{...contact, Status: status, StatusIcon: icon},
					true
				);
			});
			title.parse(contact);
		});
	}

	deleteRecords(dataBase, id) {
		const recordsArr = dataBase.data.find(
			obj => +obj.ContactID === +id
		);
		recordsArr.forEach((item) => {
			dataBase.remove(item.id);
		});
	}

	infoTemplate() {
		const _ = this.app.getService("locale")._;

		const template = ({
			Photo,
			Email,
			Skype,
			Job,
			Company,
			Address,
			Status,
			StatusIcon = "",
			_birthday
		}) => {
			const _status = Status || "No status";
			const _photo = Photo || "https://via.placeholder.com/550";
			return `
			<div class="info">
				<div class="info__block">
					<div class="info__photo">
						<img src=${_photo} alt="photo">
					</div>
	
					<div class="info__status">
						<span class="status-name">${_status}</span>
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
						<span>${_("Job")}: ${Job}</span>
					</div>
	
					<div class="info__item">
						<span class="fas fa-briefcase"></span>
						<span>${_("Company")}: ${Company}</span>
					</div>
	
					<div class="info__item">
						<span class="far fa-calendar-alt"></span>
						<span>${_("Date of birth")}: ${_birthday}</span>
					</div>
	
					<div class="info__item">
						<span class="fas fa-map-marker-alt"></span>
						<span>${_("Location")}: ${Address}</span>
					</div>
				</div>
			</div>
		`;
		};
		return template;
	}
}
