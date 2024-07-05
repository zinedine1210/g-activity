import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class ProjectRepository {
    async postProject(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/project`,
            data,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType : "arraybuffer"
                
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

    async putProject(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/project/${params.id}`,
            data,
            {
                headers:{
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType : "arraybuffer"
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

    async deleteProject(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/project/${params.id}`,
            {
                headers:{
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType : "arraybuffer"
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

    async getProjectByID(params){
        const reponse = await Repository.get(
            `${baseUrl}/project/${params.id}`,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType : "arraybuffer"
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

    async getProject(params){
        const reponse = await Repository.get(
            `${baseUrl}/project/${params.workspaceID}/${params.type}`,
            {
                headers: {
                    xa: params.xa
                },
                contentType:"application/cbor",
                responseType : "arraybuffer"
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
    async postTeamProject(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/project/${params.workspaceID}/${params.id}/team`,
            data,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType : "arraybuffer"
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
            `${baseUrl}/project/${params.id}/team/rm`,
            {
                headers:{
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType : "arraybuffer",
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
            `${baseUrl}/project/${params.id}/team/${params.type}`,
            {
                headers: {
                    xa:params.xa
                },
                contentType:"application/cbor",
                responseType : "arraybuffer"
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

export default new ProjectRepository();
