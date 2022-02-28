import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { mocked } from "jest-mock";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { SubscribeButton } from "./index";
import { getStripeJs } from "../../services/stripe-js";

jest.mock("next-auth/client");
jest.mock("next/router");
jest.mock("../../services/api");
jest.mock("../../services/stripe-js");

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirects user to sign in when not authenticated", () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user already has a subscription", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
        activeSubscription: "fake-active-subscription",
      },
      false,
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });

  it("redirects to stripe checkout when user not have a subscription", async () => {
    const apiMocked = mocked(api.post);
    const getStripeJsMocked = mocked(getStripeJs);
    const useSessionMocked = mocked(useSession);
    const redirectToCheckoutMock = jest.fn();

    apiMocked.mockResolvedValueOnce({
      data: {
        sessionId: "fake-session-id",
      },
    });
    getStripeJsMocked.mockResolvedValueOnce({
      redirectToCheckout: redirectToCheckoutMock,
    } as any);

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "john.doe@example.com" },
        expires: "fake-expires",
      },
      false,
    ]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(redirectToCheckoutMock).toHaveBeenCalled();
    });
  });
});
