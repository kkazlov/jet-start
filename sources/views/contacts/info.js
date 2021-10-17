import {JetView} from "webix-jet";

import activitiesDB from "../../models/activitiesDB";
import contactsDB from "../../models/contactsDB";
import filesDB from "../../models/filesDB";
import statusesDB from "../../models/statusesDB";

export default class Info extends JetView {
	config() {
		const deleteRecords = (dataBase, id) => {
			const recordsArr = dataBase.data.find(
				obj => +obj.ContactID === +id
			);
			recordsArr.forEach((item) => {
				dataBase.remove(item.id);
			});
		};

		const BtnDelete = {
			view: "button",
			type: "icon",
			width: 120,
			height: 50,
			icon: "far fa-trash-alt",
			label: "Delete",
			css: "customBtn",
			click: () => {
				webix
					.confirm({
						title: "Delete",
						text: "Do you want to delete this contact? Deleting cannot be undone."
					})
					.then(() => {
						const id = this.getParam("id");
						const parentView = this.getParentView();

						deleteRecords(activitiesDB, id);
						deleteRecords(filesDB, id);

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
			label: "Edit",
			css: "customBtn",
			click: () => {
				const parentView = this.getParentView();
				parentView.setParam("form", "edit", true);
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
		const id = this.getParam("id", true);
		contactsDB.waitData.then(() => {
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

	infoTemplate() {
		const template = ({
			Photo,
			Email,
			Skype,
			Job,
			Company,
			Address,
			Status = "No status",
			StatusIcon = "",
			_birthday
		}) => {
			const _photo = Photo || "https://via.placeholder.com/550";
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
						<span>Date of birth: ${_birthday}</span>
					</div>
	
					<div class="info__item">
						<span class="fas fa-map-marker-alt"></span>
						<span>Location: ${Address}</span>
					</div>
				</div>
			</div>
		`;
		};
		return template;
	}
}
