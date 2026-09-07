<template>
  <div class="iqa-page">
    <!-- 左侧历史会话 -->
    <aside class="iqa-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <span class="brand-dot"></span>
          <h2 class="sidebar-title">智能问答</h2>
        </div>
        <button type="button" class="iqa-btn iqa-btn-primary iqa-btn-sm" @click="handleCreateSession">
          <i class="el-icon-plus"></i>
          <span>新建对话</span>
        </button>
      </div>
      <div class="sidebar-search">
        <div class="search-wrap">
          <i class="el-icon-search search-icon"></i>
          <input
            v-model="sessionKeyword"
            type="text"
            class="search-input"
            placeholder="搜索历史对话"
          />
          <i
            v-if="sessionKeyword"
            class="el-icon-circle-close search-clear"
            @click="sessionKeyword = ''"
          ></i>
        </div>
      </div>
      <div class="session-list">
        <div
          v-for="item in filteredSessions"
          :key="item.sessionId"
          :class="['session-item', { active: item.sessionId === activeSessionId }]"
          @click="handleSelectSession(item.sessionId)"
        >
          <div class="session-main">
            <i class="el-icon-chat-dot-round session-icon"></i>
            <span class="session-title" :title="item.title">{{ item.title }}</span>
          </div>
          <div class="session-actions" @click.stop>
            <el-tooltip content="编辑标题" placement="top">
              <i class="el-icon-edit" @click="openEditSession(item)"></i>
            </el-tooltip>
            <el-tooltip content="删除会话" placement="top">
              <i class="el-icon-delete" @click="handleDeleteSession(item.sessionId)"></i>
            </el-tooltip>
          </div>
        </div>
        <div v-if="!filteredSessions.length" class="session-empty">暂无历史对话</div>
      </div>
    </aside>

    <!-- 右侧聊天主区域 -->
    <main class="iqa-main">
      <div class="chat-header">
        <div class="chat-header-info">
          <span class="chat-title">{{ currentSessionTitle }}</span>
          <span class="chat-subtitle">
            <i class="el-icon-magic-stick"></i>
            PC 端智能问答 · 支持文本、附件与截图粘贴
          </span>
        </div>
      </div>

      <div ref="messageList" class="message-list">
        <div v-if="!messageList.length && !loadingHistory" class="message-empty">
          <div class="empty-icon">
            <i class="el-icon-service"></i>
          </div>
          <p class="empty-title">开始新的对话</p>
          <p class="empty-desc">输入问题或上传附件，我将为您提供智能解答</p>
        </div>

        <div
          v-for="(msg, index) in messageList"
          :key="msg.id || index"
          :class="['message-row', isBotMessage(msg) ? 'is-bot' : 'is-user']"
        >
          <div class="message-avatar">
            <i :class="isBotMessage(msg) ? 'el-icon-cpu' : 'el-icon-user-solid'"></i>
          </div>
          <div class="message-body">
            <div class="message-meta">
              <span class="message-name">{{ getMessageName(msg) }}</span>
              <span v-if="msg.createTime" class="message-time">{{ formatTime(msg.createTime) }}</span>
            </div>
            <div class="message-bubble">
              <p v-if="msg.content" class="message-text">{{ msg.content }}</p>
              <div v-if="msg.fj && msg.fj.length" class="message-attachments">
                <template v-for="(file, fIndex) in msg.fj">
                  <div
                    v-if="isImageFile(file)"
                    :key="'img-' + fIndex"
                    class="msg-image-item"
                  >
                    <img
                      :src="file.url || file.previewUrl"
                      :alt="file.name"
                      @click="openImagePreview(file.url || file.previewUrl)"
                    />
                  </div>
                  <div v-else :key="'file-' + fIndex" class="msg-file-item">
                    <i class="el-icon-document"></i>
                    <span class="file-name" :title="file.name">{{ file.name }}</span>
                    <button type="button" class="file-download-btn" @click="downloadFile(file)">下载</button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div v-if="sending" class="message-row is-bot">
          <div class="message-avatar">
            <i class="el-icon-cpu"></i>
          </div>
          <div class="message-body">
            <div class="message-bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部输入区 -->
      <div class="input-area">
        <!-- 待发送预览区 -->
        <div v-if="hasPendingContent" class="pending-preview">
          <div v-if="inputText.trim()" class="pending-text">
            <span class="pending-label">待发送文本</span>
            <span class="pending-content">{{ inputText }}</span>
          </div>
          <div v-if="pendingFiles.length" class="pending-files">
            <div
              v-for="(file, index) in pendingFiles"
              :key="file.uid"
              class="pending-file-item"
            >
              <template v-if="file.isImage">
                <img :src="file.previewUrl" :alt="file.name" class="pending-thumb" />
              </template>
              <template v-else>
                <i class="el-icon-document pending-file-icon"></i>
                <span class="pending-file-name" :title="file.name">{{ file.name }}</span>
              </template>
              <i class="el-icon-close pending-remove" @click="removePendingFile(index)"></i>
            </div>
          </div>
        </div>

        <div class="input-toolbar">
          <input
            ref="fileInput"
            type="file"
            multiple
            class="hidden-input"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
            @change="handleFileSelect"
          />
          <button type="button" class="iqa-btn iqa-btn-ghost iqa-btn-sm" @click="triggerFileUpload">
            <i class="el-icon-paperclip"></i>
            <span>上传附件</span>
          </button>
          <span class="input-tip">
            <i class="el-icon-info"></i>
            支持 Ctrl+V 粘贴截图
          </span>
        </div>

        <div class="input-box">
          <div class="textarea-wrap">
            <el-input
              ref="messageInput"
              v-model="inputText"
              type="textarea"
              :rows="3"
              resize="none"
              placeholder="请输入您的问题，Enter 发送，Shift+Enter 换行"
              @keydown.native="handleInputKeydown"
              @paste.native="handlePaste"
            />
          </div>
          <button
            type="button"
            class="iqa-btn iqa-btn-send"
            :class="{ 'is-disabled': !canSend, 'is-loading': sending }"
            :disabled="!canSend"
            @click="handleSend"
          >
            <i v-if="sending" class="el-icon-loading"></i>
            <i v-else class="el-icon-s-promotion"></i>
            <span>{{ sending ? '发送中' : '发送' }}</span>
          </button>
        </div>
      </div>
    </main>

    <!-- 图片大图预览 -->
    <el-dialog
      :visible.sync="imagePreviewVisible"
      width="720px"
      append-to-body
      custom-class="iqa-image-dialog"
      @close="previewImageUrl = ''"
    >
      <img v-if="previewImageUrl" :src="previewImageUrl" class="preview-image" alt="图片预览" />
    </el-dialog>

    <!-- 编辑会话标题 -->
    <el-dialog
      title="编辑对话标题"
      :visible.sync="editDialogVisible"
      width="420px"
      append-to-body
      @close="editSessionTitle = ''"
    >
      <el-input
        v-model="editSessionTitle"
        maxlength="30"
        show-word-limit
        placeholder="请输入对话标题"
        @keyup.enter.native="confirmEditSession"
      />
      <span slot="footer" class="dialog-footer-btns">
        <button type="button" class="iqa-btn iqa-btn-ghost" @click="editDialogVisible = false">取消</button>
        <button type="button" class="iqa-btn iqa-btn-primary" @click="confirmEditSession">确定</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSessionList,
  getChatHistory,
  sendChatMessage,
  deleteSession,
  updateSessionTitle
} from '@/api/intelligentQA';

const STORAGE_KEY = 'intelligent_qa_sessions_v1';
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

export default {
  name: 'PageIntelligentQA',
  data() {
    return {
      sessions: [],
      activeSessionId: '',
      messageList: [],
      inputText: '',
      pendingFiles: [],
      sessionKeyword: '',
      sending: false,
      loadingHistory: false,
      imagePreviewVisible: false,
      previewImageUrl: '',
      editDialogVisible: false,
      editSessionId: '',
      editSessionTitle: '',
      fileUidSeed: 0
    };
  },
  computed: {
    filteredSessions() {
      const keyword = (this.sessionKeyword || '').trim().toLowerCase();
      if (!keyword) return this.sessions;
      return this.sessions.filter(function(item) {
        return (item.title || '').toLowerCase().indexOf(keyword) > -1;
      });
    },
    currentSessionTitle() {
      const session = this.sessions.find(function(item) {
        return item.sessionId === this.activeSessionId;
      }, this);
      return session ? session.title : '新对话';
    },
    hasPendingContent() {
      return !!(this.inputText.trim() || this.pendingFiles.length);
    },
    canSend() {
      return !this.sending && !!(this.inputText.trim() || this.pendingFiles.length);
    }
  },
  mounted() {
    this.initPage();
    document.addEventListener('paste', this.handleGlobalPaste);
  },
  beforeDestroy() {
    document.removeEventListener('paste', this.handleGlobalPaste);
    this.revokePendingPreviews();
  },
  methods: {
    initPage() {
      this.loadSessionsFromStorage();
      if (this.sessions.length) {
        this.handleSelectSession(this.sessions[0].sessionId);
      } else {
        this.handleCreateSession(false);
      }
      this.fetchSessionList();
    },

    generateSessionId() {
      return 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    },

    generateFileUid() {
      this.fileUidSeed += 1;
      return 'file_' + Date.now() + '_' + this.fileUidSeed;
    },

    loadSessionsFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        this.sessions = raw ? JSON.parse(raw) : [];
      } catch (e) {
        this.sessions = [];
      }
    },

    saveSessionsToStorage() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions));
    },

    fetchSessionList() {
      var self = this;
      this.m_apiFn(getSessionList)()
        .then(function(res) {
          if (res && res.success && Array.isArray(res.result) && res.result.length) {
            self.sessions = res.result;
            self.saveSessionsToStorage();
          }
        })
        .catch(function() {
          // 本地缓存兜底，不阻断页面
        });
    },

    handleCreateSession(showTip) {
      if (showTip !== false) {
        showTip = true;
      }
      var sessionId = this.generateSessionId();
      var session = {
        sessionId: sessionId,
        title: '新对话 ' + this.formatShortDate(new Date()),
        updateTime: Date.now()
      };
      this.sessions.unshift(session);
      this.saveSessionsToStorage();
      this.activeSessionId = sessionId;
      this.messageList = [];
      this.clearInput();
      if (showTip) {
        this.$message.success('已创建新对话');
      }
    },

    handleSelectSession(sessionId) {
      if (this.activeSessionId === sessionId) return;
      this.activeSessionId = sessionId;
      this.clearInput();
      this.loadChatHistory(sessionId);
    },

    loadChatHistory(sessionId) {
      var self = this;
      this.loadingHistory = true;
      this.messageList = [];

      // 优先读取本地缓存的消息
      var cacheKey = STORAGE_KEY + '_msg_' + sessionId;
      try {
        var cached = localStorage.getItem(cacheKey);
        if (cached) {
          self.messageList = JSON.parse(cached);
        }
      } catch (e) {
        self.messageList = [];
      }

      this.m_apiFn(getChatHistory, { sessionId: sessionId })
        .then(function(res) {
          if (res && res.success && Array.isArray(res.result) && res.result.length) {
            self.messageList = res.result.map(function(item, index) {
              return Object.assign({ id: 'msg_' + index + '_' + (item.createTime || Date.now()) }, item);
            });
            self.cacheMessages(sessionId);
          }
          self.$nextTick(function() {
            self.scrollToBottom();
          });
        })
        .catch(function(err) {
          self.$message.error((err && err.message) || '获取聊天记录失败，请稍后重试');
        })
        .finally(function() {
          self.loadingHistory = false;
        });
    },

    cacheMessages(sessionId) {
      var cacheKey = STORAGE_KEY + '_msg_' + sessionId;
      localStorage.setItem(cacheKey, JSON.stringify(this.messageList));
    },

    handleSend() {
      if (!this.canSend) return;
      if (!this.activeSessionId) {
        this.handleCreateSession(false);
      }

      var self = this;
      var content = this.inputText.trim();
      var fjPayload = this.pendingFiles.map(function(file) {
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          url: file.previewUrl,
          isImage: file.isImage
        };
      });

      var params = {
        sessionId: this.activeSessionId,
        content: content,
        fj: fjPayload
      };

      this.sending = true;

      this.m_apiFn(sendChatMessage, params)
        .then(function(res) {
          if (!res || !res.success) {
            throw new Error((res && res.message) || '发送失败');
          }
          var records = Array.isArray(res.result) ? res.result : [];
          records.forEach(function(item, index) {
            self.messageList.push(Object.assign({ id: 'msg_' + Date.now() + '_' + index }, item));
          });
          self.updateSessionMeta(content);
          self.cacheMessages(self.activeSessionId);
          self.clearInput();
          self.$nextTick(function() {
            self.scrollToBottom();
          });
        })
        .catch(function(err) {
          self.$message.error((err && err.message) || '服务异常，消息发送失败，请稍后重试');
        })
        .finally(function() {
          self.sending = false;
        });
    },

    updateSessionMeta(content) {
      var session = this.sessions.find(function(item) {
        return item.sessionId === this.activeSessionId;
      }, this);
      if (!session) return;
      if (session.title.indexOf('新对话') === 0 && content) {
        session.title = content.length > 20 ? content.slice(0, 20) + '...' : content;
      }
      session.updateTime = Date.now();
      this.saveSessionsToStorage();
    },

    handleDeleteSession(sessionId) {
      var self = this;
      this.$confirm('确定删除该历史对话吗？删除后不可恢复。', '提示', {
        type: 'warning',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
        .then(function() {
          return self.m_apiFn(deleteSession, { sessionId: sessionId });
        })
        .then(function() {
          self.sessions = self.sessions.filter(function(item) {
            return item.sessionId !== sessionId;
          });
          localStorage.removeItem(STORAGE_KEY + '_msg_' + sessionId);
          self.saveSessionsToStorage();
          if (self.activeSessionId === sessionId) {
            if (self.sessions.length) {
              self.handleSelectSession(self.sessions[0].sessionId);
            } else {
              self.handleCreateSession(false);
            }
          }
          self.$message.success('删除成功');
        })
        .catch(function(err) {
          if (err !== 'cancel') {
            self.$message.error((err && err.message) || '删除失败，请稍后重试');
          }
        });
    },

    openEditSession(session) {
      this.editSessionId = session.sessionId;
      this.editSessionTitle = session.title;
      this.editDialogVisible = true;
    },

    confirmEditSession() {
      var title = (this.editSessionTitle || '').trim();
      if (!title) {
        this.$message.warning('请输入对话标题');
        return;
      }
      var self = this;
      var params = { sessionId: this.editSessionId, title: title };
      this.m_apiFn(updateSessionTitle, params)
        .then(function() {
          var session = self.sessions.find(function(item) {
            return item.sessionId === self.editSessionId;
          });
          if (session) {
            session.title = title;
            session.updateTime = Date.now();
            self.saveSessionsToStorage();
          }
          self.editDialogVisible = false;
          self.$message.success('标题已更新');
        })
        .catch(function(err) {
          self.$message.error((err && err.message) || '更新失败，请稍后重试');
        });
    },

    triggerFileUpload() {
      this.$refs.fileInput.click();
    },

    handleFileSelect(event) {
      var files = event.target.files;
      if (!files || !files.length) return;
      for (var i = 0; i < files.length; i++) {
        this.addPendingFile(files[i]);
      }
      event.target.value = '';
    },

    handlePaste(event) {
      this.processPasteEvent(event);
    },

    handleGlobalPaste(event) {
      var inputEl = this.$refs.messageInput && this.$refs.messageInput.$refs.textarea;
      if (!inputEl || document.activeElement !== inputEl) return;
      this.processPasteEvent(event);
    },

    processPasteEvent(event) {
      var clipboardData = event.clipboardData || window.clipboardData;
      if (!clipboardData || !clipboardData.items) return;

      var hasImage = false;
      for (var i = 0; i < clipboardData.items.length; i++) {
        var item = clipboardData.items[i];
        if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
          hasImage = true;
          var file = item.getAsFile();
          if (file) {
            this.addPendingFile(file);
          }
        }
      }
      if (hasImage) {
        event.preventDefault();
      }
    },

    addPendingFile(file) {
      if (!file) return;
      var self = this;
      var isImage = IMAGE_TYPES.indexOf(file.type) > -1 || /\.(png|jpe?g|gif|webp|bmp)$/i.test(file.name);
      var reader = new FileReader();
      reader.onload = function(e) {
        self.pendingFiles.push({
          uid: self.generateFileUid(),
          name: file.name || ('截图_' + self.formatShortDate(new Date()) + '.png'),
          type: file.type,
          size: file.size,
          isImage: isImage,
          previewUrl: e.target.result,
          raw: file
        });
      };
      reader.onerror = function() {
        self.$message.error('文件读取失败，请重试');
      };
      reader.readAsDataURL(file);
    },

    removePendingFile(index) {
      this.pendingFiles.splice(index, 1);
    },

    clearInput() {
      this.inputText = '';
      this.revokePendingPreviews();
      this.pendingFiles = [];
    },

    revokePendingPreviews() {
      this.pendingFiles.forEach(function(file) {
        if (file.previewUrl && file.previewUrl.indexOf('blob:') === 0) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    },

    handleInputKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.handleSend();
      }
    },

    isBotMessage(msg) {
      return msg && msg.user === '机器人';
    },

    getMessageName(msg) {
      if (this.isBotMessage(msg)) return msg.user || '机器人';
      return msg.userName || '用户';
    },

    isImageFile(file) {
      if (!file) return false;
      if (file.isImage) return true;
      if (file.type && file.type.indexOf('image') === 0) return true;
      return /\.(png|jpe?g|gif|webp|bmp)$/i.test(file.name || '');
    },

    openImagePreview(url) {
      if (!url) return;
      this.previewImageUrl = url;
      this.imagePreviewVisible = true;
    },

    downloadFile(file) {
      if (!file || !file.url) {
        this.$message.warning('暂无可下载的文件地址');
        return;
      }
      var link = document.createElement('a');
      link.href = file.url;
      link.download = file.name || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    scrollToBottom() {
      var list = this.$refs.messageList;
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    },

    formatTime(timestamp) {
      var date = new Date(timestamp);
      var h = ('0' + date.getHours()).slice(-2);
      var m = ('0' + date.getMinutes()).slice(-2);
      return h + ':' + m;
    },

    formatShortDate(date) {
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);
      var h = ('0' + date.getHours()).slice(-2);
      var m = ('0' + date.getMinutes()).slice(-2);
      return month + '-' + day + ' ' + h + ':' + m;
    }
  }
};
</script>

<style scoped>
.iqa-page {
  --iqa-primary: #4f8df5;
  --iqa-primary-light: #7eb0ff;
  --iqa-primary-soft: #edf4ff;
  --iqa-primary-border: #c7ddff;
  --iqa-accent: #5ec4b6;
  --iqa-text: #334155;
  --iqa-text-secondary: #64748b;
  --iqa-border: #e8eef5;
  --iqa-sidebar-bg: #f8fafc;
  --iqa-user-bubble: #edf4ff;
  --iqa-user-text: #2f5fae;
  --iqa-bot-bubble: #ffffff;
  --iqa-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
  --iqa-shadow-md: 0 8px 24px rgba(15, 23, 42, 0.06);

  display: flex;
  height: calc(100vh - 96px);
  min-width: 960px;
  background: #ffffff;
  color: var(--iqa-text);
  overflow: hidden;
}

.iqa-sidebar {
  width: 288px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--iqa-border);
  background: linear-gradient(180deg, #fbfdff 0%, var(--iqa-sidebar-bg) 100%);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 14px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--iqa-primary), var(--iqa-accent));
  box-shadow: 0 0 0 4px rgba(79, 141, 245, 0.12);
}

.sidebar-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  letter-spacing: 0.02em;
}

.sidebar-search {
  padding: 0 16px 14px;
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 14px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 36px;
  padding: 0 32px 0 34px;
  border: 1px solid var(--iqa-border);
  border-radius: 10px;
  background: #ffffff;
  color: var(--iqa-text);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--iqa-primary-light);
  box-shadow: 0 0 0 3px rgba(79, 141, 245, 0.12);
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-clear {
  position: absolute;
  right: 10px;
  color: #94a3b8;
  cursor: pointer;
  font-size: 14px;
}

.search-clear:hover {
  color: var(--iqa-primary);
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 16px;
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 12px;
  margin-bottom: 6px;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.72);
}

.session-item:hover {
  background: #ffffff;
  border-color: var(--iqa-border);
  box-shadow: var(--iqa-shadow-sm);
  transform: translateY(-1px);
}

.session-item.active {
  background: #ffffff;
  border-color: var(--iqa-primary-border);
  box-shadow: 0 4px 14px rgba(79, 141, 245, 0.1);
}

.session-item.active .session-icon {
  color: var(--iqa-primary);
}

.session-item.active .session-title {
  color: #1e3a5f;
  font-weight: 500;
}

.session-main {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
}

.session-icon {
  color: #94a3b8;
  margin-right: 10px;
  flex-shrink: 0;
  font-size: 15px;
}

.session-title {
  font-size: 13px;
  color: var(--iqa-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-actions {
  display: none;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
}

.session-item:hover .session-actions {
  display: flex;
}

.session-actions i {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #94a3b8;
  transition: all 0.2s;
}

.session-actions i:hover {
  color: var(--iqa-primary);
  background: var(--iqa-primary-soft);
}

.session-actions .el-icon-delete:hover {
  color: #ef4444;
  background: #fef2f2;
}

.session-empty {
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
  padding: 48px 16px;
}

.iqa-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #ffffff;
}

.chat-header {
  padding: 18px 28px;
  border-bottom: 1px solid var(--iqa-border);
  background: linear-gradient(90deg, #ffffff 0%, #fbfdff 100%);
}

.chat-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.chat-subtitle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--iqa-text-secondary);
}

.chat-subtitle i {
  color: var(--iqa-accent);
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  background:
    radial-gradient(circle at top right, rgba(79, 141, 245, 0.04), transparent 28%),
    radial-gradient(circle at bottom left, rgba(94, 196, 182, 0.05), transparent 24%),
    #ffffff;
}

.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #edf4ff, #f0fdfa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: var(--iqa-primary);
  margin-bottom: 18px;
  box-shadow: inset 0 0 0 1px rgba(79, 141, 245, 0.12);
}

.empty-title {
  margin: 0 0 8px;
  font-size: 17px;
  color: #334155;
  font-weight: 500;
}

.empty-desc {
  margin: 0;
  font-size: 13px;
}

.message-row {
  display: flex;
  margin-bottom: 22px;
}

.message-row.is-user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.is-bot .message-avatar {
  background: linear-gradient(135deg, #eef4ff, #f5f3ff);
  color: #6366f1;
  margin-right: 12px;
  box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.12);
}

.is-user .message-avatar {
  background: linear-gradient(135deg, #dbeafe, #e0f2fe);
  color: #3b82c4;
  margin-left: 12px;
  box-shadow: inset 0 0 0 1px rgba(59, 130, 196, 0.12);
}

.message-body {
  max-width: 68%;
}

.is-user .message-body {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-meta {
  margin-bottom: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.is-user .message-meta {
  text-align: right;
}

.message-name {
  margin-right: 8px;
  color: var(--iqa-text-secondary);
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 14px;
  line-height: 1.65;
  word-break: break-word;
  box-shadow: var(--iqa-shadow-sm);
}

.is-bot .message-bubble {
  background: var(--iqa-bot-bubble);
  color: #334155;
  border: 1px solid var(--iqa-border);
  border-top-left-radius: 4px;
}

.is-user .message-bubble {
  background: var(--iqa-user-bubble);
  color: var(--iqa-user-text);
  border: 1px solid var(--iqa-primary-border);
  border-top-right-radius: 4px;
}

.message-text {
  margin: 0;
  white-space: pre-wrap;
}

.message-attachments {
  margin-top: 8px;
}

.msg-image-item img {
  max-width: 240px;
  max-height: 180px;
  border-radius: 10px;
  cursor: pointer;
  display: block;
  border: 1px solid rgba(79, 141, 245, 0.12);
  transition: transform 0.2s, box-shadow 0.2s;
}

.msg-image-item img:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.msg-file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(79, 141, 245, 0.06);
  margin-top: 6px;
}

.is-user .msg-file-item {
  background: rgba(255, 255, 255, 0.72);
}

.is-user .msg-file-item i {
  color: var(--iqa-primary);
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.file-download-btn {
  border: none;
  background: transparent;
  color: var(--iqa-primary);
  font-size: 12px;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.file-download-btn:hover {
  background: rgba(79, 141, 245, 0.1);
}

.message-bubble.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
}

.message-bubble.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
  animation: typing 1.2s infinite ease-in-out;
}

.message-bubble.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.message-bubble.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.input-area {
  border-top: 1px solid var(--iqa-border);
  padding: 14px 28px 22px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
}

.pending-preview {
  margin-bottom: 12px;
  padding: 12px 14px;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  background: rgba(248, 250, 252, 0.9);
}

.pending-text {
  margin-bottom: 8px;
  font-size: 13px;
}

.pending-label {
  display: inline-block;
  padding: 2px 8px;
  margin-right: 8px;
  border-radius: 999px;
  background: var(--iqa-primary-soft);
  color: var(--iqa-primary);
  font-size: 12px;
}

.pending-content {
  color: #475569;
}

.pending-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pending-file-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 6px 28px 6px 8px;
  border: 1px solid var(--iqa-border);
  border-radius: 10px;
  background: #ffffff;
  max-width: 200px;
  box-shadow: var(--iqa-shadow-sm);
}

.pending-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
}

.pending-file-icon {
  font-size: 20px;
  color: var(--iqa-primary);
  margin-right: 6px;
}

.pending-file-name {
  font-size: 12px;
  color: #475569;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pending-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #94a3b8;
  font-size: 14px;
}

.pending-remove:hover {
  color: #ef4444;
}

.input-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.hidden-input {
  display: none;
}

.input-tip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.input-box {
  display: flex;
  align-items: flex-end;
  gap: 14px;
}

.textarea-wrap {
  flex: 1;
  padding: 2px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(79, 141, 245, 0.18), rgba(94, 196, 182, 0.18));
}

.textarea-wrap >>> .el-textarea__inner {
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 14px;
  background: #ffffff;
  color: var(--iqa-text);
  box-shadow: none;
  transition: box-shadow 0.2s;
}

.textarea-wrap >>> .el-textarea__inner:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(79, 141, 245, 0.1);
}

.preview-image {
  display: block;
  max-width: 100%;
  margin: 0 auto;
}

/* 自定义按钮 */
.iqa-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.iqa-btn i {
  font-size: 14px;
}

.iqa-btn-sm {
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
}

.iqa-btn-primary {
  color: #ffffff;
  background: linear-gradient(135deg, #5b9dff 0%, #4f8df5 100%);
  box-shadow: 0 4px 12px rgba(79, 141, 245, 0.28);
}

.iqa-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(79, 141, 245, 0.34);
}

.iqa-btn-primary:active {
  transform: translateY(0);
}

.iqa-btn-ghost {
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  color: #475569;
  background: #ffffff;
  border: 1px solid var(--iqa-border);
  box-shadow: var(--iqa-shadow-sm);
}

.iqa-btn-ghost:hover {
  color: var(--iqa-primary);
  border-color: var(--iqa-primary-border);
  background: var(--iqa-primary-soft);
}

.iqa-btn-send {
  min-width: 92px;
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  color: #ffffff;
  background: linear-gradient(135deg, #66a8ff 0%, #4f8df5 55%, #5ec4b6 100%);
  box-shadow: 0 8px 20px rgba(79, 141, 245, 0.28);
}

.iqa-btn-send:hover:not(.is-disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(79, 141, 245, 0.34);
}

.iqa-btn-send.is-disabled,
.iqa-btn-send:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  transform: none;
  box-shadow: none;
  background: linear-gradient(135deg, #cbd5e1, #94a3b8);
}

.iqa-btn-send.is-loading {
  cursor: wait;
}

.dialog-footer-btns {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-footer-btns .iqa-btn {
  min-width: 72px;
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
}
</style>

<style>
.iqa-image-dialog .el-dialog__body {
  padding: 12px 20px 24px;
  text-align: center;
  background: #ffffff;
}

.iqa-image-dialog .el-dialog {
  border-radius: 14px;
  overflow: hidden;
}
</style>
