import { permanentRedirect } from "next/navigation";

export default function PremiumPage() {
  permanentRedirect("/pricing");
}
