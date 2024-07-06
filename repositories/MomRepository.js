import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class MomRepository {
    async postMom(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/mom`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer",
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data;
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async deleteMom(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/mom/${params.id}`,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async putMom(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/mom/${params.id}`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async getMomByID(params) {
        const reponse = await Repository.get(
            `${baseUrl}/mom/${params.id}`,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error;
            });
        return reponse;
    }

    async getMom(params) {
        const reponse = await Repository.get(
            `${baseUrl}/mom/${params.projectID}/${params.type}`,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error;
            });
        return reponse;
    }

    // TEAM
    async postTeamMom(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/mom_team/${params.projectID}/${params.id}`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer",
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data;
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }


    async deleteTeam(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.delete(
            `${baseUrl}/mom_team/rm/${params.id}`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async getTeam(params) {
        // type 1 untuk list invited dan active member
        // type 2 untuk count list member
        const reponse = await Repository.get(
            `${baseUrl}/mom_team/${params.id}/${params.type}`,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error;
            });
        return reponse;
    }


    // POINT
    async postPoint(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/mom_point`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer",
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data;
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async deletePoint(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/mom_point/${params.id}`,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async putMomPoint(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/mom_point/${params.id}`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async getPoint(params) {
        const reponse = await Repository.get(
            `${baseUrl}/mom_point/${params.momID}`,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error;
            });
        return reponse;
    }

    // PARTICIPANTS

    async getParticipant(params) {
        const reponse = await Repository.get(
            `${baseUrl}/mom_participant/${params.momID}`,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error;
            });
        return reponse;
    }

    async postParticipant(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/mom_participant`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer",
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data;
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async deleteParticipant(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/mom_participant/${params.id}`,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async putParticipant(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/mom_participant/${params.id}`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                contentType: "application/cbor",
                responseType: "arraybuffer"
            }
        )
            .then((response) => {
                const data = cbor.decode(response.data)
                return data
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }
}

export default new MomRepository();
