import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class MeetingRepository {
    async postMeeting(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/meet`,
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

    async setStatusMeeting(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/meet/${params.id}`,
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

    async deleteMeeting(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.delete(
            `${baseUrl}/meet`,
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

    async putMeeting(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/meet/${params.id}`,
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

    async getMeeting(params){
        const reponse = await Repository.get(
            `${baseUrl}/meet`,
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

    async detailMeetingById(params){
        const reponse = await Repository.get(
            `${baseUrl}/meet/${params.id}`,
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


    async setStatusAudience(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/meet_audience_status/${params.id}`,
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

    // flag = 1: list 2: count
    async getAudience(params){
        const reponse = await Repository.get(
            `${baseUrl}/meet_audience/${params.id}/${params.flag}`,
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

    // flag = 1: list 2: count
    async getInvitationAudience(params){
        const reponse = await Repository.get(
            `${baseUrl}/meet_by_audience/${params.flag}`,
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

export default new MeetingRepository();
