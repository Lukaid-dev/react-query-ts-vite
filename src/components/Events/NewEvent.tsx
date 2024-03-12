import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal";
import EventForm from "./EventForm";
import { createNewEvent, queryClient } from "../../utils/http";
import NewEventType from "../../types/newEvent";
import ErrorBlock from "../UI/ErrorBlock";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      // events 쿼리키를 가지고 있는 모든 쿼리를 다시 불러온다.
      queryClient.invalidateQueries({
        queryKey: ["events"],
        // exact: true, // 이 옵션을 사용하면 queryKey가 정확히 일치하는 쿼리만 다시 불러온다.
      });
      navigate("/events");
    },
  });

  function handleSubmit(formData: NewEventType) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock title="An error occurred" message={error.message} />
      )}
    </Modal>
  );
}
