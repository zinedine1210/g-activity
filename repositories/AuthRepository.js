import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class AuthRepository {
    async postLogin(params) {
        const reponse = await Repository.post(
            `${baseUrl}/auth/mlogin`,
            null,
            {
                headers: params,
                contentType:"application/cbor",
                responseType: "arraybuffer"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data;
        })
        .catch((error) => {
            if(error.response){
                let result = cbor.decode(error.response.data)
                return result
            }else if(error.request){
                return { type:"failed" }
            }else{
                console.log("Error");
            }
        });
        return reponse;
    }

    async postLogout(params) {
        const reponse = await Repository.post(
            `${baseUrl}/auth/logout`,
            null,
            {
                headers: params,
                responseType: "arraybuffer",
                contentType:"application/cbor"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data
        })
        .catch((error) => {
            if(error.response){
                let result = cbor.decode(error.response.data)
                return result
            }else if(error.request){
                return { type:"not found" }
            }else{
                return error
                console.log("Error");
            }
        });
        return reponse;
    }

    async getEnum(params){
        const reponse = await Repository.get(
            `${baseUrl}/_enum/browse/gactivity/${params.type}`,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType: "arraybuffer"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data.data
        })
        .catch((error) => {
            // console.log(error);
            if(error.response){
                let result = cbor.decode(error.response.data)
                return result
            }else if(error.request){
                return { type:"not found" }
            }else{
                return error
            }
        });
        return reponse;
    }

    async getStatus(params){
        const reponse = await Repository.get(
            `${baseUrl}/auth/status`,
            {
                headers: params,
                contentType:"application/cbor",
                responseType: "arraybuffer"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data
        })
        .catch((error) => {
            console.log(error)
            if(error.response){
                let result = cbor.decode(error.response.data)
                return result
            }else if(error.request){
                return { type:"not found" }
            }else{
                return error
            }
        });
        return reponse;
    }

    async getFindMember(params){
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/member/find`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType:"application/cbor",
                responseType: "arraybuffer"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data
        })
        .catch((error) => {
            // console.log(error);
            if(error?.response){
                return error.response.data
            }else return error
        });
        return reponse;
    }
}

export default new AuthRepository();
