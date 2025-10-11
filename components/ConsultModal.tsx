"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Modal,
  Select,
  Typography,
  message as antdMsg,
} from "antd";
import {
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  MessageOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

// Keep your data import
import { solutions, type Solution } from "@/app/data/Sollution";

const { Title, Paragraph, Text, Link } = Typography;
const { TextArea } = Input;

export type ConsultFormValues = {
  fullName: string;
  email: string;
  phone: string;
  solutionTitle?: string;
  message?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<ConsultFormValues>;
};

export default function ConsultModal({ open, onClose, initialValues }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<ConsultFormValues>();

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) form.setFieldsValue(initialValues as any);
    }
  }, [open, initialValues, form]);

  const solutionOptions = useMemo(
    () =>
      (solutions as Solution[]).map((s: any) => ({
        label: s.title ?? s.name ?? "Untitled",
        value: s.slug ?? s.id ?? s.title ?? s.name,
      })),
    []
  );

  const onFinish = async (values: ConsultFormValues) => {
    try {
      setSubmitting(true);
      // await fetch("/api/contact", { method: "POST", body: JSON.stringify(values) });
      await new Promise((r) => setTimeout(r, 700));
      antdMsg.success("Thanks! We’ll get back to you shortly.");
      onClose();
    } catch (e) {
      console.error(e);
      antdMsg.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#07518a",
          colorInfo: "#07518a",
          colorPrimaryHover: "#0a6ab8",
          colorPrimaryActive: "#0a6ab8",
          borderRadius: 20,
          fontSize: 14,
          boxShadow:
            "0 10px 30px rgba(7,81,138,0.12), 0 18px 60px rgba(10,106,184,0.10)",
        },
        components: {
          Button: { controlHeight: 44, borderRadius: 999 },
          Input: { controlHeight: 42, borderRadius: 999, paddingInline: 14 },
          Select: { controlHeight: 42, borderRadius: 999 },
          TextArea: { borderRadiusLG: 14 },
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={onClose}
        footer={null}
        centered
        destroyOnClose
        // Responsive auto width; no fixed height => grows to fit content
        width={"min(92vw, 520px)"}
        styles={{
          content: {
            borderRadius: 24,
            padding: 0,
            overflow: "hidden", // keep edges clean
          },
          body: {
            // No scrollbars in body
            overflow: "visible",
            overflowX: "hidden",
            padding: 0,
          },
        }}
        className="cute-modal"
      >
        {/* Soft, cute header */}
        <div className="rounded-b-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#07518a] to-[#0a6ab8] px-6 pt-6 pb-5">
            <p className="inline-block text-xs bg-white/20 text-white font-medium px-3 py-1 rounded-full">
              Contact Us
            </p>
            <Title level={2} className="!text-white !mt-3 !mb-1 !leading-tight">
              Let’s Get In Touch.
            </Title>
            <Paragraph className="!text-white/90 !m-0">
              Or reach us directly at{" "}
              <Link
                href="mailto:hello@prebuiltui.com"
                className="!text-white underline"
              >
                info@brihaspathi.com
              </Link>
            </Paragraph>
          </div>
        </div>

        {/* Cute form (auto height, no internal scroll) */}
        <div className="px-6 pb-6 pt-5">
          <Form<ConsultFormValues>
            form={form}
            layout="vertical"
            requiredMark="optional"
            onFinish={onFinish}
            validateTrigger={["onBlur", "onSubmit"]}
          >
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please enter your full name" },
                { min: 2, message: "Name looks too short" },
              ]}
            >
              <Input
                autoFocus
                allowClear
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
                autoComplete="name"
                className="transition-transform focus:!ring-2 focus:!ring-[#0a6ab8]/30 hover:scale-[1.01]"
              />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  allowClear
                  prefix={<MailOutlined />}
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  className="transition-transform focus:!ring-2 focus:!ring-[#0a6ab8]/30 hover:scale-[1.01]"
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                  {
                    pattern: /^\+?\d{7,15}$/,
                    message:
                      "Use digits only, optionally starting with + (7–15 digits).",
                  },
                ]}
              >
                <Input
                  allowClear
                  prefix={<PhoneOutlined />}
                  placeholder="+91 9876543210"
                  autoComplete="tel"
                  inputMode="tel"
                  className="transition-transform focus:!ring-2 focus:!ring-[#0a6ab8]/30 hover:scale-[1.01]"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="What do you want to consult about?"
              name="solutionTitle"
              rules={[{ required: true, message: "Please choose a topic" }]}
              tooltip="This list is pulled from your solutions data."
            >
              <Select
                showSearchx
                allowClear
                placeholder="Search & select a solution"
                optionFilterProp="label"
                suffixIcon={<AppstoreOutlined />}
                options={solutionOptions}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="transition-transform hover:scale-[1.01]"
              />
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              rules={[
                { required: true, message: "Please share a short message" },
                { min: 10, message: "Please add a bit more detail" },
              ]}
            >
              <TextArea
                allowClear
                showCount
                maxLength={600}
                placeholder="Tell us a bit about your requirement…"
                autoSize={{ minRows: 4, maxRows: 8 }}
                className=""
              />
            </Form.Item>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button onClick={onClose}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<MessageOutlined />}
                className="shadow-md hover:shadow-lg transition-all"
              >
                Submit Form
              </Button>
            </div>

            <div className="mt-4">
              <Text type="secondary">
                We respect your privacy. Your details will only be used to
                respond to your enquiry.
              </Text>
            </div>
          </Form>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
