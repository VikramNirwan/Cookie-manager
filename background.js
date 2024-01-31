chrome.storage.session.setAccessLevel({
  accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ blockedCokkiesArray: [] }, () => {
    // console.log("Blocked Array Set");
  });
});

// chrome.runtime.onMessage.addListener(function (request) {
//   if (request.action === "getTabDetails") {
    // setInterval(() => {
    //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //     let icon = tabs[0].favIconUrl;
    //     // console.log(icon)
    //     let url = tabs[0].url;
    //     chrome.cookies.getAll({ url: url }, async function (cks) {
    //       // console.log(cks, "Before cookies");
  
    //       // setting value in session storage
  
    //       chrome.storage.session
    //         .set({ icon: icon, url: url, cks: cks })
    //         .then(() => {
    //           // console.log(icon,url,cks,"Values set in session storage");
    //         });
  
    //       // console.log(cks, "when block not available after all cookies");
  
    //       // let ckss;
    //       // Setting values for blocked cookies
  
    //       chrome.storage.local.get("blockedCokkiesArray").then((result) => {
    //         // console.log(result.blockedCokkiesArray, "result.blockedCokkiesArray");
    //         // console.log(result.blockedCokkiesArray.length); // returns Array
    //         if (result.blockedCokkiesArray.length) {
    //           // console.log("Working 1")
    //           for (let i = 0; i < cks.length; i++) {
    //             // console.log(cks[i].name)
    //             for (let j = 0; j < result.blockedCokkiesArray.length; j++) {
    //               // console.log(result.blockedCokkiesArray[j].name)
    //               if (cks[i].name == result.blockedCokkiesArray[j].name && cks[i].domain == result.blockedCokkiesArray[j].domain) {
    //                 // console.log(cks[i].name, "cks[i].name", cks[i].domain, "cks[i].domain");
    //                 // console.log(
    //                 //   result.blockedCokkiesArray[j].name,
    //                 //   "result.blockedCokkiesArray[j].name", result.blockedCokkiesArray[j].domain, "result.blockedCokkiesArray[j].domain"
    //                 // );
    //                 // console.log("Working 4");
    //                 let data = {};
    //                 data.name = cks[i].name;
    //                 data.storeId = cks[i].storeId;
    //                 data.url = url;
                    
    //                 cks.splice(i, 1);
  
    //                 chrome.cookies.remove(data, function () {
    //                   // console.log(data.name, "cookie removed");
  
                      
    //                   // setting value in session storage
    //                   chrome.storage.session
    //                     .set({ icon: icon, url: url, cks: cks })
    //                     .then(() => {
    //                       // console.log(
    //                       //   // icon,
    //                       //   // url,
    //                       //   // cks,
    //                       //   "Values set in session storage"
    //                       // );
    //                       // console.log(cks, "available after all cookies");
    //                     });
    //                 });
    //               }
    //             }
    //           }
    //         }
    //         //  else {
    //         //   // setting value in session storage
  
    //         //   chrome.storage.session
    //         //     .set({ icon: icon, url: url, cks: cks })
    //         //     .then(() => {
    //         //       // console.log(icon,url,cks,"Values set in session storage");
    //         //     });
  
    //         //   console.log(cks, "when block not available after all cookies");
    //         // }
    //       });
    //     });
    //   });
    //   return true;
    // }, 5000); 
//   }
// });

chrome.tabs.onActivated.addListener(()=>{
  setInterval(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let icon = tabs[0].favIconUrl;
      // console.log(icon)
      let url = tabs[0].url;
      chrome.cookies.getAll({ url: url }, async function (cks) {
        // console.log(cks, "Before cookies");

        // setting value in session storage

        chrome.storage.session
          .set({ icon: icon, url: url, cks: cks })
          .then(() => {
            // console.log(icon,url,cks,"Values set in session storage");
          });


        chrome.storage.local.get("blockedCokkiesArray").then((result) => {
          // console.log(result.blockedCokkiesArray, "result.blockedCokkiesArray");
          // console.log(result.blockedCokkiesArray.length); // returns Array
          if (result.blockedCokkiesArray.length) {
            // console.log("Working 1")
            for (let i = 0; i < cks.length; i++) {
              // console.log(cks[i].name)
              for (let j = 0; j < result.blockedCokkiesArray.length; j++) {
                // console.log(result.blockedCokkiesArray[j].name)
                if (cks[i].name == result.blockedCokkiesArray[j].name && cks[i].domain == result.blockedCokkiesArray[j].domain) {
                  // console.log(cks[i].name, "cks[i].name", cks[i].domain, "cks[i].domain");
                  // console.log(
                  //   result.blockedCokkiesArray[j].name,
                  //   "result.blockedCokkiesArray[j].name", result.blockedCokkiesArray[j].domain, "result.blockedCokkiesArray[j].domain"
                  // );
                  // console.log("Working 4");
                  let data = {};
                  data.name = cks[i].name;
                  data.storeId = cks[i].storeId;
                  data.url = url;
                  
                  cks.splice(i, 1);

                  chrome.cookies.remove(data, function () {
                    // console.log(data.name, "cookie removed");

                    
                    // setting value in session storage
                    chrome.storage.session
                      .set({ icon: icon, url: url, cks: cks })
                      .then(() => {
                        // console.log(
                        //   // icon,
                        //   // url,
                        //   // cks,
                        //   "Values set in session storage"
                        // );
                        // console.log(cks, "available after all cookies");
                      });
                  });
                }
              }
            }
          }
          //  else {
          //   // setting value in session storage

          //   chrome.storage.session
          //     .set({ icon: icon, url: url, cks: cks })
          //     .then(() => {
          //       // console.log(icon,url,cks,"Values set in session storage");
          //     });

          //   console.log(cks, "when block not available after all cookies");
          // }
        });
      });
    });
    return true;
  }, 5000); 
})

let data = [];

// Generating panalist ID

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get('panalistId', function (data) {
    if (!data.panalistId) {
      const panalistId = generateRandomID(60);
      chrome.storage.local.set({ 'panalistId': panalistId }, function () {
        console.log('Panalist ID created:', panalistId);
      });
    }
  });
});

function generateRandomID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const idArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters.charAt(randomIndex);
    idArray.push(randomChar);
  }

  return idArray.join('');
}

chrome.storage.local.get('panalistId', (data)=> {
  let panalistId = data.panalistId
  console.log('Panalist ID ', panalistId);
});

// get ip Address

function getIPAddress() {
  const apiUrl = `https://httpbin.org/ip`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const ipAddress = data.origin
      console.log('IP Address:', ipAddress);
    })
    .catch(error => console.error('Error fetching IP address:', error));
}

getIPAddress();


// time stamp

const currentTimestamp = new Date().getTime();

console.log('Current Timestamp:', currentTimestamp);

// referrer

