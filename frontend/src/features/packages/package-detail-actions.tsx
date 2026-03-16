
"use client";

import { Button } from "@/src/components/ui/button";
import { useProtectedAction } from "@/src/features/auth/useProtectedAction";

export function PackageDetailActions() {
  const { runProtectedAction } = useProtectedAction();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button onClick={() => runProtectedAction()}>Book Package</Button>
      <Button variant="secondary" onClick={() => runProtectedAction()}>
        Save for Later
      </Button>
    </div>
  );
}