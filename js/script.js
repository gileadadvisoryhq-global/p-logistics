(function(){
  var WA_NUMBER = "2349045114683";

  function waLink(message){
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }

  // Handle generic WhatsApp trigger buttons
  document.querySelectorAll(".wa-trigger").forEach(function(el){
    el.addEventListener("click", function(e){
      e.preventDefault();
      var msg = el.getAttribute("data-message") || "Hello P Logistics, I want to request a delivery.";
      window.open(waLink(msg), "_blank", "noopener");
    });
  });

  // Dynamic Navigation Toggle
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var iconOpen = document.getElementById("navIconOpen");
  var iconClose = document.getElementById("navIconClose");

  function setMenu(open){
    if(!mobileMenu || !navToggle) return;
    mobileMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if(iconOpen) iconOpen.style.display = open ? "none" : "block";
    if(iconClose) iconClose.style.display = open ? "block" : "none";
  }

  if(navToggle && mobileMenu){
    navToggle.addEventListener("click", function(){
      setMenu(!mobileMenu.classList.contains("open"));
    });
  }

  var yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Delivery Request Form logic
  var form = document.getElementById("deliveryForm");
  var cardForm = document.getElementById("cardForm");
  var successBox = document.getElementById("formSuccess");
  var resetLink = document.getElementById("resetForm");

  if(form){
    var validators = {
      name: function(v){ return v.trim().length > 1; },
      phone: function(v){ return /^[0-9+\s()-]{7,}$/.test(v.trim()); },
      pickup: function(v){ return v.trim().length > 3; },
      dropoff: function(v){ return v.trim().length > 3; },
      item: function(v){ return v.trim().length > 2; },
      time: function(v){ return v.trim().length > 0; }
    };

    function fieldEl(key){ return form.querySelector('[data-field="' + key + '"]'); }

    function validateField(key, inputEl){
      var wrap = fieldEl(key);
      if(!wrap) return true;
      var ok = validators[key](inputEl.value);
      wrap.classList.toggle("has-error", !ok);
      return ok;
    }

    ["senderName","phoneNumber","pickupAddress","deliveryAddress","itemDescription","preferredTime"].forEach(function(id){
      var el = document.getElementById(id);
      if(!el) return;
      var keyMap = {
        senderName:"name", phoneNumber:"phone", pickupAddress:"pickup",
        deliveryAddress:"dropoff", itemDescription:"item", preferredTime:"time"
      };
      el.addEventListener("blur", function(){ validateField(keyMap[id], el); });
    });

    form.addEventListener("submit", function(e){
      e.preventDefault();

      var data = {
        name: document.getElementById("senderName").value,
        phone: document.getElementById("phoneNumber").value,
        pickup: document.getElementById("pickupAddress").value,
        dropoff: document.getElementById("deliveryAddress").value,
        item: document.getElementById("itemDescription").value,
        time: document.getElementById("preferredTime").value,
        instructions: document.getElementById("instructions") ? document.getElementById("instructions").value : ""
      };

      var ok = true;
      if(!validateField("name", document.getElementById("senderName"))) ok = false;
      if(!validateField("phone", document.getElementById("phoneNumber"))) ok = false;
      if(!validateField("pickup", document.getElementById("pickupAddress"))) ok = false;
      if(!validateField("dropoff", document.getElementById("deliveryAddress"))) ok = false;
      if(!validateField("item", document.getElementById("itemDescription"))) ok = false;
      if(!validateField("time", document.getElementById("preferredTime"))) ok = false;

      if(!ok){
        var firstErr = form.querySelector(".has-error input, .has-error textarea, .has-error select");
        if(firstErr) firstErr.focus();
        return;
      }

      var message = "Hello P Logistics, I want to request a delivery.\n\n" +
        "Name: " + data.name + "\n" +
        "Phone: " + data.phone + "\n" +
        "Pickup: " + data.pickup + "\n" +
        "Delivery to: " + data.dropoff + "\n" +
        "Item: " + data.item + "\n" +
        "Preferred time: " + data.time +
        (data.instructions ? ("\nNotes: " + data.instructions) : "");

      window.open(waLink(message), "_blank", "noopener");

      if(cardForm && successBox){
        cardForm.classList.add("submitted");
        successBox.classList.add("show");
      }
    });
  }

  if(resetLink){
    resetLink.addEventListener("click", function(e){
      e.preventDefault();
      form.reset();
      document.querySelectorAll(".field.has-error").forEach(function(f){ f.classList.remove("has-error"); });
      cardForm.classList.remove("submitted");
      successBox.classList.remove("show");
    });
  }
})();