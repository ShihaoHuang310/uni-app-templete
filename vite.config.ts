import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import dayjs from 'dayjs'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { visualizer } from 'rollup-plugin-visualizer'
import ViteRestart from 'vite-plugin-restart'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import UnoCSS from 'unocss/vite'
import autoprefixer from 'autoprefixer'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'

const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace('%BUILD_DATE%', dayjs().format('YYYY-MM-DD HH:mm:ss'))
    },
  }
}

// https://vitejs.dev/config/
export default ({ mode }) => {
  // mode: 区分生产环境还是开发环境
  // process.cwd(): 获取当前文件的目录跟地址
  // loadEnv(): 返回当前环境env文件中额外定义的变量
  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'))
  console.log(env)
  return defineConfig({
    plugins: [
      uni(),
      UniPages(),
      UniLayouts(),
      UnoCSS(),
      htmlPlugin(),
      svgLoader(),
      // 打包分析插件
      visualizer(),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ['vite.config.js'],
      }),
      vueSetupExtend(),
      AutoImport({
        imports: ['vue'],
        dts: 'src/auto-import.d.ts',
      }),
      createSvgIconsPlugin({
        // 指定要缓存的文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      viteCompression(), // 会多出一些.gz文件，如xxx.js.gz，这里默认是不会删除xxx.js文件的，如果想删除也可以增加配置
      // 这个图片压缩插件比较耗时，希望仅在生产环境使用
      viteImagemin({
        gifsicle: {
          // gif图片压缩
          optimizationLevel: 3, // 选择1到3之间的优化级别
          interlaced: false, // 隔行扫描gif进行渐进式渲染
          // colors: 2 // 将每个输出GIF中不同颜色的数量减少到num或更少。数字必须介于2和256之间。
        },
        optipng: {
          // png
          optimizationLevel: 7, // 选择0到7之间的优化级别
        },
        mozjpeg: {
          // jpeg
          quality: 20, // 压缩质量，范围从0(最差)到100(最佳)。
        },
        pngquant: {
          // png
          quality: [0.8, 0.9], // Min和max是介于0(最差)到1(最佳)之间的数字，类似于JPEG。达到或超过最高质量所需的最少量的颜色。如果转换导致质量低于最低质量，图像将不会被保存。
          speed: 4, // 压缩速度，1(强力)到11(最快)
        },
        svgo: {
          // svg压缩
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            // 指定目标浏览器
            overrideBrowserslist: ['> 1%', 'last 2 versions'],
          }),
        ],
      },
    },

    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: 7001,
      // 自定义代理规则
      proxy: {
        // 选项写法
        '/api': {
          target: 'http://localhost:6666',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: env.VITE_DELETE_CONSOLE === 'true',
          drop_debugger: env.VITE_DELETE_CONSOLE === 'true',
        },
      },
    },
  })
}
