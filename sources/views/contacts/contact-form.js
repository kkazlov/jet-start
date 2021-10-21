import {JetView} from "webix-jet";

import contactsDB from "../../models/contactsDB";
import statusesDB from "../../models/statusesDB";

export default class ContactForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const label = {
			view: "label",
			localId: "formLabel",
			label: "Add new contact",
			css: "form-label"
		};

		const form = {
			view: "form",
			localId: "form",
			borderless: true,
			margin: 15,
			rows: this.formElements(),
			rules: this.formRules(),
			elementsConfig: {
				invalidMessage: _("Enter the correct value!"),
				labelWidth: 100
			},
			on: {
				onChange() {
					this.clearValidation();
				}
			}
		};
		return {
			paddingX: 10,
			rows: [label, form, {}]
		};
	}

	init() {
		this.getParentView().setParam("list", "unselect", true);
	}

	urlChange() {
		const _ = this.app.getService("locale")._;

		const id = this.getParam("id", true);
		this._contactID = id;
		const deleteBtn = this.$$("deleteBtn");

		const formLabel = id ? "Edit" : "Add new";
		const actionBtnLabel = id ? "Save" : "Add";
		this.$$("formLabel").setValue(_(`${formLabel} contact`));
		this.$$("actionBtn").setValue(_(actionBtnLabel));

		if (id) {
			contactsDB.waitData.then(() => {
				const photo = contactsDB.getItem(id).Photo || "";

				if (!photo) deleteBtn.disable();
				else deleteBtn.enable();

				this.getContact(id);
			});
		}
		else deleteBtn.disable();
	}

	closeForm(select = "current") {
		const form = this.$$("form");
		const parentView = this.getParentView();
		parentView.setParam("list", select, true);
		this.show("contacts.contact-details");

		form.clear();
		form.clearValidation();
		this.$$("StartDate").setValue(new Date());
		this.$$("photoTemplate").setValues({Photo: ""});
	}

	getContact(id) {
		const form = this.$$("form");

		contactsDB.waitData.then(() => {
			const value = contactsDB.getItem(id);
			form.setValues(value);
			this.$$("photoTemplate").setValues({Photo: value.Photo});
		});
	}

	formElements() {
		const _ = this.app.getService("locale")._;

		const FirsNameElem = {
			view: "text",
			label: _("First name"),
			name: "FirstName",
			required: true
		};

		const LastNameElem = {
			view: "text",
			label: _("Last name"),
			name: "LastName",
			required: true
		};

		const StartDataElem = {
			view: "datepicker",
			localId: "StartDate",
			value: new Date(),
			label: _("Joining"),
			name: "StartDate",
			required: true
		};

		const StatusElem = {
			view: "combo",
			label: _("Status"),
			options: {
				body: {
					data: statusesDB,
					template: "#Value#"
				}
			},
			name: "StatusID",
			required: true
		};

		const JobElem = {
			view: "text",
			label: _("Job"),
			name: "Job"
		};

		const CompanyElem = {
			view: "text",
			label: _("Company"),
			name: "Company",
			required: true
		};

		const WebsiteElem = {
			view: "text",
			label: _("Website"),
			name: "Website"
		};

		const AddressElem = {
			view: "textarea",
			label: _("Address"),
			name: "Address",
			height: 65
		};

		const EmailElem = {
			view: "text",
			label: "Email",
			name: "Email",
			required: true
		};

		const SkypeElem = {
			view: "text",
			label: "Skype",
			name: "Skype"
		};

		const PhoneElem = {
			view: "text",
			label: _("Phone"),
			name: "Phone"
		};

		const BirthdayElem = {
			view: "datepicker",
			label: _("Birthday"),
			name: "Birthday",
			required: true
		};

		const ChangeBtn = {
			view: "uploader",
			label: _("Change photo"),
			css: "customBtn",
			accept: "image/jpeg, image/png",
			autosend: false,
			multiple: false,
			on: {
				onBeforeFileAdd(upload) {
					let file = upload.file;
					let reader = new FileReader();
					reader.onload = (event) => {
						this.$scope
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
			label: _("Delete photo"),
			css: "customBtn",
			click: () => {
				const template = this.$$("photoTemplate");
				const photo = template.data.Photo || "";
				if (photo) {
					template.setValues({Photo: ""});
					this.$$("deleteBtn").disable();
				}
				this.$$("deleteBtn").blur();
			}
		};

		const PhotoBlock = {
			margin: 15,
			cols: [
				{
					localId: "photoTemplate",
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
			label: _("Cancel"),
			width: 150,
			css: "customBtn",
			click: () => {
				if (this._contactID) {
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
			value: _("Add"),
			css: "customBtn",
			click: () => {
				const form = this.$$("form");
				if (form.validate()) {
					const values = form.getValues();
					const Photo = this.$$("photoTemplate").getValues().Photo;
					const {Birthday: birthday, StartDate: startdate} = values;

					const format = webix.Date.dateToStr("%Y-%m-%d %h:%i");
					const Birthday = format(birthday);
					const StartDate = format(startdate);
					const sendData = {...values, Birthday, StartDate, Photo};
					if (!this._contactID) {
						contactsDB
							.waitSave(() => {
								contactsDB.add(sendData);
							})
							.then(() => {
								this.closeForm("last");
							});
					}
					else {
						contactsDB
							.waitSave(() => {
								contactsDB.updateItem(
									this._contactID,
									sendData
								);
							})
							.then(() => {
								this.closeForm();
								webix.message(_("Contact was updated"));
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
		return FormElements;
	}

	formRules() {
		return {
			FirstName: value => value.length <= 15,
			LastName: value => value.length <= 15,
			Job: value => value.length <= 20,
			Company: value => value.length <= 20,
			Address: value => value.length <= 50,
			Email: value => value.length <= 20 && webix.rules.isEmail(value),
			Skype: value => value.length <= 20,
			Phone: value => value.length <= 20
		};
	}
}
