import {JetView} from "webix-jet";

import ListView from "./list";


export default class Contacts extends JetView {
	config() {
		return {
			type: "clean",
			cols: [
				ListView,
				{
					gravity: 3,
					paddingX: 15,
					animate: false,
					cells: [{$subview: true}]
				}
			]
		};
	}
}
