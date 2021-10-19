const TableView = (type, collections) => {
	const {activityTypesDB, contactsDB = ""} = collections;

	const checkCol = {
		id: "State",
		header: "",
		fillspace: 1,
		css: {"text-align": "center"},
		sort: "string",
		template: "{common.checkbox()}",
		checkValue: "Close",
		uncheckValue: "Open"
	};

	const activityTypeCol = {
		id: "ActivityType",
		header: [
			{
				content: "selectFilter",
				compare: (cellValue, filterValue, obj) => +obj.TypeID === +filterValue
			}
		],

		fillspace: 3,
		sort: "text",
		collection: activityTypesDB,
		template({TypeID}) {
			const activityType = this.collection.getItem(TypeID) || {
				Value: "",
				Icon: ""
			};
			const {Value, Icon} = activityType;
			return `${Value} <span class='fas fa-${Icon}'></span>`;
		}
	};

	const dueDateCol = {
		id: "Date",
		header: [{content: "datepickerFilter"}],
		fillspace: 3,
		sort: "date",
		format: webix.i18n.longDateFormatStr
	};

	const detailsCol = {
		id: "Details",
		header: [{content: "textFilter"}],
		sort: "string",
		fillspace: 6
	};

	const contactCol = {
		id: "Contact",
		header: [
			"Contacts",
			{
				content: "selectFilter",
				compare(cellValue, filterValue, obj) {
					return +obj.ContactID === +filterValue;
				}
			}
		],
		sort: "text",
		fillspace: 3,
		collection: contactsDB,
		template({ContactID}) {
			const contact = this.collection.getItem(ContactID) || {
				FirstName: "",
				LastName: ""
			};
			const {FirstName, LastName} = contact;
			return `${FirstName} ${LastName}`;
		}
	};

	const editCol = {
		id: "edit",
		header: "",
		fillspace: 1,
		css: {"text-align": "center"},
		template: () => "<span class='far fa-edit editIcon table-icon'></span>"
	};

	const deleteCol = {
		id: "delete",
		header: "",
		fillspace: 1,
		css: {"text-align": "center"},
		template: () => "<span class='far fa-trash-alt deleteIcon table-icon'></span>"
	};

	let tableColumns = [
		checkCol,
		activityTypeCol,
		dueDateCol,
		detailsCol,
		editCol,
		deleteCol
	];

	let columns;

	if (type === "activities") {
		tableColumns = [
			checkCol,
			{...activityTypeCol, header: ["Activity type", ...activityTypeCol.header]},
			{...dueDateCol, header: ["Due date", ...dueDateCol.header]},
			{...detailsCol, header: ["Details", ...detailsCol.header]},
			editCol,
			deleteCol
		];

		columns = [
			...tableColumns.slice(0, 4),
			contactCol,
			...tableColumns.slice(4)
		];
	}
	else columns = [...tableColumns];


	const datatable = {
		view: "datatable",
		localId: "table",
		columns,
		css: "webix_data_border webix_header_border activity-table"
	};

	return datatable;
};

export default TableView;
