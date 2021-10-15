import {JetView} from "webix-jet";

import filesDB from "../../models/filesDB";

export default class FilesTable extends JetView {
	config() {
		const nameCol = {
			id: "FileName",
			header: "Name",
			sort: "text",
			fillspace: 6
		};

		const changeDateCol = {
			id: "ChangeDate",
			header: "Change date",
			sort: "text",
			fillspace: 3
		};

		const convertedSize = (size) => {
			const numValue = parseFloat(size);
			const unit = size.replace(/[\d.|\s]/g, "");
			let convertedValue;
			switch (unit) {
				case "b":
					convertedValue = numValue * 1;
					break;
				case "Kb":
					convertedValue = numValue * 1024;
					break;
				case "Mb":
					convertedValue = numValue * 1048576;
					break;
				case "Gb":
					convertedValue = numValue * 1073741824;
					break;
				default:
					break;
			}
			return convertedValue;
		};

		const sizeCol = {
			id: "Size",
			header: "Size",
			fillspace: 2,
			sort: (a, b) => {
				const {Size: sizeA} = a;
				const {Size: sizeB} = b;
				const aConverted = convertedSize(sizeA);
				const bConverted = convertedSize(sizeB);

				if (aConverted > bConverted) {
					return 1;
				}
				else if (aConverted < bConverted) {
					return -1;
				}
				return 0;
			}
		};

		const deleteCol = {
			id: "delete",
			header: "",
			fillspace: 1,
			css: {"text-align": "center"},
			template: () =>
				"<span class='far fa-trash-alt deleteIcon table-icon'></span>"
		};

		const table = {
			view: "datatable",
			localId: "table",
			columns: [nameCol, changeDateCol, sizeCol, deleteCol],
			css: "webix_data_border webix_header_border activity-table"
		};

		const uploadBtn = {
			view: "uploader",
			label: "Upload file",
			css: "customBtn",
			autosend: false,
			multiple: false,
			on: {
				onAfterFileAdd: function name() {
					const files = this.files;
					const id = files.getFirstId();
					const {
						name: FileName,
						sizetext: Size,
						file: {lastModifiedDate: ChangeDate}
					} = files.getItem(id);

					const sendData = {
						FileName,
						Size,
						ContactID: this.$scope._contactID,
						ChangeDate: webix.Date.dateToStr("%Y-%m-%d")(ChangeDate)
					};
					filesDB.add(sendData);
				}
			}
		};
		return {
			rows: [table, {cols: [{}, uploadBtn, {}]}]
		};
	}

	urlChange() {
		const contactID = this.getParam("id");
		this._contactID = contactID;

		const table = this.$$("table");
		table.data.sync(filesDB, function filter() {
			this.filter("#ContactID#", contactID);
		});
	}
}
