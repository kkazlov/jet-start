import {JetView, plugins} from "webix-jet";
import "../styles/menu.css";

export default class TopView extends JetView {
	config() {
		const header = {
			type: "header",
			localId: "header",
			data: {menuName: "Contacts"},
			template: ({menuName}) => `${menuName}`,
			css: "webix_header app_header"
		};

		const menu = {
			view: "menu",
			localId: "menu",
			id: "top:menu",
			css: "main-menu",
			width: 150,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Contacts", id: "contacts", icon: "fas fa-users", css: "menu__icon"},
				{value: "Activities", id: "activities", icon: "far fa-calendar-alt"},
				{value: "Settings", id: "settings", icon: "fas fa-cogs"}
			]
		};

		const ui = {
			rows: [
				header,
				{
					cols: [
						menu,
						{rows: [{$subview: true}]}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
		const menu = this.$$("menu");
		const header = this.$$("header");

		menu.attachEvent("onAfterSelect", () => {
			const value = menu.getSelectedItem().value;
			header.setValues({menuName: `${value}`});
		});
	}
}
