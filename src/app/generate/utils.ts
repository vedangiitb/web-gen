"use client";
import { useRouter } from "next/router";

export const navigateToConversation = (id: string) => {
  const router = useRouter();

  router.push(`/generate/${id}`);
};

export const resetConversation = () => {
  const router = useRouter();

  router.push("/");
};
