import tseslint from '@electron-toolkit/eslint-config-ts'
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default tseslint.config(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  tseslint.configs.recommended,
  eslintPluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        extraFileExtensions: ['.vue'],
        parser: tseslint.parser
      }
    }
  },
  {
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'vue/require-default-prop': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: 'ts'
          }
        }
      ],

      // ==========typescript配置==========
      // 禁用函数返回类型
      '@typescript-eslint/explicit-function-return-type': 'off',
      // 禁用any类型
      '@typescript-eslint/no-explicit-any': 'off',
      // 禁用未使用的变量
      '@typescript-eslint/no-unused-vars': 'off',
      // 禁用空函数
      '@typescript-eslint/no-empty-function': 'off'
    }
  },
  eslintConfigPrettier
)
