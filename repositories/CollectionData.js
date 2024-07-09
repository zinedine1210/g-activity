import axios from 'axios';
import cbor from 'cbor';
import { baseUrl, customHeaders } from './Repository';
import { showToast } from "@utils/functionToast"
import { handleTokenExpired } from '@utils/tokenExpired'

class CollectionData {
    constructor() {
        this.axiosInstance = axios.create({
            baseUrl,
            headers: customHeaders
        });
    }
    getToken() {
        const getToken = localStorage.getItem("XA");
        return JSON.parse(getToken);
    }

    expiredToken(result) {
        if(result['message'] == "Token Expired"){
            handleTokenExpired(result);
        }
    }

    async getData(obj, abortSignal) {
        let url = `${baseUrl}/${obj.url}`
        url += `?count=${obj['count'] ? obj['count'] : 20}`
        url += `&start=${obj['start'] ? obj['start'] : 0}`
        
        if(obj.query){
            url += obj.query
        }

        const dataToken = this.getToken()
        const reponse = await this.axiosInstance.get(
            `${url}`,
            {
                headers: { "XA": dataToken },
                responseType: "arraybuffer",
                // signal: abortSignal ? abortSignal:AbortSignal.timeout(10000) ? abortSignal:10000
            }
        )
            .then((response) => {
                let result = cbor.decode(response.data)
                this.expiredToken(result)
                return result;
            })
            .catch((error) => {
                if (error.hasOwnProperty("code") && error.code == "ERR_CANCELED") {
                    return { "status": -1, "data": "Timeout" }
                }
                let result = cbor.decode(error.response.data)
                return result;
            });
        return reponse;
    }

    async postData(obj, abortSignal) {
        let url = `${baseUrl}/${obj.url}`
        const dataToken = this.getToken();
        let values = cbor.encode(obj['values'])
        const reponse = await this.axiosInstance.post(
            `${url}`,
            values,
            {
                headers: { "XA": dataToken },
                responseType: "arraybuffer",
                // signal: abortSignal ? abortSignal:AbortSignal.timeout(10000)
            }
        )
            .then((response) => {
                let result = cbor.decode(response.data)
                this.expiredToken(result)
                return result;
            })
            .catch((error) => {
                if (error.hasOwnProperty("code") && error.code == "ERR_CANCELED") {
                    return { "status": -1, "data": "Timeout" }
                }
                let result = cbor.decode(error.response.data)
                return result;
            });
        return reponse;
    }

    async putData(obj, abortSignal) {
        let url = `${baseUrl}/${obj.url}`
        if(obj['id']){
            url += `/${obj['id']}`
        }
        const dataToken = this.getToken();
        let values = cbor.encode(obj['values'])
        const reponse = await this.axiosInstance.put(
            `${url}`,
            values,
            {
                headers: { "XA": dataToken },
                responseType: "arraybuffer",
                // signal: abortSignal ? abortSignal:AbortSignal.timeout(10000)
            }
        )
            .then((response) => {
                let result = cbor.decode(response.data)
                this.expiredToken(result)
                return result;
            })
            .catch((error) => {
                if (error.hasOwnProperty("code") && error.code == "ERR_CANCELED") {
                    return { "status": -1, "data": "Timeout" }
                }
                let result = cbor.decode(error.response.data)
                return result;
            });
        return reponse;
    }

    async deleteData(obj, abortSignal) {
        let url = `${baseUrl}/${obj.url}`
        const dataToken = this.getToken();
        let values = cbor.encode(obj['values'])
        console.log("values delte", values)
        const reponse = await this.axiosInstance.delete(
            `${url}`,
            {
                data: values,
                headers: { "XA": dataToken },
                responseType: "arraybuffer",
                // signal: abortSignal ? abortSignal:AbortSignal.timeout(10000)
            }
        )
            .then((response) => {
                let result = cbor.decode(response.data)
                this.expiredToken(result)
                return result;
            })
            .catch((error) => {
                if (error.hasOwnProperty("code") && error.code == "ERR_CANCELED") {
                    return { "status": -1, "data": "Timeout" }
                }
                console.log(cbor.decode(error))
                let result = cbor.decode(error.response.data)
                return result;
            });
        return reponse;

    }
}

export default new CollectionData();