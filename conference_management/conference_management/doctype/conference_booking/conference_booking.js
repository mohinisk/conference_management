// Copyright (c) 2016, GoElite and contributors
// For license information, please see license.txt

frappe.ui.form.on('Conference booking', {
	onload: function(frm){
		console.log(cur_frm.doc.conference);
		if(frm.doc.__islocal) 
		{ 
			cur_frm.set_value("email",user); 
		}

		console.log(frm.doc.area)
		frm.set_query("conference", function(){
			return {
				"filters": {
					"city": frm.doc.city,
					"facility":frm.doc.facility
				}
			}
		})

	},
	refresh: function(frm) {
		//cur_frm.set_value("date1",cur_frm.doc.date);
		console.log(cur_frm.doc.date)
		cur_frm.set_df_property("conference","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("area","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("city","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("facility","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("building","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("location","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("date","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("from_time","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("to_time","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("attendees","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("send_invite","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("agenda","read_only",cur_frm.doc.__islocal ? 0: 1);
		cur_frm.set_df_property("pantry_service","read_only",cur_frm.doc.__islocal ? 0: 1);

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
		console.log("--",email)
		frappe.call({
				method :"conference_management.conference_management.doctype.conference_booking.conference_booking.get_location",
				args:{
			 			"email":email
			 	},
				callback: function(r) {
						User_details=r.message;
						if(frm.doc.email==User_details.name && (frm.doc.city!=User_details.city && frm.doc.facility!=User_details.facility))
						{
							console.log("Changed value");
							cur_frm.set_value("location",User_details.location);
							console.log("c",frm.doc.city)
							console.log("a",frm.doc.area)
							console.log("f",frm.doc.facility)

							if(frm.doc.city==undefined && frm.doc.area==undefined && frm.doc.facility==undefined){
								console.log("IIFIF")
								cur_frm.set_value("location",User_details.location);
								cur_frm.set_value("city",User_details.city);
								cur_frm.set_value("area",User_details.region);
								cur_frm.set_value("facility",User_details.facility);
								cur_frm.set_value("building",User_details.floor);
								cur_frm.set_value("bay",User_details.bay);
							}

						}
						else
						{
							console.log("unchanged");
							cur_frm.set_value("location",User_details.location);
						}	
								
				}

			});

	},

	conference:function(frm){
		/* Function for fetching conference_facilities,accommodation_capacity for 
		   selected conference on conference booking.
		*/
		console.log("Selected conference",frm.doc.conference);
		frappe.call({
				method :"conference_management.conference_management.doctype.conference_booking.conference_booking.get_conference_details",
				args:{
			 			"conference_name":frm.doc.conference
			 	},
				callback: function(r) {
					conf_detail=r.message;
					faci='';
					for (i=0;i<conf_detail.facilities.length;i++)	
					{
						if(faci.length==0){
							faci=faci+conf_detail.facilities[i]['facility'];
						}
						else
						{
							faci=faci+"\n"+conf_detail.facilities[i]['facility'];	
						}
						
					}
					cur_frm.set_value("conference_facilities",faci);
					cur_frm.set_value("accommodation_capacity",conf_detail.accommodation_capacity);
				}
			});


	},
	
	check_availability:function(frm){
		/* Function for checking availability of conference for selected time and date 
		   and conference on conference booking.
		*/
		frappe.call({
				method :"conference_management.conference_management.doctype.conference_booking.conference_booking.check_availability",
				args:{
			 			"date":frm.doc.date,
						"from_time":frm.doc.from_time,
						"to_time":frm.doc.to_time,
						"conference":frm.doc.conference
			 	},
				callback: function(r) {
					cur_frm.set_value("availability",r.message);
				}
			});
	}
	// validate:function(frm){


		
		
		
	// }

	



	
});
