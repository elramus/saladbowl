export const ifEnterOrSpace = (e: React.KeyboardEvent, action: () => void) => {
  if (e.key === 'Space' || e.key === ' ' || e.key === 'Enter' || e.key === 'Return') {
    action()
  }
}
