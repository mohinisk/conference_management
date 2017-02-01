import frappe

#send_email for conference invitation
@frappe.whitelist()
def send_invitation_emails(Attendee,Agenda,Venue):
	# msg="Hello "+Attendee+",\n"+Agenda+"\n"+Venue+"Thanks"
	# frappe.sendmail(
	# 		recipients=Attendee,
	# 		sender=frappe.session.user,
	# 		subject="Conference Invitation",
	# 		message=msg	
	# )
	print "_________________mailing____________"
	url="http://192.168.5.51:8000/desk#Calendar/Event"

	msg = frappe.render_template("templates/email/conference_booking.html", {"Attendee":Attendee,"Agenda": Agenda,"Venue": Venue,"base_url":url})	
	frappe.sendmail(
		recipients=Attendee,
		sender=frappe.session.user,
		subject="Conference Invitation",
		message=msg
	)
	print "_________________mail_ sent____________"	
	
# For displaying conferences on calendar
@frappe.whitelist()
def get_conference(start,end,filters=None):
 	if not frappe.has_permission("Conference booking","read"):
		raise frappe.PermissionError
	
	print "\n\nstart=",start
	print "\n\nend=",end

	# cal=frappe.db.sql("""select
	# 	from_time as start_date,
	# 	to_time as end_date,
	# 	name,
	# 	date1,
	# 	workflow_state
	# 	from `tabConference booking`
	# 	where date1 between %(start)s and %(end)s""",{
	# 	"start":start,
	# 	"end":end
	# 	},as_dict=True,debug=1,update={"allDay": 0})

	cal=frappe.db.sql("""select
	timestamp(date, from_time) as start_date,
	timestamp(date, to_time) as end_date,
	name,
	workflow_state
	from `tabConference booking`
	where timestamp(date,from_time) between %(start)s and %(end)s
	or timestamp(date,to_time) between %(start)s and %(end)s """,{
	"start":start,
	"end":end
},as_dict=True,debug=1,update={"allDay": 0})

	print "\ndetails=",cal
	return cal