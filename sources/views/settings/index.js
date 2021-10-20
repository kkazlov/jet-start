import {JetView} from "webix-jet";

import SettingsActivity from "./settings-activity";
import SettingsStatus from "./settings-status";


export default class Settings extends JetView {
	config() {
		const Language = [
			{view: "label", label: "Language"},
			{
				view: "tabbar",
				value: "en",
				options: [
					{id: "en", value: "en"},
					{id: "ru", value: "ru"}
				]
			}
		];

		const TableTabbar = {
			view: "tabbar",
			multiview: true,
			value: "activity",
			options: [
				{id: "activity", value: "Activity types"},
				{id: "status", value: "Contact statuses"}
			]
		};

		return {
			margin: 50,
			padding: 15,
			rows: [
				{cols: Language},
				{
					rows: [
						TableTabbar,
						{
							cells: [
								{$subview: SettingsActivity, id: "activity"},
								{$subview: SettingsStatus, id: "status"}
							]
						}
					]
				}
			]
		};
	}
}
