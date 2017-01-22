# -*- coding: utf-8 -*-
# Copyright (c) 2015, GoElite and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from conference_management.api import send_invitation_emails

class Conferencebooking(Document):
	
	def validate(self):
		if self.send_invite==1:
			Venue="From Time :"+self.from_time+" "+"To Time :"+self.to_time+"\n"+"Date :"+self.date
			Attendees=self.attendees
			Attendees=Attendees+str("#")
			temp_email=" "
			for  i in range(0,len(Attendees)):
				if Attendees[i]=="," or Attendees[i]=="#":
					Attendee=str(temp_email);
					print "\nAttendee=",Attendee
					temp_email=" "
					send_invitation(Attendee,self.agenda,Venue)
					print "_________________mail_____________"	
				else:
					temp_email=temp_email+str(Attendees[i])


		
@frappe.whitelist()
def get_location(email):
	user=frappe.get_doc("User",email)
	return user
	
@frappe.whitelist()
def send_invitation(Attendee,Agenda,Venue):
	send_invitation_emails(Attendee,Agenda,Venue)
	print "_________________send_invitation____________"
