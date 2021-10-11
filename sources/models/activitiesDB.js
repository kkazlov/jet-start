import activityTypesDB from "./activityTypesDB";
import contactsDB from "./contactsDB";

const activitiesDB = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj) {
			activityTypesDB.waitData.then(() => {
				obj.ActivityType = activityTypesDB.getItem(obj.TypeID).Value;
			});
			contactsDB.waitData.then(() => {
				const {FirstName, LastName} = contactsDB.getItem(obj.ContactID);
				obj.Contact = `${FirstName} ${LastName}`;
			});
		}
	}
});

export default activitiesDB;
