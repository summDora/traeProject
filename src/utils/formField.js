/**
 * hyProjectForm 字段配置工具，保证同表单内宽度、标签区、行内对齐一致。
 */
const FORM_FIELD_WIDTH = 320;
const FORM_EMBED_WIDTH = 90;

function resolveSelectClass(label) {
  const len = label.length;
  if (len <= 4) return 'selectEmbed';
  if (len <= 6) return 'selectEmbed_6';
  if (len <= 7) return 'selectEmbed_7';
  return 'selectEmbed_8';
}

function createInputField(key, label, placeholder, options = {}) {
  return {
    type: 'input',
    key,
    placeholder,
    width: options.width || FORM_FIELD_WIDTH,
    clearable: options.clearable !== false,
    selectEmbedLabel: label,
    embedWidth: FORM_EMBED_WIDTH,
    ...options
  };
}

function createSelectField(key, label, placeholder, selectOptions, options = {}) {
  return {
    type: 'select',
    key,
    placeholder,
    embed: true,
    multiple: false,
    clearable: options.clearable !== false,
    selectClass: resolveSelectClass(label),
    selectEmbedLabel: label,
    width: options.width || FORM_FIELD_WIDTH,
    embedWidth: FORM_EMBED_WIDTH,
    options: selectOptions,
    ...options
  };
}

export {
  FORM_FIELD_WIDTH,
  FORM_EMBED_WIDTH,
  resolveSelectClass,
  createInputField,
  createSelectField
};
