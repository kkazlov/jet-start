import {JetView} from "webix-jet";
import "../styles/contacts.css";

export default class Contacts extends JetView {
	config() {
		const list = {
			view: "list",
			template: "#title#",
			select: true,
			data: [
				{id: 1, title: "Item 1"},
				{id: 2, title: "Item 2"},
				{id: 3, title: "Item 3"}
			]
		};

		const infoHead = {
			type: "clean",
			margin: 10,
			paddingX: 12,
			cols: [
				{
					view: "label",
					label: "Label",
					labelPosition: "top",
					css: "info__label"
				},
				{},
				{
					view: "button",
					type: "icon",
					width: 120,
					height: 50,
					icon: "far fa-trash-alt",
					label: "Delete",
					css: "info__btn"
				},
				{
					view: "button",
					type: "icon",
					width: 120,
					height: 50,
					icon: "far fa-edit",
					label: "Edit",
					css: "info__btn"
				}
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
			template: obj => `
				<div class="info">
					<div class="info__block">
						<div class="info__photo">
							<img src=${obj.Photo} alt="photo">
						</div>

						<div class="info__status">
							<span class="status-name">StatusName</span>
							<span class='fas fa-adjust'></span>
						</div>
					</div>

					<div class="info__items">
						<div class="info__item">Item1</div>
						<div class="info__item">Item2</div>
						<div class="info__item">Item3</div>
						<div class="info__item">Item4</div>
						<div class="info__item">Item5</div>
						<div class="info__item">Item6</div>
						<div class="info__item">Item7</div>
						<div class="info__item">Item8</div>
						<div class="info__item">Item9</div>
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
