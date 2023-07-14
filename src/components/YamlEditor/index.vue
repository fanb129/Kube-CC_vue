<template>
  <div style="height: 100%">
    <textarea ref="textarea" />
  </div>
</template>
<script>
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter.js'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/selection/active-line' // 代码高亮
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/anyword-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/xq-light.css'
import 'codemirror/theme/monokai.css' // 主题
import CodeMirror from 'codemirror'
export default {
  name: 'YamlEditor',
  props: {
    value: {
      type: Object | String,
      default: null
    },
    mode: {
      type: String,
      default: 'yaml' // yaml / application/json
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      codeMirrorEditor: null // codeMirror实例化对象
    }
  },
  watch: {
    value: {
      handler(val) {
        if (!this.codeMirrorEditor) return
        const editorValue = this.getCodeMirrorEditorValue()
        if (val !== editorValue) {
          this.setCodeMirrorEditorValue(val)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    setTimeout(this.initCodeMirrorEditor, 500)
    // this.initCodeMirrorEditor();
  },
  destroyed() {
    this.codeMirrorEditor.off('change')
  },
  methods: {
    initCodeMirrorEditor() {
      this.codeMirrorEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        mode: this.mode,
        lineNumbers: true, // 显示行数
        lint: true,
        indentUnit: 2, // 缩进单位为2
        smartIndent: true, // 自动缩进是否开启
        styleActiveLine: true, // 当前行背景高亮
        matchBrackets: true, // 括号匹配
        lineWrapping: true, // 自动换行
        tabSize: 2,
        readOnly: this.readOnly,
        theme: 'rubyblue',
        scrollbarStyle: 'overlay'
      })
      this.codeMirrorEditor.setSize('99%', '100%')
      if (this.value) this.setCodeMirrorEditorValue(this.value) // 设置值
      this.codeMirrorEditor.on('change', () => {
        const EditorValue = this.getCodeMirrorEditorValue()
        this.$emit('change', EditorValue)
        this.$emit('input', EditorValue)
      })
    },
    // 设置编辑器支持的语言mode
    setCodeMirrorEditorMode(option) {
      this.codeMirrorEditor.setOption('mode', option)
    },
    // 获取编辑器内容
    getCodeMirrorEditorValue() {
      return this.codeMirrorEditor.getValue()
    },
    // 设置编辑器内容
    setCodeMirrorEditorValue(value) {
      return this.codeMirrorEditor.setValue(value)
    },
    // 刷新编辑器
    refreshCodeMirrorEditor() {
      this.codeMirrorEditor.refresh()
    }
  }
}
</script>
