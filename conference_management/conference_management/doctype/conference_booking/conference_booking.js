// Copyright (c) 2016, GoElite and contributors
// For license information, please see license.txt

frappe.ui.form.on('Conference booking', {
	refresh: function(frm) {
		//console.log(frm.doc.area)
	},
 	
 // 	onload: function(frm){
	// 	//console.log(frm.doc.area)
	// 	frm.set_query("conference", function(){
	// 		return {
	// 			"filters": {
	// 				"city": frm.doc.city
	// 			}
	// 		}
	// 	},
	// })


	email:function(frm){
		email=frm.doc.email
		frappe.call({
			method :"conference_management.conference_management.doctype.conference_booking.conference_booking.get_location",
			args:{
			 			"email":email
			 	},
				callback: function(r) {
					// console.log(r.message);
					User_details=r.message;
					cur_frm.set_value("location",User_details.location);
					cur_frm.set_value("city",User_details.city);
					cur_frm.set_value("facility",User_details.facility);
					cur_frm.set_value("area",User_details.region);
					cur_frm.set_value("building",User_details.floor);
				}
			});

		

	}
	
});
