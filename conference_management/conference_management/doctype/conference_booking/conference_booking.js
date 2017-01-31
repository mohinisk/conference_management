// Copyright (c) 2016, GoElite and contributors
// For license information, please see license.txt

frappe.ui.form.on('Conference booking', {
	onload: function(frm){

		console.log(cur_frm.doc.conference); 

	},
	refresh: function(frm) {
		//cur_frm.set_value("date1",cur_frm.doc.date);
		console.log(cur_frm.doc.date)

		/*frappe.call({
			method :"conference_management.conference_management.doctype.conference_booking.conference_booking.check_conference_permission",
			args:{
			 			"name":name
			 	},
			callback: function(r) {
				console.log(,r.message);
			}
		});

		*/
		//console.log(frm.doc.area)
	},
 	
	date:function(frm){
    		if (frm.doc.date < get_today()) 
   			{
        		frappe.msgprint("You can not select past date");
        		validated = false;
   			}
	},

	from_time:function(frm){
    		if (frm.doc.from_time > frm.doc.to_time)
   			{
        		frappe.msgprint("From Time Must Be Smaller Than To Time");
        		validated = false;
   			}
	},

	to_time:function(frm){
    		if (frm.doc.to_time < frm.doc.from_time)
   			{
        		frappe.msgprint("To Time Must Be Greater Than From Time");
        		validated = false;
   			}
	},

// For getting user location details by selecting user email on conference booking doctype
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
					cur_frm.set_value("bay",User_details.bay);
				}
			});

	},
	
	// validate:function(frm){
		
		
		
	// }

	



	
});
