import sendMail from './notification';
const fetch = require("node-fetch");
var userData = {};

const dataFetch = async (districtId,age) => {
const today = new Date();
const dd = today.getDate();
const mm = today.getMonth()+1; 
const yyyy = today.getFullYear();
const reqDate = `${dd}-${mm}-${yyyy}`
console.log(reqDate);
    const response = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${reqDate}`, {
            method: 'GET',
            headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        })
    const resp = await response.json();   
    return resp;
}
    
export default function findSlot(userMap) {
    userData = userMap;
    userData.forEach(function(value, key) {
        console.log(key)
        var input=key.split("-");
        var districtId= input[0];
        var age= input[1];
        var data = dataFetch(districtId,age);
        data.then((data)=>{
        for (var i=0;i < data.centers.length;i++){
            var subdata = data.centers[i];
                for (var j=0;j < subdata.sessions.length;j++) {
                    var sessiondata = subdata.sessions[j];
                    if(sessiondata.min_age_limit == age && sessiondata.available_capacity >0) {
                        console.log('Slots available for following locations:' , subdata.name , subdata.state_name , subdata.district_name , subdata.pincode , sessiondata.date);
                        notify(key,subdata.district_name,sessiondata.min_age_limit,sessiondata.date);
                    }
                }
        }})
    })
}

function notify(key,districtName,age,date) {
    var result = userData.get(key);
    result.forEach((user)=>{
        console.log(user.email);
        sendMail(user.email, {districtName,age,date})
    })
}
