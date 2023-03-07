
const form = document.getElementById('form');
const completeBtn = document.querySelector('.complete__btn');

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const success = document.querySelector('.form__success');
	const registered = document.querySelector('.form__registered');

	if (validatorForm(this) == true) {
		form.reset();
		success.style.display = 'block'
		registered.style.display = 'none'
	} else {
		btnAnimation()
	}

});

function btnAnimation() {
	completeBtn.classList.add('btn-animation')
	completeBtn.addEventListener("animationend", AnimationHandler, false);
	function AnimationHandler() {
		completeBtn.classList.remove('btn-animation');

	}
}

function validatorForm(form) {
	let result = true;
	let formReq = document.querySelectorAll('._req');
	let password = document.getElementById('password');
	let confirm_password = document.getElementById('confirm_password');

	function removeError(input) {
		const parent = input.parentNode;
		if (input.classList.contains('_error')) {
			parent.querySelector('.error-text').remove()
			input.classList.remove('_error')
		}
	}

	function createError(input, text) {
		const parent = input.parentNode;
		const errorBlock = document.createElement('span');

		errorBlock.classList.add('error-text');
		errorBlock.textContent = text;

		parent.querySelector('._req').classList.add('_error');

		parent.append(errorBlock);
	}

	formReq.forEach(input => {
		removeError(input);

		if (input.classList.contains('_email')) {
			if (emailTest(input)) {
				createError(input, 'E-mail не по шаблону!')
				result = false;
			}
		} else if (input.classList.contains('_password')) {
			if (passwordTest(input)) {
				createError(input, 'От 8 символов, заглавные и строчные буквы, цифры')
				result = false;
			} else if (password.value !== confirm_password.value) {
				createError(input, 'Пароль не совпадает!')
				result = false;
			}
		} else if (input.value === '') {
			createError(input, 'Поле не заполнено!')
			result = false;

		}
	})



	return result
}

function emailTest(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

function passwordTest(input) {
	return !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(input.value);
}


