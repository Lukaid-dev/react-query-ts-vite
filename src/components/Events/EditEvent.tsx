import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal";
import EventForm from "./EventForm";
import { fetchEvent, updateEvent, queryClient } from "../../utils/http";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import NewEventType from "../../types/newEvent";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) {
    throw new Error("No event id provided");
  }

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["event", { id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newData = data.event;

      // optimistic update
      await queryClient.cancelQueries({ queryKey: ["event", { id }] }); // 변경 전 데이터를 가져오는 쿼리를 취소함
      const previousEvent = queryClient.getQueryData(["event", { id }]); // 변경 전 데이터를 캐시에서 가져옴
      queryClient.setQueryData(["event", { id }], newData); // 실제로 데이터를 변경하기 전에 변경된 데이터를 캐시에 저장하여 UI를 업데이트함
      return { previousEvent };
    },
    onError: (error, data, context) => {
      if (context) {
        // 실패했을 경우 변경 전 데이터로 롤백함
        queryClient.setQueryData(["event", { id }], context.previousEvent);
      }
    },
    onSettled: () => {
      // onSettled는 mutation이 성공하거나 실패했을 때 (onMutate가 종료되었을 때) 실행됨
      queryClient.invalidateQueries({ queryKey: ["event", { id }] }); // 클라와 서버의 데이터를 동기화 함
    },
  });

  function handleSubmit(id: string, formData: NewEventType) {
    mutate({ id, event: formData });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <p className="center">
        <ErrorBlock title="An error occurred" message={error.message} />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </p>
    );
  }

  if (data) {
    content = (
      <EventForm
        inputData={data}
        onSubmit={(formData) => {
          handleSubmit(id, formData);
        }}
      >
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
