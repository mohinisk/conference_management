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


	cur_frm.fields_dict['facilities'].grid.get_field('facility').get_query = function(doc, cdt, cdn) {
		facilities=[]
		$.each(cur_frm.doc.facilities, function(idx, val){
			facilities.push(val.facility)
		})
		console.log("facilities",facilities);	
		return { filters: [['Facilities','facility','not in', facilities]]}
	}


