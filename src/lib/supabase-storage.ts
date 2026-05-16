const DEFAULT_STORAGE_BUCKET = "raka_hris";

type UploadStorageObjectInput = {
  path: string;
  file: File;
  contentType: string;
  cacheControl?: string;
};

type SupabaseStorageConfig = {
  bucket: string;
  serviceRoleKey: string;
  url: string;
};

export class SupabaseStorageConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SupabaseStorageConfigurationError";
  }
}

export async function uploadStorageObject({
  path,
  file,
  contentType,
  cacheControl = "3600",
}: UploadStorageObjectInput) {
  const config = getSupabaseStorageConfig();
  const uploadUrl = buildStorageObjectUrl(config.url, config.bucket, path);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Cache-Control": `max-age=${cacheControl}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body: file,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getStorageErrorMessage(response));
  }

  return {
    bucket: config.bucket,
    path,
  };
}

export async function getStorageObject(path: string) {
  const config = getSupabaseStorageConfig();
  const objectUrl = buildStorageObjectUrl(config.url, config.bucket, path);

  const response = await fetch(objectUrl, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getStorageErrorMessage(response));
  }

  return response;
}

function getSupabaseStorageConfig(): SupabaseStorageConfig {
  const url = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_STORAGE_BUCKET;

  if (!url || !serviceRoleKey) {
    throw new SupabaseStorageConfigurationError(
      "Supabase storage is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return {
    bucket,
    serviceRoleKey,
    url,
  };
}

function normalizeSupabaseUrl(value: string | undefined) {
  const normalized = value?.trim().replace(/\/+$/, "");

  return normalized || null;
}

function buildStorageObjectUrl(url: string, bucket: string, path: string) {
  return `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${encodeObjectPath(path)}`;
}

function encodeObjectPath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function getStorageErrorMessage(response: Response) {
  const fallbackMessage = "Company logo could not be uploaded to Supabase Storage.";
  const payload = await response.json().catch(() => null);

  if (isRecord(payload)) {
    const message = payload.message ?? payload.error;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallbackMessage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
