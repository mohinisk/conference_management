# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "conference_management"
app_title = "Conference Management"
app_publisher = "GoElite"
app_description = "Managing conference bookings"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "contact@goelite.in"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/conference_management/css/conference_management.css"
# app_include_js = "/assets/conference_management/js/conference_management.js"

# include js, css files in header of web template
# web_include_css = "/assets/conference_management/css/conference_management.css"
# web_include_js = "/assets/conference_management/js/conference_management.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "conference_management.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "conference_management.install.before_install"
# after_install = "conference_management.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "conference_management.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"conference_management.tasks.all"
# 	],
# 	"daily": [
# 		"conference_management.tasks.daily"
# 	],
# 	"hourly": [
# 		"conference_management.tasks.hourly"
# 	],
# 	"weekly": [
# 		"conference_management.tasks.weekly"
# 	]
# 	"monthly": [
# 		"conference_management.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "conference_management.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "conference_management.event.get_events"
# }

