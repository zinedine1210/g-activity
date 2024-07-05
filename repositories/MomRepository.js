import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class MomRepository {
    async postMom(params) {
        const reponse = await Repository.post(
            `${baseUrl}/mom`,
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

    async deleteMom(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/mom/${params.id}`,
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

    async putMom(params) {
        const reponse = await Repository.put(
            `${baseUrl}/mom/${params.id}`,
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

    async getMomByID(params){
        const reponse = await Repository.get(
            `${baseUrl}/mom/${params.id}`,
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

    async getMom(params){
        const reponse = await Repository.get(
            `${baseUrl}/mom/${params.projectID}/${params.type}`,
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
    async postTeamMom(params) {
        const reponse = await Repository.post(
            `${baseUrl}/mom_team/${params.projectID}/${params.id}`,
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
            `${baseUrl}/mom_team/rm/${params.id}`,
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

    async getTeam(params){
        // type 1 untuk list invited dan active member
        // type 2 untuk count list member
        const reponse = await Repository.get(
            `${baseUrl}/mom_team/${params.id}/${params.type}`,
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


    // POINT
    async postPoint(params) {
        const reponse = await Repository.post(
            `${baseUrl}/mom_point`,
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
    
    async deletePoint(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/mom_point/${params.id}`,
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

    async putMomPoint(params) {
        const reponse = await Repository.put(
            `${baseUrl}/mom_point/${params.id}`,
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

    async getPoint(params){
        const reponse = await Repository.get(
            `${baseUrl}/mom_point/${params.momID}`,
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

    // PARTICIPANTS

    async getParticipant(params){
        const reponse = await Repository.get(
            `${baseUrl}/mom_participant/${params.momID}`,
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

    async postParticipant(params) {
        const reponse = await Repository.post(
            `${baseUrl}/mom_participant`,
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
    
    async deleteParticipant(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/mom_participant/${params.id}`,
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

    async putParticipant(params) {
        const reponse = await Repository.put(
            `${baseUrl}/mom_participant/${params.id}`,
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
}

export default new MomRepository();
