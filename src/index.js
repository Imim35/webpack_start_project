//import * as $ from 'jquery' npm i -S jquery -подключение библиотеки
import Post from '@/Post'
import '@/styles/style.css'
import '@/styles/less.less'


const post = new Post('Webpack Post Title')

console.log('Post:',post.toString())