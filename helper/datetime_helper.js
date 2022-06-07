const { format, isEqual, isAfter, isBefore, parse } = require('date-fns');
const { formatInTimeZone, zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');



let parse_time = function (time, format, region) {
    return parse(`${time} ${region_offset(region)}`, `${format} xxx`, new Date())
};


let now = function (region) {
    return formatInTimeZone(new Date(), region_zone(region), 'yyyy-MM-dd HH:mm:ss')
};


let utc_now = function () {
    return formatInTimeZone(new Date(), 'UTC', 'yyyy-MM-dd HH:mm:ss')
};


let zone_to_utc = function (time, region) {
    return time === null ? null : formatInTimeZone(zonedTimeToUtc(new Date(time), region_zone(region)), 'UTC', 'yyyy-MM-dd HH:mm:ss')
};


let utc_to_zone = function (time, region) {
    return time === null ? null : formatInTimeZone(this.parse_time(time, 'yyyy-MM-dd HH:mm:ss', 'UTC'), region_zone(region), 'yyyy-MM-dd HH:mm:ss')
};

let format_in_tz = function (time, region, format) {
    return time === null ? null : formatInTimeZone(new Date(time), region_zone(region), format)
};


let array_utc_to_zone = function (array){
    array.forEach(m=> {
        let country_code = 'HK'

        if (m.country_code !== undefined && m.country_code !== null)
            country_code = m.country_code
        else if (m.current_region !== undefined && m.current_region !== null)
            country_code = m.current_region

        let modify_list = [
            'occupy_in', 'occupy_out', 'create_time',
            'check_in', 'check_out', 'confirm_time',
            'payout_time', 'last_email_send_time', 'payment_time',
            'break_finish', 'last_confirm_time', 'refund_time',
            'vcc_charge_time', 'reject_time', 'confirmedTime', 
            'register_time', 'last_active_time', 'activate_time']

        modify_list.forEach(item => {
            if (m[item] !== undefined && m[item] !== null && m[item].toString().length > 0) {
                m[item] = this.utc_to_zone(format(m[item], 'yyyy-MM-dd HH:mm:ss'), country_code)
            }

        })
    })


    return array
}


let is_between = function (time, start, end, inclusivity = '()') {
    if (!['()', '[]', '(]', '[)'].includes(inclusivity)) {
        throw new Error('Inclusivity parameter must be one of (), [], (], [)');
    } else {
        time = new Date(time);
        start = new Date(start);
        end = new Date(end);
    }
    const isBeforeEqual = inclusivity[0] === '[',
        isAfterEqual = inclusivity[1] === ']';

    return (isBeforeEqual ? (isEqual(start, time) || isBefore(start, time)) : isBefore(start, time)) &&
        (isAfterEqual ? (isEqual(end, time) || isAfter(end, time)) : isAfter(end, time));
};


let timezone_abbrev = function (region) {
    switch (region.toLowerCase()) {
        case 'hk':
            return 'HKT'
        case 'mo':
            return 'CST'
        case 'sg':
            return 'SGT'
        case 'my':
            return 'MYT'
        case 'vn':
            return 'ICT'
        default:
            return 'UTC'
    }
};


let utc_offset = function (region) {
    return region_offset(region)
};


function region_zone (region) {
    switch (region.toLowerCase()) {
        case 'hk':
            return 'Asia/Hong_Kong'
        case 'mo':
            return 'Asia/Macau'
        case 'sg':
            return 'Asia/Singapore'
        case 'my':
            return 'Asia/Kuala_Lumpur'
        case 'vn':
            return 'Asia/Saigon'
        default:
            return 'UTC'
    }
}


function region_offset (region) {
    switch (region.toLowerCase()) {
        case 'hk':
            return '+08:00'
        case 'mo':
            return '+08:00'
        case 'sg':
            return '+08:00'
        case 'my':
            return '+08:00'
        case 'vn':
            return '+07:00'
        default:
            return '+00:00'
    }
}


module.exports = {
    parse_time,
    now,
    utc_now,
    zone_to_utc,
    utc_to_zone,
    format_in_tz,
    is_between,
    array_utc_to_zone,
    timezone_abbrev,
    utc_offset
};
