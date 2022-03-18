let currentTab = "default";
let buttonDefault;
let buttonPinned;

function setClassVisibility(cssClass, visible) {
    if (visible) {
        cssClass.removeClass("hardHide");
        cssClass.show();
    } else
        cssClass.hide();
};

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

    setClassVisibility($(".chat-message"), true);

    chatLog.scrollBottom(true)
};

function selectPinnedTab(chatLog){
    currentTab = "pinned";
    buttonPinned.addClass('active');
    buttonDefault.removeClass('active');

    setClassVisibility($(".chat-message").not(".pinned-message"), false);

    chatLog.scrollBottom(true)
};

Hooks.on("renderChatMessage", (chatMessage, html, data) => {
    addButton(html, chatMessage);

    if(chatMessage.data?.flags?.pinnedChat?.pinned){
        html.addClass("pinned-message")
    }

    if (currentTab == "pinned" && !html.hasClass(".pinned-message")) {
        html.hide();
    }
});

function addButton(messageElement, chatMessage) {
    let deletecardElement = messageElement.find(".message-delete")
    // Can't find it?
    if (deletecardElement.length != 1) {
        return;
    }
    let button = $(`<a> <i class="fas fa-map-pin"></i></a>`);
    button.on('click', (event) => pinnedMessage(messageElement, chatMessage));
    deletecardElement.after(button);
};

function pinnedMessage(message, chatMessage){
    let pinned = chatMessage.data?.flags?.pinnedChat?.pinned;

    
    pinned = !pinned;

    chatMessage.update({ "flags.pinnedChat.pinned": pinned },{"diff" :true});
};