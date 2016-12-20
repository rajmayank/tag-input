(function($) {

	$.fn.tagInput = function(options) {

		var defaults = {
			checkDupEmail: true,
			position: "top"
		};

		var settings = $.extend({}, defaults, options);

		return this.each(function() {
			var elem = this;
			var elem_height = $(elem).height();
			var containerDiv = $('<div>').addClass('tagInput-container');
			var inputElementContainer = $('<div>').addClass('tagInput-input-container');
			var inputElement = $('<input>').addClass('tagInput-input');


			var emailIds = [];

			$(inputElementContainer).append(inputElement);
			$(containerDiv).append(inputElementContainer);
			$(elem).after(containerDiv);

			$(inputElement).on('keydown', function(e) {
				$(this).removeClass('tagInput-invalid-email');

				var keynum;
				if (window.event) {
					keynum = e.keyCode;
				} else if (e.which) {
					keynum = e.which;
				}
				// console.log('keynum', keynum);
				if (keynum == 32 || keynum == 13 || keynum == 188) { // on space , enter and comma
					if (addTag($(this).val()) == true) {
						$(this).val('');
					}
				} else if (keynum == 8 && $(this).val().length == 0 && $(inputElementContainer).parent().find('.tagInput-tag:last').length > 0) {
					emailIds.splice(emailIds.indexOf($(containerDiv).find('.tagInput-tag:last').text()), 1);
					$(elem).val(emailIds.join(', '));
					$(containerDiv).find('.tagInput-tag:last').remove();
					setInputWidth();
				}
			});

			function addTag(value) {
				value = value.trim();
				if (ValidateEmail(value) == 'invalid') {
					$(inputElement).addClass('tagInput-invalid-email');
					return false;
				}
				var removeIcon = $('<a>').addClass('tagInput-tag-remove').attr('title', 'Remove').append($('<span>').addClass('glyphicon glyphicon-remove'));
				var tagElem = $('<div>').addClass('tagInput-tag').append($('<span>').text(value)).append(removeIcon);


				emailIds.push(value);
				$(elem).val(emailIds.join(', '));

				$(inputElementContainer).before(tagElem);
				setInputWidth();
				return true;
			}
			
			function setInputWidth() {
				if ($(inputElementContainer).parent().find('.tagInput-tag:last').length > 0) {
					var right_limit = $(containerDiv).offset().left + $(containerDiv).width();
					var left_limit = $(inputElementContainer).parent().find('.tagInput-tag:last').offset().left + $(inputElementContainer).parent().find('.tagInput-tag:last').width();
					var new_width = right_limit - left_limit - 30;
					if (new_width < 200) {
						$(inputElementContainer).width();
						$(inputElementContainer).addClass('fullWidth');
					} else {
						$(inputElementContainer).removeClass('fullWidth');
						$(inputElementContainer).width((right_limit - left_limit - 50));
					}
				} else {
					$(inputElementContainer).width();
					$(inputElementContainer).addClass('fullWidth');
				}
			};
			setInputWidth();

			function ValidateEmail(mail) {
				if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
					return ('valid');
				} else
					return ('invalid')
			}


			$(containerDiv).find('.tagInput-tag-remove').on('click', function(event) {
				event.preventDefault();
				$(this).parent().remove();

				emailIds.splice(emailIds.indexOf($(this).parent().find('span').text()), 1);
				$(elem).val(emailIds.join(', '));
			});


			// return $(this);
			return $(this).hide();
		});

	};

})(jQuery);