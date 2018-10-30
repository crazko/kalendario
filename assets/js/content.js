/**
 * Class representing one event in calendar.
 */
class CalendarEvent {
  /**
   *@param {string} titleClasses
   */
  constructor(titleClasses) {
    try {
      let eventDetails = atob(this.getHash(titleClasses));
      let event = eventDetails.split(" ");

      this.id = event[0];
      this.calendar = this.getCalendarName(event[1]);
    } catch (error) {
      // Remainders have different id, don't want their details
      this.id = null;
      this.calendar = null;
    }
  }

  /**
   * @param {string} titleClasses
   * @returns {string}
   */
  getHash(titleClasses) {
    let classes = titleClasses.split(" ");
    let eventClass = classes[2];
    let eventParts = eventClass.split("-");
    let eventHash = eventParts[1];

    return eventHash;
  }

  /**
   * @param {string} name
   * @returns {string}
   */
  getCalendarName(name) {
    let nameParts = name.split("@");
    let domain =
      nameParts[1] == "g" ? "group.calendar.google.com" : "gmail.com";

    return `${nameParts[0]}@${domain}`;
  }
}

/**
 * Adds description to given event.
 * @param {string} eventId
 * @param {string} description
 */
const addDescription = function(eventId, description) {
  let $event = $("#" + eventId);

  // Avoid duplicated content
  if ($event.find(".calex__description")) {
    $event.find(".calex__description").remove();
  }

  $event.append(`<div class="calex__description">${description}</div>`);
};

/**
 * Gets all events from calendar and sets id to each of them.
 */
const getAllEvents = function() {
  let events = [];

  $("#lv_listview .lv-row").each(function(index) {
    let $title = $(this).find("div.lv-event-title-line");
    let event = new CalendarEvent(
      $title.children('span[role="button"]').attr("class")
    );

    // Set id of event to be found later
    $title.attr("id", event.id);

    events[index] = event;
  });

  return events;
};

/* ----------------------------------------------------- */

const calendarContainer = document.getElementById("gridcontainer");
const markdownConverter = new showdown.Converter({
  noHeaderId: true,
  simplifiedAutoLink: true,
  excludeTrailingPunctuationFromURLs: true,
  strikethrough: true
});

if (calendarContainer) {
  // Check for change in calendar.
  // Gather all events and send them to background to process
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length <= 0) {
        return true;
      }

      if (mutation.addedNodes[0].id == "lv_listview") {
        chrome.runtime.sendMessage(
          {
            msg: "events",
            events: getAllEvents()
          },
          function(response) {
            // console.log(response);
          }
        );
      }
    });
  });

  observer.observe(calendarContainer, {
    childList: true,
    characterData: true,
    subtree: true
  });
} else {
  console.log(
    `Calex browser extension currently doesn't support new Google Calendar with Material design.`
  );
}

// Wait for processed events and paste their data
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === "show") {
    let event = request.event;
    let html = markdownConverter.makeHtml(event.description);

    addDescription(event.id, html);
  }
});
