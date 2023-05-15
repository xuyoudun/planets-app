const DEFAULT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8';

export function download(res: BlobPart, filename: string, type = DEFAULT_TYPE) {
  //这里res.data是返回的blob对象
  const blob = new Blob([res], {type});
  if ('msSaveOrOpenBlob' in navigator) {
    // 兼容ie
    (window.navigator as any).msSaveOrOpenBlob(blob, filename);
  } else {
    const downloadElement = document.createElement('a');
    const href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = filename; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
  }
}

/*
export function list2tree<T = {}>(list: T[] = [], relationShip = ['id', 'parentId', 'children']): T[] {
  const [id, pid, children] = relationShip;
  const input: T[] = JSON.parse(JSON.stringify(list)),
    result: T[] = [],
    hash = {};
  input.forEach((l) => (hash[l[id] ] = l)); // bug fix
  input.forEach((d) => {
    const p = hash[d[pid]];
    if (p == null) {
      result.push(d);
    } else {
      p[children] = p[children] || [];
      p[children].push(d);
    }
  });
  return result;
}
*/
