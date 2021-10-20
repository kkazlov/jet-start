import {JetView} from "webix-jet";

export default class SettingsConstr extends JetView {
	constructor(app, config) {
		super(app);

		const {dataBase} = config;
		this._dataBase = dataBase;
	}

	config() {
		const _ = this.app.getService("locale")._;

		const rules = {
			Value: value => value.length <= 15 && webix.rules.isNotEmpty(value),
			Icon: value => value.length <= 15 && webix.rules.isNotEmpty(value)
		};

		const tableColumns = [
			{
				id: "Value",
				header: _("Name"),
				fillspace: 6,
				editor: "text"
			},
			{
				id: "Icon",
				header: _("Icon"),
				fillspace: 6,
				editor: "text"
			},
			{
				id: "delete",
				header: "",
				fillspace: 1,
				css: {"text-align": "center"},
				template: () => "<span class='far fa-trash-alt deleteIcon table-icon'></span>"
			}
		];

		const Table = {
			view: "datatable",
			localId: "table",
			editable: true,
			css: "webix_data_border webix_header_border activity-table",
			columns: tableColumns,
			onClick: {
				deleteIcon: (e, id) => this.deleteIcon(e, id)
			},
			rules,
			on: {
				onBeforeEditStop(state, editor, ignore) {
					const value = editor.getValue();
					const check = (value !== "" && value.length <= 15);
					if (!ignore && !check) {
						this.validateEditor(editor);
						return false;
					}
					return true;
				}
			}
		};

		const AddBtn = {
			view: "button",
			value: _("Add"),
			css: "webix_primary",
			click: () => this.addRecord()
		};

		const CancelBtn = {
			view: "button",
			value: _("Cancel"),
			click: () => this.clearForm()
		};

		const Form = {
			view: "form",
			localId: "form",
			elementsConfig: {
				labelWidth: 120,
				invalidMessage: _("Enter the correct value!"),
				bottomPadding: 18
			},
			elements: [
				{view: "text", label: _("Name"), name: "Value"},
				{view: "text", label: _("Icon"), name: "Icon"},
				{cols: [AddBtn, CancelBtn]}
			],
			rules,
			on: {
				onChange() {
					this.clearValidation();
				}
			}
		};

		return {
			rows: [Table, Form]
		};
	}

	init() {
		const table = this.$$("table");
		this._dataBase.waitData.then(() => {
			table.data.sync(this._dataBase);
		});
	}

	deleteIcon(e, id) {
		const _ = this.app.getService("locale")._;

		webix
			.confirm({
				title: _("Delete"),
				text: _("Do you want to delete this record? Deleting cannot be undone.")
			})
			.then(() => {
				this._dataBase.remove(id);
			});
	}

	clearForm() {
		const form = this.$$("form");
		form.clear();
		form.clearValidation();
	}

	addRecord() {
		const _ = this.app.getService("locale")._;
		const form = this.$$("form");

		if (form.validate()) {
			const values = form.getValues();
			this._dataBase.add(values);

			webix.message(_("A new record has been added"));
			this.clearForm();
		}
	}
}
