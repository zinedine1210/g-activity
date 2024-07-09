import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class EnumRepository {
    async postEnum(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/_enum`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType:"application/cbor",
                responseType:"arraybuffer"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data;
        })
        .catch((error) => {
            if(error?.response) return cbor.decode(error.response.data)
                else error
        });
        return reponse;
    }

    async deleteEnum(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.delete(
            `${baseUrl}/_enum`,
            {
                headers:{
                    xa: params.xa
                },
                data: data,
                contentType:"application/cbor",
                responseType:"arraybuffer"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data;
        })
        .catch((error) => {
            if(error?.response) return cbor.decode(error.response.data)
                else error
        });
        return reponse;
    }

    async putEnum(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/_enum/${params.id}`,
            data,
            {
                headers:{
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data;
        })
        .catch((error) => {
            if(error?.response) return cbor.decode(error.response.data)
                else error
        });
        return reponse;
    }

    async getEnum(params){
        const reponse = await Repository.get(
            `${baseUrl}/_enum`,
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
            if(error?.response) return cbor.decode(error.response.data)
                else return error
        });
        return reponse;
    }

    async browseEnum(params){
        const reponse = await Repository.get(
            `${baseUrl}/_enum/browse/${params.app}/_enum`,
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
            if(error?.response) return cbor.decode(error.response.data)
                else return error
        });
        return reponse;
    }
}

export default new EnumRepository();
