function getCloudinaryConfig() {
  const cloudName = String(
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ??
      process.env.CLOUDINARY_CLOUD_NAME ??
      ''
  ).trim();

  const uploadPreset = String(
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ??
      process.env.CLOUDINARY_UPLOAD_PRESET ??
      ''
  ).trim();

  const missing: string[] = [];
  if (!cloudName) missing.push('EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME');
  if (!uploadPreset) missing.push('EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET');

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de Cloudinary en el .env: ${missing.join(', ')}`
    );
  }

  return { cloudName, uploadPreset };
}

/**
 * Sube una imagen a Cloudinary y retorna la URL segura.
 * @param localUri URI local de la imagen en el dispositivo.
 * @returns URL HTTPS pública de la imagen.
 */
export async function subirImagen(
  localUri: string
): Promise<string> {
  const { cloudName, uploadPreset } =
    getCloudinaryConfig();

  const debugUpload =
    __DEV__ &&
    String(process.env.EXPO_PUBLIC_DEBUG_UPLOAD ?? '') === '1';

  if (!localUri || typeof localUri !== 'string') {
    throw new Error('URI de imagen inválida');
  }

  if (debugUpload) {
    console.log('[UPLOAD] start');
  }

  const formData = new FormData();

  formData.append(
    'file',
    {
      uri: localUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any
  );

  formData.append(
    'upload_preset',
    uploadPreset
  );

  let response: Response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      }
    );
  } catch (networkError: any) {
    throw new Error(
      networkError?.message ||
      'Error de red al subir imagen'
    );
  }

  const contentType =
    response.headers.get('content-type') || '';

  const isJson =
    contentType
      .toLowerCase()
      .includes('application/json');

  let data: any = {};

  try {
    data = isJson
      ? await response.json()
      : await response.text();
  } catch (parseError: any) {
    throw new Error(
      'No se pudo interpretar la respuesta de Cloudinary'
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message ||
      data?.message ||
      'Error subiendo imagen'
    );
  }

  if (!data?.secure_url) {
    throw new Error(
      'Cloudinary no devolvió secure_url'
    );
  }

  return data.secure_url;
}
