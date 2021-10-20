import {JetView} from "webix-jet";

export default class SettingsConstr extends JetView {
	constructor(app, config) {
		super(app);

		const {dataBase, label} = config;
		this._dataBase = dataBase;
		this._label = label;
	}

	config() {
		const rules = {
			Value: value => value.length <= 15 && webix.rules.isNotEmpty(value),
			Icon: value => value.length <= 15 && webix.rules.isNotEmpty(value)
		};

		const tableColumns = [
			{
				id: "Value",
				header: "Value",
				fillspace: 6,
				editor: "text"
			},
			{
				id: "Icon",
				header: "Icon",
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
			value: "Add",
			css: "webix_primary",
			click: () => this.addRecord()
		};

		const CancelBtn = {
			view: "button",
			value: "Cancel",
			click: () => this.clearForm()
		};

		const Form = {
			view: "form",
			localId: "form",
			elementsConfig: {
				labelWidth: 120,
				invalidMessage: "Enter the correct value!",
				bottomPadding: 18
			},
			elements: [
				{view: "text", label: `${this._label} Value`, name: "Value"},
				{view: "text", label: `${this._label} Icon`, name: "Icon"},
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
		webix
			.confirm({
				title: "Delete",
				text: "Do you want to delete this record? Deleting cannot be undone."
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
		const form = this.$$("form");

		if (form.validate()) {
			const values = form.getValues();
			this._dataBase.add(values);

			webix.message("A new record has been added");
			this.clearForm();
		}
	}
}
