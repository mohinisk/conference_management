# -*- coding: utf-8 -*-
# Copyright (c) 2015, GoElite and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from conference_management.api import send_invitation_emails
from conference_management.api import send_confirmation_emails

class Conferencebooking(Document):
	
	def validate(self):
		if self.workflow_state=="Open":
			self.workflow_state="Applied"
		if self.workflow_state=="Approved":
			self.workflow_state="Booked"
		if self.workflow_state=="Rejected":
			self.workflow_state="Closed"
		if not check_conference_perm(self.conference):
			self.workflow_state="Booked"
		if not self.attendees:
			print "=",self.attendees
		else:
			if self.workflow_state=="Booked":	
				create_conference_event(self.name,self.date,self.from_time,self.to_time,self.attendees)
				if self.send_invite==1:
					if self.email_sent!=1:
						self.email_sent==send_invitation(self.name,self.agenda,self.from_time,self.to_time,self.date,self.attendees)
		
		send_confirmation_to_creater(self.name,self.agenda,self.from_time,self.to_time,self.date,self.email)

		#For Helpdesk pantry_service ticket 
		if self.workflow_state=="Booked":
			if self.pantry_service==1:
				create_pantry_ticket(self.email,self.area,self.city,self.facility,self.building,self.bay,self.date,self.from_time)   		
				
		if frappe.utils.data.date_diff(self.date ,frappe.utils.data.nowdate())< 0:
				frappe.msgprint("You cannot select past date")
		if self.availability=="Not Available":
			frappe.throw("You cannot apply for this conference, please check availability")

		# var validate_flag=1;
		# if not self.check_availability.
		
				
			# if self.from_time > self.to_time:
			# 	frappe.msgprint("From Time Must Be Smaller Than To Time")

			# if self.to_time < self.from_time:
			# 	frappe.msgprint("To Time Must Be Greater Than From Time")
				
@frappe.whitelist()
def send_invitation(Name,Agenda,from_time,to_time,date,attendees):
	Venue="Date :"+str(date)+" "+"From Time :"+str(from_time)+" "+"To Time :"+str(to_time)+"\n"
	Attendees=attendees
	Attendees=Attendees+str("#")
	temp_email=" "
	flg=0
	for  i in range(0,len(Attendees)):
		if Attendees[i]=="," or Attendees[i]=="#":
			Attendee=str(temp_email);
			print "\nAttendee=",Attendee	
			send_invitation_emails(Name,Attendee,Agenda,Venue)
			temp_email=" "
			flg=1
			print "_________________mail_____________"	
		else:
			temp_email=temp_email+str(Attendees[i])

	return flg

@frappe.whitelist()
def send_confirmation_to_creater(Name,Agenda,from_time,to_time,date,email):
	Venue="From Time :"+str(from_time)+" "+"To Time :"+str(to_time)+"\n"+"On Date :"+str(date)
	print "\n\n\nvalues=",Name,Agenda,Venue,email
	send_confirmation_emails(Name,Agenda,Venue,email)
	print "_________________mail_____________"	

# For creating Event and Sharing Event	
@frappe.whitelist()
def create_conference_event(name,date,from_time,to_time,attendees):
	Attendees=attendees
	Attendees=Attendees+str("#")
	temp_email=""	
	Event_doc=frappe.new_doc("Event")
	Event_doc.subject=name
	start=str(date)+" "+str(from_time)
	print "\ndate",date
	print "from_time",from_time
	print "\ndate",date
	print "to_time",to_time
	start_date=frappe.utils.data.get_datetime(start)
	end=str(date)+" "+str(to_time)
	end_date=frappe.utils.data.get_datetime(end)
	print "\nstart_date",start_date
	print "end_date",end_date
	print "end_date",frappe.utils.data.now_datetime()
	Event_doc.starts_on=start_date
	Event_doc.ends_on=end_date
	Event_doc.event_type="Private"
	Event_doc.flags.ignore_mandatory = True
	Event_doc.save()
	print "Name",Event_doc.name
	Event_name=Event_doc.name
	for  i in range(0,len(Attendees)):
		if Attendees[i]=="," or Attendees[i]=="#":
			Attendee=temp_email;

			#New Doc_share 
			Docshare_doc=frappe.new_doc("DocShare")
			UDoc=frappe.get_doc("User",Attendee)
			Docshare_doc.user=str(Attendee)
			Docshare_doc.share_doctype="Event"
			Docshare_doc.share_name=Event_name
			Docshare_doc.read=1
			Docshare_doc.save()
			Event_doc.send_reminder=0
			Event_doc.save()
			temp_email=""
		else:
			temp_email=temp_email+str(Attendees[i])

@frappe.whitelist()
def create_pantry_ticket(email,area,city,facility,building,bay,date,from_time):
	pantry_doc=frappe.new_doc("Ticket")
	pantry_doc.user=email
	pantry_doc.region=area
	pantry_doc.city=city
	pantry_doc.facility=facility
	pantry_doc.floor=building
	pantry_doc.bay=bay
	pantry_doc.function="Pantry Services"
	pantry_doc.service="Pantry"
	pantry_doc.service_type="Pantry-Pantry-Pantry Services"
	creation_d=str(date)+" "+str(from_time)
	creation_date = frappe.utils.data.get_datetime(creation_d)
	pantry_doc.creation = creation_date
	pantry_doc.flags.ignore_mandatory = True
	pantry_doc.save()
	print "\nTicket No=",pantry_doc.name
		
@frappe.whitelist()
def get_location(email):
	user=frappe.get_doc("User",email)
	return user
	
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
	print "\nBooked Conferences",Book_conf
	for i in range(0,len(Book_conf)):
		conf_date = frappe.get_value("Conference booking", Book_conf[i]['name'], "date")
		conf_to_time = frappe.get_value("Conference booking", Book_conf[i]['name'], "to_time")
		conf_datetime = str(conf_date)+" "+str(conf_to_time)
		conf_datetime1 = frappe.utils.data.get_datetime(conf_datetime)
		current_datetime = frappe.utils.data.now_datetime()
		diff=frappe.utils.data.date_diff(current_datetime,conf_datetime1)
		if diff >= 0:
			print "\n\n conf time greater than current time",Book_conf[i]['name']
			close_conf=frappe.db.sql("""update `tabConference booking` set workflow_state='Closed' where name=%s""",(Book_conf[i]['name']))
			print close_conf

		# conf = frappe.get_doc("Conference booking",Book_conf[i]['name'])
		# print "\n\nconference Name",conf.name
		# d=str(conf.date)+" "+str(conf.to_time)
		# conf_datetime=frappe.utils.data.get_datetime(d)
		# print conf_datetime
		# print "type of conf_datetime",type(conf_datetime)
		# Current_datetime = frappe.utils.data.now_datetime()
		# print "Current_datetime",Current_datetime
		# print "type of current",type(Current_datetime)
		# print "difference",frappe.utils.data.date_diff(Current_datetime,conf_datetime)
		# diff=frappe.utils.data.date_diff(Current_datetime,conf_datetime)
		# conf.workflow_state = "Closed"
		# if diff > 0:
		# 	print conf.workflow_state 
		# 	conf.workflow_state = "Closed"
		# 	conf.flags.ignore_mandatory = True
		# 	conf.save()
		# 	print "=",conf.workflow_state
		# 	print "--conference Name",conf.name


@frappe.whitelist()
def check_availability(date,from_time,to_time,conference):
	check_conf=frappe.db.sql("""select `tabConference booking`.`name` from `tabConference booking` where `tabConference booking`.date =%s and `tabConference booking`.conference =%s and `tabConference booking`.from_time between %s and %s and `tabConference booking`.to_time between %s and %s""",(date,conference,from_time,to_time,from_time,to_time),as_dict=True,debug=1)
	if not check_conf:
		print "\n\nAvailable"
		return "Available"
	else:
		print "\n\nNot Available"
		print "check_conf",check_conf
		return "Not Available"

		# conff=frappe.get_all("Conference booking",filters=[['Conference booking','to_time','>',from_time],['Conference booking','date','=',date],['Conference booking','conference','=',conference]],debug=1)
		# print "*&*& booked conferences",conff
		# print "\n\nconference name",conference
		# flag = 0;
		# if not conff:
		# 	flag = 1
		# for i in range(0,len(conff)):
		# 	conff_details = frappe.get_doc("Conference booking",conff[i]['name'])
		# 	Conf_tt=frappe.utils.data.get_time(conff_details.to_time)
		# 	ft = frappe.utils.data.get_time(from_time)
		# 	print "\n",Conf_tt
		# 	print "\n",ft
		# 	print type(Conf_tt)
		# 	print type(ft)
		# 	c_dt= str(date)+" "+str(ft)
		# 	current_datetime = frappe.utils.data.get_datetime(c_dt)
		# 	conf_dt = str(conff_details.date)+" "+str(Conf_tt)
		# 	conf_datetime = frappe.utils.data.get_datetime(conf_dt)
		# 	diff=frappe.utils.data.time_diff_in_hours(current_datetime,conf_datetime)
		# 	print "diff",diff
		# 	print "type of diff",type(diff)
			
		# 	if diff < 0:
		# 		print "diff in if=",diff
		# 		print "\n\n name=",conff_details.name
		# 		print "Not Available"
		# 		flag = 0
		# 	else:
		# 		print "diff in else=",diff
		# 		print "\n\n name=",conff_details.name
		# 		print "Available"
		# 		flag = 1

		# if flag==1:
		# 	print "---","Available"
		# 	return "Available"
		# else:
		# 	print "---","Not Available"
		# 	return "Not Available"




	# check_conf=frappe.db.sql("""select `tabConference booking`.`name` from `tabConference booking` where `tabConference booking`.date =%s and `tabConference booking`.conference =%s and `tabConference booking`.from_time between %s and %s and `tabConference booking`.to_time between %s and %s""",(date,conference,from_time,to_time,from_time,to_time),as_dict=True,debug=1)
	# if not check_conf:
	# 	print "\n\nAvailable"
	# 	return "Available"
	# else:
	# 	print "\n\nNot Available"
	# 	print "check_conf",check_conf
	# 	return "Not Available"

@frappe.whitelist()
def get_conference_details(conference_name):
	conf_detail=frappe.get_doc("Conference",conference_name)
	print "\n\n\n\nConf",conf_detail
	print "\n\n\n\naccommodation_capacity",conf_detail.accommodation_capacity
	print "\n\n\n\nfacilities",conf_detail.facilities
	return conf_detail




