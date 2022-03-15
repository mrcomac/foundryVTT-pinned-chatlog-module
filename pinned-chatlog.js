let currentTab = "default";

function setClassVisibility(cssClass, visible) {
    if (visible) {
        cssClass.removeClass("hardHide");
        cssClass.show();
    } else
        cssClass.hide();
};

//Add chatlog type navigation
Hooks.on("renderChatLog", async function (chatLog, html, user) {
    let buttonDefault = $(`<a class="item default" data-tab="default">${game.i18n.localize("TC.TABS.Default")}</a><i id="defaultNotification" class="notification-pip fas fa-exclamation-circle" style="display: none;"></i>`);
    buttonDefault.on('click', (event) => selectDefaultTab());

    let buttonPinned = $(`<a class="item pinned" data-tab="pinned">${game.i18n.localize("TC.TABS.Pinned")}</a><i id="pinnedNotification" class="notification-pip fas fa-exclamation-circle" style="display: none;"></i>`);
    buttonPinned.on('click', (event) => selectPinnedTab());

    let toPrepend = $('<nav class="pinnedchatlog tabs"></nav>');
    toPrepend.append(buttonDefault).append(buttonPinned);
    
    html.prepend(toPrepend);
});

function selectDefaultTab(){
    currentTab = "default";
    setClassVisibility($(".chat-message"), true);
    $("#DefaultNotification").hide();
    
};

function selectPinnedTab(){
    currentTab = "pinned";
    setClassVisibility($(".chat-message").not(".pinned-message"), false);
    $("#PinnedNotification").hide();
};

Hooks.on("renderChatMessage", (chatMessage, html, data) => {
    addButton(html, chatMessage.data);

    if (currentTab == "pinned" && !html.hasClass(".pinned-message")) {
        html.hide();
    }
});

function addButton(messageElement, dataObj) {
    let deletecardElement = messageElement.find(".message-delete")
    // Can't find it?
    if (deletecardElement.length != 1) {
        return;
    }
    let button = $(`<a> <i class="fas fa-map-pin"></i></a>`);
    button.on('click', (event) => pinnedMessage(messageElement, dataObj));
    deletecardElement.after(button);
};

function pinnedMessage(message, dataObj){
    if(dataObj.pinned){
        message.removeClass('pinned-message');

        if(currentTab == "pinned"){
            message.hide();
        }

    } else {
        message.addClass('pinned-message');
    }
    
    dataObj.pinned = !dataObj.pinned
};