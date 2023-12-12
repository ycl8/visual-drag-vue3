<template>
    <div :style="{
        width: state.windowWidth + 'px', height: state.conHeight + 'px', backgroundColor: state.designCache.bgColor,
        backgroundImage: state.designCache.bgImg ? 'url(' + fileUrl + state.designCache.bgImg + ')' : 'none'
    }" style="background-size:100% 100%;background-color: #2b3340;overflow: hidden">
        <div style="position:relative;transform-origin:0 0;"
            :style="{ width: state.windowWidth + 'px', height: state.conHeight + 'px', transform: 'scale(' + state.containerScale + ')' }">
            <transition-group appear name="bounce">
                <div v-for="item in state.designCache.components" :key="item.id" style="position: absolute;" :style="{
                    width: Math.round(item.cptWidth) + 'px',
                    height: Math.round(item.cptHeight) + 'px',
                    top: Math.round(item.cptY) + 'px',
                    left: Math.round(item.cptX) + 'px',
                    zIndex: item.cptZ
                }">
                    <component :is="item.cptKey" :width="Math.round(item.cptWidth)" :height="Math.round(item.cptHeight)"
                        @reload="loadCacheData" :option="item.cptOption" />
                </div>
            </transition-group>
        </div>

        <a-modal v-model:visible="state.authCodeDialogVisible" title="请输入访问码" width="30%" center>
            <a-form autocomplete="off">
                <a-form-item label="访问码">
                    <a-input v-model:value="state.viewCode"></a-input>
                </a-form-item>
            </a-form>

            <template #footer>
                <a-button key="back" @click="handleCancel">Return</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="authCode">提 交</a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup>
import { fileUrl } from "/env";

import {useRoute } from 'vue-router';

const { proxy } = getCurrentInstance();
console.log("🚀🤩🤩 ~ file: index.vue:43 ~ proxy:", proxy)

const route = useRoute();
const state = reactive({
    fileUrl: fileUrl,
    designCache: {},
    windowWidth: 0,
    windowHeight: 0,
    conHeight: 0,
    containerScale: 1,
    authCodeDialogVisible: false,
    viewCode: ''
})
onMounted(() => {
    loadCacheData();
    window.onresize = () => {
        return (() => {
            loadSize()
        })();
    };
})

const loadCacheData = () => {
    console.log(route);
    const path = route.path;
    const id = route.query.id;
    if (path === '/preview') {
        let designCache = JSON.parse(localStorage.getItem('designCache'));
    loadDesign(designCache, false);
    } /* else if (path === '/view') {
        if (!id) {
            this.$message.error('id错');
            return;
        }
        const viewCode = localStorage.getItem('code' + id);//如果已经输入过访问码就带着访问码一起请求
        getByIdApi(id, 1, viewCode).then(res => {
            if (res.data === 'NEED_AUTH') {
                state.authCodeDialogVisible = true;
            } else {
                loadDesign(res.data, true);
            }
        })
    } */
}

const loadDesign = (design, componentPares) => {
    if (componentPares) {
        design.components = JSON.parse(design.components);
    }
    document.title = design.title;
    state.designCache = design;
    loadSize();
}

const authCode = () => {
    if (!this.viewCode) {
        this.$message.error('请输入访问码');
        return;
    }
    const id = this.$route.query.id;
    authViewCodeApi({ id: id, viewCode: this.viewCode }).then(res => {
        state.authCodeDialogVisible = false;
        localStorage.setItem('code' + id, res.data.viewCode);//缓存访问码避免二次刷新需要再次输入
        loadDesign(res.data, true)
    })
}
const loadSize = () => {
    state.windowWidth = document.documentElement.clientWidth;
    state.windowHeight = document.documentElement.clientHeight;
    state.containerScale = Math.round(state.windowWidth / state.designCache.scaleX * 100) / 100
    state.conHeight = state.designCache.scaleY
    console.log(state.windowWidth, state.containerScale)
}
</script>

<style lang="scss" scoped>
.bounce-enter-active{
  transition: all 1s;
  /*animation: bounce-in 1s;*/
}
.bounce-enter{
  opacity: 0;
  transform: scale(.5);
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  25% {
    transform: scale(0.5);
  }
  50% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>