/**
 * 全局接口调用封装，模拟原项目 m_apiFn 行为。
 *
 * 用法：
 *   await this.m_apiFn(queryList)(params)
 *   await this.m_apiFn(queryList, params)
 *   this.m_apiFn(queryList, params).then(res => {})
 */
const INVALID_TOKENS = ['401', 401, '403', 403, '10001'];

function unwrapResponse(res) {
  if (res && typeof res === 'object' && Object.prototype.hasOwnProperty.call(res, 'data')) {
    return res.data;
  }
  return res;
}

function isInvalidToken(data) {
  if (!data || typeof data !== 'object') return false;
  const code = data.code !== undefined ? data.code : data.statusCode;
  return INVALID_TOKENS.includes(code);
}

function resolveReqUrl(vm, resourceMark) {
  const meta = (vm.$route && vm.$route.meta) || {};
  if (
    resourceMark &&
    typeof resourceMark === 'string' &&
    meta.resource &&
    meta.resource[resourceMark]
  ) {
    return meta.resource[resourceMark].reqUrl || '';
  }
  return meta.reqUrl || '';
}

function isResourceMark(vm, value) {
  return (
    typeof value === 'string' &&
    vm.$route &&
    vm.$route.meta &&
    vm.$route.meta.resource &&
    vm.$route.meta.resource[value]
  );
}

function createInvoker(vm, api, resourceMark) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      const reqUrl = resolveReqUrl(vm, isResourceMark(vm, resourceMark) ? resourceMark : '');
      const callArgs = args.slice();

      if (reqUrl && !reqUrl.includes('undefined')) {
        callArgs.push(reqUrl);
      }

      Promise.resolve(api(...callArgs))
        .then((res) => {
          const data = unwrapResponse(res);
          if (isInvalidToken(data)) {
            if (typeof vm.reLoginBox === 'function') {
              vm.reLoginBox((data && data.message) || '登录已过期');
            }
            reject(data);
            return;
          }
          resolve(data);
        })
        .catch(reject);
    });
  };
}

export function mApiFn(api, resourceMarkOrArg) {
  if (typeof api !== 'function') {
    return Promise.reject(new Error('m_apiFn 第一个参数必须是接口函数'));
  }

  const invoke = createInvoker(this, api, resourceMarkOrArg);

  // m_apiFn(api, params) — 第二个参数为接口入参时直接发起请求
  if (arguments.length >= 2 && !isResourceMark(this, resourceMarkOrArg)) {
    return invoke(resourceMarkOrArg);
  }

  // m_apiFn(api) / m_apiFn(api, resourceMark)
  return invoke;
}

export function installMApiFn(Vue) {
  Vue.prototype.m_apiFn = mApiFn;
  if (!Vue.prototype.reLoginBox) {
    Vue.prototype.reLoginBox = function reLoginBox(message) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[mock] reLoginBox:', message);
      }
    };
  }
}

export default mApiFn;
