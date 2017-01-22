// Copyright (c) 2016, GoElite and contributors
// For license information, please see license.txt
frappe.ui.form.on('Conference', {
	refresh: function(frm) {
		
	},
	onload: function(frm){
		console.log(frm.doc.area)
		frm.set_query("city", function(){
			return {
				"filters": {
					"region": frm.doc.area
				}
			}
		})
	//},
	
	//onload: function(frm){
	 	frm.set_query("facility", function(){
	 		return {
	 			"filters": {
	 				"city": frm.doc.city
	 			}
	 		};
	 	})

	 	frm.set_query("building", function(){
	 		return {
	 			"filters": {
	 				"facility": frm.doc.facility
	 			}
	 		};
	 	})
	
	}
});
