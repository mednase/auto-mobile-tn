/**
 * Created by medna on 01/11/2016.
 */
app.filter('timeago', function() {
    return function(input,$type,p_allowFuture) {
        if($type!="ar"){
            var strings= {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: null,
                suffixFromNow: null,
                seconds: "moins d'une minute",
                minute: "environ une minute",
                minutes: "depuis %d minutes",
                hour: "environ une heure",
                hours: "depuis %d heures",
                day: "il y a un jour",
                days: "depuis %d jours",
                month: "environ un mois",
                months: "depuis %d mois",
                year: "environ un ans",
                years: "depuis %d anneés"}
        }else{
            strings= {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: "منذ",
                suffixFromNow: "من الان",
                seconds: "أقل من دقيقة",
                minute: "حوالي دقيقة",
                minutes: "%d دقائق",
                hour: "حوالي ساعة",
                hours: "حوالي %d ساعات",
                day: "يوم",
                days: "%d ايام",
                month: "شهر تقريبا",
                months: "%d أشهر",
                year: "حوالي سنة",
                years: "%d سنوات"}
        }

        var substitute = function (stringOrFunction, number, strings) {
                var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
                var value = (strings.numbers && strings.numbers[number]) || number;
                return string.replace(/%d/i, value);
            },
            nowTime = (new Date()).getTime(),
            date = (new Date(input)).getTime(),
            //refreshMillis= 6e4, //A minute
            allowFuture = p_allowFuture || false,

            dateDifference = nowTime - date,
            words,
            seconds = Math.abs(dateDifference) / 1000,
            minutes = seconds / 60,
            hours = minutes / 60,
            days = hours / 24,
            years = days / 365,
            separator = strings.wordSeparator === undefined ?  " " : strings.wordSeparator,

            // var strings = this.settings.strings;
            prefix = strings.prefixAgo,
            suffix = strings.suffixAgo;

        if (allowFuture) {
            if (dateDifference < 0) {
                prefix = strings.prefixFromNow;
                suffix = strings.suffixFromNow;
            }
        }

        words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
            seconds < 90 && substitute(strings.minute, 1, strings) ||
            minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
            minutes < 90 && substitute(strings.hour, 1, strings) ||
            hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
            hours < 42 && substitute(strings.day, 1, strings) ||
            days < 30 && substitute(strings.days, Math.round(days), strings) ||
            days < 45 && substitute(strings.month, 1, strings) ||
            days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
            years < 1.5 && substitute(strings.year, 1, strings) ||
            substitute(strings.years, Math.round(years), strings);

        if($type=="ar")
            return $.trim([suffix, words,prefix].join(separator));
        else
            return $.trim([prefix, words, suffix].join(separator));

        // conditional based on optional argument
        // if (somethingElse) {
        //     out = out.toUpperCase();
        // }
        // return out;
    }
});