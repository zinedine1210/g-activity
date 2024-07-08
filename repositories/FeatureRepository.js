import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class FeatureRepository {
    async postFeature(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/_feature`,
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

    async deleteFeature(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/_feature/${params.id}`,
            {
                headers:{
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

    async putFeature(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/_feature`,
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

    async getFeature(params){
        const reponse = await Repository.get(
            `${baseUrl}/_feature/${params.roleId}`,
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

export default new FeatureRepository();
