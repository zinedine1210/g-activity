import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class NoteRepository {
    async postNote(params) {
        const reponse = await Repository.post(
            `${baseUrl}/note`,
            params.data,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data;
        })
        .catch((error) => {
            return error.response.data
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
                contentType:"application/cbor"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                return error.response.data
            });
        return reponse;
    }

    async putNote(params) {
        const reponse = await Repository.put(
            `${baseUrl}/note/${params.id}`,
            params.data,
            {
                headers:{
                    xa:params.xa
                },
                contentType:"application/cbor"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                return error.response.data
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
                contentType:"application/cbor"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data
        })
        .catch((error) => {
            return error.response.data;
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
                contentType:"application/cbor"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data
        })
        .catch((error) => {
            return error.response.data;
        });
        return reponse;
    }

    // TEAM
    async postTeamNote(params) {
        const reponse = await Repository.post(
            `${baseUrl}/note/${params.projectID}/${params.id}/team`,
            params.data,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data;
        })
        .catch((error) => {
            return error.response.data
        });
        return reponse;
    }


    async deleteTeam(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/note/${params.id}/team/rm`,
            {
                headers:{
                    xa:params.xa
                },
                contentType:"application/cbor",
                data:params.data
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                return error.response.data
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
                contentType:"application/cbor"
            }
        )
        .then((response) => {
            const data = cbor.decode(response.data)
            return data
        })
        .catch((error) => {
            return error.response.data;
        });
        return reponse;
    }
}

export default new NoteRepository();
