import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/qr")({
  beforeLoad: () => {
    throw redirect({ to: "/qr-generator", replace: true });
  },
});
