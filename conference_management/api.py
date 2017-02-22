import frappe

#send_emails to attendees for conference invitation
@frappe.whitelist()
def send_invitation_emails(Name,Attendee,Agenda,Venue):
	print "_________________mailing____________"
	url="http://localhost:8000/desk#Calendar/Event"

	msg = frappe.render_template("templates/email/conference_booking.html", {"Name":Name,"Attendee":Attendee,"Agenda": Agenda,"Venue": Venue,"base_url":url})	
	frappe.sendmail(
		recipients=Attendee,
		sender=frappe.session.user,
		subject="Conference Invitation",
		message=msg
	)
	print "_________________mail_ sent____________"	
	
#send_emails to creater for conference confirmation
@frappe.whitelist()
def send_confirmation_emails(Name,Agenda,Venue,email):
	print "_________________mailing____________"
	msg = frappe.render_template("templates/email/conference_confirmation.html", {"Name":Name,"Agenda": Agenda,"Venue": Venue,"email": email})	
	frappe.sendmail(
		recipients=email,
		sender=frappe.session.user,
		subject="Conference Confirmation",
		message=msg
	)
	print "_________________mail_ sent__to creator__________"	
# For displaying conferences on calendar
@frappe.whitelist()
def get_conference(start,end,filters=None):
 	if not frappe.has_permission("Conference booking","read"):
		raise frappe.PermissionError
	print "\n\nstart=",start
	print "\n\nend=",end
	cal=frappe.db.sql("""select
	timestamp(date, from_time) as start_date,
	timestamp(date, to_time) as end_date,
	name,
	workflow_state
	from `tabConference booking`
	where workflow_state='Booked' and timestamp(date,from_time) between %(start)s and %(end)s
	or timestamp(date,to_time) between %(start)s and %(end)s """,{
	"start":start,
	"end":end
	},as_dict=True,debug=1,update={"allDay": 0})
	print "\ndetails=",cal
	return cal







