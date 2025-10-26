import { HttpException, InternalServerErrorException } from '@nestjs/common';

export async function safeAction<T>(
  action: () => T | Promise<T>,
  messageError?: string,
): Promise<T> {
  try {
    const res = await action();
    return res;
  } catch (error) {
    console.error(error);

    if (error instanceof HttpException) {
      throw error;
    }

    // Incluye detalles del error original si existe
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';

    const finalMessage = messageError
      ? `${messageError}: ${errorMessage}`
      : errorMessage;

    console.error(finalMessage);
    throw new InternalServerErrorException(messageError);
  }
}
