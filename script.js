var client;

var jid = '...';
var boshurl = 'http://localhost:5280/http-bind';
var password = '...';

client = XMPP.createClient({
    jid: jid,
    password: password,
    wsURL: null,
    boshURL: boshurl,
    transports: ['bosh']
});

client.on('session:started', function() {

    client.enableCarbons(function(err) {

        console.log('Server does not support carbons');

    });

    client.getRoster(function (err, resp) {
        client.updateCaps();
        client.sendPresence({
            caps: client.disco.caps
        });

    });

});

client.on('iq', function(data) {

    if (data.roster) {

        var people = data.roster.items;
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
    }

});

client.connect();
