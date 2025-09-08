
class udisplayCalls {
    constructor(){
       const active = true;
       const username = "aesys"; 
        const password = "ae1221"; 
        this.auth = btoa(username + ":" + password);
        this.authMode = "Basic";
    }


    getDataFromUrl(url) { 

        return new Promise(function(resolve, reject){
            //refresh data
            $.ajax({
                type: "GET",
                url: url, 
                dataType: 'json',
                timeout: 10000,
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, exception) {  //if the connection fails, retry 3 times before showing the courtesy page
                   
                    console.log("fail to acquire new data");
                    reject("ERR_CONN");
                }
            });
        });
    }
    
    
    setUdisplayKey(key_id, value="undefined", group = null, type = "string",url = ""){
        const self = this;
        return new Promise(function(resolve, reject){
            //refresh data
            $.ajax({
                type: "GET",
                headers: {
                    authorization: self.getHeaderAuth()
                },
                url: `${url}/data/set?key=${key_id}&value=${encodeURIComponent(value)}&group=${group}&type=${type}`, 
                timeout: 10000,
                success: function () {
                    console.log(`key "${key_id}" setted correctly. value: "${value}"; group: "${group}"; type: "${type}"`);
                    resolve();
                },
                error: function (jqXHR, exception) { 
                    console.log("fail set key");
                    reject("ERR_CONN");
                }
            });
        });
    }

    updateUdisplayKey(key_id, value, url = ""){
        const self = this;
        return new Promise(function(resolve, reject){
            //refresh data
            $.ajax({
                type: "PUT",
                headers: {
                    authorization: self.getHeaderAuth()
                },
                url: `${url}/data/set?key=${key_id}&value=${encodeURIComponent(value)}`, 
                timeout: 10000,
                success: function () {
                    console.log(`key "${key_id}" updated correctly. value: "${value}"`);
                    resolve();
                },
                error: function (jqXHR, exception) { 
                    console.log("fail update key " + key_id + ". error: " + exception);
                    reject("ERR_CONN");
                }
            });
        });
    }

    triggerUdisplayButton(key_id, url = ""){
        const self = this;
        return new Promise(function(resolve, reject){
            //refresh data
            $.ajax({
                type: "GET",
                headers: {
                    authorization: self.getHeaderAuth()
                },
                url: `${url}/data/triggerbutton?name=${key_id}`, 
                timeout: 10000,
                success: function () {
                    console.log(`button "${key_id}" triggered correctly.`);
                    resolve();
                },
                error: function (jqXHR, exception) { 
                    console.log("fail trigger button " + key_id + ". error: " + exception);
                    reject("ERR_CONN");
                }
            });
        });
    }

    

    getUdisplayKey(key, url = ""){
        const self = this;
        return new Promise(function(resolve, reject){
            //refresh data
            $.ajax({
                type: "GET",
                headers: {
                    authorization: self.getHeaderAuth()
                },
                url: `${url}/data/getkeyvalue?key=${key}`, 
                timeout: 10000,
                success: function (data) {
                    console.log(`key ${key} getted correctly`);
                    resolve(data);
                },
                error: function (jqXHR, exception) { 
                    console.log(`fail to get key ${key}`);
                    reject("ERR_CONN");
                }
            });
        });
    }   

     getUdisplayKeys(json_keys, url = ""){
        const self = this;
        return new Promise(function(resolve, reject){
            //refresh data
            $.ajax({
                type: "GET",
                headers: {
                    authorization: self.getHeaderAuth()
                },
                url: `${url}/data/getkeys?keys=${json_keys}`, 
                timeout: 10000,
                success: function (data) {
                    console.log(`Getted keys`);
                    resolve(data.data);
                },
                error: function (jqXHR, exception) { 
                    console.log(`fail to get keys`);
                    reject("ERR_CONN");
                }
            });
        });
    }   

    getUdisplayGroup(group, url = ""){
        const self = this;
        return new Promise(function(resolve, reject){
            //refresh data
            $.ajax({
                type: "GET",
                headers: {
                    authorization: self.getHeaderAuth()
                },
                url: `${url}/data/getgroup?name=${group}`, 
                timeout: 10000,
                success: function (data) {
                    console.log(`Getted Udisplay group "${group}`);
                    resolve(data.data);
                },
                error: function (jqXHR, exception) { 
                    console.log(`fail to get group ${group}`);
                    reject("ERR_CONN");
                }
            });
        });
    }   

    removeUdisplayGroup(group){

        return new Promise(function(resolve, reject){
            //refresh data
            $.ajax({
                type: "GET",
                url: `/data/removegroup?name=${group}`, 
                timeout: 10000,
                success: function (data) {
                    console.log(`Udisplay group "${group}" removed correctly`);
                    console.log(`data for group "${group}": ${data.data}`);
                    resolve(data);
                },
                error: function (jqXHR, exception) { 
                    console.log(`fail to remove group ${group}`);
                    reject("ERR_CONN");
                }
            });
        });
    }   


    getHeaderAuth(authMode = this.authMode, token = this.myToken, auth = this.auth){
       
            if(authMode == "Basic") {
                return "Basic " + auth;
            }
            else if (authMode == "Jwt"){
                return "Bearer " + token.accessToken;
            }
        
    }

    convertToMap(dataArray) {
        const map = {};
        dataArray.forEach(item => {
            map[item.key] = item.value;
        });
        return map;
    }
    
}