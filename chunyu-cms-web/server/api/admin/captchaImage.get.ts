import { LoginServices } from '~~/server/services/admin/login/login.services';

const formatErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  const message = JSON.stringify(error);
  return message === '{}' ? String(error) : message;
};

export default defineEventHandler(async () => {
  try {
    const data = await new LoginServices().createImageCaptcha();
    return createApiResponse(data);
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: formatErrorMessage(error),
      message: formatErrorMessage(error)
    });
  }
});
