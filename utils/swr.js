import { urlData } from "../context/MyProvider";
import useSWR from "swr"
import { fetcherData } from "./function";
import AuthRepository from "../repositories/AuthRepository";
import WorkspacesRepository from "../repositories/WorkspacesRepository";
import ProjectRepository from "../repositories/ProjectRepository";
import DocumentationRepository from "../repositories/DocumentationRepository";
import NoteRepository from "../repositories/NoteRepository";
import TaskRepository from "../repositories/TaskRepository"
import MomRepository from "../repositories/MomRepository";


export function useWorkspaces (type, xa) {
    const { data, error, isLoading, mutate } = useSWR([type, xa],([type, xa]) => {
        if(xa){
            return WorkspacesRepository.getWorkspace({type:Number(type), xa:xa})
        }else{
            return undefined
        }
    }, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateWorkspace:mutate
    }
}

export function useMomPoint (id) {
    const { data, error, isLoading, mutate } = useSWR(id, (id) => MomRepository.getPoint({xa:JSON.parse(localStorage.getItem("XA")), momID:id}), {
        revalidateIfStale:false, 
        revalidateOnFocus:false,
        revalidateOnReconnect:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutatePoint:mutate
    }
}


export function useErrorLogs (id, errorKnowledgeID) {
    const { data, error, isLoading, mutate } = useSWR(id || errorKnowledgeID ? `${urlData}/errorLogs?${id ? `id=${id}`:""}${errorKnowledgeID ? `&errorKnowledgeID=${errorKnowledgeID}`:""}`:null, fetcherData, {
        revalidateIfStale:false, 
        revalidateOnFocus:false,
        revalidateOnReconnect:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateIncidents:mutate
    }
}


export function useEnum(type, xa){
    const { data, error, isLoading, mutate } = useSWR([type, xa],([type, xa]) => AuthRepository.getEnum({type:type, xa:xa}), {
        revalidateIfStale:false, 
        revalidateOnFocus:false,
        revalidateOnReconnect:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateEnum:mutate
    }
}

export function useDetailWorkspace(id, xa){
    const { data, error, isLoading, mutate } = useSWR(['workspace', id], ([params, id]) => WorkspacesRepository.getWorkspaceByID({id:id, xa:xa}), {
        revalidateIfStale:false, 
        revalidateOnFocus:false,
        revalidateOnReconnect:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateWorkspace:mutate
    }
  }

export function useFindMembers(params){
    const { data, error, isLoading, mutate } = useSWR(params, (params) => AuthRepository.getFindMember(params), {
        revalidateIfStale:false, 
        revalidateOnFocus:false,
        revalidateOnReconnect:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateMember:mutate
    }
}


export function useProjects (type, xa, id) {
    const { data, error, isLoading, mutate } = useSWR(['projects', type, id], ([params, type, id]) => ProjectRepository.getProject({type:type, xa:xa, workspaceID:id}), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateProject:mutate
    }
}



export function useStatus (xa, id) {
    const { data, error, isLoading, mutate } = useSWR(["status", id],([params, id]) => TaskRepository.getStatusTask({xa:xa, id:id}), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateStatus:mutate
    }
}

export function useTask (xa, id) {
    const { data, error, isLoading, mutate } = useSWR(["task", id],([params, id]) => TaskRepository.getTask({xa:xa, id:id}), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateStatus:mutate
    }
}


export function useActivity (xa, id) {
    const { data, error, isLoading, mutate } = useSWR(["activity", id],([params, id]) => TaskRepository.getActivityTask({xa:xa, id:id}), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateStatus:mutate
    }
}


export function useDetailProject (xa, id) {
    const { data, error, isLoading, mutate } = useSWR(["projectsByID", id],([params, id]) => ProjectRepository.getProjectByID({xa:xa, id:id}), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateDetailProject:mutate
    }
}

export function useDocumentation (type, xa, id) {
    const { data, error, isLoading, mutate } = useSWR(["documentation", type, id], ([params, type, id]) => DocumentationRepository.getDocumentation({type:type, xa:xa, projectID:id}), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateDocumentation:mutate
    }
}

export function useNote (type, xa, id) {
    const { data, error, isLoading, mutate } = useSWR(["notes", type, id],([params, type, id]) => NoteRepository.getNote({type:type, xa:xa, projectID:id}), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateNote:mutate
    }
}

export function useMom (type, xa, id) {
    const { data, error, isLoading, mutate } = useSWR(["mom", type, id],([params, type, id]) => MomRepository.getMom({type:type, xa:xa, projectID:id}), {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale:false
    })

    if(!isLoading)
    return {
        data,
        error,
        isLoading,
        mutateMom:mutate
    }
}