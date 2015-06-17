Shplod.View.Application = Backbone.View.extend({

    events : {
        "submit #login-panel form" : "login"
    },

    client : null,

    initialize : function() {

        this.showPanel('login');

    },

    login : function(ev) {

        ev.preventDefault();
        this.showPanel('loader');
        this.loaderMessage('Logging you in...');
        var formValues = $(ev.target).serializeArray();

        var clientOptions = {
        }

        _.each(formValues, function(val) {

            switch(val.name) {
                case 'jid' :
                case 'password' :
                case 'boshURL' :
                    clientOptions[val.name] = val.value;
                    break;
            }

        });

        clientOptions.transports = ['bosh'];

        var client = XMPP.createClient(clientOptions);
        client.on('*', this.debug.bind(this));
        client.on('auth:failed', this.authFailed.bind(this));
        client.on('session:started', this.sessionStarted.bind(this));
        client.connect();

        this.client = client;

    },

    showPanel : function(panelName) {

        this.$('.panel').addClass('hidden');
        this.$('#' + panelName + '-panel').removeClass('hidden');

    },

    loaderMessage : function(message) {

        this.$('#loader-panel .message').text(message);

    },

    authFailed : function() {

        this.loaderMessage('Authentication failed!');

    },

    sessionStarted : function() {

        var self = this;
        this.client.getRoster(function(err, resp) {
            self.client.updateCaps();
            self.client.sendPresence({
                caps: self.client.disco.caps
            });
            self.parseRoster(resp.roster);
        });

    },

    parseRoster : function(roster) {

        this.showPanel('chat');
        var people = roster.items;
        var buddyDom = document.getElementById('buddylist');
        var groupDom = document.getElementById('grouplist');
        for(var i=0; i < people.length; i++) {
            var item = people[i];
            if (item.groups) {
                groupDom.innerHTML+="<li>#" + item.groups[0] + "</li>";
            } else  {
                buddyDom.innerHTML+="<li>" + item.name + "</li>";
            }

        }

    },

    debug: function(eventName) {

        console.log(eventName);

    }

});
