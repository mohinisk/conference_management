frappe.pages['search-conferences'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Conference Search And Booking',
		single_column: true
	});
	frappe.breadcrumbs.add("Conference");
	$(frappe.render_template("search_conferences", this)).appendTo(this.page.main);
	wrapper.search = new frappe.Search(wrapper);
	
}	

frappe.Search = Class.extend({

	init: function(wrapper) {
		this.wrapper = wrapper;
		this.body = $(this.wrapper).find(".search");		
		this.make_page();

	},

	make_page: function() {
		var me = this;
		me.setup_page();
		///me.get_facility();
		me.get_values();
		me.refresh();
	},

	refresh: function(){
	var me = this;
	console.log("me",me);
		me.date.value=" ";
        me.from_time.value=" ";
        me.from_time.value=" ";
        me.to_time.value=" ";
        me.attendees.value=" ";
            //me.area.input.value=" ";
            //me.from_time.input.value=" ";
            $('#tbody').html("");
	},
	setup_page: function() {
		var me = this;
		me.date = frappe.ui.form.make_control({
			parent: $("#date"),
			df: {
				fieldtype: "Date",
					fieldname: "date",
					reqd:1,
			},
			render_input: true
		});
		me.date.refresh();

		me.from_time = frappe.ui.form.make_control({			
			parent: $("#from_time"),
			df: {
				fieldtype: "Time",
				fieldname: "from_time",
				reqd:1,
				placeholder: "HH:MM",
			},
			render_input: true
		});
		me.from_time.refresh();

		me.to_time = frappe.ui.form.make_control({			
			parent: $("#to_time"),
			df: {
				fieldtype: "Time",
				fieldname: "to_time",
				reqd:1,
				placeholder: "HH:MM",
			},
			render_input: true
		});
		me.to_time.refresh();

		me.attendees = frappe.ui.form.make_control({
			parent: $("#attendees"),
			df: {
				fieldtype: "Int",
				fieldname: "attendees",
				reqd:1,
				},
			render_input: true
		});
		me.attendees.refresh();

		me.area = frappe.ui.form.make_control({
			parent: $("#area"),
			df: {
				fieldtype: "Link",
				options: "Region",
					fieldname: "area",
					//reqd:1,
			},
			render_input: true
		});
		me.area.refresh();
	
		me.city = frappe.ui.form.make_control({

			parent: $("#city"),
			df: {
				fieldtype: "Link",
				options: "City",
				fieldname: "city",
				get_query: function() {
					return {
						filters: {"region": me.area.input.value},
					}
				},
			},
			render_input: true
		});
		me.city.refresh();


		me.facility = frappe.ui.form.make_control({
			parent: $("#facility"),
			df: {
				fieldtype: "Link",
				options: "Facility",
					fieldname: "facility",
					get_query: function() {
					return {
						filters: {"city": me.city.input.value},
					}
				},
					//reqd:1,
			},
			render_input: true
		});
		me.facility.refresh();

		me.building = frappe.ui.form.make_control({
			parent: $("#building"),
			df: {
				fieldtype: "Link",
				options: "Floor",
					fieldname: "building",
					get_query: function() {
					return {
						filters: {"facility": me.facility.input.value},
					}
				},
					//reqd:1,
			},
			render_input: true
		});
		me.building.refresh();

	},

	// frappe.client.get_value (Conference booking, fieldname, filters=None, as_dict=True, debug=False)

	/*
	get_facility:function() {
		frappe.call({
				method :"conference_management.conference_management.page.search_conferences.search_conferences.facility_list",
				callback: function(data) {
					var facilities = "";
					var Faci = new Array();
					for (i=0;i<data.message.length;i++)
					{
						Faci[i]=data.message[i]['name'];
						//console.log(data.message[i]['name']);
						facilities += "<div class='checkbox'><label><input type='checkbox' id='"+data.message[i]['name']+"' value=''>"+ data.message[i]['name'] +"</label></div>"
					}
					$('#facility_list').html(facilities)
					
					for(i=0;i<Faci.length;i++)
					{
						console.log("______++++_____",Faci[i])
parseInt
					}
				}

			}); 
 	},
	 */

	get_values:function(){

		var me = this;
		var Faci = new Array();
		// For fetching facilities from facility doctype to html
		frappe.call({
			method :"conference_management.conference_management.page.search_conferences.search_conferences.facility_list",
			callback: function(data) {
				var facilities = "";
				for (i=0;i<data.message.length;i++){
					Faci[i]=data.message[i]['name'];
					facilities += "<div class='select-columns'><label><input type='checkbox' class='select-column-check' id='"+data.message[i]['name']+"'>  "+ data.message[i]['name'] +"</label></div>"
				}
				$('#facility_list').html(facilities)
			}
		});


	//For Fetching user details
		frappe.call({
			method :"conference_management.conference_management.page.search_conferences.search_conferences.get_location_details",
			args:{
			 			"user":user
			 	},
				callback: function(r) {
					User_details=r.message;
					me.area.input.value=User_details.region;
					me.city.input.value=User_details.city;
					me.facility.input.value=User_details.facility;
					me.building.input.value=User_details.floor;
					
				}
			});
		console.log("AREA",me.area);

    	$("#date").change(function(){
        	console.log(me.date.value);
        	if(me.date.value<frappe.datetime.nowdate())
        	{
        		frappe.msgprint("You cannot select past date");
        	}
    	});

    	$("#to_time").change(function(){
    		var sd=Date.parse(me.date.value+' '+me.from_time.input.value);
			var ed=Date.parse(me.date.value+' '+me.to_time.input.value);
			if(sd>=ed)
			{
				frappe.msgprint("From Time Must Be Smaller Than To Time");
			}
    	});

   //  	$("#from_time").change(function(){
   //  		var sd=Date.parse(me.date.value+' '+me.from_time.input.value);
			// var ed=Date.parse(me.date.value+' '+me.to_time.input.value);
			// if(ed<sd)
			// {
			// 	frappe.msgprint("To Time Must Be Greater Than From Time");
			// }
   //  	});

		$('#btn-cancel').click(function(){
            me.date.input.value=" ";
            me.from_time.input.value=" ";
            me.from_time.input.value=" ";
            me.to_time.input.value=" ";
            me.attendees.input.value=" ";
            //me.area.input.value=" ";
            //me.from_time.input.value=" ";
            $('#tbody').html("");
            me.date.value="";
            console.log(me.date.value)   
		}),

		function ValidateFunction() {
			console.log("Validate Date",me.date.value);
		}

		$('#btn-search').click(function(){


			if(me.city.value!=""){

			$('#city').removeClass('has-error');


		}
			var validate_flag=1;
			if(!me.date.value)
			{
				frappe.msgprint("Plase Enter Date")
				validate_flag=0
			}
			if(!me.from_time.input.value)
			{
				frappe.msgprint("Please enter From Time")
				validate_flag=0
			}
			if(!me.to_time.input.value)
			{
				frappe.msgprint("Please enter To Time")
				validate_flag=0
			}
			if(!me.attendees.value)
			{
				frappe.msgprint("Please enter No.of Attendees")
				validate_flag=0
			}
			



			var Selected_Faci = new Array();
			console.log("Selected_Faci Type=",typeof(Selected_Faci))
			//var Selected_Faci = [];
        	//  adding selected facilities in Selected_Faci array
        	$(':checkbox:checked').each(function(i){
          		console.log($(this).attr('id'))
          		fa_id = $(this).attr('id');
          		Selected_Faci.push(fa_id);
        	});

        	for(i=0;i<Selected_Faci.length;i++)
			{
				console.log("**",Selected_Faci[i]);
				console.log("**",typeof(Selected_Faci[i]));
			}

			console.log("**",Selected_Faci);
			console.log("**",Selected_Faci[0]);

			if(validate_flag==0)
			{
				
			}
			else
			{   //a = me.area.input.value;
				console.log(me.area.input.value)
				console.log(me.city.input.value)
				console.log(me.facility.input.value)
				
				frappe.call({
			 		method:"conference_management.conference_management.page.search_conferences.search_conferences.get_conference",
			 		args:{
			 			"date":me.date.value,
			 			"from_time":me.from_time.input.value,
			 			"to_time":me.to_time.input.value,
			 			"facilities": Selected_Faci,
			 			"attendees":parseInt(me.attendees.value),
			 			"city":me.city.input.value,
			 			"facility":me.facility.input.value,
			 			"building":me.building.value

			 		},
			 		callback:function(r)
			 		{
			 			data=r.message;
			 			Conference="";
			 			console.log(typeof(data));
			 			console.log(data);
			 			
			 			if(data==null)
			 			{

			 				console.log("hmm");
			 				Conference += "<tr><td colspan=5 align='center'>No Conference Found</td> </tr>";

			 			}
			 			else
			 			{
					 			j=1;
					 			for (i=0;i<Object.keys(data).length;i++)
								{
									console.log("Conference=",Object.keys(data)[i]);
									console.log("status=",Object.values(data)[i]);
									if (Object.values(data)[i]=="00")
		        					{ 	but_id=JSON.stringify(Object.keys(data)[i])
		        					  	Conference += "<tr><td>"+Object.keys(data)[i]+"</td><td>"+"Yes"+"</td><td> No </td>Value <td><button type='button' class='btn btn-default booking' id="+but_id+">Book</button></td><td><a href='#Calendar/Conference booking'><button type='button' class='btn btn-default' id=c"+j+">Calendar View</button></a></td> </tr>";
		        					  	j++;
		        					}
		        					else
		        					{ 
		        					  	if(Object.values(data)[i]=="01")
		        					  	{ 
		        					  		but_id=JSON.stringify(Object.keys(data)[i])
		  	                   	      		Conference += "<tr><td>"+Object.keys(data)[i]+"</td><td>"+"Yes"+"</td><td> Yes </td>Value <td><button type='button' class='btn btn-default booking' id="+but_id+">Book</button></td><td><a href='#Calendar/Conference booking'><button type='button' class='btn btn-default' id=c"+j+">Calendar View</button></a></td> </tr>";
		                                	j++;
		        					  	}
		        					  	else
		        					  	{
		        					  		if(Object.values(data)[i]=="10")
		        					  		{	
		        					  			but_id=JSON.stringify(Object.keys(data)[i])
		        					  			Conference += "<tr><td>"+Object.keys(data)[i]+"</td><td>"+"No"+"</td><td> No </td>Value <td><button type='button' class='btn btn-default booking' id="+but_id+" disabled>Book</button></td><td><a href='#Calendar/Conference booking'><button type='button' class='btn btn-default' id=c"+j+">Calendar View</button></a></td> </tr>";
		                                		j++;
		        					  		}
		        					  		else
		        					  		{ 
		        					  			but_id=JSON.stringify(Object.keys(data)[i])
		                                  		Conference += "<tr><td>"+Object.keys(data)[i]+"</td><td>"+"No"+"</td><td> Yes </td>Value <td><button type='button' class='btn btn-default booking' id="+but_id+" disabled>Book</button></td><td> <a href='#Calendar/Conference booking'><button type='button' class='btn btn-default' id=c"+j+">Calendar View</button></a></td> </tr>";
		        					  	  		j++;  
		        					   		}
		        					  	}
		        					}  
		        				}		
						
						}

						var But_me=this;
						var selected_bay = "";
						frappe.call({
								method :"conference_management.conference_management.page.search_conferences.search_conferences.get_bay",
								args:{
			 							"region":me.area.input.value,
			 							"city":me.city.input.value,
			 							"facility":me.facility.input.value,
			 							"floor":me.building.input.value 
			 						},
								callback: function(r) {
									console.log("get bay",r.message);
									bay = r.message;
									selected_bay = bay[0].name;
									console.log(bay[0].name);
							
								}
							});
						$('#tbody').html(Conference);
						
						// For Redirecting To Conference booking

						$('.booking').click(function(){
							var But_me=this;
							console.log("conf=",$(But_me).attr('id'));
							console.log("meeeeee",me);
							console.log("Date=",me.date.value);
							console.log("From Time=",me.from_time.input.value);
							console.log("To Time=",me.to_time.input.value);
							console.log("area=",me.area.input.value);
							console.log("city",me.city.input.value);
							console.log("facility",me.facility.input.value);
							

							tn = frappe.model.make_new_doc_and_get_name('Conference booking')
							console.log(tn,"tn");
							//console.log("date",me.date.value);
							locals['Conference booking'][tn].email = user
							locals['Conference booking'][tn].date = me.date.value;
							locals['Conference booking'][tn].from_time = me.from_time.input.value;
							locals['Conference booking'][tn].to_time = me.to_time.input.value;
							locals['Conference booking'][tn].area = me.area.input.value;
							locals['Conference booking'][tn].city = me.city.input.value;
							locals['Conference booking'][tn].facility = me.facility.input.value;
							locals['Conference booking'][tn].building = me.building.input.value;
							locals['Conference booking'][tn].bay = selected_bay;
							locals['Conference booking'][tn].conference=$(But_me).attr('id');
							frappe.set_route('Form', 'Conference booking', tn);
							//frappe.route_options('Form', 'Conference booking',{'date':d,'from_time':ftime,'to_time':ttime});
							// frappe.set_route('Form', 'Conference booking',{'date':d,'from_time':ftime,'to_time':ttime});
							// cur_frm.cscript.new_date = function(){
							// tn = frappe.model.make_new_doc_and_get_name('date');
							// locals['date'][tn].date = 1;
							// if(doc.Conference booking) locals['date'][tn].Conference booking = doc.Conference booking;

						})

						

			 		}
			 	});

			}	
		})
	},

	

});	



import_timepicker = function(callback) {
	frappe.require([
		"assets/frappe/js/lib/jquery/jquery.ui.slider.min.js",
		"assets/frappe/js/lib/jquery/jquery.ui.sliderAccess.js",
		"assets/frappe/js/lib/jquery/jquery.ui.timepicker-addon.css",
		"assets/frappe/js/lib/jquery/jquery.ui.timepicker-addon.js"
	], callback);
}

