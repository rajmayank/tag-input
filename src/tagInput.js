(function($) {

	$.fn.tagInput = function(options) {

		var defaults = {
			'tagKeys': ['space', 'comma', 'enter'],
			'emailSeperator': ',',
			'defaultText': null,
			'defaultEmails': null,
			'validEmailTest': null,
			'allowMultipleEntry': true,
			'multipleEntrySeperator': ';',
			'nameAndEmailFormat': true,
			'showEmailonFocusLost': false,
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
			if (settings.defaultText) {
				inputElement.attr('placeholder', settings.defaultText);
			}
			var clipboardElement = $('<input>').attr('type', 'hidden').addClass('hidden_text');
			// var clipboardElement = $('<input>').attr('type', 'text').addClass('hidden_text');

			$(inputElementContainer).append(inputElement);
			$(containerDiv).append(inputElementContainer);
			$(containerDiv).append(clipboardElement);
			$(elem).after(containerDiv);

			$(inputElement).on('keydown', function(e) {
				// Copy to clipboard event is handled in the respective section
				// i.e. events starting with key 'CTR'
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
					if (checkInput($(this).val()) == true) {
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

			function checkInput(value) {
				value = value.trim();

				if (settings.nameAndEmailFormat && value.indexOf('<') != -1 && value.indexOf('>') != -1 && value.indexOf(settings.multipleEntrySeperator.trim()) != -1) { // TODO - Improve flow here

					value = value.split(settings.multipleEntrySeperator.trim());
					for (var i = 0; i < value.length; i++) {
						value[i] = value[i].substring(value[i].indexOf('<') + 1, value[i].indexOf('>'));
						value[i] = value[i].trim();
					}
					for (var i = 0; i < value.length; i++) {
						if (value[i].trim() && ValidateEmail(value[i].trim()) == 'invalid') {
							$(inputElement).addClass('tagInput-invalid-email');
							return false;
						}
					}
					for (var i = 0; i < value.length; i++) {
						if (value[i].trim())
							addTag(value[i].trim());
					}
					return true;

				} else if (settings.nameAndEmailFormat && value.indexOf('<') != -1 && value.indexOf('>') != -1) {

					value = value.substring(value.indexOf('<') + 1, value.indexOf('>'));

					if (value.trim() && ValidateEmail(value.trim()) == 'invalid') {
						$(inputElement).addClass('tagInput-invalid-email');
						return false;
					}
					addTag(value[i].trim());
					return true;

				} else if (settings.allowMultipleEntry && value.indexOf(settings.multipleEntrySeperator.trim()) != -1) { // Validate Muliple email entries

					value = value.split(settings.multipleEntrySeperator.trim());
					for (var i = 0; i < value.length; i++) {
						if (value[i].trim() && ValidateEmail(value[i].trim()) == 'invalid') {
							$(inputElement).addClass('tagInput-invalid-email');
							return false;
						}
					}
					for (var i = 0; i < value.length; i++) {
						if (value[i].trim())
							addTag(value[i].trim());
					}
					return true;

				} else {

					if (ValidateEmail(value) == 'invalid') {
						$(inputElement).addClass('tagInput-invalid-email');
						return false;
					}
					addTag(value.trim());
					return true;

				}

			}

			function addTag(value) {
				if (checkDuplicate(value) == 'found') {
					return;
				}
				var removeIcon = $('<a>').addClass('tagInput-tag-remove').attr('title', 'Remove').append($('<span>').addClass('glyphicon glyphicon-remove'));
				var tagElem = $('<div>').addClass('tagInput-tag').append($('<span>').text(value)).append(removeIcon);

				emailIds.push(value);
				$(elem).val(emailIds.join(settings.emailSeperator + ' '));

				$(inputElementContainer).before(tagElem);
				setInputWidth();
			}

			function addTagonReFoucus() {
				for (var i = 0; i < emailIds.length; i++) {
					value = emailIds[i];
					var removeIcon = $('<a>').addClass('tagInput-tag-remove').attr('title', 'Remove').append($('<span>').addClass('glyphicon glyphicon-remove'));
					var tagElem = $('<div>').addClass('tagInput-tag').append($('<span>').text(value)).append(removeIcon);

					$(inputElementContainer).before(tagElem);
					setInputWidth();
				}
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
				if (settings.validEmailTest != null) {
					return settings.validEmailTest(mail);
				} else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
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
				if (settings.defaultEmails != null) {
					for (var i = 0; i < settings.defaultEmails.length; i++) {
						addTag(settings.defaultEmails[i].trim());
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

			if (settings.showEmailonFocusLost) {

				$(containerDiv).find('.tagInput-tag').remove();
				$(containerDiv).find('input').val(emailIds.join('; '));
				$(inputElement).focus(function() {
					addTagonReFoucus();
					$(this).val('');
				}).blur(function() {
					$(containerDiv).find('.tagInput-tag').remove();
					$(containerDiv).find('input').val(emailIds.join('; '));
				});
			}

			// Copy to clipboard
			var clip_currentCopyEvent = false;
			var clip_currentCopyFlag = false;
			var clip_justPressed = false;
			$(document).on('keydown', function(e) { // TODO - Costly operation here, Look for alternative
				var keynum;
				if (window.event) {
					keynum = e.keyCode;
				} else if (e.which) {
					keynum = e.which;
				}

				if (keynum == 17) {
					if (clip_currentCopyEvent) {
						$(clipboardElement).select();
						clip_justPressed = true;
					}
				} else {
					if (clip_justPressed) {
						clip_justPressed = false;
					} else {
						currentCopyEvent = false;
						$(containerDiv).find('.copy-state').removeClass('copy-state');
						$(clipboardElement).val('');
					}
				}
			});
			(function() {
				$(containerDiv).on('click', '.tagInput-tag', function(event) {
					clip_currentCopyEvent = true;
					clip_currentCopyFlag = true;
					$(containerDiv).find('.copy-state').removeClass('copy-state');
					$(this).addClass('copy-state');
					$(clipboardElement).val($(this).text());
				});
			})();

			$(document).on('click', function(e) {
				if (clip_currentCopyEvent && !clip_currentCopyFlag) {
					clip_currentCopyEvent = false;
					$(containerDiv).find('.copy-state').removeClass('copy-state');
					$(clipboardElement).val('');
				}
				clip_currentCopyFlag = false;
			});

			// return $(this);
			return $(this).hide();
		});

	};

})(jQuery);