/**
 * 接口 mock 工厂 — 真实接口未接入时使用模拟数据
 */
export function mockResolve(result = [], extra = {}) {
  return Promise.resolve({
    success: true,
    code: 200,
    result,
    total: Array.isArray(result) ? result.length : 0,
    message: 'mock',
    ...extra
  });
}

export function createMockFn(defaultResult = []) {
  return (...args) => mockResolve(defaultResult);
}

export function buildMockModule(exportNames, defaultResult = []) {
  const fn = createMockFn(defaultResult);
  const module = {};
  exportNames.forEach((name) => {
    module[name] = fn;
  });
  return module;
}
