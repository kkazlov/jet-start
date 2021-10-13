import {JetView} from "webix-jet";

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
			value: new Date(),
			label: "Joining date",
			name: "StartDate"
		};

		const StatusElem = {
			view: "combo",
			label: "Status",
			value: "One",
			options: ["One", "Two", "Three"],
			name: "Status"
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
			value: new Date(),
			label: "Birthday",
			name: "Birthday"
		};

		const ChangeBtn = {
			view: "button",
			label: "Change photo",
			css: "customBtn"
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
					template: "photo",
					width: 220,
					height: 220
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
			css: "customBtn"
		};

		const AddBtn = {
			view: "button",
			width: 150,
			label: "Add",
			css: "customBtn"
		};

		const FormElements = [
			{
				margin: 30,
				cols: [
					{
						margin: 15,
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
						margin: 15,
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

		return {
			paddingX: 10,
			rows: [
				{view: "label", label: "Add new contact", css: "form-label"},
				{
					view: "form",
					borderless: true,
					margin: 15,
					rows: FormElements
				},
				{}
			]
		};
	}
}
