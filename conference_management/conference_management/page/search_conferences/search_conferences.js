frappe.pages['search-conferences'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Conference Booking',
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
	},

	setup_page: function() {
		var me = this;
		me.date = frappe.ui.form.make_control({
			parent: $("#date"),
			df: {
				fieldtype: "Date",
					fieldname: "date",
			},
			render_input: true
		});
		me.date.refresh();

		me.from_time = frappe.ui.form.make_control({			
			parent: $("#from_time"),
			df: {
				fieldtype: "Time",
				fieldname: "from_time",
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
				placeholder: "HH:MM",
			},
			render_input: true
		});
		me.to_time.refresh();

		me.attendees = frappe.ui.form.make_control({
			parent: $("#attendees"),
			df: {
				fieldtype: "Int",
				fieldname: "Attendees"
				},
			render_input: true
		});
		me.attendees.refresh();
	},

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
			if(sd>ed)
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
            //me.date.value="";
            console.log(me.date,"")
            $('#tbody').html("");
            console.log(me.date.value)   
		}),

		$('#btn-search').click(function(){
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
			if(!me.date.value)
			{
				frappe.msgprint("PLEASE FILL FORM")
			}
			else
			{
				frappe.call({
			 		method:"conference_management.conference_management.page.search_conferences.search_conferences.get_conference",
			 		args:{
			 			"date":me.date.value,
			 			"from_time":me.from_time.input.value,
			 			"to_time":me.to_time.input.value,
			 			"facilities": Selected_Faci
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
						$('#tbody').html(Conference);
						
						// For Redirecting To Conference booking
						$('.booking').click(function(){
							// frappe.new_doc("Conference booking");
							var But_me=this;
							console.log("conf=",$(But_me).attr('id'));
							console.log("meeeeee",me);
							console.log("Date=",me.date.value);
							console.log("From Time=",me.from_time.input.value);
							console.log("To Time=",me.to_time.input.value);

							tn = frappe.model.make_new_doc_and_get_name('Conference booking')
							console.log(tn,"tn");
							//console.log("date",me.date.value);
							locals['Conference booking'][tn].email = user
							locals['Conference booking'][tn].date = me.date.value;
							locals['Conference booking'][tn].from_time = me.from_time.input.value;
							locals['Conference booking'][tn].to_time = me.to_time.input.value;
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

	

	// 	check_time_slots:function(){
			


	// },
});	



import_timepicker = function(callback) {
	frappe.require([
		"assets/frappe/js/lib/jquery/jquery.ui.slider.min.js",
		"assets/frappe/js/lib/jquery/jquery.ui.sliderAccess.js",
		"assets/frappe/js/lib/jquery/jquery.ui.timepicker-addon.css",
		"assets/frappe/js/lib/jquery/jquery.ui.timepicker-addon.js"
	], callback);
}

