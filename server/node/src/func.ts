export function createCondition<Query extends object>(query: Query) {
  const len = Object.keys(query).length;
  let i = 0;
  let condition = "";
  for (let key in query) {
    condition += `${key} LIKE "%${query[key]}%"`;
    if (i < len - 1) condition += " AND ";
    i++;
  }

  return condition;
}
