
const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const success = document.querySelector('.form__success');
	const registered = document.querySelector('.form__registered');

	if (validatorForm(this) == true) {
		form.reset();
		success.style.display = 'block'
		registered.style.display = 'none'
	}

});



function validatorForm(form) {
	let result = true;
	let formReq = document.querySelectorAll('._req');
	let password = document.getElementById('password');
	let confirm_password = document.getElementById('confirm_password');
	let errorText = document.querySelector('.error-text');

	formReq.forEach(input => {
		formRemoveError(input);
		if (input.classList.contains('_email')) {

			if (emailTest(input)) {
				try {
					formAddError(input);
					result = false;
					throw new TypeError('E-mail не по шаблону');
				} catch (e) {
					errorText.textContent = e.message
				}
			}

		} else if (input.classList.contains('_password')) {
			if (passwordTest(input)) {
				try {
					formAddError(input);
					result = false;
					throw new TypeError('От 8 символов, заглавные и строчные буквы, а также цифры');
				} catch (e) {
					errorText.textContent = e.message
				}
			}
		} else {
			if (input.value === '') {
				formAddError(input);
				result = false;

			}
		}
	})

	if (password.value !== confirm_password.value) {
		try {
			formAddError(password);
			formAddError(confirm_password)
			result = false;
			throw new TypeError('Не совпадает');
		} catch (e) {
			errorText.textContent = e.message
		}

	}

	return result
}


function formAddError(input) {
	input.classList.add('_error');
}

function formRemoveError(input) {
	input.classList.remove('_error');
}

function emailTest(input) {
	return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

function passwordTest(input) {
	return !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(input.value);
}


