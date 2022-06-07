const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const {format,getUnixTime} = require('date-fns')
const tz = require('../../../ryan_code/local_pj/helper/datetime_helper')
const got = require('got')
const os = require('os')

// let srv = cf.check_server();
let srv = 'dev';

if (os.hostname().includes('FlowDevelopment')) {
    srv = 'dev'
} else if (os.hostname().includes('FlowProduction')) {
    srv = 'prod'
} else if (os.hostname().includes('flowschedulerunner')) {
    srv = 'sched'
}
//srv = 'prod'
let door_lock_token = require('../config/door_lock_key'), door_lock_config = door_lock_token.dev;

if (srv === 'prod' || srv === 'sched') {
    door_lock_config = door_lock_token.prod
}





const getCardKey = async(mobile,roomNo,occupy_in,occupy_out,country_code) =>{
    try{
        let account_id = door_lock_config.account_id, auth_token = door_lock_config.auth_token
        let timeStamp = format(new Date(tz.utc_now()),'yyyyMMddHHmmss')
        let sig_key = (account_id + auth_token + timeStamp)
        let sig = await CryptoJS.MD5(sig_key).toString()
        let auth = (account_id + ':' + timeStamp);
        auth = Buffer.from(auth).toString('base64')
        sig = sig.toUpperCase()

        console.log()


        //let json = JSON.parse('{"mobile":"67238232","communityNo":"1316879946","buildNo":"022","floorNo":"1","roomNo":"100","cardType":"0","times":"1"}')
        // let json = {
        //     mobile: mobile,
        //     communityNo:door_lock_config.community_no,
        //     buildNo: "002",
        //     floorNo:"008",
        //     roomNo:roomNo,
        //     areaCode:"852",
        //     cardType: "0",
        //     opentype:"1",
        //     startTime:format(new Date(tz.utc_to_zone(occupy_in,country_code)),'yyMMddHHmm'),
        //     endTime:format(new Date(tz.utc_to_zone(occupy_out,country_code)),'yyMMddHHmm')
        // }

        let json = {
            mobile: mobile,
            communityNo:door_lock_config.community_no,
            buildNo: "022",
            floorNo:"1",
            roomNo:100,
            areaCode:"852",
            cardType: "0",
            opentype:"1",
            startTime:format(new Date(tz.utc_to_zone(occupy_in,country_code)),'yyMMddHHmm'),
            endTime:format(new Date(tz.utc_to_zone(occupy_out,country_code)),'yyMMddHHmm')
        }

        let url = `https://api.uclbrt.com/?c=Qrcode&a=getLink&sig=${sig}`

        let headers = {
            'Accept':'application/json',
            'Content-Type':'application/x-www-form-urlencode;charset=uft-8',
            'Authorization':auth
        }

        const {body,statusCode} = await got.post(url,{
            throwHttpErrors:false,
            headers:headers,
            json:json,
            responseType:'json'
        })

        if(statusCode > 300){
            console.log(body.message)
        }

        console.log(statusCode, body)
        return body
    }
    catch (e) {
        console.log(e)
    }
}

const getQrCode = async(mobile,cardNo,occupy_out,country_code) =>{
    try{
        let account_id = door_lock_config.account_id, auth_token = door_lock_config.auth_token
        let timeStamp = format(new Date(tz.utc_now()),'yyyyMMddHHmmss')
        let sig_key = (account_id + auth_token + timeStamp)
        let sig = await CryptoJS.MD5(sig_key).toString()
        let auth = (account_id + ':' + timeStamp);

        sig = sig.toUpperCase()
        auth = Buffer.from(auth).toString('base64')
        let json = {
            cardNo:cardNo,
            communityNo:door_lock_config.community_no,
            id:door_lock_config.account_id,
            token:door_lock_config.auth_token,
            mobile:mobile,
            time:getUnixTime(new Date()).toString(),
            cardType:"0",
            areaCode:"852",
            openEndTime:format(new Date(tz.utc_to_zone(occupy_out,country_code)),'yyMMddHHmm')

        }

        let url = `https://api.uclbrt.com/?c=Qrcode&a=getCard&sig=${sig}`
        let headers = {
            'Accept':'application/json',
            'Content-Type':'application/x-www-form-urlencode;charset=uft-8',
            'Authorization':auth
        }


        const {body,statusCode} = await got.post(url,{
            throwHttpErrors:false,
            headers:headers,
            json:json
        })
        let result = JSON.parse(body)

        if(statusCode > 300){
            console.log(body.message)
        }

        console.log(statusCode, result)
        return result

    }
    catch (e) {
        console.log(e)
    }
}

const getQrCodeV2 = async(mobile,cardNo,occupy_out,country_code) =>{
    try{
        let public_key =
            '-----BEGIN PUBLIC KEY-----\n' +
            "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqxqOJg0kqL4/xoNf0iDb" + "\n" +
            "jz/oM7ujsXOd92vQDkwO/rCP9wwZY0AvrMhcc56X4LmIbsbc1EZQ5ryMrIDbyCgt" + "\n" +
            "pgJJTQG/u/FBiwG2Yvqgx+9keVGZhBA+Oph34HFPWz4OEB+Py4QkaJPXALkjjh2Z" + "\n" +
            "f7Lgpv5gO8gRyg/o9FwCOZyEGiUmVorwPvwT3oMeNPCHxzlpGzdqV1kfqNmbS4Zk" + "\n" +
            "CiXGNhxxN0LJDnhaJJUl4bcnUjpcIxUlgSMX2CcooffIk3E1ROP051Xf/zmUWE6D" + "\n" +
            "TcGetf6ni2s2irDCgeanylyjLTgM6xaOYWqtG0yUC5lyzO46yTmE1Q47XMM2h1KJ" + "\n" +
            "swIDAQAB" + "\n" +
            '-----END PUBLIC KEY-----\n'

        let account_id = door_lock_config.account_id, auth_token = door_lock_config.auth_token
        let time = getUnixTime(new Date(tz.utc_now())), areaCode = '852',  mobile = '67238232', cardType = '0', cardNo = "dlvG2VOOG4DV748n"

        let abc = "id=" + account_id + "&token=" + auth_token + "&communityNo=" + door_lock_config.community_no +
            "&time=" + time + "&mobile=" + mobile + "&areaCode=" + areaCode + "&cardType=" + cardType + "&cardNo=" + cardNo;

        let encrypted = crypto.publicEncrypt(public_key,Buffer.from(abc));
        abc =  Buffer.from(encrypted).toString('base64')

        let url = `http://cz.uclbrt.com/apiLogin/?data=${abc}`
        url = encodeURIComponent(url)

        let headers = {
            'Accept':'application/json',
            'Content-Type':'application/x-www-form-urlencode;charset=uft-8'
        }


        const {body,statusCode} = await got.get(url,{
            throwHttpErrors:false,
            headers:headers,
        })

        // console.log(body)
        console.log(url)
        let result = body
        // let result = JSON.parse(body)

        if(statusCode > 300){
            console.log(body.message)
        }

        // console.log(statusCode, result)
        return result

    }
    catch (e) {
        console.log(e)
    }
}



module.exports = {getCardKey,getQrCode,getQrCodeV2}