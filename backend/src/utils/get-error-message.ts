const hasErrorMessage = (error: unknown): error is { message: string } => {
  return !!(error as { message: string }).message
}

export const getErrorMessage = (error: unknown): string => {
  if (hasErrorMessage(error)) {
    return error.message
  } else {
    return 'Error'
  }
}
