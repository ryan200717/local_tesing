const CryptoJS = require("crypto-js");
const {format} = require('date-fns')
const got = require('got')



const getCardKey = async() =>{
    try{
        let account_id = '98651082ab89c3f1b50f35caf794179f', auth_token = 'e687bc93c89b9b59611de521a70ed4'
        let timeStamp = format(new Date(),'yyyyMMddHHmmss')

        let sig_key = (account_id + auth_token + timeStamp)
        console.log(sig_key)
        let sig = await CryptoJS.MD5(sig_key).toString()
        sig = sig.toUpperCase()
        console.log(sig)
        let auth = (account_id + ':' + timeStamp);
        auth = Buffer.from(auth).toString('base64')
        let json = JSON.parse('{"mobile":"18819238549","communityNo":"1316879946","buildNo":"022","floorNo":"1","roomNo":"100","cardType":"0","times":"1"}')
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

        return body

    }
    catch (e) {
        console.log(e)
    }
}

const getQrCode = async() =>{
    try{
        let account_id = '98651082ab89c3f1b50f35caf794179f', auth_token = 'e687bc93c89b9b59611de521a70ed4'
        let timeStamp = format(new Date(),'yyyyMMddHHmmss')

        let sig_key = (account_id + auth_token + timeStamp)
        console.log(sig_key)
        let sig = await CryptoJS.MD5(sig_key).toString()
        sig = sig.toUpperCase()
        console.log(sig)
        let auth = (account_id + ':' + timeStamp);
        auth = Buffer.from(auth).toString('base64')
        let json = {
            cardNo:'ZvM925zmgqokEJQ0',
            communityNo:'1316879946',
            id:account_id,
            token:auth_token,
            mobile:'18819238549',
            time:new Date().toString(),
            cardType:"0"
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
        console.log(statusCode, result)

        if(statusCode > 300){
            console.log(body.message)

        }

        return body

    }
    catch (e) {
        console.log(e)
    }
}



module.exports = {getCardKey,getQrCode}