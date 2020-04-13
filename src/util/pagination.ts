export function calcPagination (pageQuery: string | undefined, limit: number) {
  const page = parseInt(pageQuery || "");
  if (isNaN(page) || page <= 0) {
    return 0;
  }

  return (page - 1) * limit;
}
