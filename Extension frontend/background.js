chrome.storage.session.setAccessLevel({
  accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ blockedCokkiesArray: [] }, () => {
    console.log("Blocked Array Set");
  });
  chrome.storage.local.set({ dataToSend: ["arr1","arr2"] }, () => {
    console.log("data Array Set");  
});
});


console.log("backgerond script running")

chrome.tabs.onActivated.addListener(()=>{
  function getData(){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let icon ,url;
      try {
        icon = tabs[0].favIconUrl
        url = tabs[0].url;
        if(!url.includes("chrome://extensions/")){
          chrome.cookies.getAll({ url: url }, function (cks) {
   
            // console.log(cks, "Before cookies");
    
            // setting value in session storage
    
            chrome.storage.session
              .set({ icon: icon, url: url, cks: cks })
              .then(() => {
                // console.log(icon,url,cks,"Values set in session storage");
              });
    
    
            chrome.storage.local.get("blockedCokkiesArray").then((result) => {
              
              if (result.blockedCokkiesArray.length) {
              
                for (let i = 0; i < cks.length; i++) {
                  
                  for (let j = 0; j < result.blockedCokkiesArray.length; j++) {
                    
                    if (cks[i].name == result.blockedCokkiesArray[j].name && cks[i].domain == result.blockedCokkiesArray[j].domain) {
      
                      let data = {};
                      data.name = cks[i].name;
                      data.storeId = cks[i].storeId;
                      data.url = url;
                      
                      cks.splice(i, 1);
    
                      chrome.cookies.remove(data, function () {
    
                        // setting value in session storage
                        chrome.storage.session
                          .set({ icon: icon, url: url, cks: cks })
                      });
                    }
                  }
                }
              }
            });
          });
        }
      } catch (error) {
        // console.log(error)
      }
    });
  }

  setInterval(() => {
    getData()
  }, 5000);

  // chrome.storage.local.get("dataToSend").then((result) => {
  //   if(result.dataToSend[result.dataToSend.length-1] != null || result.dataToSend[result.dataToSend.length-1] != undefined){
  //     result.dataToSend.shift()
  //     result.dataToSend.push(url);
  //     chrome.storage.local
  //     .set({ dataToSend: result.dataToSend })
  //     .then(() => {
  //       console.log(
  //         "URL added to storage:",
  //         result.dataToSend
  //       );
  //     });
  //   } 
  // });
})

// let data = [];

// Generating panalist ID

// chrome.runtime.onInstalled.addListener(function () {
//   chrome.storage.local.get('panalistId', function (data) {
//     if (!data.panalistId) {
//       const panalistId = generateRandomID(60);
//       chrome.storage.local.set({ 'panalistId': panalistId }, function () {
//         console.log('Panalist ID created:', panalistId);
//       });
//     }
//   });
// });

// function generateRandomID(length) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   const idArray = [];

//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     const randomChar = characters.charAt(randomIndex);
//     idArray.push(randomChar);
//   }

//   return idArray.join('');
// }

// chrome.storage.local.get('panalistId', (data)=> {
//   let panalistId = data.panalistId
//   console.log('Panalist ID ', panalistId);
// });

// get ip Address

// function getIPAddress() {
//   const apiUrl = `https://httpbin.org/ip`;
//   fetch(apiUrl)
//     .then(response => response.json())
//     .then(data => {
//       const ipAddress = data.origin
//       console.log('IP Address:', ipAddress);
//     })
//     .catch(error => console.error('Error fetching IP address:', error));
// }

// getIPAddress();


// time stamp

// const currentTimestamp = new Date().getTime();

// console.log('Current Timestamp:', currentTimestamp);

// referrer --------- Not working

// chrome.webNavigation.onBeforeNavigate.addListener(async function (details) {
//   console.log(details)
//   const frame = await chrome.webNavigation.getFrame({ tabId: details.tabId, frameId: details.parentFrameId });

//   if (frame && frame.parentFrameId === -1 && frame.url) {
//     console.log('URL:', details.url);
//     console.log('Referrer:', frame.url);
//   }
// }, { url: [{ schemes: ['http', 'https'] }] });


// navigation method

// chrome.webNavigation.onCommitted.addListener((details) => {
//   console.log('details', details);
//   console.log('Navigation Method:', details.transitionType);
// }, { url: [{ schemes: ['http', 'https'] }] });

// user agent

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   (details) => {
//     // console.log(details)
//     for (const header of details.requestHeaders) {
//       if (header.name.toLowerCase() === 'user-agent') {
//         console.log('User-Agent:', header.value);
//         break;
//       }
//     }
//   },
//   { urls: ['<all_urls>'] },
//   ['requestHeaders']
// );


chrome.tabs.onActivated.addListener(()=>{
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = tabs[0].url;

    chrome.storage.local.get("dataToSend").then((result) => {
      // if(result.dataToSend[result.dataToSend.length-1] != null || result.dataToSend[result.dataToSend.length-1] != undefined){
        if(url != null || url != undefined){
        result.dataToSend.shift()
        result.dataToSend.push(url);
        chrome.storage.local
        .set({ dataToSend: result.dataToSend })
        .then(() => {
          console.log(
            "URL added to storage:",
            result.dataToSend
          );
        });
      } 
    });
  })
})

chrome.tabs.onUpdated.addListener(()=>{

  chrome.storage.local.get("dataToSend").then((result) => {
    let referrer = result.dataToSend[result.dataToSend.length-2];
    let current = result.dataToSend[result.dataToSend.length-1];
    
    console.log("referrer",referrer)
    console.log("current",current)
  });
}
)
