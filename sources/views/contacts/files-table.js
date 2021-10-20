import {JetView} from "webix-jet";

import filesDB from "../../models/filesDB";

export default class FilesTable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const nameCol = {
			id: "FileName",
			header: _("Name"),
			sort: "text",
			fillspace: 6
		};

		const changeDateCol = {
			id: "ChangeDate",
			header: _("Change date"),
			sort: "text",
			fillspace: 3
		};

		const sizeCol = {
			id: "Size",
			header: _("Size"),
			fillspace: 2,
			sort: "int",
			template: "#SizeText#"
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
			localId: "table",
			columns: [nameCol, changeDateCol, sizeCol, deleteCol],
			css: "webix_data_border webix_header_border activity-table",
			onClick: {
				deleteIcon: (e, id) => this.deleteIcon(e, id)
			}
		};

		const uploadBtn = {
			view: "uploader",
			label: _("Upload file"),
			localId: "uploader",
			css: "customBtn",
			autosend: false,
			multiple: false,
			on: {
				onAfterFileAdd: () => this.onAfterFileAdd(),
				onFileUploadError: (file, res) => {
					webix.message(`Cannot upload a file. Status: ${res}`);
				}
			}
		};
		return {
			rows: [table, {cols: [{}, uploadBtn, {}]}]
		};
	}

	urlChange() {
		const contactID = this.getParam("id", true);
		this._contactID = contactID;

		const table = this.$$("table");
		table.data.sync(filesDB, () => {
			table.filter(obj => +obj.ContactID === +contactID);
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
				filesDB.remove(id);
			});
	}

	onAfterFileAdd() {
		const files = this.$$("uploader").files;
		const id = files.getFirstId();
		const {
			name: FileName,
			sizetext: SizeText,
			size: Size,
			file: {lastModifiedDate: ChangeDate}
		} = files.getItem(id);

		const sendData = {
			FileName,
			SizeText,
			Size,
			ContactID: this._contactID,
			ChangeDate: webix.Date.dateToStr("%Y-%m-%d")(ChangeDate)
		};
		filesDB.add(sendData);
	}
}
