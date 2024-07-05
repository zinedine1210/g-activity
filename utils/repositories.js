import { urlData } from "../context/MyProvider";
import { generateId } from "./function";

export async function handlerAddRecord(urutan, mom){
    let obj = {
        "momID": mom.id,
        "urutan":urutan + 1,
        "id": generateId(),
        "content":[]
    }

    mom.header.forEach((val, key) => {
        let content = {
            pointID:obj.id,
            headerID:val.id
        }
        if(val.type == "mention"){
            content.value = []
        }else{
            content.value = null
        }
        obj.content.push(content)
    });

    const result = await fetch(`${urlData}/momPoint`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/cbor'
        },
        body: JSON.stringify(obj)
    }).then(res => {
        return res.json()
    })

    return result
}

export async function handlerDeleteRecord(value){
    const result = await fetch(`${urlData}/momPoint/${value.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/cbor'
        }
    }).then(res => {
        return res.json()
    })

    return result
}


export async function handlerPutRecord(value){
    const result = await fetch(`${urlData}/momPoint/${value.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/cbor'
        },
        body:JSON.stringify(value)
    }).then(res => res.json())

    return result
}


export async function handlerPutMOM(value){
    const result = await fetch(`${urlData}/mom/${value.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/cbor'
        },
        body: JSON.stringify(value)
    }).then(res => {
        return res.json()
    })

    return result
}


// ERROR LOGS
export async function handlerAddErrorLogs(value){
    const result = await fetch(`${urlData}/errorLogs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/cbor'
        },
        body: JSON.stringify(value)
    }).then(res => {
        return res.json()
    })

    return result
}   

export async function handlerDeleteErrorLogs(value){
    const result = await fetch(`${urlData}/errorLogs/${value.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/cbor'
        }
    }).then(res => {
        return res.json()
    })

    return result
}

export async function handlerPutErrorLogs(value){
    const result = await fetch(`${urlData}/errorLogs/${value.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/cbor'
        },
        body:JSON.stringify(value)
    }).then(res => res.json())

    return result
}


// Errorknowledge
export async function handlerPutErrorKnowledge(value){
    const result = await fetch(`${urlData}/errorKnowledge/${value.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/cbor'
        },
        body:JSON.stringify(value)
    }).then(res => res.json())

    return result
}