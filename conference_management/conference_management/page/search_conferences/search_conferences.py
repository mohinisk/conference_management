# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt
from __future__ import unicode_literals
import frappe
import frappe.defaults
from frappe.modules.import_file import get_file_path, read_doc_from_file
from frappe.translate import send_translations
from frappe.desk.notifications import delete_notification_count_for
from frappe.permissions import reset_perms, get_linked_doctypes
import json

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
        facility_list = frappe.client.get_list('Facilities')
        #print "******************************",facility_list
        return facility_list

# For cheking conference on selected date and time and facilities
@frappe.whitelist()
def get_conference(date,from_time,to_time,facilities):
        
        selected_facilities=json.loads(facilities);
        print "\n\n\nselected_facilities=",selected_facilities
        print "type of selected_facilities", type(selected_facilities)
        # cdoc contain list of all conferences from Conference  Booking
        cdoc=frappe.get_all("Conference booking",filters={'date':date,'from_time':from_time,'to_time':to_time})
        print "conferences from Conference  Booking",cdoc
        l=len(cdoc)
        # Conferences conatin all conferences from Conference
        conferences=search_conference()
        conferences_result={}   # Dictionary for Conference name,status,permission
        for i in range(0,len(conferences)):
                conf=frappe.get_doc("Conference",conferences[i]['name']) #for getting facilities from conference
                per=conf.require_permission
                val=str(0)+str(per)
                if len(selected_facilities)!=0:
                        flag=0
                        for k in range(0,len(conf.facilities)):
                                #print "\n conf facilities=",conf.facilities[k].facility
                                for j in range(0,len(selected_facilities)):
                                        if len(selected_facilities)<=len(conf.facilities):
                                                if selected_facilities[j]==conf.facilities[j].facility:
                                                        print"if selected=",conferences[i]['name'],selected_facilities[j]
                                                        print "if conf.=",conferences[i]['name'],conf.facilities[j].facility
                                                        flag=1
                                                        print "True",flag
                                                else:
                                                        print "else selected=",conferences[i]['name'],selected_facilities[j]
                                                        print "else conf=",conferences[i]['name'],conf.facilities[j].facility
                                                        flag=0
                                                        print "False",flag
                                                        break;
                                        else:
                                                flag=0;         
                                

                                if flag==1:
                                        d1={conferences[i]['name']:val}
                                        conferences_result.update(d1)
                else:
                        d1={conferences[i]['name']:val}
                        conferences_result.update(d1)
        print "*****************All conferences**************",conferences_result
        for i in range(0,l):
                cb_doc=frappe.get_doc("Conference booking",cdoc[i]['name'])
                print "* Busy Conference Room*",cb_doc.conference
                if cb_doc.conference in conferences_result:
                        if cb_doc.workflow_state=="Approved":
                                per=str(conferences_result[cb_doc.conference])
                                p=per[1]
                                per=str(1)+str(p)
                                conferences_result[cb_doc.conference]=per
                                #print "return value", conferences_result[cb_doc.conference]
        print "***************** conferences_result**************",conferences_result,"\n\n\n"
        return conferences_result

# Method for getting all conferences from conference Doctype
@frappe.whitelist()
def search_conference():
        conf=frappe.get_all("Conference")
        return conf

