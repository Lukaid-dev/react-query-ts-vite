import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import ImagePicker from "../ImagePicker";
import { fetchSelectableImages } from "../../utils/http";
import ErrorBlock from "../UI/ErrorBlock";
import NewEventType from "../../types/newEvent";

export default function EventForm({
  inputData,
  onSubmit,
  children,
}: {
  inputData?: NewEventType;
  onSubmit: (formData: NewEventType) => void;
  children: React.ReactNode;
}) {
  const [selectedImage, setSelectedImage] = useState(inputData?.image);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["eventImages"],
    queryFn: fetchSelectableImages,
  });

  function handleSelectImage(image: string) {
    setSelectedImage(image);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData) as unknown as NewEventType;

    onSubmit({
      ...data,
      image: selectedImage || "",
    });
  }

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      <p className="control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={inputData?.title ?? ""}
        />
      </p>

      {isPending && "Loading images..."}
      {isError && (
        <ErrorBlock title="An error occurred" message={error.message} />
      )}
      {data && (
        <div className="control">
          <ImagePicker
            images={data}
            onSelect={handleSelectImage}
            selectedImage={selectedImage}
          />
        </div>
      )}

      <p className="control">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={inputData?.description ?? ""}
        />
      </p>

      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={inputData?.date ?? ""}
          />
        </p>

        <p className="control">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            defaultValue={inputData?.time ?? ""}
          />
        </p>
      </div>

      <p className="control">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={inputData?.location ?? ""}
        />
      </p>

      <p className="form-actions">{children}</p>
    </form>
  );
}
