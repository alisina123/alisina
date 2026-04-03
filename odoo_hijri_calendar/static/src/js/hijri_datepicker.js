/** @odoo-module **/

import { registry } from "@web/core/registry";
import { DateField } from "@web/views/fields/date/date_field";
import { DateTimeField } from "@web/views/fields/datetime/datetime_field";

const HIJRI_INPUT_FORMAT = "iYYYY/iMM/iDD";
const HIJRI_DATETIME_INPUT_FORMAT = "iYYYY/iMM/iDD HH:mm:ss";
const GREGORIAN_DATE_DB_FORMAT = "YYYY-MM-DD";
const GREGORIAN_DATETIME_DB_FORMAT = "YYYY-MM-DD HH:mm:ss";

function getLangCode() {
    return (odoo?.session_info?.user_context?.lang || "en_US").toLowerCase();
}

function useHijriCalendar() {
    const lang = getLangCode();
    return lang.startsWith("ar") || lang.startsWith("fa");
}

function toHijriDisplay(gregorianValue, isDateTime = false) {
    if (!gregorianValue || !useHijriCalendar()) {
        return gregorianValue;
    }
    const format = isDateTime ? HIJRI_DATETIME_INPUT_FORMAT : HIJRI_INPUT_FORMAT;
    const parseFormat = isDateTime ? GREGORIAN_DATETIME_DB_FORMAT : GREGORIAN_DATE_DB_FORMAT;
    return moment(gregorianValue, parseFormat, true).format(format);
}

function toGregorianDb(hijriValue, isDateTime = false) {
    if (!hijriValue || !useHijriCalendar()) {
        return hijriValue;
    }
    const inputFormat = isDateTime ? HIJRI_DATETIME_INPUT_FORMAT : HIJRI_INPUT_FORMAT;
    const outputFormat = isDateTime ? GREGORIAN_DATETIME_DB_FORMAT : GREGORIAN_DATE_DB_FORMAT;
    const parsed = moment(hijriValue, inputFormat, true);
    return parsed.isValid() ? parsed.format(outputFormat) : hijriValue;
}

export class HijriDateField extends DateField {
    formatValue(value) {
        const formatted = super.formatValue(value);
        return toHijriDisplay(formatted, false);
    }

    parse(value) {
        const converted = toGregorianDb(value, false);
        return super.parse(converted);
    }
}
HijriDateField.template = "odoo_hijri_calendar.HijriDateField";
HijriDateField.displayName = "Hijri Date";
HijriDateField.supportedTypes = ["date"];

export class HijriDateTimeField extends DateTimeField {
    formatValue(value) {
        const formatted = super.formatValue(value);
        return toHijriDisplay(formatted, true);
    }

    parse(value) {
        const converted = toGregorianDb(value, true);
        return super.parse(converted);
    }
}
HijriDateTimeField.template = "odoo_hijri_calendar.HijriDateTimeField";
HijriDateTimeField.displayName = "Hijri Datetime";
HijriDateTimeField.supportedTypes = ["datetime"];

registry.category("fields").add("hijri_date", HijriDateField);
registry.category("fields").add("hijri_datetime", HijriDateTimeField);

// Automatic switch without requiring widget="hijri_date" everywhere.
registry.category("fields").add("date", HijriDateField, { force: true });
registry.category("fields").add("datetime", HijriDateTimeField, { force: true });
