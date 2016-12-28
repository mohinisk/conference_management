# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe
import frappe.defaults
from frappe.modules.import_file import get_file_path, read_doc_from_file
from frappe.translate import send_translations
from frappe.desk.notifications import delete_notification_count_for
from frappe.permissions import reset_perms, get_linked_doctypes

@frappe.whitelist()
def search(data, facilities):
        
        facilities = facilities.replace('"', '').replace('[', '').replace(']', '').split(',')
        data = data.replace('"', '').replace('[', '').replace(']', '').split(',')
        
        mfilters = ""
        for n in facilities:                
                sfilter = '"facility":"{0}"'.format(n)
                mfilters ='{0},{1}'.format(sfilter, mfilters)
        
        filters = "{%s}" % (mfilters[:-1])
        
        conference_list = frappe.client.get_list('Conference',"name",filters)        
        for x in conference_list:                
                #filters = '{name:["=", {0}]}'.format(x.name)
                #filters = '{name: "Board Room"}'
                conference = frappe.client.get('Conference',x.name)                
                for y in conference.facilities:
                        if y.check == 1:
                                frappe.msgprint(y.facility)
                                
	return data

@frappe.whitelist()
def facility_list():
        facility_list = frappe.client.get_list('Facility')
	return facility_list
