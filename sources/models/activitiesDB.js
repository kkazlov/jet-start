const activitiesDB = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj) {
			obj.check = obj.State === "Close" ? 1 : 0;
		},
		$change(obj) {
			obj.State = obj.check === 1 ? "Close" : "Open";
		}
	}
});

export default activitiesDB;
