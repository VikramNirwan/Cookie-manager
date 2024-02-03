window.onload = ()=>{
    
        chrome.runtime.sendMessage({ action: "getTabDetails" },()=> {
            console.log("Content js working ")
        });
    
}


