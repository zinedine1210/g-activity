import Repository, { baseUrl } from './Repository';
import cbor from 'cbor';

class TaskRepository {
    async postTask(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/task`,
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
                return data;
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async deleteTask(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/task/${params.id}`,
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

    async putTask(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/task/${params.id}`,
            data,
            {
                headers: {
                    xa: params.xa
                },
                responseType: "arraybuffer",
                contentType: "application/cbor"
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

    async getTaskByID(params) {
        const reponse = await Repository.get(
            `${baseUrl}/task/d/${params.id}`,
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

    async getTask(params) {
        const reponse = await Repository.get(
            `${baseUrl}/task/l/${params.id}`,
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
                // console.log(error)
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    // Task Status
    async postStatusTask(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/task_status`,
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
                console.log(data)
                return data;
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }

    async putStatusTask(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.put(
            `${baseUrl}/task_status/${params.id}`,
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

    async deleteStatus(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/task_status/${params.id}`,
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

    async getStatusTask(params) {
        const reponse = await Repository.get(
            `${baseUrl}/task_status/${params.id}`,
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

    // Task Activity
    async getActivityTask(params) {
        const reponse = await Repository.get(
            `${baseUrl}/task_activity/${params.id}`,
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

    async deleteActivity(params) {
        const reponse = await Repository.delete(
            `${baseUrl}/task_activity/${params.id}`,
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


    async postActivityTask(params) {
        const data = cbor.encode(params.data)
        const reponse = await Repository.post(
            `${baseUrl}/task_activity`,
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
                return data;
            })
            .catch((error) => {
                if (error?.response) return cbor.decode(error.response.data)
                else return error
            });
        return reponse;
    }
}

export default new TaskRepository();
