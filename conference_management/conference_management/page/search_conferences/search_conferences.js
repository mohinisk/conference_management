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
		me.get_facility();
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
				fieldname: "frome_time",
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
	// For fetching facilities from facility doctype to html
	get_facility:function() {
		frappe.call({
				method :"conference_management.conference_management.page.search_conferences.search_conferences.facility_list",
				callback: function(data) {
					var facilities = "";
					for (i=0;i<data.message.length;i++)
					{
						console.log(data.message[i]['name']);
						facilities += "<div class='checkbox'><label><input type='checkbox' value=''>"+ data.message[i]['name'] +"</label></div>"
					}
					$('#facility_list').html(facilities)
				}
			});
	},
	
	// 

	get_values:function(){

		var me = this;
		
		$('#btn-search').click(function(){
			if(!me.date.value)
			{

				frappe.msgprint("PLEASE FILL FORM")
			}
			else
			{
				date=me.date.value;
				from_time=me.from_time.value;
				to_time=me.to_time.value;
				
				console.log("2")

				frappe.call({
			 		method:"conference_management.conference_management.page.search_conferences.search_conferences.get_conference",
			 		args:{
			 			"date":date,
			 			"from_time":from_time,
			 			"to_time":to_time
			 		},
			 		callback:function(r)
			 		{
			 			data=r.message;
			 			Conference="";
			 			j=1;
			 			for (i=0;i<Object.keys(data).length;i++)
						{
							console.log("Conference=",Object.keys(data)[i]);
							console.log("status=",Object.values(data)[i]);
							if (Object.values(data)[i]==1)
        					{
        					 Conference += "<tr><td>"+Object.keys(data)[i]+"</td><td>"+"No"+"</td><td> </td>Value <td><button type='button' class='btn btn-default booking' id=b"+j+" disabled>Book</button></td><td><button type='button' class='btn btn-default' id=c"+j+">Calendar View</button></td> </tr>";
        					 j++;
        					}
        					else
        					{
        					 Conference += "<tr><td>"+Object.keys(data)[i]+"</td><td>"+"Yes"+"</td><td> </td>Value <td><button type='button' class='btn btn-default booking' id=b"+j+">Book</button></td><td><button type='button' class='btn btn-default' id=c"+j+">Calendar View</button></td> </tr>";
        					 j++;
        					}
						}
						$('#tbody').html(Conference);
						$('.booking').click(function(){
							frappe.new_doc("Conference booking");
						})

						// if (Object.values(data)[i]=="No")
						// {

						// }
						//me.insert_result(data);		 		
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

/*
// For Dynamic updation of table using javascript function
	insert_result:function(result){

		var table = document.getElementById("available_result");
		var tr;
		r=1;
		console.log(Object.keys(result).length)
		for(i=0;i<6;i++)
		{
			var row = table.insertRow(r);
        	var cell1 = row.insertCell(0);
        	var cell2 = row.insertCell(1);
        	var cell3 = row.insertCell(2);
        	var cell4 = row.insertCell(3);
        	var cell5 = row.insertCell(4);
        	cell1.innerHTML = Object.keys(result)[i];
        	console.log("--",Object.values(result)[i]);
        	if (Object.values(result)[i]==1)
        	{
        		cell2.innerHTML ="No"
        	}
        	else
        	{
        		cell2.innerHTML ="Yes"
        	}
        	cell3.innerHTML = "";
        	cell4.innerHTML = "<input type='button' value='book' id ='book'>";
        	cell5.innerHTML = "<input type='button' value='Calendar View'>";
        	r++;
        }	

	},
	



*/
