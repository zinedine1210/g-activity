import AuthRepository from "../repositories/AuthRepository";

export const generateId = () => {
    return Date.now().toString() + Math.random().toString().slice(2, 11);
}

export function getTimeDate(timestamp){
    const Hours = new Date(timestamp).getHours().toString().padStart(2, '0')
    const Minute = new Date(timestamp).getMinutes().toString().padStart(2, '0')
    const date = `${Hours}:${Minute}`
    
    return date
}

export function getSizeWindow(type){
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

export function getLocaleTimeDate(timestamp){
    const time = new Date(timestamp)
    const hari = time.toLocaleDateString("id-ID", {weekday:"long"})
    const tanggal = time.getDate()
    const bulan = time.toLocaleDateString("id-ID", {month:"long"})
    const tahun = time.getFullYear()

    return `${hari}, ${tanggal} ${bulan} ${tahun}`
}

export async function fetcherData(url){
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
      return 'Baru saja';
    } else if (minutes < 60) {
      return `${minutes} menit yang lalu`;
    } else if (hours < 24) {
      return `${hours} jam yang lalu`;
    } else if (days < 30) {
      return `${days} hari yang lalu`;
    } else if (months < 12) {
      return `${months} bulan yang lalu`;
    } else {
      return `${years} tahun yang lalu`;
    }
}

  

  function getMetadata(){
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

function uploadFileBase64(objImg){
let cb = CBOR.encode(objImg),bin = new Blob([cb])
return new Promise(resolve => {
view.$scope.app.getService("libs").easyHTTP('POST',`${api}/dmsv2/uploadfilebase64/${parentID}`,bin,async(err, resp) => {
    let response = await CBOR.decode(resp)                
    resolve(response)
})         
});         
}

function setMetadata(resultUpload, rspFile, valD, objImg){
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
    if(_ini.webix._fotoObj == undefined){
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

async function saveData(){
  let form = view.queryView({ localId: "blogger_post" }).queryView({view:'form'})
  let values = form.getValues({hidden:false})
  form.disable()
  form.showProgress()
  console.log(values)
  const imgTags = values.content.match(/<img [^>]src="[^"]"[^>]*>/gm);
  const resultsObj = {};        
  if(imgTags != null){
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
  if(validationImg == false){
      console.log(val);
      console.log(i)
      let objImg = {'imgName': `img${i}`, 'imgData':btoa(getAllImgs[i]), "doctype":doctype} 
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

  values['img_src'] =  resultsObj

  console.log(values)

  let methodHttp = 'POST',url = `${api}/blogger/post/${parentID}`
  if (parentGrid.getSelectedId() != undefined) {
  methodHttp = 'PUT'
  url += `/${parentGrid.getSelectedId().id}`
  }
  url += `?grandParentID=${grandParentID}`
  values['param'] = "G"
  let cb = CBOR.encode(values),bin = new Blob([cb]);
  view.$scope.app.getService("libs").easyHTTP(methodHttp,url,bin,(err, resp) => {
  let response = CBOR.decode(resp)
  console.log(response)
  webix.message({
  type: response.type,
  text: response.message
  })
  form.enable()
  form.hideProgress()
  if(response.status == 0){
  form.clearValidation()                      
  if (parentGrid.getSelectedId() != undefined) {
      parentGrid.updateItem(response.data.id, response.data)
  }else{
      form.clear()
      parentGrid.add(response.data, 0)
  }
  }
  })
}