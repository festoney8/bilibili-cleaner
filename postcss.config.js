export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
        // 将全部rem替换为px，避免网页修改html font-size影响tailwind（如直播页）
        // https://github.com/TheDutchCoder/postcss-rem-to-px/issues/4
        '@thedutchcoder/postcss-rem-to-px': {},
    },
}
