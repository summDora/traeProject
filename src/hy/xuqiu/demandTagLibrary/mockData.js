const getTagNameOptions = () => {
  const yearMax = new Date().getFullYear() + 1;
  const years = [];
  for (let i = yearMax; i >= 2017; i -= 1) {
    years.push({ key: i, value: String(i) });
  }
  return years;
};

const tagNameOptions = getTagNameOptions();

const tagCategoryOptions = [
  { key: '', value: '全部' },
  { key: '2023年成本第一批', value: '2023年成本第一批' },
  { key: '不同意需求类型', value: '不同意需求类型' },
  { key: '数字浙电 (2023)', value: '数字浙电 (2023)' },
  { key: '新技术应用', value: '新技术应用' }
];

const tagTypeOptions = [
  { key: '', value: '全部' },
  { key: '不同意需求类型', value: '不同意需求类型' },
  { key: '同意需求类型', value: '同意需求类型' },
  { key: '专项标签', value: '专项标签' },
  { key: '数字化', value: '数字化' }
];

const categoryTagTypeMap = {
  '2023年成本第一批': '专项标签',
  '不同意需求类型': '不同意需求类型',
  '数字浙电 (2023)': '数字化',
  '新技术应用': '数字化'
};

const disagreeTags = [
  { tagName: '业务主管部门不同意', relatedDemandCount: 3, feasibilityCount: 0 },
  { tagName: '必要性不强', relatedDemandCount: 8, feasibilityCount: 0 },
  { tagName: '不符合申报渠道', relatedDemandCount: 6, feasibilityCount: 0 },
  { tagName: '技术路线不符', relatedDemandCount: 5, feasibilityCount: 0 },
  { tagName: '投资估算偏高', relatedDemandCount: 4, feasibilityCount: 0 },
  { tagName: '功能重复建设', relatedDemandCount: 12, feasibilityCount: 0 },
  { tagName: '材料不完整', relatedDemandCount: 6, feasibilityCount: 0 },
  { tagName: '其他', relatedDemandCount: 5, feasibilityCount: 0 }
];

const costBatchTags = [
  { tagName: '成本性项目', relatedDemandCount: 18, feasibilityCount: 0 },
  { tagName: '运维类项目', relatedDemandCount: 11, feasibilityCount: 0 },
  { tagName: '资本性项目', relatedDemandCount: 7, feasibilityCount: 0 }
];

const digitalTags = [
  { tagName: '数据治理', relatedDemandCount: 9, feasibilityCount: 0 },
  { tagName: '人工智能', relatedDemandCount: 6, feasibilityCount: 0 },
  { tagName: '数字孪生', relatedDemandCount: 4, feasibilityCount: 0 }
];

const newTechTags = [
  { tagName: '新技术试点', relatedDemandCount: 10, feasibilityCount: 0 },
  { tagName: '创新示范', relatedDemandCount: 5, feasibilityCount: 0 },
  { tagName: '联合攻关', relatedDemandCount: 3, feasibilityCount: 0 }
];

function buildTagChildren(categoryKey, items, startId) {
  const tagType = categoryTagTypeMap[categoryKey] || '';
  return items.map((item, index) => ({
    id: `TAG${startId + index}`,
    tagCategory: '',
    tagName: item.tagName,
    tagType,
    remark: `${item.tagName}备注说明`,
    parentCategory: categoryKey,
    parentTag: '',
    sortOrder: (index + 1) * 10,
    relatedDemandCount: item.relatedDemandCount,
    feasibilityCount: item.feasibilityCount,
    enabled: index % 5 !== 0,
    isCategory: false
  }));
}

function buildCategoryNode(categoryKey, children, nodeId, tagYear = '') {
  const relatedDemandCount = children.reduce((sum, item) => sum + item.relatedDemandCount, 0);
  const feasibilityCount = children.reduce((sum, item) => sum + item.feasibilityCount, 0);
  const sortedChildren = children.slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  sortedChildren.forEach((child) => {
    child.parentTag = nodeId;
  });
  return {
    id: nodeId,
    tagCategory: categoryKey,
    tagName: '',
    tagType: categoryTagTypeMap[categoryKey] || '',
    tagYear,
    sortOrder: 0,
    remark: '',
    relatedDemandCount,
    feasibilityCount,
    isCategory: true,
    children: sortedChildren
  };
}

function buildTagTree() {
  return [
    buildCategoryNode(
      '2023年成本第一批',
      buildTagChildren('2023年成本第一批', costBatchTags, 100),
      'CAT100',
      2023
    ),
    buildCategoryNode(
      '不同意需求类型',
      buildTagChildren('不同意需求类型', disagreeTags, 200),
      'CAT200',
      2026
    ),
    buildCategoryNode(
      '数字浙电 (2023)',
      buildTagChildren('数字浙电 (2023)', digitalTags, 300),
      'CAT300',
      2023
    ),
    buildCategoryNode(
      '新技术应用',
      buildTagChildren('新技术应用', newTechTags, 400),
      'CAT400',
      2026
    )
  ];
}

let tagTreeData = buildTagTree();
let tagIdSeed = 500;

function cloneTree(list) {
  return list.map((item) => ({
    ...item,
    children: item.children ? cloneTree(item.children) : undefined
  }));
}

function sumCategoryCount(category) {
  if (!category.children || !category.children.length) {
    return;
  }
  category.relatedDemandCount = category.children.reduce((sum, child) => sum + (child.relatedDemandCount || 0), 0);
  category.feasibilityCount = category.children.reduce((sum, child) => sum + (child.feasibilityCount || 0), 0);
}

function findTagById(id, list = tagTreeData) {
  for (let i = 0; i < list.length; i += 1) {
    const node = list[i];
    if (node.id === id) {
      return { node, parent: null, list, index: i };
    }
    if (node.children && node.children.length) {
      for (let j = 0; j < node.children.length; j += 1) {
        if (node.children[j].id === id) {
          return { node: node.children[j], parent: node, list: node.children, index: j };
        }
      }
    }
  }
  return null;
}

function filterTagTree(searchObj, source = tagTreeData) {
  const tagCategory = searchObj.tagCategory || '';
  const tree = cloneTree(source);

  if (!tagCategory) {
    return tree;
  }
  return tree.filter((category) => category.tagCategory === tagCategory);
}

function getParentTagOptions(excludeTagId = '') {
  const options = [{ key: '', value: '无（一级标签）' }];
  tagTreeData.forEach((category) => {
    options.push({ key: category.id, value: category.tagCategory });
    if (category.children && category.children.length) {
      category.children.forEach((child) => {
        if (child.id !== excludeTagId) {
          options.push({ key: child.id, value: `${category.tagCategory} / ${child.tagName}` });
        }
      });
    }
  });
  return options;
}

function sortChildren(children = []) {
  return children.slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

function getTagDetail(tagId) {
  const found = findTagById(tagId);
  if (!found || found.node.isCategory) {
    return null;
  }
  return {
    id: found.node.id,
    tagName: found.node.tagName,
    tagType: found.node.tagType || categoryTagTypeMap[found.node.parentCategory] || '',
    parentTag: found.parent?.id || '',
    sortOrder: found.node.sortOrder,
    status: found.node.enabled !== false,
    remark: found.node.remark || ''
  };
}

function saveTag(payload = {}, tagId = '') {
  const enabled = payload.status !== false;
  const sortOrder = payload.sortOrder === undefined || payload.sortOrder === null || payload.sortOrder === ''
    ? undefined
    : Number(payload.sortOrder);

  if (tagId) {
    const found = findTagById(tagId);
    if (!found || found.node.isCategory) {
      return { success: false, message: '标签不存在' };
    }

    const targetParentId = payload.parentTag || '';
    const updatedNode = {
      ...found.node,
      tagName: payload.tagName,
      tagType: payload.tagType,
      remark: payload.remark || '',
      enabled,
      sortOrder: sortOrder === undefined ? found.node.sortOrder : sortOrder
    };

    if ((found.parent?.id || '') === targetParentId) {
      found.list.splice(found.index, 1, updatedNode);
      found.parent.children = sortChildren(found.parent.children);
    } else {
      found.list.splice(found.index, 1);
      if (found.parent) {
        sumCategoryCount(found.parent);
      }
      const appendResult = appendTagNode(updatedNode, targetParentId, payload.tagType);
      if (!appendResult.success) {
        return appendResult;
      }
    }
    return { success: true };
  }

  if (!payload.parentTag) {
    tagIdSeed += 1;
    const newCategory = buildCategoryNode(payload.tagName, [], `CAT${tagIdSeed}`);
    newCategory.tagType = payload.tagType;
    newCategory.remark = payload.remark || '';
    newCategory.enabled = enabled;
    newCategory.sortOrder = sortOrder || 0;
    tagTreeData.push(newCategory);
    tagTreeData.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return { success: true };
  }

  tagIdSeed += 1;
  const newTag = {
    id: `TAG${tagIdSeed}`,
    tagCategory: '',
    tagName: payload.tagName,
    tagType: payload.tagType,
    remark: payload.remark || '',
    relatedDemandCount: 0,
    feasibilityCount: 0,
    enabled,
    sortOrder: sortOrder === undefined ? 0 : sortOrder,
    isCategory: false
  };
  return appendTagNode(newTag, payload.parentTag, payload.tagType);
}

function appendTagNode(node, parentId, tagType) {
  const parentFound = findTagById(parentId);
  if (!parentFound) {
    return { success: false, message: '上级标签不存在' };
  }

  if (parentFound.node.isCategory) {
    node.parentCategory = parentFound.node.tagCategory;
    node.parentTag = parentFound.node.id;
    if (!parentFound.node.children) parentFound.node.children = [];
    parentFound.node.children.push(node);
    parentFound.node.children = sortChildren(parentFound.node.children);
    sumCategoryCount(parentFound.node);
    return { success: true };
  }

  const category = parentFound.parent;
  if (!category) {
    return { success: false, message: '上级标签数据异常' };
  }
  node.parentCategory = category.tagCategory;
  node.parentTag = category.id;
  if (!category.children) category.children = [];
  category.children.push(node);
  category.children = sortChildren(category.children);
  sumCategoryCount(category);
  return { success: true };
}

function deleteTag(tagId) {
  const found = findTagById(tagId);
  if (!found || found.node.isCategory) {
    return { success: false, message: '仅支持删除标签' };
  }
  found.list.splice(found.index, 1);
  if (found.parent) {
    sumCategoryCount(found.parent);
  }
  return { success: true };
}

function toggleTagStatus(tagId, enabled) {
  const found = findTagById(tagId);
  if (!found || found.node.isCategory) {
    return { success: false, message: '仅支持操作标签' };
  }
  found.node.enabled = enabled;
  return { success: true };
}

export {
  tagNameOptions,
  tagCategoryOptions,
  tagTypeOptions,
  filterTagTree,
  getParentTagOptions,
  getTagDetail,
  saveTag,
  deleteTag,
  toggleTagStatus
};
