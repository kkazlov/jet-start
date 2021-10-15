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
			label: "Change photo",
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
					this.$scope.$$("deleteBtn").enable();
					return false;
				}
			}
		};

		const DeleteBtn = {
			view: "button",
			localId: "deleteBtn",
			label: "Delete photo",
			css: "customBtn",
			click: () => {
				const template = webix.$$("photoTemplate");
				const photo = template.data.Photo;
				if (photo) {
					template.setValues({Photo: ""});
					contactsDB.updateItem(this._contactID, {Photo: ""});
					this.$$("deleteBtn").disable();
				}
				this.$$("deleteBtn").blur();
			}
		};

		const PhotoBlock = {
			margin: 15,
			cols: [
				{
					id: "photoTemplate",
					borderless: true,
					maxHeight: 200,
					template: ({Photo}) => {
						const _photo =
							Photo || "https://via.placeholder.com/550";
						return `
						<div class="info__photo">
							<img src=${_photo} alt="photo">
						</div>
					`;
					}
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
				if (this._formState === "edit") {
					this.closeForm();
				}
				else {
					this.closeForm("first");
				}
			}
		};

		const ActionBtn = {
			view: "button",
			localId: "actionBtn",
			width: 150,
			value: "Add",
			css: "customBtn",
			click: () => {
				const form = this.$$("form");
				if (form.validate()) {
					const values = form.getValues();
					const Photo = webix.$$("photoTemplate").getValues().Photo;
					const {Birthday: birthday, StartDate: startdate} = values;

					const format = webix.Date.dateToStr("%Y-%m-%d %h:%i");
					const Birthday = format(birthday);
					const StartDate = format(startdate);
					const sendData = {...values, Birthday, StartDate, Photo};
					if (this._formState === "add") {
						contactsDB
							.waitSave(() => {
								contactsDB.add(sendData);
							})
							.then(() => {
								this.closeForm("last");
							});
					}
					else if (this._formState === "edit") {
						contactsDB
							.waitSave(() => {
								contactsDB.updateItem(
									this._contactID,
									sendData
								);
							})
							.then(() => {
								this.closeForm();
								webix.message("Contact was updated");
							});
					}
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
			{margin: 15, cols: [{}, CancelBtn, ActionBtn]}
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
				{
					view: "label",
					localId: "formLabel",
					label: "Add new contact",
					css: "form-label"
				},
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

	urlChange(view, url) {
		const {form: formState, id} = url[0].params;
		this._formState = formState;
		this._contactID = id;
		const deleteBtn = this.$$("deleteBtn");

		if (formState) {
			const formLabel = formState === "edit" ? "Edit" : "Add";
			const actionBtnLabel = formState === "edit" ? "Save" : "Add";
			this.$$("formLabel").setValue(`${formLabel} a new contact`);
			this.$$("actionBtn").setValue(actionBtnLabel);

			if (formState === "edit") {
				const photo = contactsDB.getItem(id).Photo;
				if (!photo) {
					deleteBtn.disable();
				}
				else {
					deleteBtn.enable();
				}

				this.getContact(id);
			}
			else {
				deleteBtn.disable();
			}
		}
	}

	closeForm(select = "") {
		const form = this.$$("form");
		const parentView = this.getParentView();

		parentView.setParam("form", false, true);
		parentView.setParam("list", select, true);
		form.clear();
		form.clearValidation();
		this.$$("StartDate").setValue(new Date());
		webix.$$("photoTemplate").setValues({Photo: ""});
	}

	getContact(id) {
		const form = this.$$("form");

		contactsDB.waitData.then(() => {
			const value = contactsDB.getItem(id);
			form.setValues(value);
			webix.$$("photoTemplate").setValues({Photo: value.Photo});
		});
	}
}
