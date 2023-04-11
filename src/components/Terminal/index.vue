<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-left: 1vh; margin-right: 1vh">
      <el-tab-pane name="first" label="SSH">
        <div style="text-align: center">
          <el-form ref="form" :model="form" status-icon :rules="rules" label-position="left" label-width="80px" style="margin-left: 50vh; width: 50vh">
            <el-form-item label="Ip" prop="ip">
              <el-input v-model="form.ip"/>
            </el-form-item>
            <el-form-item label="Port" prop="port">
              <el-input v-model="form.port"/>
            </el-form-item>
            <el-form-item label="User" prop="user">
              <el-input v-model="form.user"/>
            </el-form-item>
            <el-form-item label="Password" prop="pwd">
              <el-input v-model="form.pwd" type="password"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">连接</el-button>
              <el-button @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second" label="Terminal">
        <div class="ssh-container" ref="terminal"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import { debounce } from 'lodash'

const packResize = (cols, rows) =>
  JSON.stringify({
    type: 'resize',
    cols: cols,
    rows: rows
  })
export default {
  name: 'MyTerminal',
  created() {
    this.form.ip = this.$route.query.ip || ''
    this.form.port = this.$route.query.port || ''
  },
  data() {
    var validate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        ip: [
          {validator: validate, trigger: 'blur'}
        ],
        port: [
          {validator: validate, trigger: 'blur'}
        ],
        user: [
          {validator: validate, trigger: 'blur'}
        ],
        pwd: [
          {validator: validate, trigger: 'blur'}
        ],
      },
      activeName: 'first',
      initText: '连接中...\r\n',
      first: true,
      term: null,
      fitAddon: null,
      ws: null,
      socketUrl: `${process.env.VUE_APP_WS_API}/node/ssh`,
      form: {
        user: '',
        pwd: '',
        ip: '',
        port: '',
      },
      option: {
        lineHeight: 1.0,
        cursorBlink: true,
        cursorStyle: 'block', // 光标样式 'block' | 'underline' | 'bar'
        fontSize: 30,
        // fontcolor: '#000000',
        fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
        theme: {
          // 背景色
          background: '#ffffff',
          // 前景色
          foreground: '#000000',
          // 光标背景色
          cursor: '#000000',
          // 光标前景色
          /** The accent color of the cursor (fg color for a block cursor) */
          // cursorAccent: '#000000',
          // 选择背景色
          /** The selection background color (can be transparent) */
          selection: '#0000ff',
          // 选择前景色
          /** The selection foreground color */
          selectionForeground: '#0000ff'
        },
        cols: 30 // 初始化的时候不要设置fit，设置col为较小值（最小为可展示initText初始文字即可）方便屏幕缩放
      }
    }
  },
  // mounted() {
  //   this.initTerm()
  //   this.initSocket()
  //
  //   this.onTerminalResize()
  //   this.onTerminalKeyPress()
  // },
  beforeDestroy() {
    this.removeResizeListener()
    this.term && this.term.dispose()
    this.ws.send(JSON.stringify({
      type: 'stdin',
      data: this.utf8_to_b64('exit')
    }))
  },
  methods: {
    destroyed(){
      this.ws.send(JSON.stringify({
        type: 'stdin',
        data: this.utf8_to_b64('exit')
      }))
    },
    initWs() {
      this.initTerm()
      this.initSocket()
      this.onTerminalResize()
      this.onTerminalKeyPress()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.activeName = 'second'
          this.initWs()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleClick(tab, event) {
      if (tab.name === 'second') {
        // this.init()
      }
    },
    utf8_to_b64(rawString) {
      return btoa(unescape(encodeURIComponent(rawString)));
    },
    b64_to_utf8(encodeString) {
      return decodeURIComponent(escape(atob(encodeString)));
    },
    bytesHuman(bytes, precision) {
      if (!/^([-+])?|(\.\d+)(\d+(\.\d+)?|(\d+\.)|Infinity)$/.test(bytes)) {
        return '-'
      }
      if (bytes === 0) return '0';
      if (typeof precision === 'undefined') precision = 1;
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
      const num = Math.floor(Math.log(bytes) / Math.log(1024));
      const value = (bytes / Math.pow(1024, Math.floor(num))).toFixed(precision);
      return `${value} ${units[num]}`
    },
    isWsOpen() {
      return this.ws && this.ws.readyState === 1
    },
    initTerm() {
      this.term = new Terminal(this.option)
      this.fitAddon = new FitAddon()
      this.term.loadAddon(this.fitAddon)
      this.term.open(this.$refs.terminal)
      // this.fitAddon.fit() // 初始化的时候不要使用fit
      setTimeout(() => {
        this.fitAddon.fit()
      }, 500); // 必须延时处理
    },
    onTerminalKeyPress() {
      this.term.onData(data => {
        this.isWsOpen() && this.ws.send(JSON.stringify({
          type: 'stdin',
          data: this.utf8_to_b64(data)
        }))
      })
    },
    // resize 相关
    resizeRemoteTerminal() {
      const { cols, rows } = this.term
      console.log('列数、行数设置为：', cols, rows)
      // 调整后端终端大小 使后端与前端终端大小一致
      this.isWsOpen() && this.ws.send(packResize(cols, rows))
    },
    onResize: debounce(function () {
      this.fitAddon.fit()
    }, 500),
    onTerminalResize() {
      window.addEventListener('resize', this.onResize)
      this.term.onResize(this.resizeRemoteTerminal)
    },
    removeResizeListener() {
      window.removeEventListener('resize', this.onResize)
    },
    // socket
    initSocket() {
      this.term.write(this.initText)
      console.log(this.socketUrl)
      this.ws = new WebSocket(this.socketUrl,['webssh'])
      this.onOpenSocket()
      this.onCloseSocket()
      this.onErrorSocket()
      this.term._initialized = true
      this.onMessageSocket()
    },
    // 打开连接
    onOpenSocket() {
      this.ws.onopen = () => {
        console.log('websocket 已连接')
        this.ws.send(JSON.stringify({ type: "addr", data: this.utf8_to_b64(this.form.ip + ':' + this.form.port) }));
        // socket.send(JSON.stringify({ type: "term", data: utf8_to_b64("linux") }));
        this.ws.send(JSON.stringify({ type: "login", data: this.utf8_to_b64(this.form.user) }));
        this.ws.send(JSON.stringify({ type: "password", data: this.utf8_to_b64(this.form.pwd) }));
        this.term.reset()
        setTimeout(() => {
          this.resizeRemoteTerminal()
        }, 500)
      }
    },

    // 关闭连接
    onCloseSocket() {
      this.ws.onclose = () => {
        console.log('关闭连接')
        this.term.write('未连接， 刷新后重连...\r\n');
        // setTimeout(() => {
        //   this.initSocket();
        // }, 3000)
      }
    },
    // 连接错误
    onErrorSocket() {
      this.ws.onerror = () => {
        this.term.write('连接失败，请刷新！')
      }
    },
    // 接收消息
    onMessageSocket() {
      this.ws.onmessage = res => {
        console.log(res)
        const msg = JSON.parse(res.data)
        const term = this.term
        // console.log("receive: " + data)
        // 第一次连接成功将 initText 清空
        if (this.first) {
          this.first = false
          term.reset()
          term.element && term.focus()
          this.resizeRemoteTerminal()
        }
        term.write(this.b64_to_utf8(msg.data))
      }
    }
  }
}
//
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
}

.ssh-container {
  overflow: hidden;
  height: 85vh;
  border-radius: 4px;
  background: rgb(255, 255, 255);
  padding: 0px;
  //color: rgb(0, 0, 0);

  .xterm-scroll-area::-webkit-scrollbar-thumb {
    background-color: #b7c4d1;
    /* 滚动条的背景颜色 */
  }
}
</style>

