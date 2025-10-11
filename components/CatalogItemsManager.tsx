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
  Space,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd/es/upload/interface";

const { Option } = Select;

/* ================= Config ================= */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

/* ================= Axios ================= */
let _client: AxiosInstance | null = null;
function api() {
  if (!_client) {
    _client = axios.create({ baseURL: API_URL });
    _client.interceptors.response.use(
      (r) => r,
      (err) => {
        // Normalize Strapi error messages (v4/v5)
        const raw =
          err?.response?.data?.error?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Request failed";
        return Promise.reject(
          new Error(typeof raw === "string" ? raw : JSON.stringify(raw))
        );
      }
    );
  }
  return _client;
}

/* ================= Types ================= */
type MediaFile = {
  id: number | string;
  url?: string;
  name?: string;
  mime?: string;
  [k: string]: any;
};

export type CIItem = {
  id?: number | string;
  documentId?: string;
  label?: string;
  slug?: string;
  description?: string;
  catalog_family?: any; // entity (single)
  catalog_type?: any; // entity (single)
  heroImage?: MediaFile | null; // single media
  features?: Array<{
    name?: string;
    description?: string;
    icon?: MediaFile | null;
  }>;
  [k: string]: any;
};

type OptionRow = {
  id: number | string;
  documentId?: string;
  title: string;
  raw: any;
};

/* ================= Helpers ================= */
function getRestId(idOrItem: string | number | CIItem): string | number {
  if (typeof idOrItem === "string" || typeof idOrItem === "number")
    return idOrItem;
  const docId = idOrItem.documentId ?? undefined;
  return (docId ?? idOrItem.id)!; // prefer documentId (v5), else numeric id (v4)
}

function labelFromEntity(entity: any): string {
  if (!entity) return "(unknown)";
  if (entity.attributes) {
    const a = entity.attributes;
    return (
      a.title ||
      a.label ||
      a.name ||
      a.slug ||
      String(entity.id ?? entity.documentId ?? "")
    );
  }
  return (
    entity.title ||
    entity.label ||
    entity.name ||
    entity.slug ||
    String(entity.id ?? entity.documentId ?? "")
  );
}

/* ---- normalizers for items ---- */
function normalizeOneItem(raw: any): CIItem | null {
  if (!raw) return null;

  // v4: { id, attributes: {...} }
  if (raw.attributes) {
    const a = raw.attributes;
    const fam = a.catalog_family?.data ?? null;
    const typ = a.catalog_type?.data ?? null;
    const hero = a.heroImage?.data ?? null;
    const feats = Array.isArray(a.features) ? a.features : [];

    const heroFile: MediaFile | null = hero
      ? { id: hero.id, ...(hero.attributes || {}) }
      : null;

    const fixedFeats = feats.map((f: any) => {
      const icon = f?.icon?.data ?? null;
      const iconFile: MediaFile | null = icon
        ? { id: icon.id, ...(icon.attributes || {}) }
        : null;
      return {
        name: f?.name,
        description: f?.description,
        icon: iconFile,
      };
    });

    return {
      id: raw.id,
      documentId: raw.documentId || a.documentId,
      label: a.label,
      slug: a.slug,
      description: a.description,
      catalog_family: fam,
      catalog_type: typ,
      heroImage: heroFile,
      features: fixedFeats,
      ...a,
    } as CIItem;
  }

  // v5: flattened (already populated)
  return raw as CIItem;
}

function normalizeManyItems(resData: any): CIItem[] {
  if (!resData) return [];
  const d = resData.data;
  if (Array.isArray(d))
    return d.map(normalizeOneItem).filter(Boolean) as CIItem[];
  const one = normalizeOneItem(d);
  return one ? [one] : [];
}

/* ---- normalizers for options ---- */
function normalizeOptions(resData: any): OptionRow[] {
  if (!resData) return [];
  const arr = Array.isArray(resData.data) ? resData.data : [resData.data];
  return arr.filter(Boolean).map((row: any) => {
    if (row.attributes) {
      return {
        id: row.id,
        documentId: row.documentId || row.attributes.documentId,
        title:
          row.attributes.title ||
          row.attributes.label ||
          row.attributes.slug ||
          String(row.id),
        raw: row,
      };
    }
    return {
      id: row.id,
      documentId: row.documentId,
      title: row.title || row.label || row.slug || String(row.id),
      raw: row,
    };
  });
}

/* ================= API: Items ================= */
// Use populate=* to work across Strapi v4/v5 without query shape errors.
async function listCatalogItems(
  params: Record<string, any> = {
    "pagination[page]": 1,
    "pagination[pageSize]": 24,
    sort: "createdAt:desc",
    populate: "*",
  }
) {
  const qs = new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString();
  const res = await api().get(`/api/catalog-items${qs ? `?${qs}` : ""}`);
  return normalizeManyItems(res.data);
}

async function createCatalogItem(data: Partial<CIItem>) {
  const res = await api().post("/api/catalog-items", { data });
  return normalizeManyItems(res.data)[0] ?? null;
}

async function getCatalogItem(idOrItem: string | number | CIItem) {
  const rid = getRestId(idOrItem);
  const res = await api().get(`/api/catalog-items/${rid}?populate=*`);
  return normalizeManyItems(res.data)[0] ?? null;
}

async function updateCatalogItem(
  idOrItem: string | number | CIItem,
  patch: Partial<CIItem>
) {
  const rid = getRestId(idOrItem);
  const res = await api().put(`/api/catalog-items/${rid}`, { data: patch });
  return normalizeManyItems(res.data)[0] ?? null;
}

async function deleteCatalogItem(idOrItem: string | number | CIItem) {
  const rid = getRestId(idOrItem);
  const res = await api().delete(`/api/catalog-items/${rid}`);
  return normalizeManyItems(res.data)[0] ?? ({ id: rid } as CIItem);
}

/* ================= API: Families & Types (dropdowns) ================= */
async function listCatalogFamilies() {
  const res = await api().get(`/api/catalog-families?sort=title:asc`);
  return normalizeOptions(res.data);
}

async function listCatalogTypes() {
  const res = await api().get(`/api/catalog-types?sort=title:asc`);
  return normalizeOptions(res.data);
}

/* ================= API: Uploads ================= */
async function uploadOne(file: File): Promise<MediaFile> {
  const fd = new FormData();
  fd.append("files", file);
  const res = await api().post(`/api/upload`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const arr: any[] = Array.isArray(res.data) ? res.data : [res.data];
  return arr[0];
}

async function deleteFile(fileId: number | string) {
  await api().delete(`/api/upload/files/${fileId}`);
}

/* ================= Single image upload field ================= */
type SingleUploadProps = {
  value?: MediaFile | null;
  onChange?: (v: MediaFile | null) => void;
  buttonText?: string;
};

function SingleImageUpload({
  value,
  onChange,
  buttonText = "Upload",
}: SingleUploadProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (value?.id) {
      const url = value.url?.startsWith("http")
        ? value.url
        : value.url
        ? `${API_URL}${value.url}`
        : undefined;
      setFileList([
        {
          uid: String(value.id),
          name: value.name || `file-${value.id}`,
          status: "done",
          url,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [value]);

  const props: UploadProps = {
    fileList,
    listType: "picture-card",
    multiple: false,
    customRequest: async (req) => {
      try {
        const f = req.file as File;
        const uploaded = await uploadOne(f);
        const url = uploaded.url?.startsWith("http")
          ? uploaded.url
          : uploaded.url
          ? `${API_URL}${uploaded.url}`
          : undefined;

        const uf: UploadFile = {
          uid: String(uploaded.id),
          name: uploaded.name || f.name,
          status: "done",
          url,
        };
        setFileList([uf]);
        onChange?.(uploaded);
        req.onSuccess && req.onSuccess({}, uf as any);
      } catch (e: any) {
        message.error(`Upload failed: ${e.message}`);
        req.onError && req.onError(e);
      }
    },
    onRemove: async () => {
      try {
        if (value?.id) {
          await deleteFile(value.id);
        }
      } catch (e) {
        // best effort
      }
      setFileList([]);
      onChange?.(null);
      return true;
    },
    maxCount: 1,
  };

  return (
    <Upload {...props}>
      {fileList.length >= 1 ? null : (
        <Button icon={<UploadOutlined />}>{buttonText}</Button>
      )}
    </Upload>
  );
}

/* ================= Component ================= */
export default function CatalogItemsManager() {
  // forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // options
  const [families, setFamilies] = useState<OptionRow[]>([]);
  const [types, setTypes] = useState<OptionRow[]>([]);
  const famMap = useMemo(
    () => new Map(families.map((f) => [String(f.id), f])),
    [families]
  );
  const typeMap = useMemo(
    () => new Map(types.map((t) => [String(t.id), t])),
    [types]
  );

  // list/state
  const [items, setItems] = useState<CIItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CIItem | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // view modal
  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState<CIItem | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  async function loadAll(showToast = false) {
    try {
      setLoading(true);
      const [list, fams, tps] = await Promise.all([
        listCatalogItems(),
        listCatalogFamilies(),
        listCatalogTypes(),
      ]);
      setItems(list);
      setFamilies(fams);
      setTypes(tps);
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

  // sync edit form
  useEffect(() => {
    if (editOpen && editingItem) {
      editForm.setFieldsValue({
        label: editingItem.label ?? "",
        slug: editingItem.slug ?? "",
        description: editingItem.description ?? "",
        catalog_family: editingItem.catalog_family?.id
          ? String(editingItem.catalog_family.id)
          : undefined,
        catalog_type: editingItem.catalog_type?.id
          ? String(editingItem.catalog_type.id)
          : undefined,
        heroImage: editingItem.heroImage ?? null,
        features:
          Array.isArray(editingItem.features) && editingItem.features.length
            ? editingItem.features.map((f) => ({
                name: f.name ?? "",
                description: f.description ?? "",
                icon: f.icon ?? null,
              }))
            : [],
      });
    } else {
      editForm.resetFields();
    }
  }, [editOpen, editingItem, editForm]);

  /* ---------- Create ---------- */
  async function handleCreate(values: any) {
    setCreating(true);
    try {
      // Build payload with only present fields
      const payload: any = {};
      if (values.label !== undefined) payload.label = values.label;
      if (values.slug !== undefined) payload.slug = values.slug;
      if (values.description !== undefined)
        payload.description = values.description;

      if (values.catalog_family !== undefined && values.catalog_family !== "") {
        payload.catalog_family = Number.isNaN(Number(values.catalog_family))
          ? values.catalog_family
          : Number(values.catalog_family);
      }
      if (values.catalog_type !== undefined && values.catalog_type !== "") {
        payload.catalog_type = Number.isNaN(Number(values.catalog_type))
          ? values.catalog_type
          : Number(values.catalog_type);
      }
      if (values.heroImage?.id) {
        payload.heroImage = values.heroImage.id;
      }
      if (Array.isArray(values.features)) {
        payload.features = values.features.map((f: any) => ({
          name: f?.name ?? "",
          description: f?.description ?? "",
          icon: f?.icon?.id ?? null,
        }));
      }

      const created = await createCatalogItem(payload);

      if (!created) {
        message.warning("No item returned from API");
        return;
      }

      // fetch fresh with populate=* so relations/media show
      const fresh = await getCatalogItem(created);
      setItems((prev) => [fresh ?? created, ...prev]);
      message.success("Created successfully");
      createForm.resetFields();
    } catch (e: any) {
      // Typical: “This attribute must be unique” for slug collisions
      message.error(`Create failed: ${e.message}`);
      console.error("[Create Error]", e);
    } finally {
      setCreating(false);
    }
  }

  /* ---------- Edit ---------- */
  function openEdit(item: CIItem) {
    setEditingItem(item);
    setEditOpen(true);
  }

  async function saveEdit(values: any) {
    if (!editingItem) return;
    setSavingEdit(true);
    try {
      const patch: any = {};
      if (values.label !== undefined) patch.label = values.label;
      if (values.slug !== undefined) patch.slug = values.slug;
      if (values.description !== undefined)
        patch.description = values.description;

      if (values.catalog_family !== undefined) {
        patch.catalog_family =
          values.catalog_family === "" || values.catalog_family === null
            ? null
            : Number.isNaN(Number(values.catalog_family))
            ? values.catalog_family
            : Number(values.catalog_family);
      }
      if (values.catalog_type !== undefined) {
        patch.catalog_type =
          values.catalog_type === "" || values.catalog_type === null
            ? null
            : Number.isNaN(Number(values.catalog_type))
            ? values.catalog_type
            : Number(values.catalog_type);
      }

      if (values.heroImage?.id) {
        patch.heroImage = values.heroImage.id;
      } else if (values.heroImage === null) {
        patch.heroImage = null;
      }

      if (Array.isArray(values.features)) {
        patch.features = values.features.map((f: any) => ({
          name: f?.name ?? "",
          description: f?.description ?? "",
          icon: f?.icon?.id ?? null,
        }));
      }

      const updated = await updateCatalogItem(editingItem, patch);
      if (updated) {
        const fresh = await getCatalogItem(updated);
        setItems((prev) =>
          prev.map((it) =>
            String(getRestId(it)) === String(getRestId(updated))
              ? { ...it, ...(fresh ?? updated) }
              : it
          )
        );
        message.success("Updated successfully");
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
  async function handleView(item: CIItem) {
    setViewLoading(true);
    setViewOpen(true);
    try {
      const fresh = await getCatalogItem(item);
      setViewItem(fresh ?? item);
    } catch (e: any) {
      message.error(`Fetch item failed: ${e.message}`);
      console.error("[Get One Error]", e);
      setViewItem(item);
    } finally {
      setViewLoading(false);
    }
  }

  /* ---------- Delete ---------- */
  async function handleDelete(item: CIItem) {
    try {
      await deleteCatalogItem(item);
      setItems((prev) =>
        prev.filter((it) => String(getRestId(it)) !== String(getRestId(item)))
      );
      message.success("Deleted");
    } catch (e: any) {
      message.error(`Delete failed: ${e.message}`);
      console.error("[Delete Error]", e);
    }
  }

  /* ---------- UI helpers ---------- */
  function renderHeader(it: CIItem) {
    return (
      <span className="font-medium">
        {it.label || it.slug || "(untitled)"}{" "}
      </span>
    );
  }

  function renderRel(label: string, ent: any) {
    return (
      <div className="text-sm mt-1">
        <span className="font-medium">{label}: </span>
        {ent ? (
          <Tag>{labelFromEntity(ent)}</Tag>
        ) : (
          <span className="text-gray-500">None</span>
        )}
      </div>
    );
  }

  function renderHero(it: CIItem) {
    const f = it.heroImage;
    if (!f?.url) return null;
    const url = f.url.startsWith("http") ? f.url : `${API_URL}${f.url}`;
    return (
      <div className="mt-2">
        <img
          src={url}
          alt={f.name || "hero"}
          className="rounded-md"
          style={{ width: "100%", maxHeight: 160, objectFit: "cover" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Catalog Items — Public CRUD</h1>
        <Button icon={<ReloadOutlined />} onClick={() => loadAll(true)}>
          Refresh
        </Button>
      </div>

      {/* Create */}
      <Card
        title="Create a Catalog Item"
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
            <Col xs={24} md={8}>
              <Form.Item
                name="label"
                label="Label"
                rules={[{ required: true, message: "Please enter label" }]}
              >
                <Input placeholder="e.g. Smart Camera Kit" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: "Please enter slug" }]}
              >
                <Input placeholder="e.g. smart-camera-kit" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
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
            <Col xs={24} md={8}>
              <Form.Item name="catalog_type" label="Catalog Type">
                <Select
                  allowClear
                  placeholder="Select a type"
                  showSearch
                  optionFilterProp="children"
                >
                  {types.map((t) => (
                    <Option key={String(t.id)} value={String(t.id)}>
                      {t.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} placeholder="Short overview..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="heroImage"
                label="Hero Image"
                valuePropName="value"
              >
                <SingleImageUpload buttonText="Upload Hero Image" />
              </Form.Item>
            </Col>

            {/* Features (repeatable) */}
            <Col span={24}>
              <Form.List name="features" initialValue={[]}>
                {(fields, { add, remove }) => (
                  <Card
                    title="Features"
                    size="small"
                    extra={
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        Add Feature
                      </Button>
                    }
                  >
                    {fields.length === 0 ? (
                      <Empty description="No features yet" />
                    ) : (
                      fields.map(({ key, name, ...rest }) => (
                        <Card
                          key={key}
                          type="inner"
                          className="mb-3"
                          title={`Feature ${name + 1}`}
                          extra={
                            <Button danger onClick={() => remove(name)}>
                              Remove
                            </Button>
                          }
                        >
                          <Row gutter={12}>
                            <Col xs={24} md={8}>
                              <Form.Item
                                {...rest}
                                name={[name, "name"]}
                                label="Name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter feature name",
                                  },
                                ]}
                              >
                                <Input allowClear />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={10}>
                              <Form.Item
                                {...rest}
                                name={[name, "description"]}
                                label="Description"
                              >
                                <Input.TextArea rows={2} />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                              <Form.Item
                                {...rest}
                                name={[name, "icon"]}
                                label="Icon"
                                valuePropName="value"
                              >
                                <SingleImageUpload buttonText="Upload Icon" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      ))
                    )}
                  </Card>
                )}
              </Form.List>
            </Col>

            <Col xs={24} className="flex items-end justify-end">
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={creating}
              >
                Create
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* List */}
      <Card
        title="Catalog Items"
        extra={<span className="text-gray-500">{items.length} items</span>}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spin />
          </div>
        ) : items.length === 0 ? (
          <Empty description="No items yet" />
        ) : (
          <Row gutter={[16, 16]}>
            {items.map((it) => {
              const key = String(getRestId(it));
              return (
                <Col xs={24} sm={12} md={8} key={key}>
                  <Card
                    size="small"
                    title={renderHeader(it)}
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
                        title={`Delete "${it.label || it.slug}"?`}
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
                    {renderRel("Family", it.catalog_family)}
                    {renderRel("Type", it.catalog_type)}
                    {renderHero(it)}
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        title={`Edit: ${editingItem?.label ?? editingItem?.slug ?? "(item)"}`}
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingItem(null);
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={saveEdit}>
          <Row gutter={12}>
            <Col xs={24} md={8}>
              <Form.Item
                name="label"
                label="Label"
                rules={[{ required: true, message: "Enter label" }]}
              >
                <Input allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="slug"
                label="Slug"
                rules={[{ required: true, message: "Enter slug" }]}
              >
                <Input allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
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
            <Col xs={24} md={8}>
              <Form.Item name="catalog_type" label="Catalog Type">
                <Select
                  allowClear
                  placeholder="Select a type"
                  showSearch
                  optionFilterProp="children"
                >
                  {types.map((t) => (
                    <Option key={String(t.id)} value={String(t.id)}>
                      {t.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item name="description" label="Description">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="heroImage"
                label="Hero Image"
                valuePropName="value"
              >
                <SingleImageUpload buttonText="Upload Hero Image" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.List name="features">
                {(fields, { add, remove }) => (
                  <Card
                    title="Features"
                    size="small"
                    extra={
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        Add Feature
                      </Button>
                    }
                  >
                    {fields.length === 0 ? (
                      <Empty description="No features yet" />
                    ) : (
                      fields.map(({ key, name, ...rest }) => (
                        <Card
                          key={key}
                          type="inner"
                          className="mb-3"
                          title={`Feature ${name + 1}`}
                          extra={
                            <Button danger onClick={() => remove(name)}>
                              Remove
                            </Button>
                          }
                        >
                          <Row gutter={12}>
                            <Col xs={24} md={8}>
                              <Form.Item
                                {...rest}
                                name={[name, "name"]}
                                label="Name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter feature name",
                                  },
                                ]}
                              >
                                <Input allowClear />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={10}>
                              <Form.Item
                                {...rest}
                                name={[name, "description"]}
                                label="Description"
                              >
                                <Input.TextArea rows={2} />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={6}>
                              <Form.Item
                                {...rest}
                                name={[name, "icon"]}
                                label="Icon"
                                valuePropName="value"
                              >
                                <SingleImageUpload buttonText="Upload Icon" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      ))
                    )}
                  </Card>
                )}
              </Form.List>
            </Col>

            <Col span={24} className="flex justify-end">
              <Space>
                <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={savingEdit}>
                  Save
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title={`Details: ${viewItem?.label ?? viewItem?.slug ?? "(item)"}`}
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
            {viewItem.slug && (
              <Descriptions.Item label="Slug">
                {viewItem.slug}
              </Descriptions.Item>
            )}
            {viewItem.label && (
              <Descriptions.Item label="Label">
                {viewItem.label}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Family">
              {viewItem.catalog_family ? (
                labelFromEntity(viewItem.catalog_family)
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {viewItem.catalog_type ? (
                labelFromEntity(viewItem.catalog_type)
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </Descriptions.Item>
            {viewItem.description && (
              <Descriptions.Item label="Description">
                {viewItem.description}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Hero Image">
              {viewItem.heroImage?.url ? (
                <img
                  src={
                    viewItem.heroImage.url.startsWith("http")
                      ? viewItem.heroImage.url
                      : `${API_URL}${viewItem.heroImage.url}`
                  }
                  alt={viewItem.heroImage.name || "hero"}
                  style={{ maxWidth: "100%", borderRadius: 8 }}
                />
              ) : (
                <span className="text-gray-500">None</span>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Features">
              {Array.isArray(viewItem.features) && viewItem.features.length ? (
                <div className="space-y-2">
                  {viewItem.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {f.icon?.url && (
                        <img
                          src={
                            f.icon.url.startsWith("http")
                              ? f.icon.url
                              : `${API_URL}${f.icon.url}`
                          }
                          alt={f.icon.name || "icon"}
                          style={{
                            width: 32,
                            height: 32,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      )}
                      <div>
                        <div className="font-medium">{f.name}</div>
                        <div className="text-gray-600 text-sm">
                          {f.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
