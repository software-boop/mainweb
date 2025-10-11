"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  Descriptions,
  Select,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Option } = Select;

/**
 * CatalogTypes — fields:
 *  - title (string)
 *  - slug (string/UID)
 *  - catalog_family (single relation; dropdown shows family.title)
 *
 * Endpoints:
 *  - GET/POST   /api/catalog-types
 *  - GET/PUT/DELETE /api/catalog-types/:id
 *
 * Strapi v5: use documentId in :id paths. We prefer documentId if present.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/* -------------------- Axios client -------------------- */
let _client: AxiosInstance | null = null;
function api() {
  if (!_client) {
    _client = axios.create({ baseURL: API_URL });
    _client.interceptors.response.use(
      (r) => r,
      (err) => {
        const msg =
          err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err.message ||
          "Request failed";
        return Promise.reject(new Error(msg));
      }
    );
  }
  return _client;
}

/* -------------------- Types -------------------- */
export type CTItem = {
  id?: number | string;
  documentId?: string;
  title?: string;
  slug?: string;
  catalog_family?: any; // relation (single) normalized as entity or null
  [k: string]: any;
};

type FamilyOption = {
  id: number | string;
  documentId?: string;
  title: string;
  raw: any;
};

/* -------------------- Helpers & Normalizers -------------------- */
function labelFromEntity(entity: any): string {
  if (!entity) return "(unknown)";
  // v4-style nested:
  if (entity.attributes) {
    const a = entity.attributes;
    return (
      a.title ||
      a.slug ||
      a.name ||
      String(entity.id ?? entity.documentId ?? "")
    );
  }
  // v5 flat:
  return (
    entity.title ||
    entity.slug ||
    entity.name ||
    String(entity.id ?? entity.documentId ?? "")
  );
}

function normalizeOneType(raw: any): CTItem | null {
  if (!raw) return null;
  if (raw.attributes) {
    const { attributes } = raw;
    const fam = attributes.catalog_family?.data ?? null;
    return {
      id: raw.id,
      documentId: raw.documentId || attributes.documentId,
      ...attributes,
      catalog_family: fam,
    } as CTItem;
  }
  // v5 flat
  return raw as CTItem;
}

function normalizeManyTypes(resData: any): CTItem[] {
  if (!resData) return [];
  const d = resData.data;
  if (Array.isArray(d))
    return d.map(normalizeOneType).filter(Boolean) as CTItem[];
  const one = normalizeOneType(d);
  return one ? [one] : [];
}

function normalizeManyFamilies(resData: any): FamilyOption[] {
  if (!resData) return [];
  const d = resData.data;
  const normalizeFam = (row: any): FamilyOption | null => {
    if (!row) return null;
    if (row.attributes) {
      return {
        id: row.id,
        documentId: row.documentId || row.attributes.documentId,
        title: row.attributes.title || row.attributes.slug || String(row.id),
        raw: row,
      };
    }
    return {
      id: row.id,
      documentId: row.documentId,
      title: row.title || row.slug || String(row.id),
      raw: row,
    };
  };
  if (Array.isArray(d))
    return d.map(normalizeFam).filter(Boolean) as FamilyOption[];
  const one = normalizeFam(d);
  return one ? [one] : [];
}

// prefer documentId (v5) else numeric id (v4)
function getRestId(idOrItem: string | number | CTItem): string | number {
  if (typeof idOrItem === "string" || typeof idOrItem === "number")
    return idOrItem;
  const docId = idOrItem.documentId ?? undefined;
  return (docId ?? idOrItem.id)!;
}

/* -------------------- API: catalog-types -------------------- */
async function listCatalogTypes(
  params: Record<string, any> = {
    "pagination[page]": 1,
    "pagination[pageSize]": 24,
    sort: "createdAt:desc",
    populate: "catalog_family",
  }
) {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  const res = await api().get(`/api/catalog-types${qs ? `?${qs}` : ""}`);
  return normalizeManyTypes(res.data);
}

async function createCatalogType(data: Partial<CTItem>) {
  const res = await api().post("/api/catalog-types", { data });
  return normalizeManyTypes(res.data)[0] ?? null;
}

async function getCatalogType(idOrItem: string | number | CTItem) {
  const rid = getRestId(idOrItem);
  const res = await api().get(
    `/api/catalog-types/${rid}?populate=catalog_family`
  );
  return normalizeManyTypes(res.data)[0] ?? null;
}

async function updateCatalogType(
  idOrItem: string | number | CTItem,
  patch: Partial<CTItem>
) {
  const rid = getRestId(idOrItem);
  const res = await api().put(`/api/catalog-types/${rid}`, { data: patch });
  return normalizeManyTypes(res.data)[0] ?? null;
}

async function deleteCatalogType(idOrItem: string | number | CTItem) {
  const rid = getRestId(idOrItem);
  const res = await api().delete(`/api/catalog-types/${rid}`);
  return normalizeManyTypes(res.data)[0] ?? ({ id: rid } as CTItem);
}

/* -------------------- API: catalog-families (for dropdown) -------------------- */
async function listCatalogFamilies(
  params: Record<string, any> = {
    "pagination[page]": 1,
    "pagination[pageSize]": 200,
    sort: "title:asc",
  }
) {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  const res = await api().get(`/api/catalog-families${qs ? `?${qs}` : ""}`);
  return normalizeManyFamilies(res.data);
}

/* -------------------- Component -------------------- */
export default function CatalogTypesManager() {
  // Create form
  const [createForm] = Form.useForm();
  const [creating, setCreating] = useState(false);

  // List state
  const [items, setItems] = useState<CTItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CTItem | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm] = Form.useForm();

  // View modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState<CTItem | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Families dropdown
  const [families, setFamilies] = useState<FamilyOption[]>([]);
  const famMap = useMemo(
    () => new Map(families.map((f) => [String(f.id), f])),
    [families]
  );

  async function loadAll(showToast = false) {
    try {
      setLoading(true);
      const [list, fams] = await Promise.all([
        listCatalogTypes(),
        listCatalogFamilies(),
      ]);
      setItems(list);
      setFamilies(fams);
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

  // sync edit form fields
  useEffect(() => {
    if (editOpen && editingItem) {
      editForm.setFieldsValue({
        title: editingItem.title ?? "",
        slug: editingItem.slug ?? "",
        catalog_family: editingItem.catalog_family?.id
          ? String(editingItem.catalog_family.id)
          : undefined,
      });
    } else {
      editForm.resetFields();
    }
  }, [editOpen, editingItem, editForm]);

  /* ---------- Create ---------- */
  async function handleCreate(values: {
    title?: string;
    slug?: string;
    catalog_family?: string;
  }) {
    setCreating(true);
    try {
      const payload: any = {
        title: values.title,
        slug: values.slug,
      };
      if (values.catalog_family !== undefined) {
        payload.catalog_family =
          values.catalog_family === "" || values.catalog_family === null
            ? null
            : Number.isNaN(Number(values.catalog_family))
            ? values.catalog_family
            : Number(values.catalog_family);
      }

      const created = await createCatalogType(payload);
      if (created) {
        const fresh = await getCatalogType(created);
        setItems((prev) => [fresh ?? created, ...prev]);
        message.success("Created successfully");
        console.log(
          `[Create Success]:\n${JSON.stringify(fresh ?? created, null, 2)}`
        );
        createForm.resetFields();
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

  /* ---------- Edit ---------- */
  function openEdit(item: CTItem) {
    setEditingItem(item);
    setEditOpen(true);
  }

  async function saveEdit(values: {
    title?: string;
    slug?: string;
    catalog_family?: string;
  }) {
    if (!editingItem) return;
    setSavingEdit(true);
    try {
      const patch: any = {
        title: values.title,
        slug: values.slug,
      };
      if (values.catalog_family !== undefined) {
        patch.catalog_family =
          values.catalog_family === "" || values.catalog_family === null
            ? null
            : Number.isNaN(Number(values.catalog_family))
            ? values.catalog_family
            : Number(values.catalog_family);
      }

      const updated = await updateCatalogType(editingItem, patch);
      if (updated) {
        const fresh = await getCatalogType(updated);
        setItems((prev) =>
          prev.map((it) =>
            String(getRestId(it)) === String(getRestId(updated))
              ? { ...it, ...(fresh ?? updated) }
              : it
          )
        );
        message.success("Updated successfully");
        console.log(
          `[Update Success]:\n${JSON.stringify(fresh ?? updated, null, 2)}`
        );
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

  /* ---------- View ---------- */
  async function handleView(item: CTItem) {
    setViewLoading(true);
    setViewOpen(true);
    try {
      const fresh = await getCatalogType(item);
      if (!fresh) throw new Error("Not found");
      setViewItem(fresh);
    } catch (e: any) {
      message.error(`Fetch item failed: ${e.message}`);
      console.error("[Get One Error]", e);
      setViewItem(item);
    } finally {
      setViewLoading(false);
    }
  }

  /* ---------- Delete ---------- */
  async function handleDelete(item: CTItem) {
    try {
      const deleted = await deleteCatalogType(item);
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

  /* ---------- UI ---------- */
  function renderFamily(it: CTItem) {
    const fam = it.catalog_family;
    if (!fam) return <span className="text-gray-500">None</span>;
    return <Tag>{labelFromEntity(fam)}</Tag>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Catalog Types — Public CRUD</h1>
        <Button icon={<ReloadOutlined />} onClick={() => loadAll(true)}>
          Refresh
        </Button>
      </div>

      {/* Create */}
      <Card
        title="Create a Catalog Type"
        className="mb-6"
        extra={<span className="text-gray-500">Public</span>}
      >
        <Form
          form={createForm}
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
                <Input placeholder="e.g. Security Products" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: "Please enter a slug" }]}
              >
                <Input placeholder="e.g. securityproducts" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={10}>
              <Form.Item name="catalog_family" label="Catalog Family">
                <Select
                  allowClear
                  placeholder="Select a family"
                  showSearch
                  optionFilterProp="children"
                >
                  {families.map((f) => (
                    <Option key={String(f.id)} value={String(f.id)}>
                      {f.title}
                    </Option>
                  ))}
                </Select>
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
        title="Catalog Types"
        extra={<span className="text-gray-500">{items.length} items</span>}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <Empty description="No catalog types yet" />
        ) : (
          <Row gutter={[16, 16]}>
            {items.map((it) => {
              const key = String(getRestId(it));
              const titleText = it.title || it.slug || "(untitled)";
              return (
                <Col xs={24} sm={12} md={8} key={key}>
                  <Card
                    size="small"
                    title={<span className="font-medium">{titleText}</span>}
                    actions={[
                      <Button
                        key="view"
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(it)}
                      />,
                      <Button
                        key="edit"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEdit(it)}
                      />,
                      <Popconfirm
                        key="del"
                        title={`Delete "${titleText}"?`}
                        okText="Delete"
                        okType="danger"
                        onConfirm={() => handleDelete(it)}
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>,
                    ]}
                  >
                    <div className="text-sm text-gray-600">ID: {key}</div>
                    {it.slug && <div className="text-sm">Slug: {it.slug}</div>}
                    <div className="text-sm mt-1">
                      <span className="font-medium">Family: </span>
                      {renderFamily(it)}
                    </div>
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
        <Form form={editForm} layout="vertical" onFinish={saveEdit}>
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
          <Form.Item name="catalog_family" label="Catalog Family">
            <Select
              allowClear
              placeholder="Select a family"
              showSearch
              optionFilterProp="children"
            >
              {families.map((f) => (
                <Option key={String(f.id)} value={String(f.id)}>
                  {f.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={savingEdit}>
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`Details: ${viewItem?.title ?? viewItem?.slug ?? "(item)"}`}
        open={viewOpen}
        onCancel={() => {
          setViewOpen(false);
          setViewItem(null);
        }}
        footer={<Button onClick={() => setViewOpen(false)}>Close</Button>}
        destroyOnClose
      >
        {viewLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spin />
          </div>
        ) : !viewItem ? (
          <Empty description="No data" />
        ) : (
          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="ID">
              {String(getRestId(viewItem))}
            </Descriptions.Item>
            {viewItem.title && (
              <Descriptions.Item label="Title">
                {viewItem.title}
              </Descriptions.Item>
            )}
            {viewItem.slug && (
              <Descriptions.Item label="Slug">
                {viewItem.slug}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Catalog Family">
              {viewItem.catalog_family ? (
                labelFromEntity(viewItem.catalog_family)
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
