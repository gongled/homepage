(function($) {
	/**
	 * Функция отправляет форму
	 * @param $form — jQuery-объект формы
	 */
	function submitForm($form) {

		var name = $form.find('[name="name"]');
		var email = $form.find('[name="email"]');
		var comment = $form.find('[name="comment"]');

		// Проверяем каждое поле
		function validationField(elem, placeholderText) {
			if (elem.val() == '') {
				elem.addClass('sovet-error').attr("placeholder", placeholderText);
				elem.focus();
				return false;
			} else {
				elem.removeClass('sovet-error');
			}
		}

		if (validationField(name, 'Представьтесь') == false || validationField(email, 'Введите почту')  == false || validationField(comment, 'Опишите вопрос')  == false) {
			return false;
		}

		// Блокируем инпуты и текстовые поля, чтобы ничего нельзя было изменить
		$form.find('input, textarea').prop('readonly', true);
		$form.find('input, textarea').prop('disabled', true);

		// Блокируем кнопку отправки
		$form.find('button[type="submit"]').prop('disabled', true);

		// Отправляем аякс-запрос

		$.ajax({
			url: $form.data('url'),
			type: 'POST',
			data: {
				name: name.val(),
				email: email.val(),
				comment: comment.val()
			},
			success: function(data) {
				// Снимаем блокировку с полей и очищаем их
				$form.find('input, textarea').prop('readonly', false);
				$form.find('input, textarea').prop('disabled', false);
				$form.find('button[type="submit"]').prop('disabled', false);
				$form.find('input, textarea').val('');
				$form.find('input, textarea').attr("placeholder", "");

				alert('Спасибо за вопрос! Скоро отвечу.');
			}
		});
	}

	$(document).ready(function() {
		$('form.sovet-form').on('submit', function() {
			submitForm( $(this) );
			return false;
		})
	});
})(jQuery);
