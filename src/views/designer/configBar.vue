<template>
    <div style="width: 100%;height:100%;background: #e3e5ec;overflow: hidden">
        <a-row style="background: rgba(228, 230, 236, 0.9);">
            <a-row class="cptTitle">
                <a-col :span="24">
                    <div>{{ state.configBarShow ? '组件配置' : '大屏配置' }}</div>
                </a-col>
            </a-row>

            <a-tabs v-model:activeKey="state.configTab" v-show="state.configBarShow">
                <a-tab-pane key="basic" tab="坐标">
                    <div style="width: 200px; margin: 0 auto">
                        <a-row style="padding: 10px 6px 0 6px">
                            宽度：<a-input-number :min="20" :max="2000" v-model:value="props.currentCpt.cptWidth"
                                size="small" />
                        </a-row>
                        <a-row style="padding: 10px 6px 0 6px">
                            高度：<a-input-number :min="20" :max="1500" v-model:value="props.currentCpt.cptHeight"
                                size="small" />
                        </a-row>
                        <a-row style="padding: 10px 6px 0 6px">
                            X 轴：<a-input-number :min="-500" :max="2500" v-model:value="props.currentCpt.cptX"
                                size="small" />
                        </a-row>
                        <a-row style="padding: 10px 6px 0 6px">
                            Y 轴：<a-input-number :min="-500" v-model:value="props.currentCpt.cptY" size="small" />
                        </a-row>
                        <a-row style="padding: 10px 6px 0 6px">
                            Z 轴：<a-input-number :min="1" :max="1800" v-model:value="props.currentCpt.cptZ" size="small" />
                        </a-row>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="custom" tab="属性">

                    <div class="customForm" :style="{ height: (props.height - 140) + 'px' }"
                        v-if="props.currentCpt && props.currentCpt.cptOption">
                        <component
                            :is="props.currentCpt.cptOptionKey ? props.currentCpt.cptOptionKey: + props.currentCpt.cptKey+'-option'"
                            :attribute="props.currentCpt.cptOption.attribute" />
                    </div>

                </a-tab-pane>
<!--                 <a-tab-pane key="data" tab="数据">
                    <div class="customForm" :style="{ height: (props.height - 140) + 'px' }">
                        <a-form size="mini" label-position="top">
                            <a-form-item label="数据类型">
                                <a-radio-group v-model:value="props.currentCpt.cptOption.cptDataForm.dataSource"
                                    @change="changeDataSource">
                                    <a-radio :value="1">静态数据</a-radio>
                                    <a-radio :value="2">接口</a-radio>
                                    <a-radio :value="3">sql</a-radio>
                                </a-radio-group>
                            </a-form-item>
                        </a-form>
                    </div>
                </a-tab-pane> -->
            </a-tabs>


            <!-- 大屏配置 -->
            <div v-show="!state.configBarShow" style="margin-top: 10px;">
                <a-form :model="props.designData" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
                    size="small">
                    <a-form-item label="网站标题" name="webName">
                        <a-input v-model:value="designData.title" />
                    </a-form-item>
                    <a-form-item label="网站描述" name="simpleDesc">
                        <a-textarea v-model:value="designData.simpleDesc"
                            placeholder="Autosize height with minimum and maximum number of lines"
                            :auto-size="{ minRows: 2, maxRows: 5 }" />
                    </a-form-item>
                    <a-form-item label="分辨率X" name="scaleX">
                        <a-input v-model:value="designData.scaleX" />
                    </a-form-item>
                    <a-form-item label="分辨率Y" name="scaleY">
                        <a-input v-model:value="designData.scaleY" />
                    </a-form-item>
                    <a-form-item label="背景颜色" name="bgColor">
                        <a-input v-model:value="designData.bgColor" />
                    </a-form-item>
                    <a-form-item label="背景图片" name="bgImg">
                        <div v-if="designData.bgImg" style="width: 100%;height: 100%;position: relative">
                            <img :src="fileUrl + designData.bgImg" style="width: 100%;height: 100%;" />
                            <i style="position: absolute;z-index: 6;right: 0;font-size: 20px;color: #FFCCCC"
                                class="el-icon-delete" @click.stop="handleRemove"></i>
                        </div>
                        <div v-else class="uploadItem" @click="showGallery">
                            <i style="font-size: 40px;color: #aaa" class="el-icon-plus"></i>
                        </div>
                    </a-form-item>

                    <a-form-item label="个性链接" name="id">
                        <a-input v-model:value="designData.id" />
                    </a-form-item>
                    <a-form-item label="访问码" name="viewCode">
                        <a-input v-model:value="designData.viewCode" />
                    </a-form-item>



                </a-form>

            </div>

        </a-row>
        <!-- <gallery ref="gallery" @confirmCheck="confirmCheck"/> -->
    </div>
</template>

<script setup>
import { isJSON } from '../../utils/myutils';
import { fileUrl } from "/env";
const props = defineProps({
    currentCpt: {
        type: Object,
        default: () => ({})
    },
    designData: {
        type: Object,
        default: () => ({})
    },

    height: {
        type: Number,
        default: 0
    }
})
const changeDataSource = (val) => {
    //静态数据不显示轮询按钮
    if (val === 1) {
        props.currentCpt.cptOption.cptDataForm.pollTime = 0;
    }
}
const state = reactive({
    fileUrl: fileUrl,
    cptDataFormShow: false,
    configTab: 'custom',
    dataLabels: ['数据', '接口地址', 'sql'],
    configBarShow: false,
    hasJsonFlag: true,
    cmOptions: {
        tabSize: 4, // tab的空格个数
        theme: 'dracula', //主题样式
        lineNumbers: true, //是否显示行数
        lineWrapping: true, //是否自动换行
        styleActiveLine: true, //line选择是是否加亮
        matchBrackets: true, //括号匹配
        mode: 'text/x-sparksql', //实现javascript代码高亮
        readOnly: false, //只读

        keyMap: 'default',
        extraKeys: { tab: 'autocomplete' },
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        hintOptions: {
            completeSingle: false,
            tables: {},
        },
    },
})
watch(()=>props.currentCpt,(newVal,oldVal)=>{
    console.log("🚀🤩🤩 ~ file: configBar.vue:162 ~ watch ~ newVal:", newVal)
    state.cptDataFormShow = false;
    if (!newVal || !newVal.cptOption) {
        state.configBarShow = false;//清空时
    } else {
        if (props.currentCpt.cptOption.cptDataForm) {
            state.cptDataFormShow = true;
        } else {
            state.configTab = 'basic'; //解決上一組件沒有数据表单导致tab栏未选中bug
        }
    }
})


const showGallery = () => {
    this.$refs.gallery.opened();
}
const handleRemove = () => {
    props.designData.bgImg = ''
}

const emit = defineEmits(['refreshCptData'])
const refreshCptData = () => {
    emit('refreshCptData');
}
const showCptConfig = () => {
    console.log('showCptConfig');
    state.configBarShow = true;
}
defineExpose({
    showCptConfig,
    refreshCptData,
})
</script>

<style lang="scss" scoped>

</style>