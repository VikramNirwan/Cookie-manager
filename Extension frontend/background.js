chrome.storage.session.setAccessLevel({
  accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ blockedCokkiesArray: [] }, () => {
    console.log("Blocked Array Set");
  });
  chrome.storage.local.set({ dataToSend: ["arr1", "arr2"] }, () => {
    console.log("data Array Set");
  });
});

console.log("backgerond script running");

chrome.tabs.onActivated.addListener(() => {
  console.log("On activated On");

  // setting analytics

  chrome.storage.local.get(["analytics"]).then((result) => {
    if (result.analytics == true) {
      fn_accordian();
      console.log("Google Analytics running");
    }
  });

  function getData() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let icon, url;
      try {
        icon = tabs[0].favIconUrl;
        url = tabs[0].url;
        if (!url.includes("chrome://extensions/")) {
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
                    if (
                      cks[i].name == result.blockedCokkiesArray[j].name &&
                      cks[i].domain == result.blockedCokkiesArray[j].domain
                    ) {
                      let data = {};
                      data.name = cks[i].name;
                      data.storeId = cks[i].storeId;
                      data.url = url;

                      cks.splice(i, 1);

                      chrome.cookies.remove(data, function () {
                        // setting value in session storage
                        chrome.storage.session.set({
                          icon: icon,
                          url: url,
                          cks: cks,
                        });
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
    getData();
  }, 5000);
});


let obj = {};

// Generating panalist ID

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get("panalistId", function (data) {
    if (!data.panalistId) {
      const panalistId = generateRandomID(60);
      chrome.storage.local.set({ panalistId: panalistId }, function () {
        // obj.panalistId = panalistId;
        console.log("Panalist ID created:", panalistId);
      });
    }
  });
});

function generateRandomID(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const idArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomChar = characters.charAt(randomIndex);
    idArray.push(randomChar);
  }

  return idArray.join("");
}

chrome.tabs.onActivated.addListener(() => {
  console.log("On activated 2");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url;
    try {
      url = tabs[0].url;
      chrome.storage.local.get("dataToSend").then((result) => {
        if (url != null || url != undefined) {
          result.dataToSend.shift();
          result.dataToSend.push(url);

          chrome.storage.local
            .set({ dataToSend: result.dataToSend })
            .then(() => {
              console.log("URL added to storage:", result.dataToSend);
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
});

chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    console.log("On updated 2");

    chrome.storage.local.get("panalistId", function (result) {
      // console.log(result.panalistId)
      obj.panelID = result.panalistId
      console.log(obj)
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let url;
      try {
        url = tabs[0].url;
        if (url != null || url != undefined) {
          chrome.storage.local.get("dataToSend").then(async (result) => {

            obj.referrer = result.dataToSend[result.dataToSend.length - 1];;
            obj.url = url;
            
            console.log("Object", obj);

            const urlToSent = "http://localhost:3000/cookies";

            await fetch(urlToSent, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(obj),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((obj) => {
                console.log("Data sent successfully:", obj);

                result.dataToSend.shift();
                result.dataToSend.push(url);
                chrome.storage.local
                  .set({ dataToSend: result.dataToSend })
                  .then(() => {
                    console.log("URL added to storage:", result.dataToSend);
                  });
              })
              .catch((error) => {
                console.error(
                  "There was a problem with the POST request:",
                  error
                );
              });

          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
});

// Analytics function

function fn_accordian() {
  const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
  const MEASUREMENT_ID = `G-YPZJ7FLQTG`;
  const API_SECRET = `MKfNhdDJQvy1GoOOvCUWcA`;
  const DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;

  async function getOrCreateClientId() {
    const result = await chrome.storage.local.get("clientId");
    let clientId = result.clientId;
    if (!clientId) {
      clientId = self.crypto.randomUUID();
      await chrome.storage.local.set({ clientId });
    }
    return clientId;
  }

  const SESSION_EXPIRATION_IN_MIN = 30;

  async function getOrCreateSessionId() {
    let { sessionData } = await chrome.storage.session.get("sessionData");

    const currentTimeInMs = Date.now();
    if (sessionData && sessionData.timestamp) {
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000;

      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        sessionData = null;
      } else {
        sessionData.timestamp = currentTimeInMs;
        await chrome.storage.session.set({ sessionData });
      }
    }
    if (!sessionData) {
      sessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs.toString(),
      };
      await chrome.storage.session.set({ sessionData });
    }
    return sessionData.session_id;
  }

  async function otheranalytics() {
    fetch(
      `${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
      {
        method: "POST",
        body: JSON.stringify({
          // client_id: await getOrCreateSessionId(),
          client_id: await getOrCreateClientId(),
          events: [
            {
              name: "button_clicked",
              params: {
                session_id: await getOrCreateSessionId(),
                engagement_time_msec: DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
                id: "my-button",
              },
            },
          ],
        }),
      }
    );
  }
  otheranalytics();
}

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
