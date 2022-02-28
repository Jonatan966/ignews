import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Header } from "./index";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

describe("Header component", () => {
  it("renders correctly", () => {
    render(<Header />);

    // screen.logTestingPlaygroundURL();

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });

  it("opens mobile menu", async () => {
    const setStateMock: any = jest.fn();
    const useStateMock: any = (useState: any) => [useState, setStateMock];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);

    render(<Header />);

    const openMobileMenuButton = screen.getByTestId("open-mobile-menu");

    fireEvent.click(openMobileMenuButton);
    
    await waitFor(() => expect(setStateMock).toHaveBeenCalledWith(true));
  })
});
