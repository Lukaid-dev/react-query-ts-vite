import axios from "axios";
import EventType from "../types/event.ts";
import { QueryClient } from "@tanstack/react-query";
import NewEventType from "../types/newEvent.ts";

export const queryClient = new QueryClient();

// react-query는 queryFn에 기본적으로 몇가지 인자를 전달한다. 그 중 하나가 signal(AbortSignal)이다. 이 signal은 AbortController의 signal이다. 이 signal을 사용하면 쿼리가 취소되었을 때 fetchEvents 함수가 중단된다.
export async function fetchEvents({
  signal,
  searchTerm,
  max,
}: {
  signal: AbortSignal;
  searchTerm?: string;
  max?: string;
}): Promise<EventType[]> {
  let url = "http://localhost:3000/events";

  console.log(searchTerm, max);

  if (searchTerm && max) {
    url += `?search=${searchTerm}&max=${max}`;
  }

  if (searchTerm) {
    url += `?search=${searchTerm}`;
  }

  if (max) {
    url += `?max=${max}`;
  }

  const response = await axios.get(url, {
    responseType: "json",
    signal,
  });

  if (response.status >= 400) {
    const error = new Error("An error occurred while fetching the events");
    throw error;
  }

  return response.data.events; // Access data from response object
}

export async function createNewEvent(eventData: { event: NewEventType }) {
  const response = await axios.post("http://localhost:3000/events", eventData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status >= 400) {
    const error = new Error("An error occurred while creating the event");
    throw error;
  }

  const event = response.data.event;

  return event;
}

export async function fetchSelectableImages({
  signal,
}: {
  signal: AbortSignal;
}) {
  const response = await fetch(`http://localhost:3000/events/images`, {
    signal,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status >= 400) {
    const error = new Error("An error occurred while fetching the images");
    throw error;
  }

  const images = await response.json();

  return images.images;
}

export async function fetchEvent({
  id,
  signal,
}: {
  id: string;
  signal: AbortSignal;
}) {
  const response = await axios.get(`http://localhost:3000/events/${id}`, {
    responseType: "json",
    signal,
  });

  if (response.status >= 400) {
    const error = new Error("An error occurred while fetching the event");
    throw error;
  }

  return response.data.event;
}

export async function deleteEvent({ id }: { id: string }) {
  const response = await axios.delete(`http://localhost:3000/events/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status >= 400) {
    const error = new Error("An error occurred while deleting the event");
    throw error;
  }

  return response.data;
}

export async function updateEvent({
  id,
  event,
}: {
  id: string;
  event: NewEventType;
}) {
  console.log(id, event);
  const response = await axios.put(
    `http://localhost:3000/events/${id}`,
    JSON.stringify({ event }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log(response);

  if (response.status >= 400) {
    const error = new Error("An error occurred while updating the event");
    throw error;
  }

  return response.data.event;
}
