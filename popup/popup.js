// Buttons

const accordion_drop_button = document.querySelector("#accordion_drop_button");
const accSaveBtn = document.querySelector("#accSaveBtn")


document.addEventListener("DOMContentLoaded", function () {
  getUrl();
});

function getUrl() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    var icon = tab[0].favIconUrl;
    if (!icon) {
      icon = "img/chrome.png";
    }
    var url = tab[0].url;
    console.log(tab[0], "tab Details");
    // console.log(url, "tab url")

    document.querySelector("#NavUrl").innerHTML = `
      <span class="d-flex">
      <img
          src=${icon}
          alt="Logo"
          width="30"
          height="24"
          class="d-inline-block align-text-top mx-2"
        /><p>${url}</p>
      </span>
      `;
    chrome.cookies.getAll({ url: url }, function (cks) {
      displayCookies(cks);
      console.log(cks, "cks in get url"); // Shows Array of all the cookies
    });

    // let mainContainer = document.querySelector(".accordion.accordion-flush")
    // mainContainer.addEventListener('click', function(event) {
    //   console.log("main container targeted")
    //   if (event.target.matches('#accSaveBtn')) {
    //     console.log("Button targeted")
    //     let parent = document.querySelector("#accSaveBtn").parentElement
    //     // let cookieName = parent.find('input[id="cookieName"]')
    //     let cookieName = parent.querySelector('input[id="cookieName"]').value;
    //     console.log(cookieName)
    //   }
    // });

    let mainContainer = document.querySelector(".accordion.accordion-flush");

mainContainer.addEventListener('click', function(event) {
  console.log("main container targeted");
  
  if (event.target.matches('.btn.btn-success')) {
    console.log("Button targeted");
    
    let parent = document.querySelector(".btn.btn-success").parentElement.parentElement;

    console.log(parent)
    // Use querySelector to find the input element with the specified ID
    let cookieNameInput = parent.querySelector('input[id="cookieName"]');

    if (cookieNameInput) {
      // Access the value property to get the value of the input
      let cookieName = cookieNameInput.value;
      console.log(cookieName);
    } else {
      console.log("Input element with id 'cookieName' not found within the parent container.");
    }
  }
});


  });
}


function displayCookies(cookies) {
  console.log(cookies, "cookies in display content"); // Shows Array of all the cookies
  cookies.forEach(function (cookie, id) {
    // console.log(id, "id");
    // let date = new Date()
    // cookie.expirationDate
    let date = cookie.expirationDate
    let expirationDate = new Date(date * 1000)
    // console.log(expirationDate)

    let checkHostOnly = cookie.hostOnly?"checked":""
    let checkHttponly = cookie.httpOnly?"checked":""
    let checkSecure = cookie.secure?"checked":""
    let checkSession = cookie.session?"checked":""
    document.querySelector("#accordionFlushExample").innerHTML += `
      <div class="accordion-item">
      <h2 class="accordion-header">
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
      }" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">

        <div class="input-group flex-nowrap">
          <span class="input-group-text fw-semibold"  style="width: 100px" >Name:</span>
          <input type="text" class="form-control" id="cookieName" aria-describedby="addon-wrapping" value=${
            cookie.name
          }>
        </div>

        <div class="input-group">
          <span class="input-group-text fw-semibold" style="width: 100px" >Value:</span>
          <textarea class="form-control" id="cookieValue">${cookie.value}</textarea>
        </div>

        <div class="input-group flex-nowrap">
          <span class="input-group-text fw-semibold" style="width: 100px" >Domain:</span>
          <input type="text" class="form-control" id="cookieDomain" value=${cookie.domain}>
        </div>

        <div class="input-group flex-nowrap">
          <span class="input-group-text fw-semibold" style="width: 100px" >Path:</span>
          <input type="text" class="form-control" id="cookiePath" value=${cookie.path}>
        </div>

        <div class="input-group flex-nowrap">
          <span class="input-group-text fw-semibold" style="width: 100px" >Expiration:</span>
          <textarea class="form-control" id="cookieExpiration">${expirationDate}</textarea>
        </div>

        <div class="input-group flex-nowrap">
          <span class="input-group-text fw-semibold" style="width: 100px" >Same Site:</span>
          <input type="text" class="form-control" id="cookieSameSite" value=${cookie.sameSite}>
        </div>
        
        <div class="d-flex justify-content-around">
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
      
       <div class="d-flex justify-content-around ">
        <button type="button" id="accSaveBtn" class="btn btn-success btn-sm m-2">Save</button>
        <button type="button" id="accDeleteBtn" class="btn btn-danger btn-sm m-2">Delete</button>
       </div>
        
      </div>
    </div>
    
      `;
    // console.log(cookie, "cookies in display content"); // Shows each object of the array of cookies

    // let data = {}
    // data.name = cookieName
    // data.value = cookieValue
    // data.domain = cookieDomain
    // data.path = cookiePath
    // data.expirationDate = cookieExpiration
    // data.sameSite = cookieSameSite
    // data.hostOnly = HostOnly
    // data.httpOnly = HttpOnly
    // data.secure = Secure
    // data.session = Session
    // data.storeId = cookie.storeId
    // data.url = buildUrl(cookieDomain, cookiePath, url)


  });
}

var buildUrl = function(domain, path, realUrl){
  var secure = realUrl.indexOf("https://") === 0;
  if (domain.substr(0, 1) === '.'){
    domain = domain.substring(1);
  }
  return "http" + ((secure) ? "s" : "") + "://" + domain + path;
}



//     let cookieName = document.getElementsByTagName(`cookieName${id+1}`).value
    // console.log(cookieName)

    // let cookieValue = document.getElementById(`cookieValue${id+1}`).value
    // console.log(cookieValue)

    // let cookieDomain = document.getElementById(`cookieDomain${id+1}`).value
    // console.log(cookieDomain)

    // let cookiePath = document.getElementById(`cookiePath${id+1}`).value
    // console.log(cookiePath)

    // let cookieExpiration = document.getElementById(`cookieExpiration${id+1}`).value
    // console.log(cookieExpiration)

    // let cookieSameSite = document.getElementById(`cookieSameSite${id+1}`).value
    // console.log(cookieSameSite)

    // let HostOnly =  document.getElementById(`hostOnly${id+1}`)
    // let cookieHostOnly = HostOnly.checked?true:false
    // console.log(cookieHostOnly)

    // let HttpOnly =  document.getElementById(`httpOnly${id+1}`)
    // let cookieHttpOnly = HttpOnly.checked?true:false
    // console.log(cookieHttpOnly)

    // let Secure =  document.getElementById(`secure${id+1}`)
    // let cookieSecure = Secure.checked?true:false
    // console.log(cookieSecure)

    // let Session =  document.getElementById(`session${id+1}`)
    // let cookieSession = Session.checked?true:false
    // console.log(cookieSession)