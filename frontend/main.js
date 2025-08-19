$(document).ready(function () {
  eel.init()();

  $(".text").textillate({
    loop: true,
    speed: 1500,
    sync: true,
    in: { effect: "bounceIn" },
    out: { effect: "bounceOut" },
  });

  $(".siri-message").textillate({
    loop: true,
    sync: true,
    in: { effect: "fadeInUp", sync: true },
    out: { effect: "fadeOutUp", sync: true },
  });


  var siriWave = new SiriWave({
    container: document.getElementById("siri-container"),
    width: 940,
    style: "ios9",
    amplitude: "1",
    speed: "0.30",
    height: 200,
    autostart: true,
    waveColor: "#ff0000",
    waveOffset: 0,
    rippleEffect: true,
    rippleColor: "#ffffff",
  });

  $("#MicBtn").click(function () {
  eel.play_assistant_sound();
  $("#Oval").attr("hidden", true);
  $("#SiriWave").attr("hidden", false);

  eel.takeAllCommands()(function (response) {
    
    if (response) {
      eel.DisplayMessage(response); 
    } else {
      eel.DisplayMessage("Assistant didn't respond.");
    }

    eel.ShowHood(); 
  });
});


  document.addEventListener("keyup", function (e) {
    if (e.key === "j" && e.metaKey) {
      eel.play_assistant_sound();
      $("#Oval").attr("hidden", true);
      $("#SiriWave").attr("hidden", false);
      eel.takeAllCommands()();
    }
  });

  function PlayAssistant(message) {
    if (!message) return;
    $("#Oval").attr("hidden", true);
    $("#SiriWave").attr("hidden", false);
    eel.takeAllCommands(message);
    $("#chatbox").val("");
    $("#MicBtn").attr("hidden", false);
    $("#SendBtn").attr("hidden", true);
  }

  function ShowHideButton(message) {
    $("#MicBtn").attr("hidden", message.length !== 0);
    $("#SendBtn").attr("hidden", message.length === 0);
  }

  $("#chatbox").keyup(function () {
    ShowHideButton($(this).val());
  });

  $("#SendBtn").click(function () {
    PlayAssistant($("#chatbox").val());
  });

  $("#chatbox").keypress(function (e) {
    if (e.which == 13) PlayAssistant($("#chatbox").val());
  });

  $("#ChatBtn").click(function () {
    $("#Oval").hide();
    $("#SiriWave").hide();
    showSection("ChatSection");
  });

  function appendMessage(message, sender = "user") {
    const messageClass = sender === "user" ? "sender_message" : "receiver_message";
    let formatted = message
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\n/g, "<br>");

    formatted = formatted.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) =>
      `<div class="code-container position-relative">
        <button class="copy-btn">Copy</button>
        <pre><code>${code}</code></pre>
      </div>`);

    const deleteBtn = sender === "user" ? '<button class="delete-btn">Delete</button>' : "";

    const messageHTML = `
      <div class="d-flex ${sender === "user" ? "justify-content-end" : "justify-content-start"} mb-2">
        <div class="width-size ${messageClass} position-relative">
          ${deleteBtn}${formatted}
        </div>
      </div>`;

    $("#chatDisplayBox").append(messageHTML);
    $("#chatDisplayBox").scrollTop($("#chatDisplayBox")[0].scrollHeight);
  }

  $("#chatSendBtn").click(function () {
    const msg = $("#chatInput").val().trim();
    if (!msg) return;

    appendMessage(msg, "user");
    $("#chatInput").val("");
    appendMessage("<i>Typing...</i>", "jarvis");

    eel.takeAllCommands(msg)(function (reply) {
      $(".receiver_message:contains('Typing...')").last().parent().remove();

      setTimeout(() => {
        appendMessage(reply || "Assistant did not respond properly.", "jarvis");
        if (reply && !isChatMode) eel.speak(reply);
      }, 500);

      $("#chatDisplayBox").scrollTop($("#chatDisplayBox")[0].scrollHeight);
    });
  });

  $("#chatInput").keypress(function (e) {
    if (e.which === 13) $("#chatSendBtn").click();
  });

  $(document).on("click", ".copy-btn", function () {
    const code = $(this).siblings("pre").text();
    navigator.clipboard.writeText(code).then(() => {
      $(this).text("Copied");
      setTimeout(() => $(this).text("Copy"), 1000);
    });
  });

  $(document).on("contextmenu", ".sender_message", function (e) {
    e.preventDefault();
    if (confirm("Delete your message and its reply?")) {
      const userBubble = $(this).closest(".d-flex");
      const nextBubble = userBubble.next();

      userBubble.remove();
      if (nextBubble.find(".receiver_message").length > 0) nextBubble.remove();
    }
  });

  $(document).on("click", ".delete-btn", function () {
    const userBubble = $(this).closest(".d-flex");
    const nextBubble = userBubble.next();

    userBubble.remove();
    if (nextBubble.find(".receiver_message").length > 0) nextBubble.remove();
  });

 
});


let lastVisibleSection = null;

function showSection(sectionId) {
  $(".section-block").hide();            
  $("#" + sectionId).show();            
  $("#BackToHomeBtn").show();           
  lastVisibleSection = sectionId;       
}

$("#BackToHomeBtn").click(() => {
  if (lastVisibleSection) {
    $("#" + lastVisibleSection).hide();
  }
  $("#Start").show();                  
  $("#Oval").show();                   
  $("#BackToHomeBtn").hide();          
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();  
  }
});
