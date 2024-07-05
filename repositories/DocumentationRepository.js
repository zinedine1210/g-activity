import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class DocumentationRepository {
    async postDocumentation(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/documentation`,
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

    async deleteDocumentation(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/documentation/${params.id}`,
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
                return data
            })
            .catch((error) => {
                if(error?.response) return cbor.decode(error.response.data)
            else return error
            });
        return reponse;
    }

    async putDocumentation(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/documentation/${params.id}`,
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
                return data
            })
            .catch((error) => {
                if(error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async getDocumentationByID(params){
        const reponse = await Repository.get(
            `${baseUrl}/documentation/${params.id}`,
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
            else return error;
        });
        return reponse;
    }

    async getDocumentation(params){
        const reponse = await Repository.get(
            `${baseUrl}/documentation/${params.projectID}/${params.type}`,
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
            else return error;
        });
        return reponse;
    }

    // TEAM
    async postTeamDocumentation(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/documentation/${params.projectID}/${params.id}/team`,
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
            `${baseUrl}/documentation/${params.id}/team/rm`,
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
            `${baseUrl}/documentation/${params.id}/team/${params.type}`,
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
            else return error;
        });
        return reponse;
    }

    async postPageDocumentation(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/documentation/page`,
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
    
    async putPageDocumentation(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/documentation/page/${params.id}`,
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
                return data
            })
            .catch((error) => {
                if(error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async deletePageDocumentation(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.delete(
            `${baseUrl}/documentation/page`,
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
                return data
            })
            .catch((error) => {
                if(error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async getPageDocumentation(params){
        const reponse = await Repository.get(
            `${baseUrl}/documentation/${params.id}/page/list`,
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
            else return error;
        });
        return reponse;
    }

    async getPageDocumentationByID(params){
        const reponse = await Repository.get(
            `${baseUrl}/documentation/page/d/${params.id}`,
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
            else return error;
        });
        return reponse;
    }

}

export default new DocumentationRepository();
