import { redirect } from "next/navigation";

export default function FinancingApplyPage() {
  redirect("/?apply-financing=true");
}
