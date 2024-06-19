"use client";

import { toast } from "sonner";

import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { useProModal } from "@/hooks/use-pro-modal";

interface SubscriptionButtonProps {
  isPro: boolean;
};

export const SubscriptionButton = ({ 
  isPro,
 }: SubscriptionButtonProps) => {
  const proModal = useProModal();

  const { run, loading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const onClick = () => {
    if (isPro) {
      run({});
    } else {
      proModal.onOpen();
    }
  }

  return (
    <Button
      variant="primary"
      onClick={onClick}
      disabled={loading}
    >
      {isPro ? "Manage subscription" : "Upgrade to pro"}
    </Button>
  )
};