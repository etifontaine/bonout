export function sortByDate(array: any[], key: string): any[] {
  return array.sort(function (a: any, b: any) {
    return Date.parse(a[key]) - Date.parse(b[key]);
  });
}
