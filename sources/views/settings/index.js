import {JetView} from "webix-jet";

import activityTypesDB from "../../models/activityTypesDB";
import statusesDB from "../../models/statusesDB";
import SettingsConstr from "./settings-constr";


export default class Settings extends JetView {
	config() {
		const ActivitySetting = new SettingsConstr(this.app, {
			dataBase: activityTypesDB,
			label: "Activity"
		});

		const StatusSetting = new SettingsConstr(this.app, {
			dataBase: statusesDB,
			label: "Status"
		});

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
								{$subview: ActivitySetting, id: "activity"},
								{$subview: StatusSetting, id: "status"}
							]
						}
					]
				}
			]
		};
	}
}
