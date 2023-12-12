<template>
    <div class="bar">
        <a-row class="topTab">
            <a-col :span="12" :class="state.currentTab === 1 ? 'focusTab' : ''">
                <div @click="state.currentTab = 0">组件</div>

            </a-col>
            <a-col :span="12" :class="state.currentTab === 0 ? 'focusTab' : ''">
                <div @click="state.currentTab = 1">图层</div>
            </a-col>
        </a-row>
        <div style="height: 45px;"></div>

        <div v-show="state.currentTab === 0" v-for="group in state.options" :key="group.name">
      <div style="line-height: 45px;cursor: pointer;box-shadow: 0 1px 2px #2B3340;" @click="group.opened = !group.opened">
        <div style="display: inline-block;text-indent: 1em;width: 170px;">{{group.name}}</div>
        <div style="display: inline-block;">
          <!-- <i :class="group.opened ? 'el-icon-arrow-down':'el-icon-arrow-right'"></i> -->
          <down-outlined  v-if="group.opened" />
          <right-outlined v-else />

        </div>
      </div>
      <a-row :gutter="2" v-show="group.opened">
        <a-col :span="12" v-for="(item,index) in group.children" :key="item.name+index">
          <div draggable="true" :config="JSON.stringify(item)" @dragstart="dragStart"
               style="background-color: #3F4B5F;height: 70px;text-align: center;margin-top: 2px;">
            <div style="line-height: 40px;">
                <form-outlined />
            <!--   <embed v-if="item.icon" style="width: 20px;" src="../../assets/icon/button.svg" type="image/svg+xml" />
              
              <i v-else style="font-size: 20px;" class="el-icon-question"></i> -->
            </div>
            <div style="font-size: 13px">{{ item.name }}</div>
          </div>
        </a-col>
      </a-row>
    </div>


    <div v-show="state.currentTab === 1">
      <div v-show="props.selectedComponents.length === 0" style="text-align: center;line-height: 50px;">
        无图层
      </div>

      <a-row v-for="(item,index) in props.selectedComponents" :key="item.keyId" class="selectedItem"
              :style="{background: props.currentCptIndex === index ? '#3F4B5F':'#353f50'}">
        <a-col :span="4" style="text-align: center"><i :class="item.icon"/></a-col>
        <a-col :span="15" @click.native="showConfigBar($event,item,index)">{{item.cptTitle}}</a-col>
        <a-col :span="5" style="text-align: center">
          <i class="el-icon-copy-document" @click="copyCpt(item)"/>

          <delete-outlined  style="margin-left: 4px;"  @click="delCpt(item,index)" />
          <!-- <i style="margin-left: 4px;" class="el-icon-delete" @click="delCpt(item,index)"/> -->
        </a-col>
      </a-row>
      </div>
    </div>
</template>

<script setup>
import getIconPath from "./getIconPath";
import options from '../../components/options'
const props = defineProps({
    selectedComponents: {
        type:Array,
        default:()=>{[]}
    },
    currentCptIndex: {
        type:Number,
        default:0
    }
})

const state = reactive({
    options:options,
    cptGroupKeys: [],
    currentTab: 0//0组件，1图层
})

const emit = defineEmits(['dragStart', 'showConfigBar', 'copyCpt', 'delC'])

const dragStart = (e) => {
    let copyDom = e.currentTarget.cloneNode(true);
    emit('dragStart', copyDom);
}
const showConfigBar = (e, item, index) => {
    emit('showConfigBar', e, item, index);
}
const copyCpt = (item) => {
    emit('copyCpt', item);
}
const delCpt = (item, index) => {
    emit('delCpt', item, index);
}
</script>



<style lang="scss" scoped>

.bar{position:relative;width:100%;height:100%;background: #353f50;color: #fff;overflow-x:hidden;overflow-y: auto}
.el-collapse-item__*{background: #353f50}
.topTab{width:200px;height: 45px;text-align: center;line-height: 45px;cursor: pointer;
  position: fixed;z-index: 7;background: #353f50;box-shadow: 0 1px 3px #2b3340;}
.focusTab{background: #3F4B5F}
.selectedItem{line-height: 45px;cursor: pointer;box-shadow: 0 1px 3px #2b3340 inset;}
</style>