"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosInstance } from "axios";
import {
  message,
  Modal,
  Form,
  Input,
  Button,
  Card,
  Empty,
  Popconfirm,
  Row,
  Col,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

/**
 * CatalogFamilies — Public Axios CRUD with UI list/cards (Strapi v4/v5 aware)
 * - Fully public (no tokens)
 * - Create → toast + add to list
 * - List all (GET /api/catalog-families)
 * - Edit in modal (PUT /api/catalog-families/:id)
 * - Delete with confirm (DELETE /api/catalog-families/:id)
 *
 * 🔑 IMPORTANT (Strapi v5): the REST ":id" path expects the **documentId**, not the numeric entry id.
 * Your sample shows both `id` and `documentId`. We now use `documentId` when present,
 * falling back to `id` for Strapi v4. That fixes 404 Not Found on update/delete.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

// -------------- Axios client --------------
let _client: AxiosInstance | null = null;
function api() {
  if (!_client) {
    _client = axios.create({ baseURL: API_URL });
    _client.interceptors.response.use(
      (r) => r,
      (err) => {
        const msg =
          err?.response?.data?.error?.message ||
          err.message ||
          "Request failed";
        return Promise.reject(new Error(msg));
      }
    );
  }
  return _client;
}

// -------------- Types & Normalizers --------------
export type CFItem = {
  id?: number | string;
  documentId?: string;
  title?: string;
  slug?: string;
  [k: string]: any;
};

function normalizeOne(raw: any): CFItem | null {
  if (!raw) return null;
  // Strapi v4: { id, attributes: {...} }
  if (raw.attributes) {
    const { attributes } = raw;
    return {
      id: raw.id,
      documentId: raw.documentId || attributes.documentId, // if provided
      ...attributes,
    } as CFItem;
  }
  // Strapi v5 (flattened): fields at root, includes documentId
  return raw as CFItem;
}

function normalizeMany(resData: any): CFItem[] {
  if (!resData) return [];
  const d = resData.data;
  if (Array.isArray(d)) return d.map(normalizeOne).filter(Boolean) as CFItem[];
  const one = normalizeOne(d);
  return one ? [one] : [];
}

// Helper: get the correct identifier for REST path param
function getRestId(idOrItem: string | number | CFItem): string | number {
  if (typeof idOrItem === "string" || typeof idOrItem === "number")
    return idOrItem;
  const docId = idOrItem.documentId ?? undefined;
  return (docId ?? idOrItem.id)!; // prefer documentId (Strapi v5), else numeric id (v4)
}

// -------------- API calls --------------
async function listCatalogFamilies(
  params: Record<string, any> = {
    "pagination[page]": 1,
    "pagination[pageSize]": 24,
    sort: "createdAt:desc",
  }
) {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  const res = await api().get(`/api/catalog-families${qs ? `?${qs}` : ""}`);
  return normalizeMany(res.data);
}

async function createCatalogFamily(data: Partial<CFItem>) {
  const res = await api().post("/api/catalog-families", { data });
  return normalizeMany(res.data)[0] ?? null;
}

async function updateCatalogFamily(
  idOrItem: string | number | CFItem,
  patch: Partial<CFItem>
) {
  const rid = getRestId(idOrItem);
  const res = await api().put(`/api/catalog-families/${rid}`, { data: patch });
  return normalizeMany(res.data)[0] ?? null;
}

async function deleteCatalogFamily(idOrItem: string | number | CFItem) {
  const rid = getRestId(idOrItem);
  const res = await api().delete(`/api/catalog-families/${rid}`);
  return normalizeMany(res.data)[0] ?? ({ id: rid } as CFItem);
}

// -------------- Component --------------
export default function CatalogFamiliesManager() {
  // Create form state
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);

  // List state
  const [items, setItems] = useState<CFItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CFItem | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  async function loadAll(showToast = false) {
    try {
      setLoading(true);
      const list = await listCatalogFamilies();
      setItems(list);
      if (showToast) message.success("Refreshed");
    } catch (e: any) {
      message.error(`Load failed: ${e.message}`);
      console.error("[List Error]", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  // Create handler
  async function handleCreate(values: { title?: string; slug?: string }) {
    setCreating(true);
    try {
      const created = await createCatalogFamily({
        title: values.title,
        slug: values.slug,
      });
      if (created) {
        setItems((prev) => [created, ...prev]);
        message.success("Created successfully");
        console.log(`[Create Success]:\n${JSON.stringify(created, null, 2)}`);
        form.resetFields();
      } else {
        message.warning("No item returned from API");
      }
    } catch (e: any) {
      message.error(`Create failed: ${e.message}`);
      console.error("[Create Error]", e);
    } finally {
      setCreating(false);
    }
  }

  // Edit
  function openEdit(item: CFItem) {
    setEditingItem(item);
    setEditOpen(true);
  }

  async function saveEdit(values: { title?: string; slug?: string }) {
    if (!editingItem) return;
    setSavingEdit(true);
    try {
      const updated = await updateCatalogFamily(editingItem, {
        title: values.title,
        slug: values.slug,
      });
      if (updated) {
        setItems((prev) =>
          prev.map((it) =>
            String(getRestId(it)) === String(getRestId(updated))
              ? { ...it, ...updated }
              : it
          )
        );
        message.success("Updated successfully");
        console.log(`[Update Success]:\n${JSON.stringify(updated, null, 2)}`);
        setEditOpen(false);
        setEditingItem(null);
      }
    } catch (e: any) {
      message.error(`Update failed: ${e.message}`);
      console.error("[Update Error]", e);
    } finally {
      setSavingEdit(false);
    }
  }

  // Delete
  async function handleDelete(item: CFItem) {
    try {
      const deleted = await deleteCatalogFamily(item);
      setItems((prev) =>
        prev.filter((it) => String(getRestId(it)) !== String(getRestId(item)))
      );
      message.success("Deleted");
      console.log(`[Delete Success]:\n${JSON.stringify(deleted, null, 2)}`);
    } catch (e: any) {
      message.error(`Delete failed: ${e.message}`);
      console.error("[Delete Error]", e);
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">
          Catalog Families — Public CRUD
        </h1>
        <Button icon={<ReloadOutlined />} onClick={() => loadAll(true)}>
          Refresh
        </Button>
      </div>

      {/* Create form */}
      <Card
        title="Create a Catalog Family"
        className="mb-6"
        extra={<span className="text-gray-500">Public</span>}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreate}
          autoComplete="off"
        >
          <Row gutter={12}>
            <Col xs={24} md={10}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input placeholder="e.g. products" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: "Please enter a slug" }]}
              >
                <Input placeholder="e.g. products" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={4} className="flex items-end">
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={creating}
                block
              >
                Create
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* List */}
      <Card
        title="Catalog Families"
        extra={<span className="text-gray-500">{items.length} items</span>}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <Empty description="No catalog families yet" />
        ) : (
          <Row gutter={[16, 16]}>
            {items.map((it) => {
              const key = String(getRestId(it));
              return (
                <Col xs={24} sm={12} md={8} key={key}>
                  <Card
                    size="small"
                    title={
                      <span className="font-medium">
                        {it.title || "(untitled)"}
                      </span>
                    }
                    actions={[
                      <EditOutlined key="edit" onClick={() => openEdit(it)} />,
                      <Popconfirm
                        key="del"
                        title={`Delete "${it.title || it.slug}"?`}
                        okText="Delete"
                        okType="danger"
                        onConfirm={() => handleDelete(it)}
                      >
                        <DeleteOutlined />
                      </Popconfirm>,
                    ]}
                  >
                    <div className="text-sm text-gray-600">ID: {key}</div>
                    {it.slug && <div className="text-sm">Slug: {it.slug}</div>}
                    {it.documentId && (
                      <div className="text-xs text-gray-500">
                        documentId: {it.documentId}
                      </div>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        title={`Edit: ${editingItem?.title ?? editingItem?.slug ?? "(item)"}`}
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingItem(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={{ title: editingItem?.title, slug: editingItem?.slug }}
          onFinish={(vals) =>
            saveEdit(vals as { title?: string; slug?: string })
          }
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input allowClear />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please enter a slug" }]}
          >
            <Input allowClear />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={savingEdit}>
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
