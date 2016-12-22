(function($) {

	$.fn.tagInput = function(options) {

		var defaults = {
			'tagKeys': ['space', 'comma', 'enter'],
			'emailSeperator' : ',',
			'defaultEmails' : null,
			'validEmailTest' : null
		};

		var settings = $.extend({}, defaults, options);

		for (var i = 0; i < settings.tagKeys.length; i++) {
			if (settings.tagKeys[i] == 'space') {
				settings.tagKeys[i] = 32;
			} else if (settings.tagKeys[i] == 'comma') {
				settings.tagKeys[i] = 188;
			} else if (settings.tagKeys[i] == 'enter') {
				settings.tagKeys[i] = 13;
			} else if (settings.tagKeys[i] == 'semicolon') {
				settings.tagKeys[i] = 59;
			} else if (settings.tagKeys[i] === parseInt(settings.tagKeys[i], 10)) {
				settings.tagKeys[i] = settings.tagKeys[i];
			}
		}
		
		settings.emailSeperator = settings.emailSeperator.trim();

		console.log(settings);

		return this.each(function() {
			var elem = this;
			var emailIds = [];
			var elem_height = $(elem).height();
			var containerDiv = $('<div>').addClass('tagInput-container');
			var inputElementContainer = $('<div>').addClass('tagInput-input-container');
			var inputElement = $('<input>').addClass('tagInput-input');
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

				if (settings.tagKeys.indexOf(keynum) != -1) {
					var keyup_stat = 0;
					if (addTag($(this).val()) == true) {
						$(this).val('');
						keyup_stat = 1;
						$(this).on('keyup', function(e) {
							if (keyup_stat == 1) {
								$(this).val('');
								keyup_stat = 0;
							}
						});
					}
				} else if (keynum == 8 && $(this).val().length == 0 && $(inputElementContainer).parent().find('.tagInput-tag:last').length > 0) {
					emailIds.splice(emailIds.indexOf($(containerDiv).find('.tagInput-tag:last').text()), 1);
					$(elem).val(emailIds.join(settings.emailSeperator + ' '));
					$(containerDiv).find('.tagInput-tag:last').remove();
					setInputWidth();
				}
			});

			function addTag(value) {
				value = value.trim();

				if (checkDuplicate(value) == 'found') {
					return;
				}

				if (ValidateEmail(value) == 'invalid') {
					$(inputElement).addClass('tagInput-invalid-email');
					return false;
				}
				var removeIcon = $('<a>').addClass('tagInput-tag-remove').attr('title', 'Remove').append($('<span>').addClass('glyphicon glyphicon-remove'));
				var tagElem = $('<div>').addClass('tagInput-tag').append($('<span>').text(value)).append(removeIcon);

				emailIds.push(value);
				$(elem).val(emailIds.join(settings.emailSeperator + ' '));

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

			function ValidateEmail(mail) {
				if( settings.validEmailTest != null ){
					return settings.validEmailTest(mail);
				}else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
					return ('valid');
				} else {
					return ('invalid')
				}
			}

			(function() {
				$(containerDiv).on('click', '.tagInput-tag-remove', function(event) {
					event.preventDefault();
					$(this).parent().remove();
					emailIds.splice(emailIds.indexOf($(this).parent().find('span').text()), 1);
					$(elem).val(emailIds.join(settings.emailSeperator + ' '));
				});
			})();

			function initialize() {
				if ($(elem).val() != '') {
					var defaultEmail = $(elem).val();
					defaultEmail = defaultEmail.split(settings.emailSeperator);
					for (var i = 0; i < defaultEmail.length; i++) {
						addTag(defaultEmail[i].trim());
					}
				}
				if(settings.defaultEmails != null){
					for (var i = 0; i < settings.defaultEmails.length; i++) {
						addTag( settings.defaultEmails[i].trim() );
					}
				}
				setInputWidth();
			};
			initialize();

			function checkDuplicate(email) {
				if (emailIds.indexOf(email) >= 0) {
					return 'found';
				} else {
					return 'not_found';
				}
			}

			return $(this);
			// return $(this).hide();
		});

	};

})(jQuery);