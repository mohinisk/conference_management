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
	"msg = frappe.render_template("templates/email/ticket_assigned.html", {
		"Attendee":Attendee,
		"Agenda": Agenda,
		"Venue": Venue
	})
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

	return frappe.db.sql("""select
		timestamp('date',from_time) as start,
		timestamp('date',to_time) as end,
		name,
		workflow_state
		from `tabConference booking`
		where date between %(start)s and %(end)s""",{
		"start":start,
		"end":end
		},as_dict=True,debug=1)