const activitiesDB = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$change: (obj) => {
			const parser = webix.Date.strToDate("%Y-%m-%d");
			obj.Date = parser(obj.DueDate);
		}
	}
});

export default activitiesDB;
