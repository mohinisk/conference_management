# -*- coding: utf-8 -*-
# Copyright (c) 2015, GoElite and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Conferencebooking(Document):
	pass
	
@frappe.whitelist()
def get_location(email):
	user=frappe.get_doc("User",email)
	return user.location
	
