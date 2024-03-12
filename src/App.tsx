import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Events from "./components/Events/Events";
import NewEvent from "./components/Events/NewEvent";
import EventDetails from "./components/Events/EventDetails";
import EditEvent from "./components/Events/EditEvent";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/events" />,
  },
  {
    path: "/events",
    element: <Events />,
    children: [
      {
        path: "/events/new",
        element: <NewEvent />,
      },
    ],
  },
  {
    path: "/events/:id",
    element: <EventDetails />,
    children: [
      {
        path: "/events/:id/edit",
        element: <EditEvent />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
