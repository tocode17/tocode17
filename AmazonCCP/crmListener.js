var serviceNowURL;
var SNOpenFrameAPI;

window.addEventListener("message", function (event) {
    try {
        console.info(" snCRM: Received softphone raw event: ", event);
        var message = event.data;
        if (message && message.type) {
            switch (message.type) {
                case 'eventRinging':
                    openFrameAPI.show();
                    break;
                case 'eventAccepted':
                    console.log(" snCRM: AWS Accepted Event: ", message);
                    // Servicenow Record Creation
                    recordCreation("incident", bodyData, message.data, callback);
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
        console.error(" snCRM: Error at CRM eventListener", err);
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

function recordCreation(recordName, bodyData, callData, callback) {
    try {
        if (bodyData && recordName) {
            console.warn("recordCreation", "request body is null");
            return;
        }

        var httpReq = new XMLHttpRequest();
        httpReq.open("post", serviceNowURL + "/api/now/table/" + recordName + "?", true);
        httpReq.setRequestHeader('Content-Type', 'application/json');
        httpReq.setRequestHeader('X-UserToken', g_ck);
        var parameters = JSON.stringify(bodyData);
        console.log("recordCreation", " new record create request, object:" + recordName + " bodyData: " + parameters);
        httpReq.onreadystatechange = function () {
            if (this.readyState == 4 & this.status == 201) {
                var snResponse = JSON.parse(this.response);
                console.log("recordCreation", "new record created for:" + recordName + " , sys_id:" + snResponse.result.sys_id);
                if (callback != null) {
                    callback(snResponse.result.sys_id);
                    callback = null;
                }
                openFrameAPI.openServiceNowForm({
                    entity: recordName,
                    query: 'sys_id=' + snResponse.result.sys_id
                });
            } else
                console.log("recordCreation", "state: " + this.readyState + " ,status: " + this.status);
        }
        httpReq.send(parameters);
    } catch (e) {
        console.error("Error at recordCreation: ", e);
    }
}