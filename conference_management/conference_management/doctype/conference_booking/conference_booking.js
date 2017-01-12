// Copyright (c) 2016, GoElite and contributors
// For license information, please see license.txt

frappe.ui.form.on('Conference booking', {
	refresh: function(frm) {

	},
	email:function(frm){
		email=frm.doc.email
		frappe.call({
			method :"conference_management.conference_management.doctype.conference_booking.conference_booking.get_location",
			args:{
			 			"email":email,
			 	},
				callback: function(r) {
					console.log(r.message);
					cur_frm.set_value("location",r.message);
				}

			});
	}
});
