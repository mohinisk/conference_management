# -*- coding: utf-8 -*-
# Copyright (c) 2015, GoElite and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from conference_management.api import send_invitation_emails

class Conferencebooking(Document):
	
	def validate(self):
		
		if not check_conference_perm(self.conference):
			self.workflow_state="Booked"
		if not self.attendees:
			print "========",self.attendees
		else:
			if self.workflow_state=="Booked":	
				# For creating Event and Sharing Event
				Attendees=self.attendees
				Attendees=Attendees+str("#")
				temp_email=""
				# New Event 
				Event_doc=frappe.new_doc("Event")
				Event_doc.subject=self.name
				start=str(self.date+" "+self.from_time)
				end=str(self.date+" "+self.to_time)
				Event_doc.starts_on=frappe.utils.data.parse_val(start)
				Event_doc.ends_on=frappe.utils.data.parse_val(end)
				Event_doc.event_type="Private"
				Event_doc.flags.ignore_mandatory = True
				Event_doc.save()
				print "Name",Event_doc.name
				Event_name=Event_doc.name
				for  i in range(0,len(Attendees)):
					if Attendees[i]=="," or Attendees[i]=="#":
						Attendee=temp_email;
						print "\nUser=",Attendee
						#New Doc_share 
						Docshare_doc=frappe.new_doc("DocShare")
						#print len(Attendee)
						#for j in range(0,len(Attendee)):
						#	print"",Attendee[j],#
						UDoc=frappe.get_doc("User",Attendee)
						print UDoc.name
						Docshare_doc.user=str(Attendee)
						print "User+---",Attendee
						Docshare_doc.share_doctype="Event"
						Docshare_doc.share_name=Event_name
						Docshare_doc.read=1
						Docshare_doc.save()
						Event_doc.send_reminder=1
						Event_doc.save()

						temp_email=""
						print "______________________________"	
					else:
						temp_email=temp_email+str(Attendees[i])

		if self.workflow_state=="Booked":
			if self.send_invite==1:
				print "send invite\n\n\n"
				if self.email_sent!=1:
					print "send invite\n\n\n"
					Venue="From Time :"+self.from_time+" "+"To Time :"+self.to_time+"\n"+"Date :"+self.date
					Attendees=self.attendees
					Attendees=Attendees+str("#")
					temp_email=" "
					for  i in range(0,len(Attendees)):
						if Attendees[i]=="," or Attendees[i]=="#":
							Attendee=str(temp_email);
							print "\nAttendee=",Attendee
							temp_email=" "
							send_invitation(self.name,Attendee,self.agenda,Venue)
							print "_________________mail_____________"
							self.email_sent=1	
						else:
							temp_email=temp_email+str(Attendees[i])

		    # For Helpdesk pantry_service ticket 
			if self.pantry_service==1:
				pantry_doc=frappe.new_doc("Ticket")
				pantry_doc.user=self.email
				pantry_doc.region=self.area
				pantry_doc.city=self.city
				pantry_doc.facility=self.facility
				pantry_doc.floor=self.building
				pantry_doc.bay=self.bay
				pantry_doc.function="Pantry Services"
				pantry_doc.service="Pantry"
				pantry_doc.service_type="Pantry-Pantry-Pantry Services"
				pantry_doc.flags.ignore_mandatory = True
				pantry_doc.save()

			if self.date < frappe.utils.data.nowdate():
				frappe.msgprint("You cannot select past date")

			if self.from_time > self.to_time:
				frappe.msgprint("From Time Must Be Smaller Than To Time")

			if self.to_time < self.from_time:
				frappe.msgprint("To Time Must Be Greater Than From Time")
		
		

# @frappe.whitelist()
# def activate_conference_workflow(conference):
# 	workflow_conference=frappe.get_doc("Conference",conference)
# 	print "\n\nworkflow_conference.require_permission",workflow_conference.require_permission		
# 	if workflow_conference.require_permission!=1:
# 		workflow_doc=frappe.get_doc("Workflow","Booking_permission")
# 		print "\n\nworkflow_doc.is_active",workflow_doc.is_active
# 		workflow_doc.is_active = 0
# 		workflow_doc.save(ignore_permissions=True)
# 	else:
# 		workflow_doc=frappe.get_doc("Workflow","Booking_permission")
# 		workflow_doc.is_active = 1
# 		workflow_doc.save(ignore_permissions=True)

		
@frappe.whitelist()
def get_location(email):
	user=frappe.get_doc("User",email)
	return user
	
@frappe.whitelist()
def send_invitation(Name,Attendee,Agenda,Venue):
	send_invitation_emails(Name,Attendee,Agenda,Venue)
	print "_________________send_invitation____________"

@frappe.whitelist()
def check_conference_perm(name):
	conf_doc=frappe.get_doc("Conference",name)
	print "\n\n\n\nConf",conf_doc.require_permission
	return conf_doc.require_permission

@frappe.whitelist()
def get_permission_query_conditions(user):
	print "user=++++++++++",user
	if not user=="Administrator":
		return "`tabConference booking`.email = '{0}'".format(user);

@frappe.whitelist()
def conference_close():
	Book_conf = frappe.get_all("Conference booking",filters={'workflow_state':"Booked"})
	print "\n\n\n\n\n\nBooked Conferences",Book_conf
	for i in range(0,len(Book_conf)):
		conf = frappe.get_doc("Conference booking",Book_conf[i]['name'])
		print "\n\n\nname",conf.name
		print "date",conf.date
		print "to_time",conf.to_time
		print "status",conf.workflow_state
		d=str(conf.date)+" "+str(conf.to_time)
		#print type(d)
		#conf_datetime=frappe.utils.data.getdate(d)
		conf_datetime=frappe.utils.data.get_datetime(d)
		print conf_datetime
		print "type of conf_datetime",type(conf_datetime)
		Current_datetime = frappe.utils.data.now_datetime()
		print "Current_datetime",Current_datetime
		print "type of current",type(Current_datetime)
		date_difference = frappe.utils.data.date_diff
		print "difference",frappe.utils.data.date_diff(Current_datetime,conf_datetime)
		diff=frappe.utils.data.date_diff(Current_datetime,conf_datetime)
		if diff > 0:
			conf.workflow_state = "Closed"
			conf.save()
		 	print conf.name








