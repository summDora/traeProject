<!--
 * 【新需求】战略联合推演中枢：智能对话问答
 * 上线状态未定 —— 入口由 index.vue 的 ENABLE_DEDUCTION 开关控制，
 * 去掉时把开关改 false，或整段删除带「新需求」标记的代码即可。
-->
<template>
  <section class="home-deduction" aria-label="战略联合推演中枢">
    <button
      type="button"
      class="home-deduction__back"
      aria-label="返回推演中枢"
      @click="$emit('back')"
    >
      <span>返回</span>
    </button>

    <div class="home-deduction__body" :class="{ 'is-chat': started }">
      <template v-if="!started">
        <h2 class="home-deduction__title">今天需要推演什么战略议题？</h2>
        <p class="home-deduction__desc">
          描述议题背景与推演目标，AI 将自动完成问题结构化、情景设计与模型协同调度，组织多模型开展多轮对抗推演，输出可决策的方案与风险研判。
        </p>
      </template>

      <div v-else ref="thread" class="home-deduction__thread">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="home-deduction__msg"
          :class="`is-${msg.role}`"
        >
          <span v-if="msg.role === 'assistant'" class="home-deduction__avatar">
            AI
          </span>
          <div class="home-deduction__bubble">
            <span class="home-deduction__text">{{ msg.text }}</span>
            <i v-if="msg.streaming" class="home-deduction__caret" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div class="home-deduction__input" :class="{ 'is-compact': started }">
        <textarea
          ref="textarea"
          v-model.trim="topic"
          class="home-deduction__textarea"
          :class="{ 'is-overflow': overflow }"
          :placeholder="inputPlaceholder"
          aria-label="推演议题描述"
          @input="syncOverflow"
          @keydown.enter.exact.prevent="send"
        ></textarea>
        <button
          type="button"
          class="home-deduction__submit"
          :disabled="!canSend"
          @click="send"
        >
          {{ submitText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeDeductionChat",
  data() {
    return {
      topic: "",
      started: false,
      messages: [],
      streaming: false,
      timer: null,
      disposed: false,
      // 内容是否超出可视高度，用于给输入区做底部渐隐，避免半行文字被硬切
      overflow: false,
    };
  },
  computed: {
    canSend() {
      return !this.streaming && !!this.topic;
    },
    submitText() {
      if (this.streaming) return "推演中…";
      return this.started ? "继续追问" : "发起推演";
    },
    inputPlaceholder() {
      return this.started
        ? "继续补充约束条件或追问，例如：受阻延长到 90 天，替代方案成本如何变化？"
        : "例如：关键通道受阻情形下，区域产业链韧性与替代布局方案推演";
    },
  },
  beforeDestroy() {
    this.disposed = true;
    if (this.timer) clearTimeout(this.timer);
  },
  mounted() {
    this.syncOverflow();
  },
  methods: {
    // 输入区内容超出时加渐隐，避免滚动时出现被拦腰截断的半行文字
    syncOverflow() {
      this.$nextTick(() => {
        const el = this.$refs.textarea;
        if (el) this.overflow = el.scrollHeight > el.clientHeight + 1;
      });
    },
    send() {
      if (!this.canSend) return;

      const text = this.topic;
      const isFirst = !this.started;
      this.topic = "";
      this.started = true;
      this.syncOverflow();

      this.messages.push({ role: "user", text, streaming: false });
      const reply = { role: "assistant", text: "", streaming: true };
      this.messages.push(reply);
      this.streaming = true;
      this.scrollToBottom();

      // 首轮通知父级，后续接后端时父级可用它初始化会话
      if (isFirst) this.$emit("submit", text);

      this.requestStream(
        text,
        (chunk) => {
          reply.text += chunk;
          this.scrollToBottom();
        },
        () => {
          reply.streaming = false;
          this.streaming = false;
          this.scrollToBottom();
        },
        () => {
          reply.text += "\n\n（推演服务暂时不可用，请稍后重试）";
          reply.streaming = false;
          this.streaming = false;
        },
      );
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const thread = this.$refs.thread;
        if (thread) thread.scrollTop = thread.scrollHeight;
      });
    },
    // ===== 流式输出：目前本地模拟，接后端只改这一个方法 =====
    // 真实实现（SSE / fetch + ReadableStream）示例：
    //   const res = await fetch("/api/deduction/chat", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ topic, sessionId: this.sessionId }),
    //   });
    //   const reader = res.body.getReader();
    //   const decoder = new TextDecoder();
    //   while (true) {
    //     const { done, value } = await reader.read();
    //     if (done) break;
    //     onChunk(decoder.decode(value, { stream: true }));
    //   }
    //   onDone();
    requestStream(topic, onChunk, onDone, onError) {
      try {
        const answer = this.mockAnswer(topic);
        let index = 0;
        const tick = () => {
          if (this.disposed) return;
          const step = 2 + Math.floor(Math.random() * 4);
          onChunk(answer.slice(index, index + step));
          index += step;
          if (index >= answer.length) {
            onDone();
            return;
          }
          this.timer = setTimeout(tick, 26);
        };
        this.timer = setTimeout(tick, 280);
      } catch (error) {
        if (onError) onError(error);
      }
    },
    // 模拟推演回复（接后端后整段删掉）
    mockAnswer(topic) {
      return [
        `已接收议题：${topic}`,
        "",
        "【问题结构化】拆解为三个核心矛盾：供给缺口、通道韧性、替代路径成本。",
        "【情景设计】构造三类情景：基准情景、通道受阻 30 天、受阻 90 天叠加价格冲击。",
        "【模型协同】调度产业链关联模型、投入产出模型与情景推演模型并行计算，已完成 4 轮对抗。",
        "【结论建议】",
        "1. 短期以库存与替代采购对冲，缺口可控在 8% 以内；",
        "2. 中期把替代布局重心放在临近区域，运输半径控制在 800km 内；",
        "3. 长期建议建立通道韧性指数，纳入常态化监测。",
        "",
        "可以继续补充预算、时间窗或替代来源等约束，我会据此重新推演。",
      ].join("\n");
    },
  },
};
</script>

<style lang="scss" scoped>
.home-deduction {
  // ---- 设计稿尺寸（2880 基准，单位 px）----
  --dd-title-font: 104;
  --dd-desc-font: 34;
  --dd-desc-lh: 56;
  --dd-desc-mt: 40;
  --dd-box-h: 337;
  --dd-box-radius: 46;
  --dd-box-mt: 56;
  --dd-input-font: 36;
  --dd-input-pad-x: 58;
  --dd-input-pad-y: 42;
  --dd-btn-w: 220;
  --dd-btn-h: 64;
  --dd-btn-font: 39;
  --dd-btn-right: 34;
  --dd-btn-bottom: 30;
  --dd-back-font: 34;
  --dd-back-h: 62;
  --dd-cyan: 46, 192, 255;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 calc(40 * var(--home-s) * 1px);
  box-sizing: border-box;
}

// 左上返回
.home-deduction__back {
  position: absolute;
  top: calc(8 * var(--home-s) * 1px);
  left: calc(8 * var(--home-s) * 1px);
  display: flex;
  align-items: center;
  gap: calc(10 * var(--home-s) * 1px);
  height: calc(var(--dd-back-h) * var(--home-s) * 1px);
  padding: 0 calc(26 * var(--home-s) * 1px);
  border-radius: 4px;
  color: #fff;
  font-family: inherit;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  border: 1px solid #0DF;
  background: linear-gradient(316deg, #2cb2ff80 0%, #004f7680 98.16%);
  box-shadow: 0 4px 4px 0 #00000040;

  &:hover {
    border-color: rgba(var(--dd-cyan), 0.9);
    background: rgba(10, 66, 100, 0.7);
    box-shadow: 0 0 18px rgba(var(--dd-cyan), 0.35);
  }
}

.home-deduction__back-icon {
  width: calc(26 * var(--home-s) * 1px);
  height: calc(26 * var(--home-s) * 1px);
}

.home-deduction__body {
  width: 100%;
  max-width: calc(2354 * var(--home-s) * 1px);
}

.home-deduction__title {
  margin: 0;
  color: #ffffff;
  font-size: calc(var(--dd-title-font) * var(--home-s) * 1px);
  font-weight: 800;
  letter-spacing: calc(2 * var(--home-s) * 1px);
  line-height: 1.2;
  text-align: center;
  text-shadow: 0 0 26px rgba(var(--dd-cyan), 0.45);
}

.home-deduction__desc {
  margin: calc(var(--dd-desc-mt) * var(--home-s) * 1px) auto 0;
  max-width: calc(2060 * var(--home-s) * 1px);
  color: rgba(198, 226, 245, 0.78);
  font-size: calc(var(--dd-desc-font) * var(--home-s) * 1px);
  line-height: calc(var(--dd-desc-lh) * var(--home-s) * 1px);
  text-align: left;
}

.home-deduction__input {
  position: relative;
  width: 100%;
  height: calc(var(--dd-box-h) * var(--home-s) * 1px);
  margin-top: calc(var(--dd-box-mt) * var(--home-s) * 1px);
  border: 1px solid rgba(var(--dd-cyan), 0.6);
  border-radius: calc(var(--dd-box-radius) * var(--home-s) * 1px);
  background: linear-gradient(
    180deg,
    rgba(4, 44, 70, 0.62) 0%,
    rgba(4, 28, 46, 0.34) 100%
  );
  box-shadow:
    0 0 26px rgba(var(--dd-cyan), 0.22),
    inset 0 0 48px rgba(var(--dd-cyan), 0.1);
  box-sizing: border-box;
  // 内边距放在不滚动的外层：textarea 内容超长滚动时，文字不会顶到边框
  padding: calc(var(--dd-input-pad-y) * var(--home-s) * 1px)
    calc(var(--dd-input-pad-x) * var(--home-s) * 1px)
    calc(150 * var(--home-s) * 1px);
}

.home-deduction__textarea {
  width: 100%;
  height: 100%;
  // 内边距交给父级，自身只负责滚动
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #eaf8ff;
  font-family: inherit;
  font-size: calc(var(--dd-input-font) * var(--home-s) * 1px);
  line-height: 1.5;
  resize: none;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(186, 218, 238, 0.55);
  }

  // 内容溢出时底部渐隐，避免滚动时出现被拦腰截断的半行文字
  &.is-overflow {
    -webkit-mask-image: linear-gradient(
      to bottom,
      #000 calc(100% - 1.4em),
      transparent
    );
    mask-image: linear-gradient(to bottom, #000 calc(100% - 1.4em), transparent);
  }
}

.home-deduction__submit {
  position: absolute;
  right: calc(var(--dd-btn-right) * var(--home-s) * 1px);
  bottom: calc(var(--dd-btn-bottom) * var(--home-s) * 1px);
  width: calc(var(--dd-btn-w) * var(--home-s) * 1px);
  height: calc(var(--dd-btn-h) * var(--home-s) * 1px);
  border: 0;
  border-radius: 999px;
  background: linear-gradient(180deg, #d4f4ff 0%, #86dbff 100%);
  color: #04283c;
  font-family: inherit;
  font-size: calc(var(--dd-btn-font) * var(--home-s) * 1px);
  font-weight: 700;
  letter-spacing: calc(1 * var(--home-s) * 1px);
  cursor: pointer;
  transition: filter 0.2s, box-shadow 0.2s;

  &:hover {
    filter: brightness(1.06);
    box-shadow: 0 0 22px rgba(var(--dd-cyan), 0.45);
  }
}
/* ===== 新需求：对话态 + 字号调整 start ===== */
// 主体宽度收窄，避免 100% 顶满显得拥挤
.home-deduction__body {
  width: 76%;
  max-width: calc(2000 * var(--home-s) * 1px);
}

// 大标题：2880 设计稿 48px，随 --home-s 适配（1920 → 32px）
.home-deduction__title {
  font-size: calc(48 * var(--home-s) * 1px);
}

// 说明文案、输入框、占位符固定 18px；发送按钮 20px
.home-deduction__desc {
  // 比输入框（主体宽度的 100%）再窄 10%，左右各内收 5%，避免两行文字与输入框硬顶齐
  width: 90%;
  font-size: 18px;
  line-height: 34px;
}

.home-deduction__textarea {
  font-size: 18px;
}

.home-deduction__submit {
  font-size: 20px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// ---- 对话态 ----
.home-deduction__body.is-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: calc(96 * var(--home-s) * 1px) 0 calc(24 * var(--home-s) * 1px);
}

.home-deduction__thread {
  flex: 1 1 auto;
  min-height: 0;
  padding-right: 8px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--dd-cyan), 0.4) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgba(var(--dd-cyan), 0.4);
  }
}

.home-deduction__msg {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;

  &.is-user {
    justify-content: flex-end;
  }
}

.home-deduction__avatar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(var(--dd-cyan), 0.6);
  border-radius: 50%;
  background: rgba(8, 52, 80, 0.8);
  color: #7fd8ff;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.home-deduction__bubble {
  max-width: 82%;
  padding: 14px 18px;
  border-radius: 12px;
  font-size: 18px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
}

.is-user .home-deduction__bubble {
  border: 1px solid rgba(var(--dd-cyan), 0.45);
  background: linear-gradient(
    180deg,
    rgba(var(--dd-cyan), 0.3) 0%,
    rgba(var(--dd-cyan), 0.12) 100%
  );
  color: #eaf8ff;
}

.is-assistant .home-deduction__bubble {
  border: 1px solid rgba(var(--dd-cyan), 0.22);
  background: rgba(4, 40, 64, 0.5);
  color: #d8efff;
}

// 打字机光标
.home-deduction__caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  background: #7fd8ff;
  vertical-align: -2px;
  animation: dd-caret 0.9s steps(1) infinite;
}

@keyframes dd-caret {
  50% {
    opacity: 0;
  }
}

// 对话态的输入区：底部固定，改成「输入区占满 + 按钮独占一行」的纵向布局，
// 这样 padding 不会挤占输入区高度，输入区至少能看到 3 行
.home-deduction__input.is-compact {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  height: calc(240 * var(--home-s) * 1px);
  margin-top: calc(18 * var(--home-s) * 1px);
  padding: calc(20 * var(--home-s) * 1px) calc(32 * var(--home-s) * 1px)
    calc(16 * var(--home-s) * 1px);
}

.home-deduction__input.is-compact .home-deduction__textarea {
  flex: 1 1 auto;
  height: auto;
  min-height: 0;
}

.home-deduction__input.is-compact .home-deduction__submit {
  position: static;
  flex: 0 0 auto;
  align-self: flex-end;
  margin-top: calc(10 * var(--home-s) * 1px);
}
/* ===== 新需求：对话态 + 字号调整 end ===== */
</style>
