import {JetView} from "webix-jet";
import "../styles/contacts.css";

export default class Contacts extends JetView {
	config() {
		const list = {
			view: "list",
			template: ({Photo, FirstName, LastName, Company}) => `
			<div class="contact__item">
				<div class="contact__photo">
					<img src=${Photo} alt="Photo">
				</div>
				<div class="contact__name">
					<div>${FirstName} ${LastName}</div>
					<div>${Company}</div>
				</div>
			</div>
			`,
			select: true,
			data: [
				{
					id: 1,
					FirstName: "Nelly",
					LastName: "Anderson",
					Company: "BBN Software",
					Job: "Lead Developer",
					Photo: "https://via.placeholder.com/550"
				},
				{
					id: 2,
					FirstName: "Neasdd",
					LastName: "Andsafasfon",
					Company: "XB Software",
					Job: "Developer",
					Photo: "https://via.placeholder.com/150"
				},
				{
					id: 3,
					FirstName: "33Neasdd",
					LastName: "Xfasfon",
					Company: "ASD Software",
					Job: "JSSD",
					Photo: "https://via.placeholder.com/150"
				}
			]
		};

		const btnDelete = {
			view: "button",
			type: "icon",
			width: 120,
			height: 50,
			icon: "far fa-trash-alt",
			label: "Delete",
			css: "info__btn"
		};

		const btnEdit = {
			view: "button",
			type: "icon",
			width: 120,
			height: 50,
			icon: "far fa-edit",
			label: "Edit",
			css: "info__btn"
		};

		const infoHead = {
			type: "clean",
			margin: 10,
			cols: [
				{
					borderless: true,
					autoheight: true,
					data: [
						{
							id: 1,
							FirstName: "Nelly",
							LastName: "Anderson"
						}
					],
					template: ({FirstName, LastName}) => `${FirstName} ${LastName}`,
					css: "info__label"
				},
				{},
				btnDelete,
				btnEdit
			]
		};

		const infoMain = {
			borderless: true,
			data: [
				{
					id: 1,
					FirstName: "Nelly",
					LastName: "Anderson",
					StatusID: 2,
					Company: "BBN Software",
					Address: "Not specified",
					Job: "Lead Developer",
					Website: "http://bbnsoft.com",
					Skype: "-",
					Phone: "+1 45 455-77-55",
					Email: "alex@gmail.com",
					Photo: "https://via.placeholder.com/550",
					Birthday: "1970-07-07",
					StartDate: "2001-04-18"
				}
			],
			template: ({
				Photo,
				Email,
				Skype,
				Job,
				Company,
				Birthday,
				Address
			}) => `
				<div class="info">
					<div class="info__block">
						<div class="info__photo">
							<img src=${Photo} alt="photo">
						</div>

						<div class="info__status">
							<span class="status-name">StatusName</span>
							<span class='fas fa-adjust'></span>
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
			`
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
}
