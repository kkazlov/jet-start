import {JetView} from "webix-jet";

export default class FilesTable extends JetView {
	config() {
		const nameCol = {
			id: "name",
			header: "Name",
			fillspace: 6
		};

		const changeDateCol = {
			id: "changeDate",
			header: "Change date",
			fillspace: 3
		};

		const sizeCol = {
			id: "size",
			header: "Size",
			fillspace: 2
		};

		const deleteCol = {
			id: "delete",
			header: "",
			fillspace: 1,
			css: {"text-align": "center"},
			template: () => "<span class='far fa-trash-alt deleteIcon table-icon'></span>"
		};

		const table = {
			view: "datatable",
			columns: [nameCol, changeDateCol, sizeCol, deleteCol],
			css: "webix_data_border webix_header_border activity-table"
		};
		const uploadBtn = {
			view: "uploader",
			label: "Change photo",
			css: "customBtn",
			accept: "image/jpeg, image/png",
			autosend: false,
			multiple: false,
			on: {
				onBeforeFileAdd(upload) {
					let file = upload.file;
					let reader = new FileReader();
					reader.onload = (event) => {
						webix
							.$$("photoTemplate")
							.parse({Photo: event.target.result});
					};
					reader.readAsDataURL(file);
					return false;
				}
			}
		};
		return {
			rows: [table, {cols: [{}, uploadBtn, {}]}]
		};
	}
}
