var buildUrl = function (domain, path, realUrl) {
  var secure = realUrl.indexOf("https://") === 0;
  // console.log(domain)
  if (domain.substr(0, 1) === ".") {
    domain = domain.substring(1);
  }
  return "http" + (secure ? "s" : "") + "://" + domain + path;
};

// Buttons
const searchBar = document.querySelector("#SearchBar");
const accordion_drop_button = document.querySelector("#accordion_drop_button");
const addCookieBtn = document.querySelector("#addCookieBtn");
const delAllBtn = document.querySelector("#DeleteAllBtn");
const blockedBtn = document.querySelector("#BlockedBtn");
const allowBtn = document.getElementById("userConsent_allowButton");
const rejectBtn = document.getElementById("userConsent_rejectButton");
const menuBtn = document.getElementById("menuIcon");
const crossBtn = document.getElementById("privacyCross");
const analyticsBtn = document.getElementById("analyticsBtn");

// let url;
let cookietoshow_array = [];

chrome.storage.local.get(["concent"]).then((result) => {
  if (result.concent == true) {
    userConsent.style.display = "none";
    chrome.storage.local.get(["analytics"]).then((result) => {
      if (result.analytics == true) {
        analyticsBtn.checked = true;
        fn_accordian();
      } else {
        analyticsBtn.checked = false;
      }
    });
  } else if (result.concent == false) {
    userConsent.style.display = "none";
  }
});

//----------------------------------------------------------- Allow button setting

allowBtn.addEventListener("click", () => {
  chrome.storage.local.set({ concent: true }).then(() => {
    userConsent.style.display = "none";
    // Setting analytics button initially
    chrome.storage.local.set({ analytics: true }).then(() => {
      analyticsBtn.checked = true;
      fn_accordian();
    });
  });
  window.close();
});

//----------------------------------------------------------- Reject button setting

rejectBtn.addEventListener("click", () => {
  chrome.storage.local.set({ concent: false }).then(() => {
    userConsent.style.display = "none";
    // analyticsBtn.checked = false;
  });
});

chrome.storage.session.get(["icon", "url", "cks"]).then((result) => {

  if(!result.cks){
    document.querySelector(".main").innerHTML="<h3>Please click popup again</h3>"
  }else{
    document.querySelector("#NavUrl").innerHTML = `
      <div class="d-flex" style="height:50px;">
      <img
          src=${result.icon}
          alt="Logo"
          width="30"
          height="30"
          style="position: relative;left: 15px;top: 10px;"
        /><p style="text-align: start;
        margin-left: 30px;
        margin-top: 0px;
        overflow: hidden;
        height: 50px;
        width: 403px;">${result.url}</p>
      </div>
      `;

  let ckss = result.cks;

  // console.log(ckss, "After All cookies");
  // console.log(cks.length,"Length before All cookies")

  cookietoshow_array = JSON.parse(JSON.stringify(ckss));

  if(ckss.length>0){
    displayCookies(ckss);
  }else{
    document.querySelector(
      ".cookeiAccordian #accordionFlushExample"
    ).innerHTML = "<h3>No cookies</h3>"
  }
  // console.log(searchBar, "searchBar");

  //------------------------------manipulating Search Bar

  searchBar.addEventListener("input", () => {
    if (searchBar.value === "") {
      displayCookies(ckss);
    } else {
      for (let i = cookietoshow_array.length - 1; i >= 0; i--) {
        if (
          !cookietoshow_array[i].name
            .toLowerCase()
            .includes(searchBar.value.toLowerCase())
        ) {
          cookietoshow_array.splice(i, 1);
        }
      }
      // console.log(cks,"cks");
      displayCookies(cookietoshow_array);
    }
    cookietoshow_array = JSON.parse(JSON.stringify(ckss));
  });

  let cookies = document.querySelectorAll(".accordion-item");
  console.log(cookies);

  // ---------------------------------------------- Edit cookie
  cookies.forEach((value, id) => {
    value.addEventListener("click", () => {
      value.querySelector("#accSaveBtn").addEventListener("click", () => {
        let text = "Save changes";
        if (confirm(text) == true) {
          let data = {};
          data.name = value.querySelector("#cookieName").value;
          data.domain = value.querySelector("#cookieDomain").value;
          data.value = value.querySelector("#cookieValue").value;
          data.path = value.querySelector("#cookiePath").value;

          let date = value.querySelector("#cookieExpiration").value;
          data.expirationDate = new Date(date).getTime();
          console.log(data.expirationDate);
          // data.expirationDate = date.getTime()
          // console.log(exDate)
          data.sameSite = value.querySelector("#cookieSameSite").value;

          // let hostonly = value.querySelector("#hostOnly")
          // data.hostOnly = hostonly.checked?true:false

          let httponly = value.querySelector("#httpOnly");
          data.httpOnly = httponly.checked ? true : false;

          let Secure = value.querySelector("#secure");
          data.secure = Secure.checked ? true : false;

          // let Session = value.querySelector("#session")
          // data.session = Session.checked?true:false

          data.url = buildUrl(data.domain, data.path, result.url);
          console.log(data);

          chrome.cookies.set(data, function () {
            console.log(data);
          });

          value.style.display = "none";
        }
      });
    });
  });

  // ---------------------------     Block Cookie

  cookies.forEach((value, id) => {
    value.addEventListener("click", () => {
      value.querySelector("#accBlockBtn").addEventListener("click", () => {
        let text = "Do you want to block this cookie";

        if (confirm(text) == true) {
          let obj = {
            name: value.querySelector("#cookieName").value
              ? value.querySelector("#cookieName").value
              : "",
            domain: value.querySelector("#cookieDomain").value
              ? value.querySelector("#cookieDomain").value
              : "",
            // value:value.querySelector("#cookieValue").value?value.querySelector("#cookieValue").value: ""
          };

          chrome.storage.local.get("blockedCokkiesArray").then((result) => {
            result.blockedCokkiesArray.push(obj);
            chrome.storage.local
              .set({ blockedCokkiesArray: result.blockedCokkiesArray })
              .then(() => {
                console.log(
                  "Object added to storage:",
                  result.blockedCokkiesArray
                );
              });
          });

          let data = {};
          data.name = value.querySelector("#cookieName").value;
          data.storeId = value.querySelector("#cookieStoreId").value;
          data.url = result.url;

          chrome.cookies.remove(data, function () {
            console.log(data.name, "cookie removed");
          });

          value.style.display = "none";
        }
      });
    });
  });

  // -------------------------------------- Delete a single Cookie

  cookies.forEach((value, id) => {
    value.addEventListener("click", () => {
      value.querySelector("#accDeleteBtn").addEventListener("click", () => {
        let text = "Do you want to block this cookie";

        if (confirm(text) == true) {
          let data = {};
          data.name = value.querySelector("#cookieName").value;
          data.storeId = value.querySelector("#cookieStoreId").value;
          data.url = result.url;

          chrome.cookies.remove(data, function () {
            console.log(data.name, "cookie removed");
          });
          value.style.display = "none";
        }
      });
    });
  });

  // ------------------------------ Delete all the cookies  ---------------------------------
  delAllBtn.addEventListener("click", () => {
    let text = "Do you want delete all the cookies";
    if (confirm(text) == true) {
      cookies.forEach((value) => {
        let data = {};
        data.name = value.querySelector("#cookieName").value;
        data.storeId = value.querySelector("#cookieStoreId").value;
        data.url = result.url;
        document.querySelector(".cookeiAccordian").style.display = "none";
        chrome.cookies.remove(data, function () {
          console.log(data.name, "cookie removed");
        });
      });
    }
  });

  //--------------------------------- Add cookie ------------------------------------------------

  let isAddLayoutVisible = false;

  addCookieBtn.addEventListener("click", () => {
    isAddLayoutVisible = !isAddLayoutVisible;

    document.querySelector(
      ".cookeiAccordian #accordionFlushExample"
    ).style.display = isAddLayoutVisible ? "none" : "block";

    // document.querySelector(
    //   ".blockedCookieForm #accordionFlushExample"
    // ).style.display = isAddLayoutVisible ? "none" : "block";

    let layOut = document.querySelector(
      ".addCookieForm #accordionFlushExample"
    );
    layOut.innerHTML = "";

    if (isAddLayoutVisible) {
      layOut.innerHTML += `
              <div class="accordion-item" id="accordion-item">
          
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text fw-semibold"  style="width: 100px" >Name:</span>
                    <input type="text" class="form-control" id="cookieName" aria-describedby="addon-wrapping">
                  </div>
          
                  <div class="input-group">
                    <span class="input-group-text fw-semibold" style="width: 100px" >Value:</span>
                    <textarea class="form-control" id="cookieValue"></textarea>
                  </div>
          
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text fw-semibold" style="width: 100px" >Domain:</span>
                    <input type="text" class="form-control" id="cookieDomain">
                  </div>
          
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text fw-semibold" style="width: 100px" >Path:</span>
                    <input type="text" class="form-control" id="cookiePath">
                  </div>
          
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text fw-semibold" style="width: 100px" >Expiration:</span>
                    <textarea class="form-control" id="cookieExpiration">Day Month dd yyyy 12:00:00</textarea>
                  </div>
          
                  <div class="input-group flex-nowrap">
                    <span class="input-group-text fw-semibold" style="width: 100px" >Same Site:</span>
                    <input type="text" class="form-control" id="cookieSameSite">
                  </div>
                  
                  <div class="d-flex justify-content-around">
                  <form class="setting">
                  <label for="hostOnly" class="switch-label">Host Only</label>
                  <input type="checkbox" id="hostOnly" name="hostOnly"  class="switch-input"/>
                 </form>
          
                 <form class="setting">
                  <label for="httpOnly" class="switch-label">Http Only</label>
                  <input type="checkbox" id="httpOnly" name="httpOnly" class="switch-input"/>
                 </form>
          
                 <form class="setting">
                  <label for="secure" class="switch-label">Secure</label>
                  <input type="checkbox" id="secure" name="secure" class="switch-input"/>
                 </form>
          
                 <form class="setting">
                  <label for="session" class="switch-label">Session</label>
                  <input type="checkbox" id="session" name="session" class="switch-input"/>
                 </form>
                  </div>
                
                 <div class="d-flex justify-content-around ">
                  <button type="button" id="addSaveBtn" class="btn btn-success btn-sm m-2">Save</button>
                 </div>
                  
              </div>
              `;
    }
    let save = document.getElementById("addSaveBtn");
    save.addEventListener("click", () => {
      let data = {};
      data.name = layOut.querySelector("#cookieName").value;
      data.domain = layOut.querySelector("#cookieDomain").value;
      data.value = layOut.querySelector("#cookieValue").value;
      data.path = layOut.querySelector("#cookiePath").value;

      let date = layOut.querySelector("#cookieExpiration").value;
      data.expirationDate = new Date(date).getTime() / 1000;
      // data.expirationDate = layOut.querySelector("#cookieExpiration").value
      // data.expirationDate = date.getTime()
      // console.log(exDate)
      data.sameSite = layOut.querySelector("#cookieSameSite").value;

      // let hostonly = layOut.querySelector("#hostOnly")
      // data.hostOnly = hostonly.checked?true:false

      let httponly = layOut.querySelector("#httpOnly");
      data.httpOnly = httponly.checked ? true : false;

      let Secure = layOut.querySelector("#secure");
      data.secure = Secure.checked ? true : false;

      // let Session = layOut.querySelector("#session")
      // data.session = Session.checked?true:false

      data.url = buildUrl(data.domain, data.path, result.url);
      // console.log(data)

      try {
        console.log("Sent data", data);
        chrome.cookies.set(data, function () {
          console.log(data);
          alert("Save Success", "success", 2000);
          // chrome.cookies.getAll({url:url},function(cks){
          //   displayCookies(cks);
          // });
        });
      } catch (error) {
        alert("Failed to Add Cookie, Please Recheck");
        console.error(error);
      }
    });
  });
  }
});

//--------------------------------- Blocked cookie --------------------------------------------------

let isBlockedLayoutVisible = false;

blockedBtn.addEventListener("click", () => {
  isBlockedLayoutVisible = !isBlockedLayoutVisible;

  document.querySelector(
    ".cookeiAccordian #accordionFlushExample"
  ).style.display = isBlockedLayoutVisible ? "none" : "block";

  // document.querySelector(
  //   ".addCookieForm #accordionFlushExample"
  // ).style.display = isBlockedLayoutVisible ? "none" : "block";

  let blockedLayout = document.querySelector(
    ".blockedCookieForm #accordionFlushExample"
  );

  if (isBlockedLayoutVisible) {
    blockedLayout.style.display = "block";

    chrome.storage.local.get("blockedCokkiesArray").then((result) => {
      let array = result.blockedCokkiesArray;
      if(array.length>0){
        displayBlockedCookies(array);
        console.log(array, "array");
      }else{
        blockedLayout.innerHTML = "<h3>No cookies are blocked</h3>"
      }

      let blockedArray = document.querySelectorAll(".blockedCookieForm #accordionFlushExample .accordion-item");
      console.log(blockedArray, "blockedArray");

      blockedArray.forEach((value, id) => {
        value.querySelector("#unblockBtn").addEventListener("click", () => {
          let name = value.querySelector("#blockName").value;
          let domain = value.querySelector("#blockDomain").value;
          // console.log(name, domain, "name and domain");
          // console.log(array)
          for (i = 0; i < array.length; i++) {
            if (name == array[i].name && domain == array[i].domain) {
              console.log(name, domain, "name and domain");
              console.log(
                array[i].name,
                array[i].domain,
                "array name and domain"
              );
              array.splice(i, 1);
              console.log(array, "spliced array");
              chrome.storage.local
                .set({ blockedCokkiesArray: array })
                .then(() => {
                  console.log(array, "Modified Array");
                  value.style.display = "none"
                });
            }
          }
        });
      });
    });
  } else {
    blockedLayout.style.display = "none";
  }

  // blockedLayout.style.display = isBlockedLayoutVisible ? "block" : "none";
});

// -----------------------------      Functions for display cookies
function displayCookies(cookies) {
  // Build the HTML string
  let accordionHTML = "";

  cookies.forEach(function (cookie, id) {
    let date = cookie.expirationDate;
    let expirationDate = new Date(date * 1000);

    let checkHostOnly = cookie.hostOnly ? "checked" : "";
    let checkHttponly = cookie.httpOnly ? "checked" : "";
    let checkSecure = cookie.secure ? "checked" : "";
    let checkSession = cookie.session ? "checked" : "";

    accordionHTML += `
    <div class="accordion-item" id="accordion-item${id + 1} "">
    <h2 class="accordion-header" "">
      <button id="accordion_drop_button${
        id + 1
      }" class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne${
      id + 1
    }" aria-expanded="false" aria-controls="flush-collapseOne${id + 1}">
      ${cookie.domain} | ${cookie.name}
      </button>
    </h2>
    <div id="flush-collapseOne${
      id + 1
    }" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample" >

      <div class="input-group flex-nowrap" style="width: 469px";>
        <span class="input-group-text fw-semibold"  style="width: 100px" >Name:</span>
        <input type="text" class="form-control" id="cookieName" aria-describedby="addon-wrapping" value=${
          cookie.name
        } readonly>
      </div>

      <div class="input-group" style="width: 469px">
        <span class="input-group-text fw-semibold" style="width: 100px" >Value:</span>
        <textarea class="form-control" id="cookieValue">${
          cookie.value
        }</textarea>
      </div>

      <div class="input-group flex-nowrap" style="width: 469px">
        <span class="input-group-text fw-semibold" style="width: 100px" >Domain:</span>
        <input type="text" class="form-control" id="cookieDomain" value=${
          cookie.domain
        }>
      </div>

      <div class="input-group flex-nowrap" style="width: 469px">
        <span class="input-group-text fw-semibold" style="width: 100px" >Path:</span>
        <input type="text" class="form-control" id="cookiePath" value=${
          cookie.path
        }>
      </div>

      <div class="input-group flex-nowrap" style="width: 469px">
        <span class="input-group-text fw-semibold" style="width: 100px" >Expiration:</span>
        <textarea class="form-control" id="cookieExpiration">${expirationDate}</textarea>
      </div>

      <div class="input-group flex-nowrap" style="width: 469px">
        <span class="input-group-text fw-semibold" style="width: 100px" >Same Site:</span>
        <input type="text" class="form-control" id="cookieSameSite" value=${
          cookie.sameSite
        }>
      </div>

      <div class="input-group flex-nowrap" style="width: 469px">
        <span class="input-group-text fw-semibold" style="width: 100px" >Store Id:</span>
        <input type="text" class="form-control" id="cookieStoreId" value=${
          cookie.storeId
        } readonly>
      </div>
      
      <div class="d-flex justify-content-around" style="width: 469px">
      <form class="setting">
      <label for="hostOnly" class="switch-label">Host Only</label>
      <input type="checkbox" id="hostOnly" ${checkHostOnly} name="hostOnly"  class="switch-input"/>
     </form>

     <form class="setting">
      <label for="httpOnly" class="switch-label">Http Only</label>
      <input type="checkbox" id="httpOnly" ${checkHttponly} name="httpOnly" class="switch-input"/>
     </form>

     <form class="setting">
      <label for="secure" class="switch-label">Secure</label>
      <input type="checkbox" id="secure" ${checkSecure} name="secure" class="switch-input"/>
     </form>

     <form class="setting">
      <label for="session" class="switch-label">Session</label>
      <input type="checkbox" id="session" ${checkSession} name="session" class="switch-input"/>
     </form>
      </div>
    
     <div class="d-flex justify-content-around " style="width: 469px">
      <button type="button" id="accSaveBtn" class="btn btn-success btn-sm m-2">Save</button>
      <button type="button" id="accBlockBtn" class="btn btn-warning btn-sm m-2">Block</button>
      <button type="button" id="accDeleteBtn" class="btn btn-danger btn-sm m-2">Delete</button>
     </div>
      
    </div>
  </div>
  
    `;
    document.querySelector(
      ".cookeiAccordian #accordionFlushExample"
    ).innerHTML = accordionHTML;
  });
}

function displayBlockedCookies(array) {
  let blockedHTML = "";

  array.forEach((arr, id) => {
    blockedHTML += `
              
<div class="accordion-item" id="accordion-item${id + 1}" style="margin-bottom: 5px">
<div class="input-group flex-nowrap">
  <span class="input-group-text fw-semibold" style="width: 100px">Name:</span>
  <input
    type="text"
    class="form-control"
    id="blockName"
    aria-describedby="addon-wrapping"
    value="${arr.name}"
  />
</div>
<div class="input-group flex-nowrap">
  <span class="input-group-text fw-semibold" style="width: 100px"
    >Domain:</span
  >
  <input
    type="text"
    class="form-control"
    id="blockDomain"
    aria-describedby="addon-wrapping"
    value="${arr.domain}"
  />
</div>
<div class="d-flex justify-content-around">
  <button type="button" id="unblockBtn" class="btn btn-success btn-sm m-2">
    Unblock
  </button>
</div>
</div>
              `;
    document.querySelector(
      ".blockedCookieForm #accordionFlushExample"
    ).innerHTML = blockedHTML;
  });
}

// menu btn

menuBtn.addEventListener("click", () => {
  document.querySelector(".main").style.cssText = "display:none;";
  document.querySelector("#userConsent").style.cssText =
    "display:block; text-align: start;";
  document.querySelector(".userConsent_Buttons").style.display = "none";
  document.querySelector("#analyticsToggle").style.cssText =
    "display:flex; margin-top:-40px";
  // document.querySelector("#analyticsForm").style.display = "block"
});

crossBtn.addEventListener("click", () => {
  document.querySelector(".main").style.cssText = "display:block;";
  document.querySelector("#userConsent").style.cssText = "display:none;";
});

// Google Analytics toggle button

analyticsBtn.addEventListener("change", function () {
  if (analyticsBtn.checked == true) {
    chrome.storage.local.set({ analytics: true }).then(() => {
      analyticsBtn.checked == true;
    });
    fn_accordian();
  } else {
    chrome.storage.local.set({ analytics: false }).then(() => {
      analyticsBtn.checked == false;
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
