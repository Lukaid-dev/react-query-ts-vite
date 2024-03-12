import { useIsFetching } from "@tanstack/react-query";
import { ReactNode } from "react";

export default function Header({ children }: { children: ReactNode }) {
  const fetching = useIsFetching();
  return (
    <>
      <div id="main-header-loading">{fetching > 0 && <progress />}</div>
      <header id="main-header">
        <div id="header-title">
          <h1>React Events</h1>
        </div>
        <nav>{children}</nav>
      </header>
    </>
  );
}
