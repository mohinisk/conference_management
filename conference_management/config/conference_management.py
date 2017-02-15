from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Documents"),
			"items": [
				{
				"type": "doctype",
				"name": "Conference",
				"description": _("Database of Conference."),
				},
				{
				"type": "doctype",
				"name": "Conference booking",
				"description": _("Database of Conference bookings."),
				},
				{
				"type": "page",
				"name": "search-conferences",
				"label": _("Search Conference"),
				"description": _("Search a Conference")
				},
			]
		}		
	]