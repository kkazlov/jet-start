import {JetView} from "webix-jet";

import activityTypesDB from "../../models/activityTypesDB";
import statusesDB from "../../models/statusesDB";
import SettingsConstr from "./settings-constr";

export default class Settings extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const ActivitySetting = new SettingsConstr(this.app, {dataBase: activityTypesDB});
		const StatusSetting = new SettingsConstr(this.app, {dataBase: statusesDB});

		const value = this.app.getService("locale").getLang();

		const Language = [
			{view: "label", label: _("Language")},
			{
				view: "segmented",
				name: "lang",
				options: [
					{id: "en", value: "EN"},
					{id: "ru", value: "RU"}
				],
				value,
				click: () => this.toggleLanguage()
			}
		];

		const TableTabbar = {
			view: "tabbar",
			multiview: true,
			value: "activity",
			options: [
				{id: "activity", value: _("Activity types")},
				{id: "status", value: _("Contact statuses")}
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

	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot().queryView({name: "lang"}).getValue();
		langs.setLang(value);
	}
}
