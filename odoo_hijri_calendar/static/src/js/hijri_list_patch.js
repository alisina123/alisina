/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { ListRenderer } from "@web/views/list/list_renderer";

const GREGORIAN_DATE_DB_FORMAT = "YYYY-MM-DD";
const GREGORIAN_DATETIME_DB_FORMAT = "YYYY-MM-DD HH:mm:ss";
const HIJRI_DATE_FORMAT = "iYYYY/iMM/iDD";
const HIJRI_DATETIME_FORMAT = "iYYYY/iMM/iDD HH:mm:ss";

function getLangCode() {
    return (odoo?.session_info?.user_context?.lang || "en_US").toLowerCase();
}

function useHijriCalendar() {
    const lang = getLangCode();
    return lang.startsWith("ar") || lang.startsWith("fa");
}

const dateCache = new Map();

function toHijriText(value, isDateTime = false) {
    if (!value || !useHijriCalendar()) {
        return value;
    }
    const cacheKey = `${value}|${isDateTime ? "dt" : "d"}`;
    if (dateCache.has(cacheKey)) {
        return dateCache.get(cacheKey);
    }

    const inputFormat = isDateTime ? GREGORIAN_DATETIME_DB_FORMAT : GREGORIAN_DATE_DB_FORMAT;
    const outputFormat = isDateTime ? HIJRI_DATETIME_FORMAT : HIJRI_DATE_FORMAT;
    const result = moment(value, inputFormat, true).format(outputFormat);
    dateCache.set(cacheKey, result);

    if (dateCache.size > 2000) {
        const firstKey = dateCache.keys().next().value;
        dateCache.delete(firstKey);
    }

    return result;
}

patch(ListRenderer.prototype, {
    getFormattedValue(column, record) {
        const originalValue = super.getFormattedValue(...arguments);
        if (!useHijriCalendar()) {
            return originalValue;
        }

        const fieldType = record.fields?.[column.name]?.type;
        if (fieldType === "date") {
            return toHijriText(originalValue, false);
        }
        if (fieldType === "datetime") {
            return toHijriText(originalValue, true);
        }
        return originalValue;
    },
});
