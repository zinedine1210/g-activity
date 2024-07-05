import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class WorkspacesRepository {
    async postWorkspace(params) {
        const paramsData = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/workspace`,
            paramsData,
            {
                headers: {
                    xa:params.xa
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
            else return error
        });
        return reponse;
    }

    async deleteWorkspace(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/workspace/${params.id}`,
            {
                headers:{
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType:"arraybuffer"
            }
        )
            .then((response) => {
                console.log(response)
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if(error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }
    


    async putWorkspace(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/workspace/${params.id}`,
            data,
            {
                headers:{
                    xa:params.xa
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
                else return error
            });
        return reponse;
    }

    async getWorkspaceByID(params){
        const reponse = await Repository.get(
            `${baseUrl}/workspace/d/${params.id}`,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType:"arraybuffer"
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

    async getWorkspace(params){
        const reponse = await Repository.get(
            `${baseUrl}/workspace/${params.type}`,
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
            else return error
        });
        return reponse;
    }
    

    // TEAM
    async postTeamWorkspace(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/workspace/${params.workspaceID}/team`,
            data,
            {
                headers: {
                    xa:params.xa
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
            else return error
        });
        return reponse;
    }


    async deleteTeam(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.delete(
            `${baseUrl}/workspace/${params.id}/team/rm`,
            {
                headers:{
                    xa:params.xa
                },
                data: data,
                contentType:"application/cbor",
                responseType:"arraybuffer"
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
            `${baseUrl}/workspace/${params.id}/team/${params.type}`,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType:"arraybuffer"
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


    async resendInvitation(params){
        const reponse = await Repository.get(
            `${baseUrl}/workspace/${params.workspaceID}/resend/${params.id}`,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType:"arraybuffer"
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

    async acceptInvitation(params){
        const reponse = await Repository.put(
            `${baseUrl}/workspace/${params.workspace_id}/accept/${params.id}`,
            null,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType:"arraybuffer"
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

export default new WorkspacesRepository();
