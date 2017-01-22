frappe.views.calendar["Conference booking"] = {
	field_map: {
		"start":"from_time",
		"end": "to_time",
		"date":"date",
		"allDay": "allDay",
		"id": "name",
	},
	get_events_method: "conference_management.api.get_conference"
	
}