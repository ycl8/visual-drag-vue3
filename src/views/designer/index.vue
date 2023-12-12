<template>
    <div>
        <a-row class="top">
            <a-col :span="2" align="right" style="height: 100%;overflow: hidden;">
                <a-image style="width: 40px; height: 40px;padding: 0;margin: 0" fit="fill"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            </a-col>
            <a-col :span="6">
                <span class="el-icon-magic-stick lg" style="width: 30px" />
                <span>Cola Designer</span>

                <a style="margin: 0 4px;" href='https://gitee.com/colaiven/cola-designer' target="_blank">
                    <a-image style="width: 50px; height: 16px;padding: 0;margin: 0"
                        src='https://gitee.com/colaiven/cola-designer/badge/star.svg?theme=dark' alt='star' />
                </a>
            </a-col>


            <a-col :span="16" @click.self.native="outBlur">
                <a-button type="primary" size="small" style="margin: 10px 10px;
            background: #49586e;color: #fff;float: right" @click="preview">预览</a-button>
                <a-button type="primary" size="small" style="margin: 10px 5px;background: #d5d9e2;float: right"
                    @click="submitDesign">保存</a-button>
                <div style="float: right;margin: 1px 10px;" class="configBtn" @click="clearDesign">
                    <delete-outlined />
                </div>
            </a-col>
        </a-row>

        <div class="sk_back_port" :style="{ height: (state.windowHeight - 45) + 'px' }" @click.self="outBlur">
            <div style="float: left;height: 100%;overflow: hidden;" :style="{ width: state.cptBarWidth + 'px' }">
                <component-bar @dragStart="dragStart" :selectedComponents="state.cacheComponents"
                    :currentCptIndex="state.currentCptIndex" @showConfigBar="showConfigBar" @copyCpt="copyCpt"
                    @delCpt="delCpt" /><!--左侧组件栏-->
            </div>



            <div style="float: left;position: relative;overflow: hidden;height: 100%"
                :style="{ width: (state.windowWidth - state.cptBarWidth - state.configBarWidth) + 'px' }"
                @click.self="outBlur">
                <div style="height: 10px;margin-left: 10px" :style="{ width: 1920 * state.containerScale + 'px' }">
                    <ScaleMarkX /><!--顶部刻度线-->
                </div>
                <div style="position: absolute;width: 10px;"
                    :style="{ height: 1920 * state.containerScale / state.designData.scaleX * state.designData.scaleY + 'px' }">
                    <ScaleMarkY /><!--左侧刻度线-->
                </div>

                <div class="webContainer" :style="{
                    width: state.designData.scaleX + 'px', 
                    height: state.designData.scaleY + 'px', 
                    backgroundColor: state.designData.bgColor,
                    backgroundImage: state.designData.bgImg ? 'url(' + fileUrl + state.designData.bgImg + ')' : 'none', transform: 'scale(' + state.containerScale + ')'
                }" @dragover="allowDrop" @drop="drop" ref="webContainer" @click.self="outBlur">
                    <div v-for="(item, index) in state.cacheComponents" :key="item.id" class="cptDiv" :style="{
                        width: Math.round(item.cptWidth) + 'px', height: Math.round(item.cptHeight) + 'px',
                        top: Math.round(item.cptY) + 'px', left: Math.round(item.cptX) + 'px',
                        zIndex: state.currentCptIndex === index ? 1800 : item.cptZ
                    }" :ref="'div' + item.cptKey + index" @mousedown="showConfigBar($event, item, index)" tabindex="0">
                        <div v-show="state.currentCptIndex === index"
                            style="position: fixed;border-top: 1px dashed #8A8A8A;width: 100%;left:0" /><!--顶部辅助线-->
                        <div v-show="state.currentCptIndex === index"
                            style="position: fixed;border-right: 1px dashed #8A8A8A;height:100%;top:0" /><!--左侧辅助线-->
                        <!-- 2021-12-28新增iframe组件，防止焦点聚焦在iframe内部，添加此蒙版 -->
                        <div v-resize="'move'" class="activeMask"
                            :style="state.cacheChoices[item.id] ? { border: '1px solid #B6BFCE' } : {}" />
                        <div style="width: 100%;height: 100%;">
                            <component :is="item.cptKey" :ref="item.cptKey + index" :width="Math.round(item.cptWidth)"
                                :height="Math.round(item.cptHeight)" :option="item.cptOption" />
                        </div>
                        <div class="delTag">
            <!--                 <i class="el-icon-copy-document" @click.stop="copyCpt(item)" />
                          
                            <i style="margin-left: 4px" class="el-icon-delete" @click.stop="delCpt(item, index)" /> -->
                            <copy-outlined @click.stop="copyCpt(item)" />

                            <delete-outlined   @click.stop="delCpt(item, index)"/>
                        </div>
                        <div v-show="state.currentCptIndex === index"
                            style="top: 0;left: 0;cursor: se-resize;transform: translate(-50%, -50%)" class="resizeTag"
                            v-resize="'lt'" />
                        <div v-show="state.currentCptIndex === index"
                            style="top: 0;left: 50%;cursor: s-resize;transform: translate(-50%, -50%)" class="resizeTag"
                            v-resize="'t'" />
                        <div v-show="state.currentCptIndex === index"
                            style="top: 0;right: 0;cursor: ne-resize;transform: translate(50%, -50%)" class="resizeTag"
                            v-resize="'rt'" />
                        <div v-show="state.currentCptIndex === index"
                            style="top: 50%;right: 0;cursor: w-resize;transform: translate(50%, -50%)" class="resizeTag"
                            v-resize="'r'" />
                        <div v-show="state.currentCptIndex === index"
                            style="bottom: 0;right: 0;cursor: se-resize;transform: translate(50%, 50%)" class="resizeTag"
                            v-resize="'rb'" />
                        <div v-show="state.currentCptIndex === index"
                            style="bottom: 0;left: 50%;cursor: s-resize;transform: translate(-50%, 50%)" class="resizeTag"
                            v-resize="'b'" />
                        <div v-show="state.currentCptIndex === index"
                            style="bottom: 0;left: 0;cursor: ne-resize;transform: translate(-50%, 50%)" class="resizeTag"
                            v-resize="'lb'" />
                        <div v-show="state.currentCptIndex === index"
                            style="top: 50%;left: 0;cursor: w-resize;transform: translate(-50%, -50%)" class="resizeTag"
                            v-resize="'l'" />
                    </div>
                </div>
                <div style="position: absolute;width: 120px;height: 30px;bottom: 10px;left: 10px;">
                    <a-slider v-model:value="state.containerScale" :min="0.3" :max="2" :step="0.01" />
                </div>
            </div>
            <div style="float: right;height: 100%;overflow: hidden" :style="{ width: state.configBarWidth - 6 + 'px' }">
                <config-bar ref="configBar" :currentCpt.sync="state.currentCpt" :designData.sync="state.designData"
                    @refreshCptData="refreshCptData" :height="state.windowHeight" /><!--右侧属性栏-->
            </div>
        </div>

        <input v-show="false" type="file" id="files" ref="refFile" @change="fileLoad" accept=".cd">
    </div>
</template>

<script setup>
import env from "/env";
import componentBar from './componentBar.vue'
import ConfigBar from "./configBar.vue";
import ScaleMarkX from "./scaleMark/ScaleMarkX.vue";
import ScaleMarkY from "./scaleMark/ScaleMarkY.vue";
import { message } from 'ant-design-vue';
import html2canvas from 'html2canvas';
import { v1 as uuidv1 } from 'uuid';
import { Modal } from 'ant-design-vue';
import { createVNode, defineComponent } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
//引入router 
import { useRouter } from 'vue-router';

const   router= useRouter()
console.log("🚀🤩🤩 ~ file: index.vue:131 ~ useRouter:", router)


const {proxy} = getCurrentInstance()
    console.log("🚀🤩🤩 ~ file: index.vue:452 ~ vResize ~ proxy:", proxy)
const state = reactive({
    windowWidth: 0,
    windowHeight: 0,
    fileUrl: env.fileUrl,
    cptBarWidth: 200,
    configBarWidth: 300,
    copyDom: '',
    designData: {
        id: '', title: '我的大屏', scaleX: 1920, scaleY: 1080, version: '',
        bgColor: '#2B3340', simpleDesc: '', bgImg: '', viewCode: '', components: []
    },
    cacheComponents: [],
    currentCptIndex: -1,
    currentCpt: { cptOption: undefined },
    containerScale: 1,
    cacheChoices: {},
    cacheChoicesFixed: {}//记录移动前选中组件的位置 自定义事件内部无法处理，放在了外面。
})

onMounted(() => {
    const that = state;
    window.addEventListener("keydown", (event) => {
        if (state.currentCptIndex !== -1) {
            let key = event.key
            switch (key) {//方向键移动当前组件
                case 'ArrowDown':
                    that.currentCpt.cptY += 1;
                    break;
                case 'ArrowUp':
                    that.currentCpt.cptY -= 1;
                    break;
                case 'ArrowLeft':
                    that.currentCpt.cptX -= 1
                    break;
                case 'ArrowRight':
                    that.currentCpt.cptX += 1
                    break;
            }
        }
    })
    window.onresize = () => {
        return (() => {
            initContainerSize()
        })();
    };
})

const initContainerSize = () => {
    state.windowWidth = document.documentElement.clientWidth
    state.windowHeight = document.documentElement.clientHeight
    let tempWidth = state.windowWidth - state.cptBarWidth - state.configBarWidth;
    state.containerScale = Math.round(tempWidth / state.designData.scaleX * 100) / 100
}

const webContainer = ref(null)
//导出
const exportCommand = (command) => {
    if (command === 'img') {
        html2canvas(this.$refs.webContainer, { backgroundColor: '#49586e' }).then(canvas => {
            const canvasData = canvas.toDataURL("image/jpeg");
            fileDownload(canvasData, this.designData.title + '.png');
        })
    } else if (command === 'json') {
        state.designData.components = state.cacheComponents;
        state.designData.version = env.version;
        const data = JSON.stringify(state.designData)
        let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(data);//encodeURIComponent解决中文乱码
        fileDownload(uri, state.designData.title + '.cd');
    }
}
// 导入
/* const importDesign = () => {
    this.$refs.refFile.dispatchEvent(new MouseEvent('click'))
} */
//导入
const fileLoad = () => {
    const that = this;
    const selectedFile = this.$refs.refFile.files[0];
    const reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onload = function () {
        const fileJson = JSON.parse(this.result);//文件大小、合法性待校验
        if (!fileJson.version || fileJson.version !== env.version) {
            that.$message.error('导入失败，与当前版本不一致');
        } else {
            fileJson.id = that.designData.id
            that.designData = fileJson;
            that.cacheComponents = fileJson.components;
            that.designData.components = [];
            that.$message.success('导入成功');
        }
    }
    this.$refs.refFile.value = ''
}
const clearDesign = () => {
    Modal.confirm({
        title: "此操作将会清空图层，是否继续？",
        icon: createVNode(ExclamationCircleOutlined),
        content: 'Some descriptions',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            console.log('OK');
            state.cacheComponents = [];
            state.designData.components = [];
            state.currentCpt = {};
            localStorage.removeItem('designCache');
            // clearCptInterval(null, true);
            message.success("清除成功");
        },
        onCancel() {
            console.log('Cancel');
        },
    });

}


const loadCacheData = () => {
    /*     const loading = this.$loading({
            lock: true, text: '加载中', spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        }); */
    if ('preview' === env.active) {
        const cacheStr = localStorage.getItem('designCache');
        if (cacheStr) {
            state.designData = JSON.parse(cacheStr);
            if (!state.designData.version || state.designData.version !== env.version) {
                localStorage.removeItem('designCache');
                message.success("发现旧版缓存，已清除");
            } else {
                state.cacheComponents = state.designData.components;
                state.designData.components = [];//强迫症
            }
        }
        state.designData.version = env.version;
        initContainerSize();
        // loading.close();
    } else {
        /*      const id = this.$route.query.id;
             if (id) {
                 getByIdApi(id, 0).then(res => {
                     this.designData = res.data;
                     this.cacheComponents = JSON.parse(this.designData.components);
                     if (!this.cacheComponents) {
                         this.cacheComponents = []
                     }
                     this.designData.components = [];
                     this.initContainerSize();
                     loading.close();
                 })
             } else {
                message.error('当前为DEV模式，请从管理端进入')
             } */
    }
}
loadCacheData()

const outBlur = () => {//取消聚焦组件
    state.currentCptIndex = -1;
    state.currentCpt = {};
    state.cacheChoices = {}
}



const submitDesign = () => {//保存
    if ('preview' === env.active) {
        state.designData.components = state.cacheComponents;
        localStorage.setItem('designCache', JSON.stringify(state.designData));
        message.success('已保存')
    } else {
        const that = this;
        if (!that.$route.query.id) {
            that.$message.error('更新异常')
            return;
        }
        /*     const loading = this.$loading({
                lock: true, text: '保存中', spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            }); */

        html2canvas(that.$refs.webContainer, { backgroundColor: '#49586e' }).then(canvas => {
            const canvasData = canvas.toDataURL("image/jpeg");
            let file = base64toFile(canvasData, that.designData.title + '.png');
            let fileFormData = new FormData()
            fileFormData.append('file', file)
            uploadFileApi(that.designData.id + '.png', fileFormData).then(res => {//上传预览图
                that.designData.designImgPath = res.data
                that.designData.components = JSON.stringify(this.cacheComponents)
                saveOrUpdateApi(this.designData).then(res2 => {
                    // loading.close();
                    that.$message.success(res2.msg);
                })
            })
            // loading.close();
        })
    }
}






const showConfigBar = (e, item, index) => {//刷新属性栏数据，页面上拖动的组件执行click事件来更新组件的属性栏
    state.currentCpt = item;
    state.currentCptIndex = index;
  /*   if (this.$refs['div' + item.cptKey + index]) {
        this.$refs['div' + item.cptKey + index][0].focus();//聚焦 用于多选移动
    } */
    if (!e.ctrlKey) {//未按住ctrl键
        state.cacheChoices = {}
    }
    // this.$refs['configBar'].showCptConfig(item);
    configBar.value.showCptConfig(item)
    state.cacheChoices[item.id] = item
    state.cacheChoicesFixed[item.id] = JSON.parse(JSON.stringify(item))
}
const preview = () => {//预览按钮
    state.designData.components = state.cacheComponents;
    localStorage.setItem('designCache', JSON.stringify(state.designData));
    console.log("🚀🤩🤩 ~ file: index.vue:360 ~ preview ~ router:", router)
  let routeUrl= router.resolve({
        path: "/preview"
    })
  console.log("🚀🤩🤩 ~ file: index.vue:362 ~ routeUrl ~ routeUrl:", routeUrl)
/*     let routeUrl = this.$router.resolve({
        path: "/preview"
    }); */
    window.open(routeUrl.href, '_blank');
}

const delCpt = (cpt, index) => {
    Modal.confirm({
        title: `您要删除${cpt.cptTitle}组件？`,
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后将无法在画布中显示',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            console.log('OK');
            state.currentCpt = {};
            state.cacheComponents.splice(index, 1);
            console.log(proxy.$refs);
            const childId = proxy.$refs[cpt.cptKey + index][0].uuid
            // const childId = this.$refs[cpt.cptKey + index][0].uuid
            // clearCptInterval(childId);
        },
        onCancel() {
            console.log('Cancel');
        },
    });

    /*     this.$confirm('删除' + cpt.cptTitle + '组件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            //记录一个bug，v-for key值重复导致页面渲染数据错乱。在丢下组件时实用uuid作为key解决。
            state.currentCpt = {};
            state.cacheComponents.splice(index, 1);
            const childId = this.$refs[cpt.cptKey + index][0].uuid
            clearCptInterval(childId);
        }).catch(() => { }); */
}

const copyCpt = (item) => {
    let copyItem = JSON.parse(JSON.stringify(item))
    copyItem.cptX = item.cptX + 30//复制的组件向右下偏移
    copyItem.cptY = item.cptY + 30
    // copyItem.id = require('uuid').v1();
       copyItem.id =uuidv1()
    state.cacheComponents.push(copyItem);
    state.currentCptIndex = state.cacheComponents.length - 1//聚焦到复制的组件
}



const refreshCptData = () => {
    const refName = this.currentCpt.cptKey + this.currentCptIndex;
    if (!this.$refs[refName][0].refreshCptData) {
        message.warning('当前图层还未实现refreshCptData方法')
    } else {
        this.$refs[refName][0].refreshCptData();//刷新子组件数据，refs为组建名加index
    }
}

const dragStart = (copyDom) => {//从组件栏拿起组件
    state.copyDom = copyDom;
    copyDom.draggable = false;
}

const allowDrop = (e) => { e.preventDefault() }
const configBar = ref(null)

const drop = (e) => {//从组件栏丢下组件
    let config = JSON.parse(state.copyDom.getAttribute('config'));
    if (config.option.cptDataForm) {//2022-01-24：将静态数据、api、sql用三个字段存储，配置项未填写apiUrl字段和sql字段在此处赋默认值
        if (!config.option.cptDataForm.apiUrl) {
            config.option.cptDataForm.apiUrl = '/design/test'
        }
        if (!config.option.cptDataForm.sql) {
            config.option.cptDataForm.sql = 'select username from sys_user limit 1'
        }
    }
    let cpt = {
        cptTitle: config.name,
        icon: config.icon,
        cptKey: config.cptKey,
        cptOptionKey: config.cptOptionKey ? config.cptOptionKey : config.cptKey + '-option',
        cptOption: config.option,
        cptX: Math.round(e.offsetX),
        cptY: Math.round(e.offsetY),
        cptZ: 100,
        cptWidth: config.width ? config.width : 400,
        cptHeight: config.height ? config.height : 300,
        // id: require('uuid').v1(),
        id: uuidv1()
    }
    state.cacheComponents.push(cpt);
    state.cacheChoices = {}//多选清空
    showConfigBar({}, cpt, state.cacheComponents.length - 1)//丢下组件后刷新组件属性栏
    console.log(configBar.value.showCptConfig());
    //   this.$refs['configBar'].showCptConfig();
}
//指令

const vResize = (el, binding, vNode) => {
    el.onmousedown = function (e) {
        const that = vNode.context;
        const scaleClientX = e.clientX / state.containerScale;
        const scaleClientY = e.clientY / state.containerScale;
        const rbX = scaleClientX - el.parentNode.offsetWidth;
        const rbY = scaleClientY - el.parentNode.offsetHeight;
        const ltX = scaleClientX + el.parentNode.offsetWidth;
        const ltY = scaleClientY + el.parentNode.offsetHeight;
        const disX = scaleClientX - el.parentNode.offsetLeft;
        const disY = scaleClientY - el.parentNode.offsetTop;
        let cptWidth, cptHeight, cptX, cptY;

        document.onmousemove = function (me) {

            const meScaleClientX = me.clientX / state.containerScale
            const meScaleClientY = me.clientY / state.containerScale
            if (binding.value === 'move') {
                cptX = meScaleClientX - disX;
                cptY = meScaleClientY - disY;
                Object.keys(state.cacheChoices).forEach((key) => {
                    state.cacheChoices[key].cptX = state.cacheChoicesFixed[key].cptX + Math.round(meScaleClientX - scaleClientX)
                    state.cacheChoices[key].cptY = state.cacheChoicesFixed[key].cptY + Math.round(meScaleClientY - scaleClientY)
                })
            } else {
                switch (binding.value) {
                    case 'lt':
                        cptWidth = ltX - meScaleClientX;
                        cptHeight = ltY - meScaleClientY;
                        cptX = meScaleClientX - disX;
                        cptY = meScaleClientY - disY;
                        state.currentCpt.cptX = Math.round(cptX);
                        state.currentCpt.cptY = Math.round(cptY);
                        break;
                    case 't':
                        cptHeight = ltY - meScaleClientY;
                        cptY = meScaleClientY - disY;
                        state.currentCpt.cptY = Math.round(cptY);
                        break;
                    case 'rt':
                        cptWidth = meScaleClientX - rbX;
                        cptHeight = ltY - meScaleClientY;
                        cptY = meScaleClientY - disY;
                        state.currentCpt.cptY = Math.round(cptY);
                        break;
                    case 'r':
                        cptWidth = meScaleClientX - rbX;
                        break;
                    case 'rb':
                        cptWidth = meScaleClientX - rbX;
                        cptHeight = meScaleClientY - rbY;
                        break;
                    case 'b':
                        cptHeight = meScaleClientY - rbY;
                        break;
                    case 'lb':
                        cptWidth = ltX - meScaleClientX;
                        cptHeight = meScaleClientY - rbY;
                        cptX = meScaleClientX - disX;
                        state.currentCpt.cptX = Math.round(cptX);
                        break;
                    case 'l':
                        cptWidth = ltX - meScaleClientX;
                        cptX = meScaleClientX - disX;
                        state.currentCpt.cptX = Math.round(cptX);
                        break;
                }
                cptWidth = cptWidth < 40 ? 40 : cptWidth;//限制最小缩放
                cptHeight = cptHeight < 20 ? 20 : cptHeight;
                if (cptWidth) state.currentCpt.cptWidth = Math.round(cptWidth);
                if (cptHeight) state.currentCpt.cptHeight = Math.round(cptHeight);
            }
        }
        //点击选中
        document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null;
            state.cacheChoicesFixed = JSON.parse(JSON.stringify(state.cacheChoices));//解决多选移动未松开ctrl键第二次以后拖动定位还原
        }
        return false;
    }
}


</script>

<style lang="scss" scoped>
.sk_back_port {
    background: url('@/assets/port.png') repeat;
}

.top {
    height: 45px;
    box-shadow: 0 2px 5px #2b3340 inset;
    color: #fff;
    overflow: hidden;
    margin: 0;
    font-size: 18px;
    line-height: 45px;
    background: #353F50
}

.webContainer {
    position: relative;
    margin: 0 10px;
    background-size: 100% 100%;
    transform-origin: 0 0
}

.delTag {
    width: 45px;
    height: 22px;
    background: rgba(43, 51, 64, 0.8);
    border-radius: 2px;
    color: #ccc;
    z-index: 2000;
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
    display: none;
    cursor: pointer
}

.activeMask {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1801
}

.cptDiv {
    position: absolute;
    outline: none
}

.cptDiv:hover .delTag {
    display: block
}

.resizeTag {
    width: 8px;
    height: 8px;
    position: absolute;
    background-color: #B6BFCE;
    z-index: 2000;
    border-radius: 50%;
}

.configBtn:hover {
    cursor: pointer;
    color: #B6BFCE
}

.el-dropdown-link {
    cursor: pointer;
    color: #fff;
}
</style>