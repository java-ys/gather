/*
  inspired by https://www.npmjs.com/package/react-csv-downloader
  now removed from Github
*/

const newLine = "\r\n";
const appendLine = (content, row, { separator, quoted }) => {
  const line = row.map(data => {
    if (!quoted) return data;
    // quote data
    // eslint-disable-next-line no-param-reassign
    data = typeof data === "string" ? data.replace(/"/g, '"') : data;
    return `"${data}"`;
  });
  content.push(line.join(separator));
};

const defaults = {
  separator: ",",
  quoted: false
};

export default function csv(columns, datas, options, noHeader = false) {
  // eslint-disable-next-line no-param-reassign
  options = { ...defaults, ...options };
  let columnOrder;
  const content = [];
  const column = [];

  if (columns) {
    columnOrder = columns.map(v => {
      if (typeof v === "string") return v;
      if (!noHeader) {
        column.push(typeof v.title !== "undefined" ? v.title : v.key);
      }
      return v.key;
    });
    if (column.length > 0) appendLine(content, column, options);
  } else {
    columnOrder = [];
    datas.forEach(v => {
      if (!Array.isArray(v)) {
        columnOrder = columnOrder.concat(Object.keys(v));
      }
    });
    if (columnOrder.length > 0) {
      columnOrder = columnOrder.filter((value, index, self) => self.indexOf(value) === index);
      if (!noHeader) appendLine(content, columnOrder, options);
    }
  }

  if (Array.isArray(datas)) {
    datas.forEach(row => {
      if (!Array.isArray(row)) {
        // eslint-disable-next-line no-param-reassign
        row = columnOrder.map(k => (typeof row[k] !== "undefined" ? row[k] : ""));
      }
      appendLine(content, row, options);
    });
  }
  return content.join(newLine);
}
