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
    $(".pinned-vue-message").remove();

    chatLog.scrollBottom(true)
};

async function selectPinnedTab(chatLog){
    currentTab = "pinned";
    buttonPinned.addClass('active');
    buttonDefault.removeClass('active');

    setClassVisibility($(".chat-message"), false);

    let pinnedMessages = game.messages.contents.filter(entry => undefined != entry.data.flags.pinnedChat && entry.data.flags.pinnedChat.pinned);

    //const log = chatLog._element[0].children[1];
    const log = $("#chat-log");
    let htmlMessages = [];
    
    for ( let i=0; i<pinnedMessages.length; i++) {
        let pinnedMessage = pinnedMessages[i];
        if (!pinnedMessage.visible) continue;
        pinnedMessage.logged = true;
        try {
            let messageHtml = await pinnedMessage.getHTML();
            //messageHtml.addClass('pinned-vue-message')
            htmlMessages.push(messageHtml);
        } catch (err) {
          err.message = `Pinned message ${pinnedMessage.id} failed to render: ${err})`;
          console.error(err);
        }
      }

      // Prepend the HTML
      log.prepend(htmlMessages);


    //Charger tout les messages ping override _renderBatch
    //Charger les message non charger et non présent dans la liste index de chatlog ?
    //
    
    chatLog.scrollBottom(true)
};

Hooks.on("renderChatMessage", (chatMessage, html, data) => {
    if(chatMessage.canUserModify(Users.instance.current,'update')){
        addButton(html, chatMessage);
    }

    if(chatMessage.data?.flags?.pinnedChat?.pinned){
        html.addClass("pinned-message")
    }

    if (currentTab == "pinned" && !html.hasClass("pinned-message")) {
        html.hide();
    }
});

function addButton(messageElement, chatMessage) {
    let messageMetadata = messageElement.find(".message-metadata")
    // Can't find it?
    if (messageMetadata.length != 1) {
        return;
    }
    let button = $(`<a> <i class="fas fa-map-pin"></i></a>`);
    button.on('click', (event) => pinnedMessage(messageElement, chatMessage));
    messageMetadata.append(button);
};

function pinnedMessage(message, chatMessage){
    let pinned = chatMessage.data?.flags?.pinnedChat?.pinned;

    
    pinned = !pinned;

    chatMessage.update({ "flags.pinnedChat.pinned": pinned },{"diff" :true});
};

