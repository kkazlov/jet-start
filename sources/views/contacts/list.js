const List = {
	view: "list",
	localId: "list",
	minWidth: 200,
	template: ({Photo, FirstName, LastName, Company}) => {
		const _photo = Photo || "https://via.placeholder.com/550";
		return `
		<div class="contact__item">
			<div class="contact__photo">
				<img src=${_photo} alt="Photo">
			</div>
			<div class="contact__name">
				<div>${FirstName} ${LastName}</div>
				<div>${Company}</div>
			</div>
		</div>
		`;
	},
	select: true
};

export default List;
