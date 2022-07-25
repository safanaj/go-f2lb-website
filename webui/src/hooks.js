
export const handle = async ({ event, resolve }) => {
  return await resolve(event, { ssr: false });
}
