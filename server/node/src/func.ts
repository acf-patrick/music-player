export function createCondition<Query extends object>(query: Query) {
  const conditions: string[] = [];
  for (let key in query) {
    if (key !== "page") {
      conditions.push(`${key} LIKE "%${query[key]}%"`);
    }
  }
  return conditions.join(" AND ");
}
