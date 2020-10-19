// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

window.onload = function () {
    var x = new XMLHttpRequest();
    x.open('GET', "https://vishwaroop.info/covid/india/nationalSummary");
    x.onload = function () {
        let nationalData = JSON.parse(x.responseText);

        let testedSign = nationalData.delta.tested > 0 ? "+" : "-";
        let confirmedSign = nationalData.delta.confirmed > 0 ? "+" : "-";
        let recoveredSign = nationalData.delta.recovered > 0 ? "+" : "-";
        let deceasedSign = nationalData.delta.deceased > 0 ? "+" : "-";

        document.getElementById("nationalTestedNumbers").innerText = "Tested : " + formatNumberToString(nationalData.total.tested) + "(" + testedSign + formatNumberToString(nationalData.delta.tested) + ")";
        document.getElementById("nationalConfirmedNumbers").innerText = "Confirmed : " + formatNumberToString(nationalData.total.confirmed) + "(" + confirmedSign + formatNumberToString(nationalData.delta.confirmed) + ")";
        document.getElementById("nationalRecoveredNumbers").innerText = "Recovered : " + formatNumberToString(nationalData.total.recovered) + "(" + recoveredSign + formatNumberToString(nationalData.delta.recovered) + ")";
        document.getElementById("nationalDeceasedNumbers").innerText = "Deceased : " + formatNumberToString(nationalData.total.deceased) + "(" + deceasedSign + formatNumberToString(nationalData.delta.deceased) + ")";

        document.getElementById("nationalTestedProportion").innerText = calculateRate(nationalData.total.tested, nationalData.meta.population) + " of total population";
        document.getElementById("nationalConfirmedProportion").innerText = calculateRate(nationalData.total.confirmed, nationalData.total.tested) + " of tested cases";
        document.getElementById("nationalRecoveredProportion").innerText = calculateRate(nationalData.total.recovered, nationalData.total.confirmed) + " of confirmed cases";
        document.getElementById("nationalDeceasedProportion").innerText = calculateRate(nationalData.total.deceased, nationalData.total.confirmed) + " of confirmed cases";

        document.getElementById("footer").innerText = "Last Updated : " + new Date(nationalData.effectiveDate).toUTCString().substring(0, 16) + ". For more details, visit ";
        document.getElementById("websiteURL").href = "https://www.vishwaroop.info";

    };
    x.send();

    function calculateRate(cases, confirmed) {
        if (cases === undefined || cases == null || confirmed === 0) {
            return '0%';
        }
        return Math.round(cases / confirmed * 10000) / 100 + '%';
    }

    function formatNumberToString(number, isSignedNumber) {
        if (number === undefined || number == null || number === 0 || number === '') {
            return '-';
        }

        let formattedString;
        let sign = '';
        if (isSignedNumber) {
            sign = number < 0 ? '-' : '+';
        }
        number = Math.abs(number);
        let quotient = Math.floor(number / 1000);
        let reminder = number % 1000;

        if (quotient > 0) {
            formattedString = ',' + reminder.toString().padStart(3, '0');

            reminder = quotient % 100;
            quotient = Math.floor(quotient / 100);

            if (quotient > 0) {
                formattedString = ',' + reminder.toString().padStart(2, '0') + formattedString;

                reminder = quotient % 100;
                quotient = Math.floor(quotient / 100);

                if (quotient > 0) {
                    formattedString = ',' + reminder.toString().padStart(2, '0') + formattedString;

                    reminder = quotient % 100;
                    quotient = Math.floor(quotient / 100);

                    if (quotient > 0) {
                        formattedString = ',' + reminder.toString().padStart(2, '0') + formattedString;

                        reminder = quotient % 100;
                        quotient = Math.floor(quotient / 100);

                        if (quotient > 0) {
                            return 'large number';
                        } else {
                            return sign + reminder + formattedString;
                        }
                    } else {
                        return sign + reminder + formattedString;
                    }
                } else {
                    return sign + reminder + formattedString;
                }
            } else {
                return sign + reminder + formattedString;
            }

        } else {
            return sign + reminder.toString();
        }
    }
};