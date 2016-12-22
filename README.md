tagInput
===================


Simple yet effective email id tag generator.  It creates gmail like tags inputs for email.

**Options**

| Option         | Default                                                                                                                                                          | Function                                                                          |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| tagKeys        | ['space', 'comma', 'enter', 'semicolon']                                                                                                                         | Keys that would trigger test on the email yet entered and add it if valid         |
| emailSeperator | ','                                                                                                                                                              | Seperator between emaails. Inserted as - 'email1 email2'                          |
| defaultEmails  | [ ]                                                                                                                                                              | Array of default emails                                                           |
| validEmailTest | function(email) { if ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) ) {         return ('valid');     } else {         return ('invalid');     } } | Custom bolean function that receives email as parameter and returns valid/invalid |


    		$(element / s).tagInput({
			'tagKeys': ['space', 'comma', 'enter', 'semicolon'],
			'emailSeperator': ',',
			'defaultEmails': [],
			'validEmailTest': function(email) {
				if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
					return ('valid');
				} else {
					return ('invalid');
				}
			}
		});

**Features:**

 - Validates Email before adding it to the list
 - Custom regex expression to validate emails from certain domains or pattern

**To Do**

 - Edit a already entered email
 - Arrange emails


