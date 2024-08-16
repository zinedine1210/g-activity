import AuthRepository from "../repositories/AuthRepository";

export const generateId = () => {
    return Date.now().toString() + Math.random().toString().slice(2, 11);
}

export function getTimeDate(timestamp) {
    const Hours = new Date(timestamp).getHours().toString().padStart(2, '0')
    const Minute = new Date(timestamp).getMinutes().toString().padStart(2, '0')
    const date = `${Hours}:${Minute}`
    return date
}

export function timeUntil(epochTime) {
    const now = new Date();
    const futureDate = new Date(epochTime);
    const difference = futureDate - now;

    if (difference <= 0) {
        return "Time has passed";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (days > 3) {
        const tgl = futureDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: "numeric"
        });
        return tgl
    } else if (days > 0) {
        return `${days} day(s) later`;
    } else if (hours > 0) {
        return `${hours} hour(s) later`;
    } else if (minutes > 0) {
        return `${minutes} minute(s) later`;
    } else if (seconds > 0) {
        return `In a few seconds`;
    } else {
        return "Soon";
    }
}

export function getSizeWindow(type) {
    switch (type) {
        case 1:
            return "w-1/2"
        case 2:
            return "w-3/4"
        case 3:
            return "w-full"
        default:
            return ""
    }
}

export const getValue = value => {
    let epochTime = value; // Nilai epoch time yang ingin digunakan sebagai default value
    let date = new Date(epochTime); // Membuat objek Date berdasarkan epoch time
    let year = date.getFullYear(); // Mendapatkan tahun
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mendapatkan bulan (diubah menjadi string dan ditambahkan leading zero jika perlu)
    let day = date.getDate().toString().padStart(2, '0'); // Mendapatkan hari (diubah menjadi string dan ditambahkan leading zero jika perlu)
    let formattedDate = `${year}-${month}-${day}`; // Menggabungkan tahun, bulan, dan hari dalam format yyyy-mm-dd
    // console.log(formattedDate);
    return formattedDate
}

export function getLocaleTimeDate(timestamp) {
    const time = new Date(timestamp)
    const hari = time.toLocaleDateString("id-ID", { weekday: "long" })
    const tanggal = time.getDate()
    const bulan = time.toLocaleDateString("id-ID", { month: "long" })
    const tahun = time.getFullYear()

    return `${hari}, ${tanggal} ${bulan} ${tahun}`
}

export async function fetcherData(url) {
    const json = await fetch(url).then(res => res.json())
    // console.log(json);
    return json
}

export function getTimeAgo(timestamp) {
    const date = new Date(timestamp).getTime();
    const now = new Date().getTime();

    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
        return 'Just now';
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 30) {
        return `${days} days ago`;
    } else if (months < 12) {
        return `${months} months ago`;
    } else {
        return `${years} years ago`;
    }
}



function getMetadata() {
    console.log("ini get metadatanya")
    return new Promise(resolve => {
        webix.ajax().response("arraybuffer").get(`${api}/dms/mapping/${doctype}`).then(data => {
            let rspFile = CBOR.decode(data)
            resolve(rspFile)
        }).fail(err => {
            let rspFile = CBOR.decode(err)
            webix.message({
                type: rspFile['type'],
                text: rspFile['message']
            })
        })
    });
}

function uploadFileBase64(objImg) {
    let cb = CBOR.encode(objImg), bin = new Blob([cb])
    return new Promise(resolve => {
        view.$scope.app.getService("libs").easyHTTP('POST', `${api}/dmsv2/uploadfilebase64/${parentID}`, bin, async (err, resp) => {
            let response = await CBOR.decode(resp)
            resolve(response)
        })
    });
}

function setMetadata(resultUpload, rspFile, valD, objImg) {
    console.log("ini set metadata")
    console.log(valD)
    console.log(rspFile);
    console.log(resultUpload)
    let valuesUuid = resultUpload.uuid
    let imgName = objImg['imgName']
    let metadata = {}
    _ini.webix._fotoUrl = {}
    for (var o = 0; o < rspFile.metadata.length; o++) {
        for (var prop in rspFile.mapping) {
            if (rspFile.metadata[o].indexName == prop) {
                for (var prop2 in valD) {
                    if (rspFile.mapping[prop] == prop2) {
                        metadata[`${prop}`] = valD[prop2]
                    }
                }
            }
        }
    }
    valD.attachName = imgName
    valD.module = "Blogger"

    let refKey = {
        "id": "tmp",
        "module": moduleDMS,
        "name": `_${imgName}`,
    }

    let cb = CBOR.encode({
        'metadata': metadata,
        'doctype': doctype,
        'refKey': refKey
    }),
        bin = new Blob([cb]);
    return new Promise(resolve => {
        view.$scope.app.getService("libs").easyHTTP("PUT", `${api}/dmsv2/setmetadata/${valuesUuid}`, bin, (err, resp) => {
            let rspFile = CBOR.decode(resp)
            console.log("success set metadata")
            console.log(rspFile)
            webix.message({
                type: rspFile.type,
                text: rspFile.message
            })

            let sizeText = rspFile['data']['filestat']['size'] / 1024
            sizeText = sizeText.toFixed(2)

            // temp variable photo
            if (_ini.webix._fotoObj == undefined) {
                _ini.webix._fotoObj = []
            }
            _ini.webix._fotoObj.push(rspFile['data']['id'])
            _ini.webix._fotoUrl[imgName] = rspFile['data']['url']

            // // Update thumbnail
            // if (parentGrid.getSelectedId() != undefined) {
            //     let dataGrid = {}
            //     dataGrid[`_foto${comLength}`] = rspFile['data']['url']
            //     parentGrid.updateItem(parentGrid.getSelectedId().id, dataGrid)
            // }
            resolve(rspFile)
        })
    });
}

async function saveData() {
    let form = view.queryView({ localId: "blogger_post" }).queryView({ view: 'form' })
    let values = form.getValues({ hidden: false })
    form.disable()
    form.showProgress()
    console.log(values)
    const imgTags = values.content.match(/<img [^>]src="[^"]"[^>]*>/gm);
    const resultsObj = {};
    if (imgTags != null) {
        console.log('bawah result img')
        const getAllImgs = imgTags.map(x => x.replace(/.src="([^"])".*/, '$1'));
        const isImgLink = (url) => {
            return new Promise(resolve => {
                if (typeof url !== 'string') {
                    resolve(false);
                }
                resolve(url.match(/^http[^\?].(jpg|jpeg|gif|png|tiff|bmp)(\?(.))?$/gmi) !== null);
            })
        }

        console.log(getAllImgs)
        let resultGetMetadata = await getMetadata()
        console.log(resultGetMetadata)
        let i = 0;
        for (const val of getAllImgs) {
            let validationImg = await isImgLink(getAllImgs[i])
            console.log(validationImg == false)
            if (validationImg == false) {
                console.log(val);
                console.log(i)
                let objImg = { 'imgName': `img${i}`, 'imgData': btoa(getAllImgs[i]), "doctype": doctype }
                let resultUpload = await uploadFileBase64(objImg)
                let resultSetMetadata = await setMetadata(resultUpload, resultGetMetadata, values, objImg)
                console.log("dibawah upload file result");
                console.log(resultUpload)
                console.log("dibawah set metadata")
                console.log(resultSetMetadata)
                resultsObj[resultSetMetadata['data']['url']] = resultSetMetadata['data']['url']
                values['content'] = values['content'].replace(getAllImgs[i], resultSetMetadata['data']['url'])
            } else {
                resultsObj[getAllImgs[i]] = getAllImgs[i]
            }
            console.log(resultsObj)
            console.log(i)
            i++;
        }
        console.log("datanya adalah dibwhh obj imagenya")
        console.log(resultsObj)
    }

    values['img_src'] = resultsObj

    console.log(values)

    let methodHttp = 'POST', url = `${api}/blogger/post/${parentID}`
    if (parentGrid.getSelectedId() != undefined) {
        methodHttp = 'PUT'
        url += `/${parentGrid.getSelectedId().id}`
    }
    url += `?grandParentID=${grandParentID}`
    values['param'] = "G"
    let cb = CBOR.encode(values), bin = new Blob([cb]);
    view.$scope.app.getService("libs").easyHTTP(methodHttp, url, bin, (err, resp) => {
        let response = CBOR.decode(resp)
        console.log(response)
        webix.message({
            type: response.type,
            text: response.message
        })
        form.enable()
        form.hideProgress()
        if (response.status == 0) {
            form.clearValidation()
            if (parentGrid.getSelectedId() != undefined) {
                parentGrid.updateItem(response.data.id, response.data)
            } else {
                form.clear()
                parentGrid.add(response.data, 0)
            }
        }
    })
}

export function convertDate(item) {
    return new Date(item.epoch_time * 1000)
}

export function getTimeAgoFromIsoString(isoDate) {
    const date = new Date(isoDate).getTime(); // Mengonversi ISO 8601 ke timestamp
    const now = new Date().getTime();

    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
        return 'Just now';
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 30) {
        return `${days} days ago`;
    } else if (months < 12) {
        return `${months} months ago`;
    } else {
        return `${years} years ago`;
    }
}

export function convertDateString(dateString, type = "date") {
    const date = new Date(dateString);

    // Format untuk "datemonth" -> 14 Aug
    if (type === "datemonth") {
        const options = { day: '2-digit', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    }

    // Format untuk "datetime" -> 14 Aug, 3:05 PM
    if (type === "datetime") {
        const optionsDate = { day: '2-digit', month: 'short' };
        const formattedDate = date.toLocaleDateString('en-US', optionsDate);
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
        const formattedTime = date.toLocaleTimeString('en-US', optionsTime);
        return `${formattedDate}, ${formattedTime}`;
    }

    // Format untuk "dateyear" -> 23/11/22
    if (type === "dateyear") {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return date.toLocaleDateString('en-GB', options).replace(/-/g, '/');
    }

    // Format untuk "full" -> Rab, 23 Nov 2022, 14.34
    if (type === "full") {
        const optionsDate = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('id-ID', optionsDate);
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedTime = date.toLocaleTimeString('id-ID', optionsTime).replace('.', ':');
        return `${formattedDate}, ${formattedTime}`;
    }

    // Default case jika type tidak cocok
    return dateString;
}

export function convertDateMail(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    // Periksa apakah tanggalnya hari ini
    if (date.toDateString() === now.toDateString()) {
        // Return time (e.g., 3:05 PM)
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
        return date.toLocaleTimeString('en-US', optionsTime);
    }

    // Periksa apakah tanggalnya dalam tahun yang sama
    if (date.getFullYear() === now.getFullYear()) {
        // Return date with month in "day month" format (e.g., 8 May)
        const optionsDate = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-GB', optionsDate);
    }

    // Jika tanggalnya tidak dalam tahun yang sama
    // Return date in DD/MM/YY format (e.g., 18/09/23)
    const optionsDateYear = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return date.toLocaleDateString('en-GB', optionsDateYear).replace(/-/g, '/');
}


export const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes === 0) return '0 Byte';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(k));
    return parseFloat((sizeInBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
