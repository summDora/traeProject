/**
 * 深拷贝，挂载到 Vue.prototype.m_copy
 */
export function mCopy(source) {
  if (source === null || source === undefined) {
    return source;
  }
  try {
    return JSON.parse(JSON.stringify(source));
  } catch (e) {
    if (Array.isArray(source)) {
      return source.map((item) => mCopy(item));
    }
    if (typeof source === 'object') {
      return Object.keys(source).reduce((acc, key) => {
        acc[key] = mCopy(source[key]);
        return acc;
      }, {});
    }
    return source;
  }
}

export default mCopy;
