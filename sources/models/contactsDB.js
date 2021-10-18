const contactsDB = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$change: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj._birthday = webix.Date.dateToStr("%Y-%m-%d")(obj.Birthday);
		}
	}
});

export default contactsDB;
