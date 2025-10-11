"use client";

import { Button } from "antd";
import { ContactsOutlined } from "@ant-design/icons";
import { useConsultModal } from "../components/ConsultModalContext";

const BRAND = "#07518a";

export default function ScheduleConsultationButton({
  prefillSolution,
}: {
  /** Optional: pre-select a solution in the dropdown */
  prefillSolution?: string;
}) {
  const { open } = useConsultModal();

  return (
    <Button
      type="default"
      // AntD doesn't have `variant`, your classes are fine to keep the look
      className="text-white px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      style={{ backgroundColor: "white" }}
      icon={<ContactsOutlined className="mr-2 h-5 w-5" />}
      onClick={() => open({ solutionTitle: prefillSolution })}
    >
      Schedule Consultation
    </Button>
  );
}
