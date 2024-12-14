const COHORT = "2410-FTB-ET-WEB-PT-jmuminov"
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}`;
const eventsContainer = document.querySelector('#events');
const form = document.querySelector("form");

const state = {
    recipes: [],
}

const getEvents = async () => {
    try {
        const response = await fetch(`${API_URL}/events`);
        const events = await response.json();
        return events.data;
    } catch (error) {
        console.error(`Failed to retrive list of the events`, error);
        return [];
    }
}

const deleteEvent = async (id) => {
    try {
        await fetch(`${API_URL}/events/${id}`, {
            method: 'DELETE',
        });
        await renderPage();
    } catch (error) {
        console.error(`Failed to delete event with ID: ${id}`, errpr);
    }
};

async function addEvent(event) {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      const json = await response.json();
  
      if (json.error) {
        throw new Error(json.error.message);
      }
    } catch (error) {
      console.error(error);
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const isoDate = new Date(form.time.value).toISOString();
    console.log(form.time.value);
    const newEvent = {
      name: form.eventName.value,
      description: form.description.value,
      date: isoDate,
      location: form.location.value,
    };
  
    await addEvent(newEvent);
    renderPage();
    form.reset();
});

const createEventItem = (event) => {
    const eventContainer = document.createElement(`div`);
    eventContainer.classList.add('event_item');

    const eventName = document.createElement(`h4`);
    eventName.textContent = event.name;

    const eventDescription = document.createElement(`p`);
    eventDescription.textContent = event.description;

    const eventDate = document.createElement(`h4`);
    eventDate.textContent = event.date;

    const eventLocation = document.createElement(`h4`);
    eventLocation.textContent = event.location;

    const deleteButton = document.createElement(`button`);
    deleteButton.textContent = `Delete the event`;
    deleteButton.addEventListener('click', () => {
        deleteEvent(event.id);
    });

    eventContainer.append(eventName, eventDescription, eventDate, eventLocation, deleteButton);

    return eventContainer;
}

async function renderPage() {
    while (eventsContainer.children.length) {
        const child = eventsContainer.firstChild;
        eventsContainer.removeChild(child);
    }

    const events = await getEvents();

    state.events = events;

    state.events.forEach((event) => {
        const eventContainer = createEventItem(event);

        eventsContainer.appendChild(eventContainer);
    });
}
renderPage();