/* Magic Mirror
 * Module: MMM-MercuryInRetrograde
 *
 * By Mykle1
 * MIT License
 */
Module.register("MMM-MercuryInRetrograde", {

    // Module config defaults.
    defaults: {
        image: "static", // static or gif * Use of gif may not work on Raspberry Pi
        useHeader: false, // true if you want a header
        header: "Mercury Rising!", // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 0,
        initialLoadDelay: 1250,
        retryDelay: 2500,
        updateInterval: 5 * 60 * 1000, // 5 minutes

    },

    getStyles: function() {
        return ["MMM-MercuryInRetrograde.css"];
    },


    start: function() {
        Log.info("Starting module: " + this.name);

        //  Set locale.
        this.url = "https://mercuryretrogradeapi.com";
        this.Mercury = {};
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Mercury Rising . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        var title = document.createElement("div");
        title.classList.add("small", "bright", "title");
        title.innerHTML = "Mercury";
        wrapper.appendChild(title);


        var pic = document.createElement("div");
        var img = document.createElement("img");
        img.classList.add("img");

        if (this.config.image == "gif") {
            img.src = "modules/MMM-MercuryInRetrograde/images/mercuryAnimation.gif";
            pic.appendChild(img);
            wrapper.appendChild(pic);

        } else if (this.config.image == "static") {
            img.src = "modules/MMM-MercuryInRetrograde/images/mercuryStatic.jpg";
            pic.appendChild(img);
            wrapper.appendChild(pic);
        }


        var date = document.createElement("div");
        date.classList.add("xsmall", "bright", "date");
        date.innerHTML = moment().format('h:mm a ~ MMM DD, YYYY');
        wrapper.appendChild(date);


        var retro = document.createElement("div");
        retro.classList.add("bright", "small", "retro");
        if (this.Mercury == true) {
            retro.innerHTML = "Mercury is in retrograde!";
        }
        wrapper.appendChild(retro);

        return wrapper;
    },


    processMercury: function(data) {
        this.Mercury = data.is_retrograde;
        this.loaded = true;
        // console.log(this.Mercury);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getMercury();
        }, this.config.updateInterval);
        this.getMercury(this.config.initialLoadDelay);
    },

    getMercury: function() {
        this.sendSocketNotification('GET_MERCURY', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "MERCURY_RESULT") {
            this.processMercury(payload);

            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
