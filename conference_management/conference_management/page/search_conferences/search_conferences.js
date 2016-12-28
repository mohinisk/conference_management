frappe.pages['search-conferences'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Conference Booking',
		single_column: true
	});
	
	frappe.breadcrumbs.add("Setup");	
	//$("<div class='search-engine' style='min-height: 200px; padding: 15px;'></div>").appendTo(page.main);	
	$(frappe.render_template("search_conferences", this)).appendTo(this.page.main);
	wrapper.search_engine = new frappe.SearchEngine(wrapper);
	
	
}

frappe.SearchEngine = Class.extend({
	init: function(wrapper) {
		this.wrapper = wrapper;
		this.body = $(this.wrapper).find(".search-engine");		
		this.make();
		
		//this.refresh();
		//this.add_check_events();
	},
	make: function() {
		var me = this;		
		me.setup_page();
	},
	setup_page: function() {
		var me = this;
		
		import_timepicker(function() {
			$('#date1').datepicker();
			$('#time1').timepicker();
			$('#time2').timepicker();
		});
		
		$( "#btn-search" ).click(function() {
		  var qdate = $("#date1").val();
		  var ftime = $("#time1").val();
		  var ttime = $("#time2").val();
		  var attendees = $("#attendees").val();
		  var other_time = $("#other_time").val();		  
		  var data = [];	
		  var allVals = [];
			 $('.list').each(function() {			 
				if( $(this).is(':checked') ){
					allVals.push(this.id);		   
				}
			 });
		 
				
		  data.push(qdate, ftime, ttime, attendees, other_time);		  
		  
		 frappe.call({
				module:"conference_management.conference_management",
				page:"search_conferences",
				method: "search",
				args: {
					data:data,
					facilities:allVals
				},
				callback: function(r) {
					console.log(r);					
				}
			});
		});
		
		frappe.call({
				module:"conference_management.conference_management",
				page:"search_conferences",
				method: "facility_list",
				callback: function(data) {
					tag = "";
					for( var e = 0; e < data.message.length; e++) {
						var tagc = '<li><input type="checkbox" class="list" id="'+data.message[e].name+'"> '+data.message[e].name+'</li>'; 						
						tag = tag + tagc	
					}					
					$(".facility_list").html(tag);
				}
			});
	}
});

import_timepicker = function(callback) {
	frappe.require([
		"assets/frappe/js/lib/jquery/jquery.ui.slider.min.js",
		"assets/frappe/js/lib/jquery/jquery.ui.sliderAccess.js",
		"assets/frappe/js/lib/jquery/jquery.ui.timepicker-addon.css",
		"assets/frappe/js/lib/jquery/jquery.ui.timepicker-addon.js"
	], callback);
}

