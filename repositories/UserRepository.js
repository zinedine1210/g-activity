import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class UserRepository {
    async postUser(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/baseuser`,
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

    async deleteUser(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/baseuser/${params.id}`,
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

    async putUser(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/baseuser/${params.id}`,
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

    async getUser(params){
        const reponse = await Repository.get(
            `${baseUrl}/baseuser`,
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

}

export default new UserRepository();
