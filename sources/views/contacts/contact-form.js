import {JetView} from "webix-jet";

import contactsDB from "../../models/contactsDB";
import statusesDB from "../../models/statusesDB";

export default class ContactForm extends JetView {
	config() {
		const FirsNameElem = {
			view: "text",
			label: "First name",
			name: "FirstName"
		};

		const LastNameElem = {
			view: "text",
			label: "Last name",
			name: "LastName"
		};

		const StartDataElem = {
			view: "datepicker",
			localId: "StartDate",
			value: new Date(),
			label: "Joining",
			name: "StartDate"
		};

		const StatusElem = {
			view: "combo",
			label: "Status",
			options: {
				body: {
					data: statusesDB,
					template: "#Value#"
				}
			},
			name: "StatusID"
		};

		const JobElem = {
			view: "text",
			label: "Job",
			name: "Job"
		};

		const CompanyElem = {
			view: "text",
			label: "Company",
			name: "Company"
		};

		const WebsiteElem = {
			view: "text",
			label: "Website",
			name: "Website"
		};

		const AddressElem = {
			view: "textarea",
			label: "Address",
			name: "Address",
			height: 65
		};

		const EmailElem = {
			view: "text",
			label: "Email",
			name: "Email"
		};

		const SkypeElem = {
			view: "text",
			label: "Skype",
			name: "Skype"
		};

		const PhoneElem = {
			view: "text",
			label: "Phone",
			name: "Phone"
		};

		const BirthdayElem = {
			view: "datepicker",
			label: "Birthday",
			name: "Birthday"
		};

		const ChangeBtn = {
			view: "uploader",
			value: "Upload file",
			css: "customBtn",
			accept: "image/jpeg, image/png",
			autosend: false,
			multiple: false,
			on: {
				onBeforeFileAdd(upload) {
					let file = upload.file;
					let reader = new FileReader();
					reader.onload = (event) => {
						webix
							.$$("photoTemplate")
							.parse({Photo: event.target.result});
					};
					reader.readAsDataURL(file);
					return false;
				}
			}
		};

		const DeleteBtn = {
			view: "button",
			label: "Delete photo",
			css: "customBtn"
		};

		const PhotoBlock = {
			margin: 15,
			cols: [
				{
					id: "photoTemplate",
					maxHeight: 200,
					template: obj => `
						<div class='photo'>
							<img src=${obj.Photo || "https://via.placeholder.com/550"} alt='Photo'>
						</div>
					`
				},
				{
					margin: 7,
					type: "clean",
					rows: [{}, ChangeBtn, DeleteBtn]
				}
			]
		};

		const CancelBtn = {
			view: "button",
			label: "Cancel",
			width: 150,
			css: "customBtn",
			click: () => {
				this.closeForm("first");
			}
		};

		const AddBtn = {
			view: "button",
			width: 150,
			label: "Add",
			css: "customBtn",
			click: () => {
				const form = this.$$("form");
				if (form.validate()) {
					const values = form.getValues();
					const {Birthday: birthday, StartDate: startdate} = values;

					const format = webix.Date.dateToStr("%Y-%m-%d %h:%i");
					const Birthday = format(birthday);
					const StartDate = format(startdate);
					const sendData = {...values, Birthday, StartDate};

					contactsDB
						.waitSave(() => {
							contactsDB.add(sendData);
						})
						.then(() => {
							this.closeForm("last");
						});
				}
			}
		};

		const FormElements = [
			{
				margin: 30,
				cols: [
					{
						margin: 5,
						rows: [
							FirsNameElem,
							LastNameElem,
							StartDataElem,
							StatusElem,
							JobElem,
							CompanyElem,
							WebsiteElem,
							AddressElem
						]
					},
					{
						margin: 5,
						rows: [
							EmailElem,
							SkypeElem,
							PhoneElem,
							BirthdayElem,
							PhotoBlock
						]
					}
				]
			},
			{margin: 15, cols: [{}, CancelBtn, AddBtn]}
		];

		const formRules = {
			FirstName: webix.rules.isNotEmpty,
			LastName: webix.rules.isNotEmpty,
			StatusID: webix.rules.isNotEmpty,
			StartDate: webix.rules.isNotEmpty,
			Job: webix.rules.isNotEmpty,
			Company: webix.rules.isNotEmpty,
			Website: webix.rules.isNotEmpty,
			Address: webix.rules.isNotEmpty,
			Email: webix.rules.isNotEmpty && webix.rules.isEmail,
			Skype: webix.rules.isNotEmpty,
			Birthday: webix.rules.isNotEmpty,
			Phone: webix.rules.isNotEmpty && webix.rules.isNumber
		};

		return {
			paddingX: 10,
			rows: [
				{view: "label", label: "Add new contact", css: "form-label"},
				{
					view: "form",
					localId: "form",
					borderless: true,
					margin: 15,
					rows: FormElements,
					rules: formRules,
					elementsConfig: {
						invalidMessage: "Enter the correct value!"
					},
					on: {
						onChange: function change() {
							this.clearValidation();
						}
					}
				},
				{}
			]
		};
	}

	closeForm(select) {
		const form = this.$$("form");
		const parentView = this.getParentView();
		form.clear();
		form.clearValidation();
		this.$$("StartDate").setValue(new Date());
		parentView.setParam("form", false, true);
		parentView.setParam("list", select, true);
	}
}
