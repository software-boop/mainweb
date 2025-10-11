"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { http } from "@/lib/http";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next"); // optional
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  async function onFinish(values: { identifier: string; password: string }) {
    setLoading(true);
    try {
      const { data } = await http.post<{
        ok: boolean;
        role?: string;
        message?: string;
      }>("/auth/login", values);
      if (!data?.ok) throw new Error(data?.message || "Invalid credentials");

      await messageApi.success("Login successful! Redirecting...");
      const role = (data.role || "user").toLowerCase().replace(/[\s_-]+/g, "");
      const target =
        next ||
        (role === "superadmin"
          ? "/dashboard/superadmin"
          : role === "admin"
          ? "/dashboard/admin"
          : "/dashboard/user");
      router.push(target);
    } catch (err: any) {
      messageApi.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {contextHolder}
      <Card className="w-full max-w-md shadow-md rounded-2xl" bordered={false}>
        <div className="text-center mb-6">
          <Title level={3} style={{ marginBottom: 4 }}>
            Sign in
          </Title>
          <Text type="secondary">Access your dashboard</Text>
        </div>

        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ identifier: "", password: "" }}
        >
          <Form.Item
            label="Email / Username"
            name="identifier"
            rules={[
              { required: true, message: "Please enter email or username" },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="balaji@example.com"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="••••••••"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
