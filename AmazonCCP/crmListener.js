var configManager = {};
var serviceNowURL;
var SNOpenFrameAPI;
var softphoneOrigin;

window.addEventListener("message", function (event) {
    try {
        console.info(" snCRM: crmEventListener, Received softphone raw event: ", event);
        var message = event.data;
        if (message && message.type) {
            console.info(" snCRM: crmEventListener, Received softphone event, name(): ", message.type);
            switch (message.type) {
                case 'eventAccepted':
                    console.log(" snCRM: AWS Accepted Event: ", message);
                    // Servicenow Screenpopup
                    var recordName = "incident";
                    var client = new XMLHttpRequest();
                    client.open("get", serviceNowURL + "/api/now/table/" + recordName +
                        "?sysparm_query=" + finalQuery, true);
                    infoLog("performRecordSearch", " record search query: " + finalQuery);
                    client.setRequestHeader('Content-Type', 'application/json');
                    client.setRequestHeader('X-UserToken', g_ck);
                    client.onreadystatechange = function () {
                        if (this.readyState == 4 & this.status == 200) {
                            console.log("API Call Success: ", this.response);
                            openFrameAPI.openServiceNowForm({
                                entity: 'incident',
                                query: 'sys_id=76a6d66a833312106a0bf855eeaad32a'
                            });
                        }
                    }
                    break;
                default:
                    break;
            }
        } else if (event.type == 'message' && event.data) {
            try {
                var jsonData = JSON.parse(event.data);
                if (jsonData.eventName) {
                    switch (jsonData.eventName) {
                        case 'openframe_collapse':
                            openFrameAPI.hide();
                            openFrameAPI.setFrameMode(openFrameAPI.FRAME_MODE.EXPAND);
                            break;
                    }
                }
            } catch (error) {}
        }
    } catch (err) {
        console.log(" snCRM: Error at CRM eventListener", err);
    }
});

window.onload = init();

function init() {
    try {
        console.log(" snCRM: Trying to connect servicenow CRM");
        serviceNowURL = window.origin;
        SNOpenFrameAPI = document.createElement("script");
        SNOpenFrameAPI.type = "text/javascript";
        SNOpenFrameAPI.src = serviceNowURL + "/scripts/openframe/latest/openFrameAPI.min.jsx";
        document.getElementsByTagName('head')[0].appendChild(SNOpenFrameAPI);
    } catch (err) {
        console.log(" snCRM: Error occured at init() ", err);
    }
}