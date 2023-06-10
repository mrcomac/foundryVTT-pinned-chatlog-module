let currentTab = "default";
let buttonDefault;
let buttonPinned;

function setClassVisibility(cssClass, visible) {
    cssClass.style.display = visible;
};

Hooks.once('ready', () => {

});
//Add chatlog type navigation
Hooks.on("renderChatLog", async function (chatLog, html, user) {
    buttonDefault = $(`<a class="item active default" data-tab="default">${game.i18n.localize("TC.TABS.Default")}</a>`);
    buttonDefault.on('click', (event) => selectDefaultTab(chatLog));

    buttonPinned = $(`<a class="item pinned" data-tab="pinned">${game.i18n.localize("TC.TABS.Pinned")}</a>`);
    buttonPinned.on('click', (event) => selectPinnedTab(chatLog));

    let toPrepend = $('<nav class="pinnedchatlog tabs"></nav>');
    toPrepend.append(buttonDefault).append(buttonPinned);
    
    html.prepend(toPrepend);
});

function selectDefaultTab(chatLog){
    currentTab = "default";
    buttonDefault.addClass('active');
    buttonPinned.removeClass('active');

    let pinnedMessages = game.messages.contents;    
    let messages = $(".chat-message");
    for ( let i=0; i<pinnedMessages.length; i++) {
        setClassVisibility(messages[i],"")
        
    }
    chatLog.scrollBottom(true)
}

async function selectPinnedTab(chatLog){

    currentTab = "pinned";
    buttonPinned.addClass('active');
    buttonDefault.removeClass('active');

    let pinnedMessages = game.messages.contents;      
    let messages = $(".chat-message");
    for ( let i=0; i<pinnedMessages.length; i++) {
        if(pinnedMessages[i].type != 5) {
            setClassVisibility(messages[i],"none")
        }       
    }
    
    chatLog.scrollBottom(true)
};

Hooks.on("renderChatMessage", (chatMessage, html, data) => {
    
    if(chatMessage.type != 5 && currentTab =="pinned") { 
        let messages = $(".chat-message");
        setClassVisibility(html[0], "none");
    }
    
});

function addButton(messageElement, chatMessage) {
    let messageMetadata = messageElement.find(".message-metadata")
    if (messageMetadata.length != 1) {
        return;
    }
    let button = $(`<a> <i class="fas"></i></a>`);//Example of circle fa-circle
    button.on('click', (event) => pinnedMessage(button, chatMessage));
    changeIcon(button, chatMessage.flags?.pinnedChat?.pinned);
    messageMetadata.append(button);
};


function pinnedMessage(button, chatMessage){
    let pinned = chatMessage.flags?.pinnedChat?.pinned;

    pinned = !pinned;

    changeIcon(button, pinned);

    chatMessage.update({ "flags.pinnedChat.pinned": true },{"diff" :true});
};

function changeIcon(button, isPinned){
    let icon = button.find(".fas");

    if(isPinned){
        icon.removeClass('fa-map-pin');
        icon.addClass('fa-circle');
    } else {
        icon.addClass('fa-map-pin');
        icon.removeClass('fa-circle');
    }
};

