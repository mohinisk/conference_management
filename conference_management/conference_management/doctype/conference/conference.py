# -*- coding: utf-8 -*-
# Copyright (c) 2015, GoElite and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class Conference(Document):
	def validate(self):
		if self.require_permission == 1:
			workflow_doc=frappe.get_doc("Workflow","Booking_permission")
			workflow_doc.is_active= self.require_permission
			workflow_doc.save(ignore_permissions=True)
		else:
			workflow_doc=frappe.get_doc("Workflow","Booking_permission")
			workflow_doc.is_active = 0
			workflow_doc.save(ignore_permissions=True)