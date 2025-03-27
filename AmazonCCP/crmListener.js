var configManager = {};
var serviceNowURL;
var SNOpenFrameAPI;
var softphoneOrigin;

window.addEventListener("message", function (event) {
    try {
        var message = event.data;
        if (message && message.type) {
            console.info(" snCRM: crmEventListener, Received softphone event, name(): ", message.type);
            switch (message.type) {
                case 'interactionEvent':
                    console.log(" snCRM: interactionEvent: ", message);
                    break;
                default:
                    break;
            }
        } else if (event.type == 'message') {
            if (!checkValueNotEmpty(event.data)) {
                return;
            }
            try {
                var jsonData = JSON.parse(event.data);
                if (checkValueNotEmpty(jsonData.eventName)) {
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