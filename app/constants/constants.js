'use strict';

angular.module('eayun.ecmc')
    .constant('SysCode', {
        error: "010120",
        success: "000000",
        warning:"010110"
    })
    .config(function ($provide) {
        $provide.value("$locale", {
            "DATETIME_FORMATS": {
                "AMPMS": [
                    "AM",
                    "PM"
                ],
                "DAY": [
                    "周日",
                    "周一",
                    "周二",
                    "周三",
                    "周四",
                    "周五",
                    "周六"
                ],
                "ERANAMES": [
                    "Before Christ",
                    "Anno Domini"
                ],
                "ERAS": [
                    "BC",
                    "AD"
                ],
                "FIRSTDAYOFWEEK": 6,
                "MONTH": [
                    "1月",
                    "2月",
                    "3月",
                    "4月",
                    "5月",
                    "6月",
                    "7月",
                    "8月",
                    "9月",
                    "10月",
                    "11月",
                    "12月"
                ],
                "SHORTDAY": [
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat"
                ],
                "SHORTMONTH": [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ],
                "WEEKENDRANGE": [
                    5,
                    6
                ],
                "fullDate": "EEEE, MMMM d, y",
                "longDate": "MMMM d, y",
                "medium": "MMM d, y h:mm:ss a",
                "mediumDate": "MMM d, y",
                "mediumTime": "h:mm:ss a",
                "short": "M/d/yy h:mm a",
                "shortDate": "M/d/yy",
                "shortTime": "h:mm a"
            },
            "NUMBER_FORMATS": {
                "CURRENCY_SYM": "$",
                "DECIMAL_SEP": ".",
                "GROUP_SEP": ",",
                "PATTERNS": [
                    {
                        "gSize": 3,
                        "lgSize": 3,
                        "maxFrac": 3,
                        "minFrac": 0,
                        "minInt": 1,
                        "negPre": "-",
                        "negSuf": "",
                        "posPre": "",
                        "posSuf": ""
                    },
                    {
                        "gSize": 3,
                        "lgSize": 3,
                        "maxFrac": 2,
                        "minFrac": 2,
                        "minInt": 1,
                        "negPre": "-\u00a4",
                        "negSuf": "",
                        "posPre": "\u00a4",
                        "posSuf": ""
                    }
                ]
            },
            "id": "en-us",
            "pluralCat": function (n, opt_precision) {
                var i = n | 0;
                var vf = getVF(n, opt_precision);
                if (i == 1 && vf.v == 0) {
                    return PLURAL_CATEGORY.ONE;
                }
                return PLURAL_CATEGORY.OTHER;
            }
        });
    });
