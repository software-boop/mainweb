"use client";

import { Button, message } from "antd";
import { useRouter } from "next/navigation";
import { http } from "@/lib/http";
import { LogoutOutlined } from "@ant-design/icons";

export default function LogoutButton() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onLogout = async () => {
    try {
      await http.post("/auth/logout");
      await messageApi.success("Logged out");
      router.replace("/login");
    } catch {
      messageApi.error("Logout failed");
    }
  };

  return (
    <>
      {contextHolder}
      <Button icon={<LogoutOutlined />} onClick={onLogout}>
        Log out
      </Button>
    </>
  );
}
