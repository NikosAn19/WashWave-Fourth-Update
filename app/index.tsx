// app/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Allow at least 1 frame for rendering
    setTimeout(() => {
      router.replace("/splash");
    }, 3000);
  }, []);

  return null;
}
