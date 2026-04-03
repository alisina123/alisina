{
    "name": "Hijri Calendar Auto Switch",
    "version": "19.0.1.0.0",
    "summary": "Automatic Hijri/Gregorian date switching by user language",
    "category": "Tools",
    "author": "Your Company",
    "license": "LGPL-3",
    "depends": ["web"],
    "data": [
        "views/hijri_date_templates.xml",
        "views/hijri_date_example_views.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "odoo_hijri_calendar/static/lib/moment/moment.min.js",
            "odoo_hijri_calendar/static/lib/moment-hijri/moment-hijri.js",
            "odoo_hijri_calendar/static/src/js/hijri_datepicker.js",
            "odoo_hijri_calendar/static/src/js/hijri_list_patch.js",
            "odoo_hijri_calendar/static/src/xml/hijri_date_templates.xml",
        ],
    },
    "installable": True,
    "application": False,
}
