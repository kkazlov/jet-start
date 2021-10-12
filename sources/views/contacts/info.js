const BtnDelete = {
	view: "button",
	type: "icon",
	width: 120,
	height: 50,
	icon: "far fa-trash-alt",
	label: "Delete",
	css: "customBtn"
};

const BtnEdit = {
	view: "button",
	type: "icon",
	width: 120,
	height: 50,
	icon: "far fa-edit",
	label: "Edit",
	css: "customBtn"
};

const InfoHead = {
	type: "clean",
	paddingY: 10,
	margin: 10,
	cols: [
		{
			localId: "infoTitle",
			borderless: true,
			autoheight: true,
			template: ({FirstName, LastName}) => `${FirstName} ${LastName}`,
			css: "info__label"
		},
		{},
		BtnDelete,
		BtnEdit
	]
};

const infoTemplate = () => {
	const template = ({
		Photo,
		Email,
		Skype,
		Job,
		Company,
		Birthday,
		Address,
		Status = "No status",
		StatusIcon = ""
	}) => {
		const _photo = Photo || "https://via.placeholder.com/550";

		return `
		<div class="info">
			<div class="info__block">
				<div class="info__photo">
					<img src=${_photo} alt="photo">
				</div>

				<div class="info__status">
					<span class="status-name">${Status}</span>
					<span class='fas fa-${StatusIcon}'></span>
				</div>
			</div>


			<div class="info__items">
				<div class="info__item">
					<span class="fas fa-envelope"></span>
					<span>Email: ${Email}</span>
				</div>

				<div class="info__item">
					<span class="fab fa-skype"></span>
					<span>Skype: ${Skype}</span>
				</div>

				<div class="info__item">
					<span class="fas fa-tag"></span>
					<span>Job: ${Job}</span>
				</div>

				<div class="info__item">
					<span class="fas fa-briefcase"></span>
					<span>Company: ${Company}</span>
				</div>

				<div class="info__item">
					<span class="far fa-calendar-alt"></span>
					<span>Date of birth: ${Birthday}</span>
				</div>

				<div class="info__item">
					<span class="fas fa-map-marker-alt"></span>
					<span>Location: ${Address}</span>
				</div>
			</div>
		</div>
	`;
	};
	return template;
};

const InfoMain = {
	localId: "infoMain",
	borderless: true,
	template: infoTemplate()
};

export {InfoHead, InfoMain, BtnDelete, BtnEdit};
