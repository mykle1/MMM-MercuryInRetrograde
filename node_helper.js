/* Magic Mirror
 * Module: MMM-MercuryInRetrograde
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getMercury: function(url) {
        request({
            url: url,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
					// console.log(response.statusCode + result); // for checking
                    this.sendSocketNotification('MERCURY_RESULT', result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_MERCURY') {
            this.getMercury(payload);
        }
    }
});
