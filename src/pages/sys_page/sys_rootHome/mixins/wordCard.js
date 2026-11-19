// 词条展示交互（通用）
// 用法：
//   1) mixins: [wordCard]
//   2) 列表项加 v-on="wordEvents(item)"、:class="{ 'is-focus': isWordActive(item) }"
//      （可选 :tabindex="item.desc ? 0 : -1"）
//   3) 列表里放一个 <word-card :visible="isWordActive(item)" :item="item" />
// 之后新增词条只需要在数据里补 en / desc 两个字段
export default {
  data() {
    return {
      activeWord: null,
      // 离场动画期间 activeWord 已置空，但面板还要显示内容，
      // 所以额外记住上一条，供 :item 与锚点样式在动画期间继续取值
      lastWord: null,
      // hover 时条目的视口矩形：给需要用 position: fixed 摆脱 overflow 裁剪的卡片做锚点
      wordRect: null,
    };
  },
  computed: {
    wordCardItem() {
      return this.activeWord || this.lastWord || {};
    },
  },
  methods: {
    openWord(item, event) {
      if (!item || !item.desc) return;
      this.activeWord = item;
      this.lastWord = item;
      const el = event && event.currentTarget;
      if (el) this.wordRect = el.getBoundingClientRect();
    },
    closeWord() {
      this.activeWord = null;
    },
    isWordActive(item) {
      return this.activeWord === item;
    },
    // 没有 desc 的条目不绑定事件，避免无意义的 hover 开销
    wordEvents(item) {
      if (!item || !item.desc) return {};
      return {
        mouseenter: (event) => this.openWord(item, event),
        mouseleave: this.closeWord,
        focus: (event) => this.openWord(item, event),
        blur: this.closeWord,
      };
    },
  },
};
