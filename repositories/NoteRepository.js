import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class NoteRepository {
    async postNote(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/note`,
            data,
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
            return data;
        })
        .catch((error) => {
            if(error?.response) return cbor.decode(error.response.data)
                else return error
        });
        return reponse;
    }

    async deleteNote(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/note/${params.id}`,
            {
                headers:{
                    xa:params.xa
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

    async putNote(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/note/${params.id}`,
            data,
            {
                headers:{
                    xa:params.xa
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

    async getNoteByID(params){
        const reponse = await Repository.get(
            `${baseUrl}/note/${params.id}`,
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
            console.log("ini dari repo", cbor.decode(response.data))
            return data
        })
        .catch((error) => {
            if(error?.response) return cbor.decode(error.response.data)
                else return error;
        });
        return reponse;
    }

    async getNote(params){
        const reponse = await Repository.get(
            `${baseUrl}/note/${params.projectID}/${params.type}`,
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
            return data
        })
        .catch((error) => {
            if(error?.response) return cbor.decode(error.response.data)
                else return error;
        });
        return reponse;
    }

    // TEAM
    async postTeamNote(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/note/${params.projectID}/${params.id}/team`,
            data,
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
            return data;
        })
        .catch((error) => {
            if(error?.response) return cbor.decode(error.response.data)
                else return error
        });
        return reponse;
    }


    async deleteTeam(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.delete(
            `${baseUrl}/note/${params.id}/team/rm`,
            {
                headers:{
                    xa:params.xa
                },
                contentType:"application/cbor",
                data: data
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

    async getTeam(params){
        // type 1 untuk list invited dan active member
        // type 2 untuk count list member
        const reponse = await Repository.get(
            `${baseUrl}/note/${params.id}/team/${params.type}`,
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
            return data
        })
        .catch((error) => {
            if(error?.response) return cbor.decode(error.response.data)
                else return error;
        });
        return reponse;
    }
}

export default new NoteRepository();
