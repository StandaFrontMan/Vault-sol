export function formatAddr(addr: string): string {
  const formatedAddr: string = addr.slice(0, 6) + '...' + addr.slice(-4)
  return formatedAddr
}
