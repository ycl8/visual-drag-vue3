import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite"; // 内置常使用ui组件库
import Unocss from "unocss/vite";
import { VantResolver, AntDesignVueResolver, ElementPlusResolver } from "unplugin-vue-components/resolvers";

import AutoImport from "unplugin-auto-import/vite";

import path from "path";
function resolve(dir) {
    return path.join(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({


    plugins: [
        vue(),
        Unocss(),
        Components({
            resolvers: [AntDesignVueResolver({ resolveIcons: true, importStyle: true })],
        }), // 配置按需加载组件
        AutoImport({
            resolvers: [AntDesignVueResolver()],
            imports: ["vue", "vue-router"], //加载vue vuex 等
            // dts:'src/auto-import.d.ts'    // 路径下自动生成文件夹存放全局指
        }),
    ],
    resolve: {
      alias: {
          "@": path.resolve(__dirname, "./src"),
      },
  },
});
