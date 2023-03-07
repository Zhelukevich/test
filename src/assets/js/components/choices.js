const element = document.querySelectorAll('.js-choice');
element.forEach(el => {
	new Choices(el, {
		searchEnabled: false,
		itemSelectText: '',
	});
});

